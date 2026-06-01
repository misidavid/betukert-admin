'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { WORD_BANK } from '../../shared/data/wordbank';
import { splitIntoSyllables, splitIntoGraphemes, DISPLAY_TO_ID } from '../../shared/curriculum/wordFilter';
import { GRAPHEMES } from '../../shared/curriculum/graphemes';

const getPhase = (word: string): number => {
  const graphemes = splitIntoGraphemes(word.toLowerCase());
  let maxPhase = 1;
  for (const g of graphemes) {
    const id = DISPLAY_TO_ID[g];
    if (id) {
      const grapheme = GRAPHEMES.find(gr => gr.id === id);
      if (grapheme && grapheme.phase > maxPhase) maxPhase = grapheme.phase;
    }
  }
  return maxPhase;
};

const getDifficulty = (word: string): number => {
  const syllables = splitIntoSyllables(word);
  const graphemes = splitIntoGraphemes(word);
  if (syllables.length === 1 && graphemes.length <= 2) return 1;
  if (syllables.length === 1) return 2;
  if (syllables.length === 2 && graphemes.length <= 4) return 2;
  if (syllables.length === 2) return 3;
  if (syllables.length === 3) return 4;
  return 5;
};

export async function seedWordsAction(): Promise<{ inserted: number; skipped: number; error?: string }> {
  try {
    const { data: existing } = await getSupabaseAdmin().from('words').select('text');
    const existingTexts = new Set(existing?.map((e: any) => e.text) || []);
    const uniqueWords = [...new Set(WORD_BANK)];

    const toInsert = uniqueWords
      .filter(word => word.length >= 2 && !existingTexts.has(word))
      .map(word => {
        const syllables = splitIntoSyllables(word.toLowerCase());
        const graphemes = splitIntoGraphemes(word.toLowerCase());
        return { text: word, syllables, syllable_count: syllables.length, graphemes, phase: getPhase(word), difficulty: getDifficulty(word), enabled: true };
      });

    if (toInsert.length === 0) return { inserted: 0, skipped: existingTexts.size };

    const { error } = await getSupabaseAdmin().from('words').insert(toInsert);
    if (error) return { inserted: 0, skipped: existingTexts.size, error: error.message };

    return { inserted: toInsert.length, skipped: existingTexts.size };
  } catch (e: any) {
    return { inserted: 0, skipped: 0, error: e.message };
  }
}

export type WordInsertData = {
  text: string;
  syllables: string[];
  syllable_count: number;
  graphemes: string[];
  phase: number;
  difficulty: number;
  enabled: boolean;
};

export async function insertWordsAction(words: WordInsertData[]): Promise<{ inserted: number; error?: string }> {
  if (words.length === 0) return { inserted: 0 };
  try {
    const batchSize = 100;
    let inserted = 0;
    for (let i = 0; i < words.length; i += batchSize) {
      const batch = words.slice(i, i + batchSize);
      const { error } = await getSupabaseAdmin().from('words').insert(batch);
      if (error) return { inserted, error: error.message };
      inserted += batch.length;
    }
    return { inserted };
  } catch (e: any) {
    return { inserted: 0, error: e.message };
  }
}

export async function deleteWordAction(id: string): Promise<{ error?: string }> {
  try {
    const { error } = await getSupabaseAdmin().from('words').delete().eq('id', id);
    if (error) return { error: error.message };
    return {};
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function toggleWordEnabledAction(id: string, enabled: boolean): Promise<{ error?: string }> {
  try {
    const { error } = await getSupabaseAdmin()
      .from('words')
      .update({ enabled: !enabled, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) return { error: error.message };
    return {};
  } catch (e: any) {
    return { error: e.message };
  }
}
