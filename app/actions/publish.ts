'use server';

import { supabaseAdmin } from '../../lib/supabaseAdmin';

export async function publishPackageAction(): Promise<{ version: string; imageCount: number; soundCount: number; error?: string }> {
  try {
    const [{ data: images }, { data: sounds }] = await Promise.all([
      supabaseAdmin.from('image_needs').select('*').eq('status', 'published'),
      supabaseAdmin.from('sound_needs').select('*').eq('status', 'published'),
    ]);

    const version = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const manifest = {
      version,
      generated_at: new Date().toISOString(),
      images: images?.map((img: any) => ({ word: img.word, phase: img.phase, url: img.file_url, syllables: img.syllables })) || [],
      sounds: sounds?.map((snd: any) => ({ text: snd.text, type: snd.type, phase: snd.phase, url: snd.file_url })) || [],
    };

    const { error } = await supabaseAdmin.from('published_packages').insert({
      version,
      image_count: images?.length || 0,
      sound_count: sounds?.length || 0,
      manifest,
    });

    if (error) return { version: '', imageCount: 0, soundCount: 0, error: error.message };

    return { version, imageCount: images?.length || 0, soundCount: sounds?.length || 0 };
  } catch (e: any) {
    return { version: '', imageCount: 0, soundCount: 0, error: e.message };
  }
}
