'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { requireAuth } from '../../lib/requireAuth';

export interface LoadingScreen {
  id: string;
  filename: string;
  file_path: string;
  file_url: string;
  sort_order: number;
  created_at: string;
}

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp'];

export async function fetchLoadingScreensAction(): Promise<{ items: LoadingScreen[]; error?: string }> {
  try {
    await requireAuth();
    const { data, error } = await getSupabaseAdmin()
      .from('loading_screens')
      .select('*')
      .order('sort_order')
      .order('created_at');
    if (error) throw error;
    return { items: (data ?? []) as LoadingScreen[] };
  } catch (e) {
    console.error('[fetchLoadingScreensAction]', e);
    return { items: [], error: 'Szerverhiba' };
  }
}

export async function uploadLoadingScreenAction(formData: FormData): Promise<{ error?: string }> {
  try {
    await requireAuth();
    const file = formData.get('file') as File;
    if (!file || !file.name) return { error: 'Hiányzó fájl' };
    if (file.size > 10 * 1024 * 1024) return { error: 'Fájl túl nagy (max 10 MB)' };

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      return { error: `Nem engedélyezett formátum. Engedélyezett: ${ALLOWED_EXTENSIONS.join(', ')}` };
    }

    const safeFilename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}_${safeFilename}`;
    const path = `loading-screens/${filename}`;

    await getSupabaseAdmin().storage.createBucket('content', { public: true }).catch(() => {});

    const { error: uploadError } = await getSupabaseAdmin().storage
      .from('content')
      .upload(path, file, { upsert: false });

    if (uploadError) {
      console.error('[uploadLoadingScreenAction] Storage hiba:', uploadError);
      return { error: 'Tárhely hiba' };
    }

    const { data: urlData } = getSupabaseAdmin().storage.from('content').getPublicUrl(path);

    const { data: existing } = await getSupabaseAdmin()
      .from('loading_screens')
      .select('sort_order')
      .order('sort_order', { ascending: false })
      .limit(1);
    const maxOrder = existing?.[0]?.sort_order ?? 0;

    const { error: dbError } = await getSupabaseAdmin().from('loading_screens').insert({
      filename,
      file_path: path,
      file_url: urlData.publicUrl,
      sort_order: maxOrder + 1,
    });

    if (dbError) {
      console.error('[uploadLoadingScreenAction] DB hiba:', dbError);
      return { error: 'Adatbázis hiba' };
    }
    return {};
  } catch (e) {
    console.error('[uploadLoadingScreenAction]', e);
    return { error: 'Szerverhiba' };
  }
}

export async function deleteLoadingScreenAction(id: string): Promise<{ error?: string }> {
  try {
    await requireAuth();
    if (!UUID_RE.test(id)) return { error: 'Érvénytelen azonosító' };

    const { data: record } = await getSupabaseAdmin()
      .from('loading_screens')
      .select('file_path')
      .eq('id', id)
      .single();

    if (record?.file_path) {
      await getSupabaseAdmin().storage.from('content').remove([record.file_path]).catch(() => {});
    }

    const { error } = await getSupabaseAdmin().from('loading_screens').delete().eq('id', id);
    if (error) return { error: 'Adatbázis hiba' };
    return {};
  } catch (e) {
    console.error('[deleteLoadingScreenAction]', e);
    return { error: 'Szerverhiba' };
  }
}
