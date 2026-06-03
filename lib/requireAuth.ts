import { createSupabaseServerClient } from './supabaseServer';

export async function requireAuth(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
}
