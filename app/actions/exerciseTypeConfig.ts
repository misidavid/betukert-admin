'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';
import { requireAuth } from '../../lib/requireAuth';

export async function toggleRequiresImageAction(id: string, value: boolean): Promise<{ error?: string }> {
  try {
    await requireAuth();
    const { error } = await getSupabaseAdmin()
      .from('exercise_type_config')
      .update({ requires_image: value, updated_at: new Date().toISOString() })
      .eq('id', id);
    if (error) return { error: error.message };
    return {};
  } catch (e: any) {
    return { error: e.message };
  }
}
