'use server';

import { getSupabaseAdmin } from '../../lib/supabaseAdmin';

export async function toggleRequiresImageAction(id: string, value: boolean): Promise<{ error?: string }> {
  try {
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
