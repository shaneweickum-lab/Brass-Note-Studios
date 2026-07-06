import { createClient, SupabaseClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// SECURITY: This key is never passed to the browser.
// It bypasses RLS and has full database access.
// Only call createServiceClient() inside Server Components, Route Handlers, and Server Actions.

let _client: SupabaseClient | null = null;

export function createServiceClient(): SupabaseClient {
  if (!_client) {
    _client = createClient(supabaseUrl, serviceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });
  }
  return _client;
}
