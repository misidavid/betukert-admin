'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { requireAuth } from '../../lib/requireAuth';
import { EXERCISE_TYPE_LABELS } from '../../shared/data/exerciseDefaults';

const EXERCISE_TYPE_ID_RE = /^[a-z0-9_-]{1,64}$/i;

// Új feladattípus első felvételekor ez az alapértelmezett kép-igény. Ezután a
// felhasználó a beállítások panelen bármikor átállíthatja — a re-seed a meglévő
// sorokhoz SOSEM nyúl hozzá, így a kézi kapcsolás megmarad.
const DEFAULT_REQUIRES_IMAGE = new Set<string>([
  'image_word_match',
  'image_word_drag',
  'first_sound',
  'sentence_picture_match',
  'image_sentence_match',
  'missing_letter',
]);

export interface ExerciseTypeConfig {
  id: string;
  label: string;
  requires_image: boolean;
  updated_at: string;
}

// A közös exerciseDefaults.ts (mobil forrás tükre) minden ismert feladattípusát
// felveszi a config táblába, ha még hiányzik. Így új típusnál nem kell külön
// SQL-migráció: a beállítások panel legközelebbi betöltésekor magától megjelenik.
async function ensureAllTypesSeeded(existingIds: Set<string>): Promise<boolean> {
  const now = new Date().toISOString();
  const missing = Object.entries(EXERCISE_TYPE_LABELS)
    .filter(([id]) => !existingIds.has(id))
    .map(([id, label]) => ({
      id,
      label,
      requires_image: DEFAULT_REQUIRES_IMAGE.has(id),
      updated_at: now,
    }));
  if (missing.length === 0) return false;
  // ignoreDuplicates: párhuzamos betöltésnél sem ír felül meglévő sort (ON CONFLICT DO NOTHING).
  const { error } = await getSupabaseAdmin()
    .from('exercise_type_config')
    .upsert(missing, { onConflict: 'id', ignoreDuplicates: true });
  if (error) {
    console.error('[ensureAllTypesSeeded] DB hiba:', error);
    return false;
  }
  return true;
}

export async function fetchExerciseTypeConfigsAction(): Promise<{ configs: ExerciseTypeConfig[]; error?: string }> {
  try {
    await requireAuth();
    const { data, error } = await getSupabaseAdmin()
      .from('exercise_type_config')
      .select('*')
      .order('id');
    if (error) return { configs: [], error: 'Adatbázis hiba' };

    const existingIds = new Set((data ?? []).map((c: ExerciseTypeConfig) => c.id));
    const seeded = await ensureAllTypesSeeded(existingIds);
    if (!seeded) return { configs: data ?? [] };

    // Új sorok kerültek be — újraolvassuk, hogy azok is megjelenjenek.
    const { data: refreshed } = await getSupabaseAdmin()
      .from('exercise_type_config')
      .select('*')
      .order('id');
    return { configs: refreshed ?? data ?? [] };
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
