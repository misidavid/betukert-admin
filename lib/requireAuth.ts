import { createSupabaseServerClient } from './supabaseServer';
import { isAdminEmail } from './adminAllowlist';

export async function requireAuth(): Promise<void> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || !isAdminEmail(user.email)) {
    throw new Error('Unauthorized');
  }
}
