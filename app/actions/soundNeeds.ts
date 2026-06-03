'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { SoundStatus } from '../../lib/supabase';
import { requireAuth } from '../../lib/requireAuth';

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
    if (error) return { inserted: 0, skipped: existingSet.size, error: error.message };

    return { inserted: toInsert.length, skipped: existingSet.size };
  } catch (e: any) {
    return { inserted: 0, skipped: 0, error: e.message };
  }
}

export async function uploadSoundFileAction(
  id: string,
  text: string,
  file: File,
): Promise<{ error?: string }> {
  try {
    await requireAuth();
    const ALLOWED_SOUND_EXTENSIONS = ['mp3', 'wav', 'ogg', 'm4a'];
    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_SOUND_EXTENSIONS.includes(ext)) {
      return { error: `Nem engedélyezett fájlformátum. Engedélyezett: ${ALLOWED_SOUND_EXTENSIONS.join(', ')}` };
    }
    const safeName = text
      .toLowerCase()
      .replace(/[!?,.:;]/g, '')
      .replace(/\s+/g, '_')
      .replace(/_+/g, '_')
      .replace(/^_|_$/, '');
    const path = `instruction/${safeName}.${ext}`;

    const { error: uploadError } = await getSupabaseAdmin().storage
      .from('sounds')
      .upload(path, file, { upsert: true });

    if (uploadError) return { error: `Storage: ${uploadError.message}` };

    const { data: urlData } = getSupabaseAdmin().storage.from('sounds').getPublicUrl(path);

    const { error } = await getSupabaseAdmin()
      .from('sound_needs')
      .update({ status: 'pending_review', file_path: path, file_url: urlData.publicUrl, updated_at: new Date().toISOString() })
      .eq('id', id);

    if (error) return { error: `DB: ${error.message}` };
    return {};
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function updateSoundNeedStatusAction(id: string, status: SoundStatus): Promise<{ error?: string }> {
  try {
    await requireAuth();
    const { error } = await getSupabaseAdmin()
      .from('sound_needs')
      .update({ status, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) return { error: error.message };
    return {};
  } catch (e: any) {
    return { error: e.message };
  }
}
