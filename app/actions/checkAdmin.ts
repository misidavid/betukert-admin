'use server';

import { createSupabaseServerClient } from '../../lib/supabaseServer';
import { isAdminEmail } from '../../lib/adminAllowlist';

// A login oldal hívja közvetlenül bejelentkezés után: így a nem-admin
// felhasználó azonnal érthető hibát kap (és kijelentkeztetjük), ahelyett
// hogy a proxy némán visszadobná a login oldalra.
export async function checkAdminAction(): Promise<{ isAdmin: boolean }> {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  return { isAdmin: isAdminEmail(user?.email) };
}
