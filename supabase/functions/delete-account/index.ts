// Fiók végleges törlése — a mobilapp hívja (Szülői mód → Fiók törlése).
//
// A bejövő JWT azonosítja a felhasználót, majd service role kulccsal töröljük
// az auth.users sort. A child_profiles és mastery_records sorokat az
// ON DELETE CASCADE külső kulcsok takarítják el (lásd
// migrations/20260609_child_profiles_mastery.sql).
//
// Két kiegészítő takarítás, mindkettő LEGJOBB SZÁNDÉK SZERINTI: ha elbukik,
// csak naplózzuk, a fióktörlést nem akadályozhatja (az Apple és a Google is
// elvárja, hogy a törlés mindig lefusson).
//  1. Apple: ha az app Apple-hozzáférési kódot küld, beváltjuk és visszavonjuk
//     a tokent — így a szülő iPhone-ja sem mutatja tovább a Betűkertet a
//     „Bejelentkezés az Apple-lel" alkalmazások közt (Apple fióktörlési útmutató).
//  2. RevenueCat: a sikeres törlés után a vásárlói rekordot is töröljük (GDPR).
//     A vásárlás maga az Apple-nél / Google-nél marad, új fiókban visszaállítható.
//
// Deploy: supabase functions deploy delete-account
// (A SUPABASE_URL / SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY környezeti
// változókat a Supabase automatikusan biztosítja a function futásakor.)
//
// Saját titkok (supabase secrets set …) — bármelyik hiányában az adott
// takarítás kimarad, a törlés a régi módon fut:
//   APPLE_TEAM_ID, APPLE_KEY_ID, APPLE_PRIVATE_KEY (a .p8 tartalma; fejléc és
//   sortörés nélkül is jó), APPLE_CLIENT_ID (elhagyható, alapból a bundle ID)
//   REVENUECAT_SECRET_KEY (v2, customer_information:customers:read_write),
//   REVENUECAT_PROJECT_ID

import { createClient, type User } from 'npm:@supabase/supabase-js@2';

const DEFAULT_APPLE_CLIENT_ID = 'com.misi.david.betukert';
// A külső hívások ne tarthassák fogva a törlést.
const EXTERNAL_TIMEOUT_MS = 10_000;

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

const base64UrlEncode = (data: Uint8Array | string): string => {
  const bytes = typeof data === 'string' ? new TextEncoder().encode(data) : data;
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
};

const base64UrlDecode = (data: string): string =>
  atob(data.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(data.length / 4) * 4, '='));

// Az Apple a kliens-titkot a .p8 kulccsal aláírt, rövid életű ES256 JWT-ként
// várja. A WebCrypto ECDSA-aláírása eleve a JWS-hez kellő r||s formátumú.
const createAppleClientSecret = async (
  teamId: string,
  keyId: string,
  privateKey: string,
  clientId: string,
): Promise<string> => {
  const der = Uint8Array.from(
    atob(privateKey.replace(/-----[^-]+-----/g, '').replace(/\s+/g, '')),
    c => c.charCodeAt(0),
  );
  const key = await crypto.subtle.importKey(
    'pkcs8',
    der,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  );
  const now = Math.floor(Date.now() / 1000);
  const signingInput =
    base64UrlEncode(JSON.stringify({ alg: 'ES256', kid: keyId })) +
    '.' +
    base64UrlEncode(
      JSON.stringify({ iss: teamId, iat: now, exp: now + 300, aud: 'https://appleid.apple.com', sub: clientId }),
    );
  const signature = new Uint8Array(
    await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, key, new TextEncoder().encode(signingInput)),
  );
  return `${signingInput}.${base64UrlEncode(signature)}`;
};

const postAppleForm = (path: string, params: Record<string, string>) =>
  fetch(`https://appleid.apple.com${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(params),
    signal: AbortSignal.timeout(EXTERNAL_TIMEOUT_MS),
  });

const revokeAppleToken = async (user: User, authorizationCode: string): Promise<void> => {
  const teamId = Deno.env.get('APPLE_TEAM_ID');
  const keyId = Deno.env.get('APPLE_KEY_ID');
  const privateKey = Deno.env.get('APPLE_PRIVATE_KEY');
  const clientId = Deno.env.get('APPLE_CLIENT_ID') ?? DEFAULT_APPLE_CLIENT_ID;
  if (!teamId || !keyId || !privateKey) {
    console.warn('Apple-visszavonás kihagyva: hiányzó APPLE_* titok');
    return;
  }

  const appleIdentity = user.identities?.find(i => i.provider === 'apple');
  if (!appleIdentity) {
    console.warn('Apple-visszavonás kihagyva: a fióknak nincs Apple-azonosítója');
    return;
  }

  const clientSecret = await createAppleClientSecret(teamId, keyId, privateKey, clientId);

  const tokenRes = await postAppleForm('/auth/token', {
    client_id: clientId,
    client_secret: clientSecret,
    code: authorizationCode,
    grant_type: 'authorization_code',
  });
  if (!tokenRes.ok) throw new Error(`Apple token ${tokenRes.status}: ${await tokenRes.text()}`);
  const tokens = await tokenRes.json() as { refresh_token?: string; access_token?: string; id_token?: string };

  // Csak a SAJÁT Apple-azonosítót vonjuk vissza: ha az eszközön más Apple ID
  // van bejelentkezve, a kód annak a felhasználónak szól, és azt nem bántjuk.
  // Az id_token közvetlenül az Apple-től jött TLS-en, ezért elég kiolvasni.
  const appleSub = tokens.id_token
    ? (JSON.parse(base64UrlDecode(tokens.id_token.split('.')[1])) as { sub?: string }).sub
    : undefined;
  const expectedSub = (appleIdentity.identity_data?.sub as string | undefined) ?? appleIdentity.id;
  if (!appleSub || appleSub !== expectedSub) {
    console.warn('Apple-visszavonás kihagyva: a kód nem a fiók Apple-azonosítójához tartozik');
    return;
  }

  const token = tokens.refresh_token ?? tokens.access_token;
  if (!token) throw new Error('Apple token-válasz token nélkül');
  const revokeRes = await postAppleForm('/auth/revoke', {
    client_id: clientId,
    client_secret: clientSecret,
    token,
    token_type_hint: tokens.refresh_token ? 'refresh_token' : 'access_token',
  });
  if (!revokeRes.ok) throw new Error(`Apple revoke ${revokeRes.status}: ${await revokeRes.text()}`);
};

const deleteRevenueCatCustomer = async (userId: string): Promise<void> => {
  const secretKey = Deno.env.get('REVENUECAT_SECRET_KEY');
  const projectId = Deno.env.get('REVENUECAT_PROJECT_ID');
  if (!secretKey || !projectId) {
    console.warn('RevenueCat-törlés kihagyva: hiányzó REVENUECAT_* titok');
    return;
  }
  const res = await fetch(
    `https://api.revenuecat.com/v2/projects/${encodeURIComponent(projectId)}/customers/${encodeURIComponent(userId)}`,
    {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${secretKey}` },
      signal: AbortSignal.timeout(EXTERNAL_TIMEOUT_MS),
    },
  );
  // 404: a RevenueCatnél nincs ilyen vásárló (pl. soha nem nyitotta meg a
  // fizetőfalat) — nincs mit törölni.
  if (!res.ok && res.status !== 404) {
    throw new Error(`RevenueCat ${res.status}: ${await res.text()}`);
  }
};

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

  // A régebbi app-verziók üres törzzsel hívnak — ez nem hiba.
  let appleAuthorizationCode: string | null = null;
  try {
    const body = await req.json();
    if (typeof body?.appleAuthorizationCode === 'string') {
      appleAuthorizationCode = body.appleAuthorizationCode;
    }
  } catch {
    // nincs (vagy nem JSON) törzs
  }

  // 1. Apple — a törlés ELŐTT, mert ehhez még kell a fiók Apple-azonosítója.
  if (appleAuthorizationCode) {
    try {
      await revokeAppleToken(user, appleAuthorizationCode);
    } catch (e) {
      console.error('Apple-visszavonás sikertelen:', e);
    }
  }

  // 2. Törlés service role-lal — a kapcsolódó táblák kaszkáddal ürülnek
  const admin = createClient(supabaseUrl, serviceKey);
  const { error: deleteError } = await admin.auth.admin.deleteUser(user.id);
  if (deleteError) {
    return json({ error: deleteError.message }, 500);
  }

  // 3. RevenueCat — csak a sikeres törlés UTÁN: ha a fiók megmaradna, a
  // vásárlói rekordja se tűnjön el.
  try {
    await deleteRevenueCatCustomer(user.id);
  } catch (e) {
    console.error('RevenueCat-törlés sikertelen:', e);
  }

  return json({ success: true }, 200);
});
