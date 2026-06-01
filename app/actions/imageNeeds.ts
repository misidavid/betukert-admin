'use server';

import { supabaseAdmin } from '../../lib/supabaseAdmin';
import { ImageStatus } from '../../lib/supabase';
import { WORD_BANK } from '../../shared/data/wordbank';
import { splitIntoSyllables, splitIntoGraphemes, DISPLAY_TO_ID } from '../../shared/curriculum/wordFilter';
import { GRAPHEMES } from '../../shared/curriculum/graphemes';

const getFirstSound = (word: string): string =>
  splitIntoGraphemes(word.toLowerCase())[0] || '';

const getFirstSyllable = (word: string): string =>
  splitIntoSyllables(word.toLowerCase())[0] || '';

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

const getExerciseTypes = (word: string): string[] => {
  const syllables = splitIntoSyllables(word);
  const types = ['image_word_match', 'first_sound'];
  if (syllables.length >= 2) types.push('syllable_clapping', 'word_builder');
  return types;
};

export async function generateImageNeedsAction(): Promise<{ inserted: number; skipped: number }> {
  const { data: existing } = await supabaseAdmin.from('image_needs').select('word');
  const existingWords = new Set(existing?.map((e: any) => e.word) || []);

  const toInsert = WORD_BANK
    .filter(word => word.length >= 2 && !existingWords.has(word))
    .map(word => {
      const syllables = splitIntoSyllables(word.toLowerCase());
      return {
        word,
        syllables,
        syllable_count: syllables.length,
        first_sound: getFirstSound(word),
        first_syllable: getFirstSyllable(word),
        phase: getPhase(word),
        exercise_types: getExerciseTypes(word),
        image_brief: `Egyértelmű, gyerekbarát illusztráció erről: "${word}"`,
        ambiguity_notes: '',
        status: 'missing',
      };
    });

  if (toInsert.length === 0) return { inserted: 0, skipped: existingWords.size };

  const { error } = await supabaseAdmin.from('image_needs').insert(toInsert);
  if (error) throw new Error(error.message);

  return { inserted: toInsert.length, skipped: existingWords.size };
}

export async function updateImageNeedFileAction(
  id: string,
  filePath: string,
  fileUrl: string,
): Promise<void> {
  const { error } = await supabaseAdmin
    .from('image_needs')
    .update({ status: 'uploaded', file_path: filePath, file_url: fileUrl, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function updateImageNeedStatusAction(id: string, status: ImageStatus): Promise<void> {
  const { error } = await supabaseAdmin
    .from('image_needs')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}
