// Fiók végleges törlése — a mobilapp hívja (Szülői mód → Fiók törlése).
//
// A bejövő JWT azonosítja a felhasználót, majd service role kulccsal töröljük
// az auth.users sort. A child_profiles és mastery_records sorokat az
// ON DELETE CASCADE külső kulcsok takarítják el (lásd
// migrations/20260609_child_profiles_mastery.sql).
//
// Deploy: supabase functions deploy delete-account
// (A SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY környezeti
// változókat a Supabase automatikusan biztosítja a function futásakor.)

import { createClient } from 'npm:@supabase/supabase-js@2';

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

Deno.serve(async (req) => {
  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
  const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

  // A hívó azonosítása a saját JWT-je alapján
  const authHeader = req.headers.get('Authorization') ?? '';
  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: authHeader } },
  });
  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) {
    return json({ error: 'Érvénytelen vagy hiányzó munkamenet' }, 401);
  }

  // Törlés service role-lal — a kapcsolódó táblák kaszkáddal ürülnek
  const admin = createClient(supabaseUrl, serviceKey);
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteError) {
    return json({ error: deleteError.message }, 500);
  }

  return json({ success: true }, 200);
});
