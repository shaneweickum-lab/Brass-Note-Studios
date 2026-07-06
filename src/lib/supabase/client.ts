"use client";

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

// Browser singleton — safe to import in client components.
// Only has access to operations permitted by the anon RLS policies:
// SELECT on messages (real-time subscriptions) and INSERT with sender = 'client'.
export const supabaseBrowser = createClient(supabaseUrl, supabaseAnonKey);
