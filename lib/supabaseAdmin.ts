import { createClient, SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function getSupabaseAdmin(): SupabaseClient {
  if (!_client) {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (!url) throw new Error('NEXT_PUBLIC_SUPABASE_URL env var is missing');
    if (!key) throw new Error('SUPABASE_SERVICE_ROLE_KEY env var is missing on server');
    _client = createClient(url, key);
  }
  return _client;
}
