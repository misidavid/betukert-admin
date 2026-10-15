'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { requireAuth } from '../../lib/requireAuth';
import { isAdminEmail } from '../../lib/adminAllowlist';
import { computeStats, type MasteryRow, type ProfileRow, type UserRow } from '../../lib/stats/compute';
import type { SentenceInfo } from '../../lib/stats/items';
import type { StatsResponse } from '../../lib/stats/types';
import { SENTENCE_BANK, COMPREHENSION_BANK } from '../../shared/data/sentencebank';

export async function fetchHomeStatsAction(): Promise<{
  missingImages: number;
  missingSounds: number;
  publishedPackages: number;
  error?: string;
}> {
  try {
    await requireAuth();
    const [
      { count: missingImages },
      { count: missingSounds },
      { count: publishedPackages },
    ] = await Promise.all([
      getSupabaseAdmin().from('image_needs').select('*', { count: 'exact', head: true }).eq('status', 'missing'),
      getSupabaseAdmin().from('sound_needs').select('*', { count: 'exact', head: true }).eq('status', 'missing'),
      getSupabaseAdmin().from('published_packages').select('*', { count: 'exact', head: true }),
    ]);
    return {
      missingImages: missingImages ?? 0,
      missingSounds: missingSounds ?? 0,
      publishedPackages: publishedPackages ?? 0,
    };
  } catch (e) {
    console.error('[fetchHomeStatsAction]', e);
    return { missingImages: 0, missingSounds: 0, publishedPackages: 0, error: 'Szerverhiba' };
  }
}

// ── Statisztika ─────────────────────────────────────────────────────────────

// A Supabase (PostgREST) egy kérésre legfeljebb 1000 sort ad vissza, és ezt
// némán teszi: a régi oldal így a mastery_records felét látta. Lapozva, stabil
// rendezéssel kérünk le mindent, és addig megyünk, amíg üres oldal nem jön —
// így egy alacsonyabbra állított szerveroldali plafon sem vág le semmit.
const PAGE_SIZE = 1000;

async function fetchAllRows<T>(table: string, columns: string): Promise<{ rows: T[]; exactCount: number | null }> {
  const supabase = getSupabaseAdmin();
  const rows: T[] = [];
  let exactCount: number | null = null;
  for (;;) {
    const from = rows.length;
    const { data, error, count } = await supabase
      .from(table)
      .select(columns, from === 0 ? { count: 'exact' } : undefined)
      .order('id')
      .range(from, from + PAGE_SIZE - 1);
    if (error) throw new Error(`${table}: ${error.message}`);
    if (from === 0) exactCount = count;
    const page = (data ?? []) as unknown as T[];
    if (page.length === 0) break;
    rows.push(...page);
    if (exactCount !== null && rows.length >= exactCount) break;
  }
  return { rows, exactCount };
}

async function fetchAllUsers(): Promise<{ id: string; email: string | undefined; created_at: string }[]> {
  const supabase = getSupabaseAdmin();
  const perPage = 1000;
  const users: { id: string; email: string | undefined; created_at: string }[] = [];
  for (let page = 1; ; page++) {
    const { data, error } = await supabase.auth.admin.listUsers({ page, perPage });
    if (error) throw new Error(`auth.users: ${error.message}`);
    users.push(...data.users.map(u => ({ id: u.id, email: u.email, created_at: u.created_at })));
    if (data.users.length < perPage) break;
  }
  return users;
}

// Belső fiók: admin (ADMIN_EMAILS) vagy külön kizárt cím (STATS_EXCLUDED_EMAILS,
// pl. az App Store demo fiók, tesztfiókok) — vesszővel elválasztva.
const excludedEmails = (): Set<string> =>
  new Set(
    (process.env.STATS_EXCLUDED_EMAILS ?? '')
      .split(',')
      .map(e => e.trim().toLowerCase())
      .filter(Boolean),
  );

// A mondatok szövege a címkékhez. Az adatbázisbeli bank az élő (az adminban
// szerkesztett) változat; ami ott nincs, azt a beépített bank pótolja.
async function fetchSentenceLabels(): Promise<Map<string, SentenceInfo>> {
  const map = new Map<string, SentenceInfo>();
  for (const s of SENTENCE_BANK) map.set(s.id, { label: (s.acceptedOrders[0] ?? s.words).join(' '), phase: s.phase });
  for (const c of COMPREHENSION_BANK) map.set(c.id, { label: c.sentence, phase: c.phase });

  const [sentences, comprehension] = await Promise.all([
    fetchAllRows<{ id: string; words: string[]; accepted_orders: string[][] | null; phase: number }>(
      'sentence_bank',
      'id, words, accepted_orders, phase',
    ),
    fetchAllRows<{ id: string; sentence: string; phase: number }>('comprehension_bank', 'id, sentence, phase'),
  ]);
  for (const s of sentences.rows) {
    map.set(s.id, { label: (s.accepted_orders?.[0] ?? s.words).join(' '), phase: s.phase });
  }
  for (const c of comprehension.rows) map.set(c.id, { label: c.sentence, phase: c.phase });
  return map;
}

export async function getStatsAction(options?: { includeInternal?: boolean }): Promise<StatsResponse> {
  try {
    await requireAuth();
    const includeInternal = options?.includeInternal === true;

    const [mastery, profiles, users, sentences] = await Promise.all([
      fetchAllRows<MasteryRow>(
        'mastery_records',
        'child_id, user_id, item_id, item_type, status, correct_count, incorrect_count, sessions, last_practiced, recent_results',
      ),
      fetchAllRows<ProfileRow>('child_profiles', 'id, user_id, current_phase, created_at'),
      fetchAllUsers(),
      fetchSentenceLabels(),
    ]);

    const excluded = excludedEmails();
    const internalUserIds = new Set(
      users
        .filter(u => isAdminEmail(u.email) || (u.email !== undefined && excluded.has(u.email.trim().toLowerCase())))
        .map(u => u.id),
    );

    const data = computeStats({
      mastery: mastery.rows,
      masteryExactCount: mastery.exactCount,
      profiles: profiles.rows,
      users: users.map((u): UserRow => ({ id: u.id, created_at: u.created_at })),
      internalUserIds,
      sentences,
      includeInternal,
      now: new Date(),
    });
    return { ok: true, data };
  } catch (e: unknown) {
    console.error('[getStatsAction]', e);
    const msg = e instanceof Error ? e.message : String(e);
    return { ok: false, error: msg };
  }
}
