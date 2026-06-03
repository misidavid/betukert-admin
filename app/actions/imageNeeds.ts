'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { ImageStatus } from '../../lib/supabase';
import { requireAuth } from '../../lib/requireAuth';
import { WORD_BANK } from '../../shared/data/wordbank';
import { splitIntoSyllables, splitIntoGraphemes, DISPLAY_TO_ID } from '../../shared/curriculum/wordFilter';
import { GRAPHEMES } from '../../shared/curriculum/graphemes';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_IMAGE_STATUSES = new Set<ImageStatus>(['missing', 'uploaded', 'approved', 'published', 'rejected', 'needs_replacement']);

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
    await requireAuth();
    const { data: existing } = await getSupabaseAdmin().from('image_needs').select('word');
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

    const { error } = await getSupabaseAdmin().from('image_needs').insert(toInsert);
    if (error) {
      console.error('[generateImageNeedsAction] DB hiba:', error);
      return { inserted: 0, skipped: existingWords.size, error: 'Adatbázis hiba' };
    }

    return { inserted: toInsert.length, skipped: existingWords.size };
  } catch (e) {
    console.error('[generateImageNeedsAction]', e);
    return { inserted: 0, skipped: 0, error: 'Szerverhiba' };
  }
}

export async function uploadImageFileAction(
  formData: FormData,
): Promise<{ error?: string }> {
  try {
    await requireAuth();
    const id = formData.get('id') as string;
    if (!UUID_RE.test(id)) return { error: 'Érvénytelen azonosító' };

    const { data: record, error: fetchError } = await getSupabaseAdmin()
      .from('image_needs')
      .select('word, phase')
      .eq('id', id)
      .single();

    if (fetchError || !record) return { error: 'Nem található a bejegyzés' };

    const { word, phase } = record;
    const file = formData.get('file') as File;

    if (!file || !file.name) return { error: 'Hiányzó fájl' };

    const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_IMAGE_EXTENSIONS.includes(ext)) {
      return { error: `Nem engedélyezett fájlformátum. Engedélyezett: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}` };
    }

    const toSlug = (text: string) => text.toLowerCase()
      .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
      .replace(/ó/g, 'o').replace(/ö/g, 'o').replace(/ő/g, 'o')
      .replace(/ú/g, 'u').replace(/ü/g, 'u').replace(/ű/g, 'u')
      .replace(/[^a-z0-9]/g, '_');

    const path = `phase_${phase}/${toSlug(word)}.${ext}`;

    const { error: uploadError } = await getSupabaseAdmin().storage
      .from('images')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      console.error('[uploadImageFileAction] Storage hiba:', uploadError);
      return { error: 'Tárhely hiba' };
    }

    const { data: urlData } = getSupabaseAdmin().storage.from('images').getPublicUrl(path);

    const { error } = await getSupabaseAdmin()
      .from('image_needs')
      .update({ status: 'uploaded', file_path: path, file_url: urlData.publicUrl, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('[uploadImageFileAction] DB hiba:', error);
      return { error: 'Adatbázis hiba' };
    }
    return {};
  } catch (e) {
    console.error('[uploadImageFileAction]', e);
    return { error: 'Szerverhiba' };
  }
}

export async function deleteImageFileAction(id: string): Promise<{ error?: string }> {
  try {
    await requireAuth();
    if (!UUID_RE.test(id)) return { error: 'Érvénytelen azonosító' };

    const { data: record, error: fetchError } = await getSupabaseAdmin()
      .from('image_needs')
      .select('file_path')
      .eq('id', id)
      .single();

    if (fetchError || !record?.file_path) return { error: 'Nem található a fájl' };

    const { error: storageError } = await getSupabaseAdmin().storage
      .from('images')
      .remove([record.file_path]);

    if (storageError) {
      console.error('[deleteImageFileAction] Storage hiba:', storageError);
      return { error: 'Tárhely hiba' };
    }

    const { error } = await getSupabaseAdmin()
      .from('image_needs')
      .update({ status: 'missing', file_path: null, file_url: null, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('[deleteImageFileAction] DB hiba:', error);
      return { error: 'Adatbázis hiba' };
    }
    return {};
  } catch (e) {
    console.error('[deleteImageFileAction]', e);
    return { error: 'Szerverhiba' };
  }
}

export async function updateImageNeedStatusAction(id: string, status: ImageStatus): Promise<{ error?: string }> {
  try {
    await requireAuth();
    if (!UUID_RE.test(id)) return { error: 'Érvénytelen azonosító' };
    if (!VALID_IMAGE_STATUSES.has(status)) return { error: 'Érvénytelen státusz' };
    const { error } = await getSupabaseAdmin()
      .from('image_needs')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      console.error('[updateImageNeedStatusAction] DB hiba:', error);
      return { error: 'Adatbázis hiba' };
    }
    return {};
  } catch (e) {
    console.error('[updateImageNeedStatusAction]', e);
    return { error: 'Szerverhiba' };
  }
}
