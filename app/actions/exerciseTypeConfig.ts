'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { requireAuth } from '../../lib/requireAuth';

const EXERCISE_TYPE_ID_RE = /^[a-z0-9_-]{1,64}$/i;

export interface ExerciseTypeConfig {
  id: string;
  label: string;
  requires_image: boolean;
  updated_at: string;
}

export async function fetchExerciseTypeConfigsAction(): Promise<{ configs: ExerciseTypeConfig[]; error?: string }> {
  try {
    await requireAuth();
    const { data, error } = await getSupabaseAdmin()
      .from('exercise_type_config')
      .select('*')
      .order('id');
    if (error) return { configs: [], error: 'Adatbázis hiba' };
    return { configs: data ?? [] };
  } catch (e) {
    console.error('[fetchExerciseTypeConfigsAction]', e);
    return { configs: [], error: 'Szerverhiba' };
  }
}

export async function toggleRequiresImageAction(id: string, value: boolean): Promise<{ error?: string }> {
  try {
    await requireAuth();
    if (!EXERCISE_TYPE_ID_RE.test(id)) return { error: 'Érvénytelen azonosító' };
    const { error } = await getSupabaseAdmin()
      .from('exercise_type_config')
      .update({ requires_image: value, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) {
      console.error('[toggleRequiresImageAction] DB hiba:', error);
      return { error: 'Adatbázis hiba' };
    }
    return {};
  } catch (e) {
    console.error('[toggleRequiresImageAction]', e);
    return { error: 'Szerverhiba' };
  }
}
