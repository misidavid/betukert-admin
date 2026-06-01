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

export async function generateImageNeedsAction(): Promise<{ inserted: number; skipped: number; error?: string }> {
  try {
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
    if (error) return { inserted: 0, skipped: existingWords.size, error: error.message };

    return { inserted: toInsert.length, skipped: existingWords.size };
  } catch (e: any) {
    return { inserted: 0, skipped: 0, error: e.message };
  }
}

export async function uploadImageFileAction(
  formData: FormData,
): Promise<{ error?: string }> {
  try {
    const id = formData.get('id') as string;
    const phase = Number(formData.get('phase'));
    const word = formData.get('word') as string;
    const file = formData.get('file') as File;

    if (!file || !file.name) return { error: 'Hiányzó fájl' };

    const toSlug = (text: string) => text.toLowerCase()
      .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
      .replace(/ó/g, 'o').replace(/ö/g, 'o').replace(/ő/g, 'o')
      .replace(/ú/g, 'u').replace(/ü/g, 'u').replace(/ű/g, 'u')
      .replace(/[^a-z0-9]/g, '_');

    const ext = file.name.split('.').pop();
    const path = `phase_${phase}/${toSlug(word)}.${ext}`;

    const { error: uploadError } = await supabaseAdmin.storage
      .from('images')
      .upload(path, file, { upsert: true });

    if (uploadError) return { error: `Storage: ${uploadError.message}` };

    const { data: urlData } = supabaseAdmin.storage.from('images').getPublicUrl(path);

    const { error } = await supabaseAdmin
      .from('image_needs')
      .update({ status: 'uploaded', file_path: path, file_url: urlData.publicUrl, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return { error: `DB: ${error.message}` };
    return {};
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateImageNeedStatusAction(id: string, status: ImageStatus): Promise<{ error?: string }> {
  try {
    const { error } = await supabaseAdmin
      .from('image_needs')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) return { error: error.message };
    return {};
  } catch (e: any) {
    return { error: e.message };
  }
}
