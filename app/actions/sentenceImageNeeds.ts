'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { ImageStatus } from '../../lib/supabase';
import { requireAuth } from '../../lib/requireAuth';
import { SENTENCE_BANK, COMPREHENSION_BANK } from '../../shared/data/sentencebank';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_IMAGE_STATUSES = new Set<ImageStatus>(['missing', 'uploaded', 'approved', 'published', 'rejected', 'needs_replacement']);

export async function generateSentenceImageNeedsAction(): Promise<{ inserted: number; skipped: number; error?: string }> {
  try {
    await requireAuth();
    const { data: existing } = await getSupabaseAdmin().from('sentence_image_needs').select('sentence_id');
    const existingIds = new Set(existing?.map((e: any) => e.sentence_id) || []);

    const fromSentences = SENTENCE_BANK
      .filter(s => !existingIds.has(s.id))
      .map(s => {
        const sentence_text = s.words.join(' ');
        return {
          sentence_id: s.id,
          source: 'sentence_order',
          sentence_text,
          phase: s.phase,
          exercise_type: 'sentence_picture_match',
          image_brief: `Egyértelmű, gyerekbarát illusztráció ehhez a mondathoz: "${sentence_text}"`,
          status: 'missing',
        };
      });

    const fromComprehensions = COMPREHENSION_BANK
      .filter(c => !existingIds.has(c.id))
      .map(c => ({
        sentence_id: c.id,
        source: 'sentence_comprehension',
        sentence_text: c.sentence,
        phase: c.phase,
        exercise_type: 'sentence_picture_match',
        image_brief: `Egyértelmű, gyerekbarát illusztráció ehhez a mondathoz: "${c.sentence}"`,
        status: 'missing',
      }));

    const toInsert = [...fromSentences, ...fromComprehensions];

    if (toInsert.length === 0) return { inserted: 0, skipped: existingIds.size };

    const { error } = await getSupabaseAdmin().from('sentence_image_needs').insert(toInsert);
    if (error) {
      console.error('[generateSentenceImageNeedsAction] DB hiba:', error);
      return { inserted: 0, skipped: existingIds.size, error: 'Adatbázis hiba' };
    }

    return { inserted: toInsert.length, skipped: existingIds.size };
  } catch (e) {
    console.error('[generateSentenceImageNeedsAction]', e);
    return { inserted: 0, skipped: 0, error: 'Szerverhiba' };
  }
}

export async function uploadSentenceImageFileAction(
  formData: FormData,
): Promise<{ error?: string }> {
  try {
    await requireAuth();
    const id = formData.get('id') as string;
    if (!UUID_RE.test(id)) return { error: 'Érvénytelen azonosító' };

    const { data: record, error: fetchError } = await getSupabaseAdmin()
      .from('sentence_image_needs')
      .select('sentence_id, phase')
      .eq('id', id)
      .single();

    if (fetchError || !record) return { error: 'Nem található a bejegyzés' };

    const { sentence_id, phase } = record;
    const file = formData.get('file') as File;

    if (!file || !file.name) return { error: 'Hiányzó fájl' };
    if (file.size > 5 * 1024 * 1024) return { error: 'Fájl túl nagy (max 5 MB)' };

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

    const path = `sentence_phase_${phase}/${toSlug(sentence_id)}.${ext}`;

    const { error: uploadError } = await getSupabaseAdmin().storage
      .from('images')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      console.error('[uploadSentenceImageFileAction] Storage hiba:', uploadError);
      return { error: 'Tárhely hiba' };
    }

    const { data: urlData } = getSupabaseAdmin().storage.from('images').getPublicUrl(path);

    const { error } = await getSupabaseAdmin()
      .from('sentence_image_needs')
      .update({ status: 'uploaded', file_path: path, file_url: urlData.publicUrl, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('[uploadSentenceImageFileAction] DB hiba:', error);
      return { error: 'Adatbázis hiba' };
    }
    return {};
  } catch (e) {
    console.error('[uploadSentenceImageFileAction]', e);
    return { error: 'Szerverhiba' };
  }
}

export async function deleteSentenceImageFileAction(id: string): Promise<{ error?: string }> {
  try {
    await requireAuth();
    if (!UUID_RE.test(id)) return { error: 'Érvénytelen azonosító' };

    const { data: record, error: fetchError } = await getSupabaseAdmin()
      .from('sentence_image_needs')
      .select('file_path')
      .eq('id', id)
      .single();

    if (fetchError || !record?.file_path) return { error: 'Nem található a fájl' };

    const { error: storageError } = await getSupabaseAdmin().storage
      .from('images')
      .remove([record.file_path]);

    if (storageError) {
      console.error('[deleteSentenceImageFileAction] Storage hiba:', storageError);
      return { error: 'Tárhely hiba' };
    }

    const { error } = await getSupabaseAdmin()
      .from('sentence_image_needs')
      .update({ status: 'missing', file_path: null, file_url: null, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('[deleteSentenceImageFileAction] DB hiba:', error);
      return { error: 'Adatbázis hiba' };
    }
    return {};
  } catch (e) {
    console.error('[deleteSentenceImageFileAction]', e);
    return { error: 'Szerverhiba' };
  }
}

export async function updateSentenceImageNeedStatusAction(id: string, status: ImageStatus): Promise<{ error?: string }> {
  try {
    await requireAuth();
    if (!UUID_RE.test(id)) return { error: 'Érvénytelen azonosító' };
    if (!VALID_IMAGE_STATUSES.has(status)) return { error: 'Érvénytelen státusz' };
    const { error } = await getSupabaseAdmin()
      .from('sentence_image_needs')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      console.error('[updateSentenceImageNeedStatusAction] DB hiba:', error);
      return { error: 'Adatbázis hiba' };
    }
    return {};
  } catch (e) {
    console.error('[updateSentenceImageNeedStatusAction]', e);
    return { error: 'Szerverhiba' };
  }
}
