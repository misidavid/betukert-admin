'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { GRAPHEMES } from '../../shared/curriculum/graphemes';

export async function publishPackageAction(): Promise<{ version: string; imageCount: number; soundCount: number; error?: string }> {
  try {
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

    if (error) return { version: '', imageCount: 0, soundCount: 0, error: error.message };

    // Upload manifest to public storage so the mobile app can fetch it
    const supabase = getSupabaseAdmin();
    await supabase.storage.createBucket('content', { public: true }).catch(() => {});
    const { error: storageError } = await supabase.storage
      .from('content')
      .upload('manifest.json', JSON.stringify(manifest), {
        contentType: 'application/json',
        upsert: true,
      });

    if (storageError) return { version: '', imageCount: 0, soundCount: 0, error: `DB ok, storage: ${storageError.message}` };

    return { version, imageCount: images?.length || 0, soundCount: sounds?.length || 0 };
  } catch (e: any) {
    return { version: '', imageCount: 0, soundCount: 0, error: e.message };
  }
}
