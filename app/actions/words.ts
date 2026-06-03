'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { requireAuth } from '../../lib/requireAuth';
import { WORD_BANK } from '../../shared/data/wordbank';
import { splitIntoSyllables, splitIntoGraphemes, DISPLAY_TO_ID } from '../../shared/curriculum/wordFilter';
import { GRAPHEMES } from '../../shared/curriculum/graphemes';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

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
    await requireAuth();
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
    if (error) {
      console.error('[seedWordsAction] DB hiba:', error);
      return { inserted: 0, skipped: existingTexts.size, error: 'Adatbázis hiba' };
    }

    return { inserted: toInsert.length, skipped: existingTexts.size };
  } catch (e) {
    console.error('[seedWordsAction]', e);
    return { inserted: 0, skipped: 0, error: 'Szerverhiba' };
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
    await requireAuth();
    const batchSize = 100;
    let inserted = 0;
    for (let i = 0; i < words.length; i += batchSize) {
      const batch = words.slice(i, i + batchSize);
      const { error } = await getSupabaseAdmin().from('words').insert(batch);
      if (error) {
        console.error('[insertWordsAction] DB hiba:', error);
        return { inserted, error: 'Adatbázis hiba' };
      }
      inserted += batch.length;
    }
    return { inserted };
  } catch (e) {
    console.error('[insertWordsAction]', e);
    return { inserted: 0, error: 'Szerverhiba' };
  }
}

export async function deleteWordAction(id: string): Promise<{ error?: string }> {
  try {
    await requireAuth();
    if (!UUID_RE.test(id)) return { error: 'Érvénytelen azonosító' };
    const { error } = await getSupabaseAdmin().from('words').delete().eq('id', id);
    if (error) {
      console.error('[deleteWordAction] DB hiba:', error);
      return { error: 'Adatbázis hiba' };
    }
    return {};
  } catch (e) {
    console.error('[deleteWordAction]', e);
    return { error: 'Szerverhiba' };
  }
}

export async function toggleWordEnabledAction(id: string, enabled: boolean): Promise<{ error?: string }> {
  try {
    await requireAuth();
    if (!UUID_RE.test(id)) return { error: 'Érvénytelen azonosító' };
    const { error } = await getSupabaseAdmin()
      .from('words')
      .update({ enabled: !enabled, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      console.error('[toggleWordEnabledAction] DB hiba:', error);
      return { error: 'Adatbázis hiba' };
    }
    return {};
  } catch (e) {
    console.error('[toggleWordEnabledAction]', e);
    return { error: 'Szerverhiba' };
  }
}
