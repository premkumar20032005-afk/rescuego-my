import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { Database } from "./types";
import { env } from "../env";

/**
 * Service-role client that bypasses RLS. Only import this from trusted
 * server-only code paths (webhook handlers, notification writes on behalf
 * of another user) - never from a client component or a path reachable
 * with attacker-controlled input without its own authorization check.
 */
export function createAdminClient() {
  if (!env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY is not configured.");
  }

  return createSupabaseClient<Database>(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
}
