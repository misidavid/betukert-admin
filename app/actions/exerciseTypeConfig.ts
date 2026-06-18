'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { requireAuth } from '../../lib/requireAuth';

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export async function toggleRequiresImageAction(id: string, value: boolean): Promise<{ error?: string }> {
  try {
    await requireAuth();
    if (!UUID_RE.test(id)) return { error: 'Érvénytelen azonosító' };
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
