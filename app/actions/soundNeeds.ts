'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { SoundStatus } from '../../lib/supabase';
import { GRAPHEMES } from '../../shared/curriculum/graphemes';
import { generateSyllables } from '../../shared/curriculum/syllableGenerator';
import { WORD_BANK } from '../../shared/data/wordbank';
import { filterWordsByPhase } from '../../shared/curriculum/wordFilter';

export async function generateSoundNeedsAction(): Promise<{ inserted: number; skipped: number; error?: string }> {
  try {
    const { data: existing } = await getSupabaseAdmin().from('sound_needs').select('text, type');
    const existingSet = new Set(existing?.map((e: any) => `${e.type}:${e.text}`) || []);

    const toInsert: any[] = [];

    for (const g of GRAPHEMES.filter(g => !g.rare)) {
      const key = `phoneme:${g.display}`;
      if (!existingSet.has(key)) {
        toInsert.push({
          text: g.display,
          type: 'phoneme',
          phase: g.phase,
          pronunciation_note: `A "${g.display}" hang ejtése — NEM a betű neve!`,
          status: 'missing',
        });
      }
    }

    const syllables = generateSyllables(36);
    for (const s of syllables.slice(0, 200)) {
      const key = `syllable:${s.text}`;
      if (!existingSet.has(key)) {
        toInsert.push({ text: s.text, type: 'syllable', phase: s.phase, status: 'missing' });
      }
    }

    const words = filterWordsByPhase(WORD_BANK, 36);
    for (const w of words) {
      const key = `word:${w.text}`;
      if (!existingSet.has(key)) {
        toInsert.push({ text: w.text, type: 'word', phase: w.phase, status: 'missing' });
      }
    }

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
  type: string,
  phase: number,
  text: string,
  file: File,
): Promise<{ error?: string }> {
  try {
    const ext = file.name.split('.').pop();
    const path = `${type}/${phase}/${text}.${ext}`;

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
