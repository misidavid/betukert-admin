'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { requireAuth } from '../../lib/requireAuth';
import { GRAPHEMES } from '../../shared/curriculum/graphemes';

export interface PublishedPackage {
  id: string;
  version: string;
  created_at: string;
  image_count: number;
  sound_count: number;
  manifest: any;
}

export interface PublishPageData {
  totalImages: number;
  publishedImages: number;
  totalSounds: number;
  publishedSounds: number;
  packages: PublishedPackage[];
  error?: string;
}

export async function fetchPublishDataAction(): Promise<PublishPageData> {
  try {
    await requireAuth();
    const [
      { count: totalImages },
      { count: publishedImages },
      { count: totalSounds },
      { count: publishedSounds },
      { data: packages },
    ] = await Promise.all([
      getSupabaseAdmin().from('image_needs').select('*', { count: 'exact', head: true }),
      getSupabaseAdmin().from('image_needs').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      getSupabaseAdmin().from('sound_needs').select('*', { count: 'exact', head: true }),
      getSupabaseAdmin().from('sound_needs').select('*', { count: 'exact', head: true }).eq('status', 'published'),
      getSupabaseAdmin().from('published_packages').select('*').order('created_at', { ascending: false }).limit(10),
    ]);
    return {
      totalImages: totalImages ?? 0,
      publishedImages: publishedImages ?? 0,
      totalSounds: totalSounds ?? 0,
      publishedSounds: publishedSounds ?? 0,
      packages: (packages ?? []) as PublishedPackage[],
    };
  } catch (e) {
    console.error('[fetchPublishDataAction]', e);
    return { totalImages: 0, publishedImages: 0, totalSounds: 0, publishedSounds: 0, packages: [], error: 'Szerverhiba' };
  }
}

export async function publishPackageAction(): Promise<{ version: string; imageCount: number; soundCount: number; loadingScreenCount: number; error?: string }> {
  try {
    await requireAuth();
    const [{ data: images }, { data: sounds }, { data: words }, { data: sentenceImages }, { data: sentences }, { data: comprehensions }, { data: loadingScreens }] = await Promise.all([
      getSupabaseAdmin().from('image_needs').select('*').eq('status', 'published'),
      getSupabaseAdmin().from('sound_needs').select('*').eq('status', 'published'),
      getSupabaseAdmin().from('words').select('*').eq('enabled', true).order('phase').order('text'),
      getSupabaseAdmin().from('sentence_image_needs').select('*').eq('status', 'published'),
      getSupabaseAdmin().from('sentence_bank').select('*').order('phase').order('id'),
      getSupabaseAdmin().from('comprehension_bank').select('*').order('phase').order('id'),
      getSupabaseAdmin().from('loading_screens').select('file_url, sort_order').order('sort_order').order('created_at'),
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
      sentence_images: sentenceImages?.map((si: any) => ({
        sentence_id: si.sentence_id,
        source: si.source,
        sentence: si.sentence_text,
        phase: si.phase,
        url: si.file_url,
      })) || [],
      sentences: sentences?.map((s: any) => ({
        id: s.id,
        words: s.words,
        accepted_orders: s.accepted_orders,
        phase: s.phase,
      })) || [],
      comprehension: comprehensions?.map((c: any) => ({
        id: c.id,
        sentence: c.sentence,
        question: c.question,
        correct_answer: c.correct_answer,
        wrong_answers: c.wrong_answers,
        phase: c.phase,
      })) || [],
      loading_screens: loadingScreens?.map((ls: any) => ({ url: ls.file_url })) || [],
    };

    const { error } = await getSupabaseAdmin().from('published_packages').insert({
      version,
      image_count: images?.length || 0,
      sound_count: sounds?.length || 0,
      loading_screen_count: loadingScreens?.length || 0,
      manifest,
    });

    if (error) {
      console.error('[publishPackageAction] DB hiba:', error);
      return { version: '', imageCount: 0, soundCount: 0, loadingScreenCount: 0, error: 'Adatbázis hiba' };
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
      return { version: '', imageCount: 0, soundCount: 0, loadingScreenCount: 0, error: 'Tárhely hiba (az adatbázisba mentés sikeres volt)' };
    }

    return { version, imageCount: images?.length || 0, soundCount: sounds?.length || 0, loadingScreenCount: loadingScreens?.length || 0 };
  } catch (e) {
    console.error('[publishPackageAction]', e);
    return { version: '', imageCount: 0, soundCount: 0, loadingScreenCount: 0, error: 'Szerverhiba' };
  }
}
