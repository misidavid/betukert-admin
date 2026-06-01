'use server';

import { supabaseAdmin } from '../../lib/supabaseAdmin';

export async function toggleRequiresImageAction(id: string, value: boolean): Promise<void> {
  const { error } = await supabaseAdmin
    .from('exercise_type_config')
    .update({ requires_image: value, updated_at: new Date().toISOString() })
    .eq('id', id);
  if (error) throw new Error(error.message);
}
