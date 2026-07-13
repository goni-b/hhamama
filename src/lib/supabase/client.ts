// src/lib/supabase/client.ts — single browser Supabase client (cookie-based session).
// Lazy singleton so the module is safe to import during SSR bundling.
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient {
  if (client) return client;
  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  // sb_publishable_... is the modern client key; legacy anon JWT still accepted.
  const key = (import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY ??
    import.meta.env.VITE_SUPABASE_ANON_KEY) as string | undefined;
  if (!url || !key) {
    throw new Error(
      "Missing VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY — set them in .env.local",
    );
  }
  client = createBrowserClient(url, key);
  return client;
}
