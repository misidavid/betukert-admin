'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { requireAuth } from '../../lib/requireAuth';
import { SENTENCE_BANK, COMPREHENSION_BANK } from '../../shared/data/sentencebank';

// --- Típusok ---

export interface SentenceRow {
  id: string;
  words: string[];
  accepted_orders: string[][];
  phase: number;
}

export interface ComprehensionRow {
  id: string;
  sentence: string;
  question: string;
  correct_answer: string;
  wrong_answers: string[];
  phase: number;
}

// --- Lekérdezések ---

export async function getSentencesAction(): Promise<{ data: SentenceRow[]; error?: string }> {
  await requireAuth();
  const { data, error } = await getSupabaseAdmin()
    .from('sentence_bank')
    .select('*')
    .order('phase')
    .order('id');
  if (error) return { data: [], error: error.message };
  return { data: data as SentenceRow[] };
}

export async function getComprehensionsAction(): Promise<{ data: ComprehensionRow[]; error?: string }> {
  await requireAuth();
  const { data, error } = await getSupabaseAdmin()
    .from('comprehension_bank')
    .select('*')
    .order('phase')
    .order('id');
  if (error) return { data: [], error: error.message };
  return { data: data as ComprehensionRow[] };
}

// --- Szerkesztés ---

export async function upsertSentenceAction(row: SentenceRow): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await getSupabaseAdmin()
    .from('sentence_bank')
    .upsert({ ...row, updated_at: new Date().toISOString() });
  if (error) return { error: error.message };
  return {};
}

export async function upsertComprehensionAction(row: ComprehensionRow): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await getSupabaseAdmin()
    .from('comprehension_bank')
    .upsert({ ...row, updated_at: new Date().toISOString() });
  if (error) return { error: error.message };
  return {};
}

export async function deleteSentenceAction(id: string): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await getSupabaseAdmin().from('sentence_bank').delete().eq('id', id);
  if (error) return { error: error.message };
  return {};
}

export async function deleteComprehensionAction(id: string): Promise<{ error?: string }> {
  await requireAuth();
  const { error } = await getSupabaseAdmin().from('comprehension_bank').delete().eq('id', id);
  if (error) return { error: error.message };
  return {};
}

// --- Seed: TS adatból Supabase-be tölt ---

export async function seedSentenceBankAction(): Promise<{ inserted: number; error?: string }> {
  await requireAuth();

  const sentences: SentenceRow[] = SENTENCE_BANK.map(s => ({
    id: s.id,
    words: s.words,
    accepted_orders: s.acceptedOrders,
    phase: s.phase,
  }));

  const { error } = await getSupabaseAdmin()
    .from('sentence_bank')
    .upsert(sentences, { onConflict: 'id' });

  if (error) return { inserted: 0, error: error.message };
  return { inserted: sentences.length };
}

export async function seedComprehensionBankAction(): Promise<{ inserted: number; error?: string }> {
  await requireAuth();

  const items: ComprehensionRow[] = COMPREHENSION_BANK.map(c => ({
    id: c.id,
    sentence: c.sentence,
    question: c.question,
    correct_answer: c.correctAnswer,
    wrong_answers: c.wrongAnswers,
    phase: c.phase,
  }));

  const { error } = await getSupabaseAdmin()
    .from('comprehension_bank')
    .upsert(items, { onConflict: 'id' });

  if (error) return { inserted: 0, error: error.message };
  return { inserted: items.length };
}
