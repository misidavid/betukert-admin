'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { requireAuth } from '../../lib/requireAuth';
import { WORD_BANK } from '../../shared/data/wordbank';

export interface WordItem {
  id: string;
  text: string;
  syllables: string[];
  syllable_count: number;
  phase: number;
  difficulty: number;
  enabled: boolean;
}

export async function fetchWordsAction(
  phase: number,
  sortBy: 'created_at' | 'text' | 'phase',
  sortDir: 'asc' | 'desc',
): Promise<{ words: WordItem[]; error?: string }> {
  try {
    await requireAuth();
    const { data, error } = await getSupabaseAdmin()
      .from('words')
      .select('*')
      .lte('phase', phase)
      .order(sortBy, { ascending: sortDir === 'asc' });
    if (error) return { words: [], error: 'Adatbázis hiba' };
    return { words: (data ?? []) as WordItem[] };
  } catch (e) {
    console.error('[fetchWordsAction]', e);
    return { words: [], error: 'Szerverhiba' };
  }
}
import { splitIntoSyllables, splitIntoGraphemes, splitNameIntoGraphemes, DISPLAY_TO_ID } from '../../shared/curriculum/wordFilter';
import { GRAPHEMES } from '../../shared/curriculum/graphemes';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const getPhase = (word: string): number => {
  const isName = word[0] && word[0] !== word[0].toLowerCase();
  const graphemes = isName ? splitNameIntoGraphemes(word) : splitIntoGraphemes(word.toLowerCase());
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

    const { data: excludedRows, error: excludedError } = await getSupabaseAdmin()
      .from('excluded_words')
      .select('text');
    if (excludedError) {
      console.error('[seedWordsAction] Kizárt szavak lekérési hiba:', excludedError.message);
      return { inserted: 0, skipped: 0, error: `Adatbázis hiba: ${excludedError.message}` };
    }
    const excluded = new Set((excludedRows ?? []).map(r => r.text));

    const { error: deleteError } = await getSupabaseAdmin()
      .from('words')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000');
    if (deleteError) {
      console.error('[seedWordsAction] Törlési hiba:', deleteError.message);
      return { inserted: 0, skipped: 0, error: `Adatbázis hiba: ${deleteError.message}` };
    }

    const toInsert = [...new Set(WORD_BANK)]
      .filter(word => word.length >= 2 && !excluded.has(word))
      .map(word => {
        const syllables = splitIntoSyllables(word.toLowerCase());
        const graphemes = splitIntoGraphemes(word.toLowerCase());
        return { text: word, syllables, syllable_count: syllables.length, graphemes, phase: getPhase(word), difficulty: getDifficulty(word), enabled: true };
      });

    const batchSize = 100;
    let inserted = 0;
    for (let i = 0; i < toInsert.length; i += batchSize) {
      const batch = toInsert.slice(i, i + batchSize);
      const { error } = await getSupabaseAdmin().from('words').insert(batch);
      if (error) {
        console.error('[seedWordsAction] DB hiba:', error.message, error.details);
        return { inserted, skipped: 0, error: `Adatbázis hiba: ${error.message}` };
      }
      inserted += batch.length;
    }

    return { inserted, skipped: excluded.size };
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
  try {
    await requireAuth();
  } catch {
    return { inserted: 0, error: 'Unauthorized' };
  }
  if (words.length === 0) return { inserted: 0 };
  if (words.length > 1000) return { inserted: 0, error: 'Túl sok szó egyszerre (max 1000)' };
  for (const w of words) {
    if (typeof w.text !== 'string' || w.text.length < 2 || w.text.length > 100) return { inserted: 0, error: 'Érvénytelen szó' };
    if (!Number.isInteger(w.phase) || w.phase < 1 || w.phase > 99) return { inserted: 0, error: 'Érvénytelen szint' };
    if (!Number.isInteger(w.difficulty) || w.difficulty < 1 || w.difficulty > 5) return { inserted: 0, error: 'Érvénytelen nehézség' };
    if (typeof w.enabled !== 'boolean') return { inserted: 0, error: 'Érvénytelen enabled érték' };
  }
  try {
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

export async function addWordAction(text: string): Promise<{ error?: string }> {
  try {
    await requireAuth();
    const word = text.trim();
    if (!word || word.length < 2 || word.length > 100) return { error: 'Érvénytelen szó (2-100 karakter)' };
    const syllables = splitIntoSyllables(word.toLowerCase());
    const graphemes = splitIntoGraphemes(word.toLowerCase());
    const { error } = await getSupabaseAdmin()
      .from('words')
      .insert({
        text: word,
        syllables,
        syllable_count: syllables.length,
        graphemes,
        phase: getPhase(word),
        difficulty: getDifficulty(word),
        enabled: true,
      });
    if (error) {
      if (error.code === '23505') return { error: 'Ez a szó már szerepel az adatbázisban' };
      return { error: 'Adatbázis hiba' };
    }
    await getSupabaseAdmin().from('excluded_words').delete().eq('text', word);
    return {};
  } catch (e) {
    return { error: 'Szerverhiba' };
  }
}

export async function deleteWordAction(id: string): Promise<{ error?: string }> {
  try {
    await requireAuth();
    if (!UUID_RE.test(id)) return { error: 'Érvénytelen azonosító' };

    const { data: word, error: fetchError } = await getSupabaseAdmin()
      .from('words')
      .select('text')
      .eq('id', id)
      .single();
    if (fetchError) {
      console.error('[deleteWordAction] Lekérési hiba:', fetchError);
      return { error: 'Adatbázis hiba' };
    }

    const { error: excludeError } = await getSupabaseAdmin()
      .from('excluded_words')
      .upsert({ text: word.text }, { onConflict: 'text' });
    if (excludeError) {
      console.error('[deleteWordAction] Kizárás hiba:', excludeError);
      return { error: 'Adatbázis hiba' };
    }

    const { error } = await getSupabaseAdmin().from('words').delete().eq('id', id);
    if (error) {
      console.error('[deleteWordAction] DB hiba:', error);
      return { error: 'Adatbázis hiba' };
    }

    const { error: imageNeedError } = await getSupabaseAdmin()
      .from('image_needs')
      .delete()
      .eq('word', word.text);
    if (imageNeedError) {
      console.error('[deleteWordAction] image_needs törlési hiba:', imageNeedError);
    }

    return {};
  } catch (e) {
    console.error('[deleteWordAction]', e);
    return { error: 'Szerverhiba' };
  }
}

export async function getExcludedWordsAction(): Promise<{ words: { text: string }[]; error?: string }> {
  try {
    await requireAuth();
    const { data, error } = await getSupabaseAdmin()
      .from('excluded_words')
      .select('text')
      .order('text');
    if (error) {
      console.error('[getExcludedWordsAction] DB hiba:', error);
      return { words: [], error: 'Adatbázis hiba' };
    }
    return { words: data ?? [] };
  } catch (e) {
    console.error('[getExcludedWordsAction]', e);
    return { words: [], error: 'Szerverhiba' };
  }
}

export async function restoreExcludedWordAction(text: string): Promise<{ error?: string }> {
  try {
    await requireAuth();
    const { error } = await getSupabaseAdmin().from('excluded_words').delete().eq('text', text);
    if (error) {
      console.error('[restoreExcludedWordAction] DB hiba:', error);
      return { error: 'Adatbázis hiba' };
    }
    return {};
  } catch (e) {
    console.error('[restoreExcludedWordAction]', e);
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
