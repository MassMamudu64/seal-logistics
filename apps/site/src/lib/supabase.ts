import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _admin: SupabaseClient | null = null;

/**
 * Server-only Supabase client using the service-role key.
 * NEVER import this into a Client Component or any module reachable from one.
 * Tests stub this module entirely.
 */
export function supabaseAdmin(): SupabaseClient {
  if (_admin) return _admin;
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error('Supabase env not configured (SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).');
  }
  _admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { headers: { 'x-application-name': 'seal-site' } },
  });
  return _admin;
}
