'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { SoundStatus } from '../../lib/supabase';
import { requireAuth } from '../../lib/requireAuth';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const VALID_SOUND_STATUSES = new Set<SoundStatus>(['missing', 'uploaded', 'pending_review', 'approved', 'published', 'rejected', 'needs_regeneration']);

const INSTRUCTIONS = [
  'Koppints a betűre!',
  'Koppints minden betűre!',
  'Melyik hanggal kezdődik?',
  'Melyik szótag ez?',
  'Tapsolj, és számold meg a szótagokat!',
  'Melyik szót látod a képen?',
  'Rakd ki a szót!',
  'Keresd meg a szótagpárokat!',
  'Rakd helyes sorrendbe a szavakat!',
  'Húzd a szavakat a képekhez!',
  'Húzd az ujjad balról jobbra a vonalon!',
];

export async function generateSoundNeedsAction(): Promise<{ inserted: number; skipped: number; error?: string }> {
  try {
    await requireAuth();
    const { data: existing } = await getSupabaseAdmin()
      .from('sound_needs')
      .select('text')
      .eq('type', 'instruction');

    const existingSet = new Set(existing?.map((e: any) => e.text) || []);

    const toInsert = INSTRUCTIONS
      .filter(text => !existingSet.has(text))
      .map(text => ({ text, type: 'instruction', phase: 0, status: 'missing' }));

    if (toInsert.length === 0) return { inserted: 0, skipped: existingSet.size };

    const { error } = await getSupabaseAdmin().from('sound_needs').insert(toInsert);
    if (error) {
      console.error('[generateSoundNeedsAction] DB hiba:', error);
      return { inserted: 0, skipped: existingSet.size, error: 'Adatbázis hiba' };
    }

    return { inserted: toInsert.length, skipped: existingSet.size };
  } catch (e) {
    console.error('[generateSoundNeedsAction]', e);
    return { inserted: 0, skipped: 0, error: 'Szerverhiba' };
  }
}

export async function uploadSoundFileAction(
  id: string,
  file: File,
): Promise<{ error?: string }> {
  try {
    await requireAuth();
    if (!UUID_RE.test(id)) return { error: 'Érvénytelen azonosító' };

    const { data: record, error: fetchError } = await getSupabaseAdmin()
      .from('sound_needs')
      .select('text')
      .eq('id', id)
      .single();

    if (fetchError || !record?.text) return { error: 'Nem található a bejegyzés' };

    if (file.size > 10 * 1024 * 1024) return { error: 'Fájl túl nagy (max 10 MB)' };
    const ALLOWED_SOUND_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm4a'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_SOUND_EXTENSIONS.includes(ext)) {
      return { error: `Nem engedélyezett fájlformátum. Engedélyezett: ${ALLOWED_SOUND_EXTENSIONS.join(', ')}` };
    }
    const safeName = record.text
      .toLowerCase()
      .replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i')
      .replace(/ó/g, 'o').replace(/ö/g, 'o').replace(/ő/g, 'o')
      .replace(/ú/g, 'u').replace(/ü/g, 'u').replace(/ű/g, 'u')
      .replace(/[!?,.:;]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/, '');
    const path = `instruction/${safeName}.${ext}`;

    const { error: uploadError } = await getSupabaseAdmin().storage
      .from('sounds')
      .upload(path, file, { upsert: true });

    if (uploadError) {
      console.error('[uploadSoundFileAction] Storage hiba:', uploadError);
      return { error: 'Tárhely hiba' };
    }

    const { data: urlData } = getSupabaseAdmin().storage.from('sounds').getPublicUrl(path);

    const { error } = await getSupabaseAdmin()
      .from('sound_needs')
      .update({ status: 'pending_review', file_path: path, file_url: urlData.publicUrl, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) {
      console.error('[uploadSoundFileAction] DB hiba:', error);
      return { error: 'Adatbázis hiba' };
    }
    return {};
  } catch (e) {
    console.error('[uploadSoundFileAction]', e);
    return { error: 'Szerverhiba' };
  }
}

export async function updateSoundNeedStatusAction(id: string, status: SoundStatus): Promise<{ error?: string }> {
  try {
    await requireAuth();
    if (!UUID_RE.test(id)) return { error: 'Érvénytelen azonosító' };
    if (!VALID_SOUND_STATUSES.has(status)) return { error: 'Érvénytelen státusz' };
    const { error } = await getSupabaseAdmin()
      .from('sound_needs')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      console.error('[updateSoundNeedStatusAction] DB hiba:', error);
      return { error: 'Adatbázis hiba' };
    }
    return {};
  } catch (e) {
    console.error('[updateSoundNeedStatusAction]', e);
    return { error: 'Szerverhiba' };
  }
}
