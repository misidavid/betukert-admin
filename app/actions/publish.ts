'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { requireAuth } from '../../lib/requireAuth';
import { GRAPHEMES } from '../../shared/curriculum/graphemes';

export async function publishPackageAction(): Promise<{ version: string; imageCount: number; soundCount: number; error?: string }> {
  try {
    await requireAuth();
    const [{ data: images }, { data: sounds }, { data: words }] = await Promise.all([
      getSupabaseAdmin().from('image_needs').select('*').eq('status', 'published'),
      getSupabaseAdmin().from('sound_needs').select('*').eq('status', 'published'),
      getSupabaseAdmin().from('words').select('*').eq('enabled', true).order('phase').order('text'),
    ]);

    const version = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const manifest = {
      version,
      generated_at: new Date().toISOString(),
      words: words?.map((w: any) => ({
        id: w.id,
        text: w.text,
        syllables: w.syllables,
        syllable_count: w.syllable_count,
        graphemes: w.graphemes,
        phase: w.phase,
        difficulty: w.difficulty,
      })) || [],
      graphemes: GRAPHEMES,
      images: images?.map((img: any) => ({ word: img.word, phase: img.phase, url: img.file_url, syllables: img.syllables })) || [],
      sounds: sounds?.map((snd: any) => ({ text: snd.text, type: snd.type, phase: snd.phase, url: snd.file_url })) || [],
    };

    const { error } = await getSupabaseAdmin().from('published_packages').insert({
      version,
      image_count: images?.length || 0,
      sound_count: sounds?.length || 0,
      manifest,
    });

    if (error) {
      console.error('[publishPackageAction] DB hiba:', error);
      return { version: '', imageCount: 0, soundCount: 0, error: 'Adatbázis hiba' };
    }

    const supabase = getSupabaseAdmin();
    await supabase.storage.createBucket('content', { public: true }).catch(() => {});
    const { error: storageError } = await supabase.storage
      .from('content')
      .upload('manifest.json', JSON.stringify(manifest), {
        contentType: 'application/json',
        upsert: true,
        cacheControl: '0',
      });

    if (storageError) {
      console.error('[publishPackageAction] Storage hiba:', storageError);
      return { version: '', imageCount: 0, soundCount: 0, error: 'Tárhely hiba (az adatbázisba mentés sikeres volt)' };
    }

    return { version, imageCount: images?.length || 0, soundCount: sounds?.length || 0 };
  } catch (e) {
    console.error('[publishPackageAction]', e);
    return { version: '', imageCount: 0, soundCount: 0, error: 'Szerverhiba' };
  }
}
