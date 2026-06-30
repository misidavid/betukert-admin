'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { requireAuth } from '../../lib/requireAuth';

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

export interface WordStat {
  item_id: string;
  item_type: string;
  total_correct: number;
  total_incorrect: number;
  total_sessions: number;
  child_count: number;
  avg_accuracy: number;
}

export interface PhaseDistributionItem {
  phase: number;
  count: number;
}

export interface ActivityTrendItem {
  date: string;
  children: number;
}

export interface MasteryStatusItem {
  type: string;
  locked: number;
  new: number;
  learning: number;
  practicing: number;
  stable: number;
  needs_review: number;
  total: number;
}

export interface StatsResult {
  total_users: number;
  total_profiles: number;
  total_sessions: number;
  active_last_7_days: number;
  needs_review_total: number;
  stable_ratio: number;
  phase_distribution: PhaseDistributionItem[];
  activity_trend: ActivityTrendItem[];
  mastery_status: MasteryStatusItem[];
  word_stats: WordStat[];
  error?: string;
}

export async function getStatsAction(): Promise<StatsResult> {
  try {
    await requireAuth();
    const supabase = getSupabaseAdmin();

    const [{ data: profiles }, { data: masteryData }] = await Promise.all([
      supabase.from('child_profiles').select('user_id, current_phase'),
      supabase
        .from('mastery_records')
        .select('child_id, item_id, item_type, status, correct_count, incorrect_count, sessions, last_practiced'),
    ]);

    // ── KPI ──────────────────────────────────────────────────────────────────
    const uniqueUsers = new Set((profiles ?? []).map(p => p.user_id)).size;
    const totalProfiles = profiles?.length ?? 0;
    const totalSessions = (masteryData ?? []).reduce((sum, r) => sum + r.sessions, 0);

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();
    const active_last_7_days = new Set(
      (masteryData ?? []).filter(r => r.last_practiced >= sevenDaysAgo).map(r => r.child_id),
    ).size;

    const needs_review_total = (masteryData ?? []).filter(r => r.status === 'needs_review').length;
    const nonLocked = (masteryData ?? []).filter(r => r.status !== 'locked');
    const stable_ratio =
      nonLocked.length > 0
        ? Math.round((nonLocked.filter(r => r.status === 'stable').length / nonLocked.length) * 100)
        : 0;

    // ── Phase distribution ────────────────────────────────────────────────────
    const phaseMap = new Map<number, number>();
    for (const p of profiles ?? []) {
      phaseMap.set(p.current_phase, (phaseMap.get(p.current_phase) ?? 0) + 1);
    }
    const phase_distribution: PhaseDistributionItem[] = Array.from(phaseMap.entries())
      .map(([phase, count]) => ({ phase, count }))
      .sort((a, b) => a.phase - b.phase);

    // ── Activity trend (last 30 days) ─────────────────────────────────────────
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const dailyMap = new Map<string, Set<string>>();
    for (let i = 0; i < 30; i++) {
      const d = new Date(thirtyDaysAgo.getTime() + i * 24 * 60 * 60 * 1000);
      dailyMap.set(d.toISOString().slice(0, 10), new Set());
    }
    for (const r of masteryData ?? []) {
      const date = r.last_practiced?.slice(0, 10);
      if (date && dailyMap.has(date)) dailyMap.get(date)!.add(r.child_id);
    }
    const activity_trend: ActivityTrendItem[] = Array.from(dailyMap.entries())
      .map(([date, set]) => ({ date, children: set.size }))
      .sort((a, b) => a.date.localeCompare(b.date));

    // ── Mastery status breakdown ──────────────────────────────────────────────
    const statusMap = new Map<string, { locked: number; new: number; learning: number; practicing: number; stable: number; needs_review: number }>();
    for (const type of ['grapheme', 'syllable', 'word']) {
      statusMap.set(type, { locked: 0, new: 0, learning: 0, practicing: 0, stable: 0, needs_review: 0 });
    }
    for (const r of masteryData ?? []) {
      const entry = statusMap.get(r.item_type);
      if (entry && r.status in entry) (entry as Record<string, number>)[r.status]++;
    }
    const mastery_status: MasteryStatusItem[] = Array.from(statusMap.entries()).map(([type, c]) => ({
      type,
      locked: c.locked,
      new: c.new,
      learning: c.learning,
      practicing: c.practicing,
      stable: c.stable,
      needs_review: c.needs_review,
      total: c.locked + c.new + c.learning + c.practicing + c.stable + c.needs_review,
    }));

    // ── Word stats ────────────────────────────────────────────────────────────
    const wordMap = new Map<string, WordStat>();
    for (const r of masteryData ?? []) {
      const key = `${r.item_type}:${r.item_id}`;
      const ex = wordMap.get(key);
      if (ex) {
        ex.total_correct += r.correct_count;
        ex.total_incorrect += r.incorrect_count;
        ex.total_sessions += r.sessions;
        ex.child_count += 1;
      } else {
        wordMap.set(key, {
          item_id: r.item_id,
          item_type: r.item_type,
          total_correct: r.correct_count,
          total_incorrect: r.incorrect_count,
          total_sessions: r.sessions,
          child_count: 1,
          avg_accuracy: 0,
        });
      }
    }
    const word_stats = Array.from(wordMap.values())
      .map(s => ({
        ...s,
        avg_accuracy:
          s.total_correct + s.total_incorrect > 0
            ? Math.round((s.total_correct / (s.total_correct + s.total_incorrect)) * 100)
            : 0,
      }))
      .sort((a, b) => b.total_sessions - a.total_sessions);

    return {
      total_users: uniqueUsers,
      total_profiles: totalProfiles,
      total_sessions: totalSessions,
      active_last_7_days,
      needs_review_total,
      stable_ratio,
      phase_distribution,
      activity_trend,
      mastery_status,
      word_stats,
    };
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e);
    return {
      total_users: 0,
      total_profiles: 0,
      total_sessions: 0,
      active_last_7_days: 0,
      needs_review_total: 0,
      stable_ratio: 0,
      phase_distribution: [],
      activity_trend: [],
      mastery_status: [],
      word_stats: [],
      error: msg,
    };
  }
}
