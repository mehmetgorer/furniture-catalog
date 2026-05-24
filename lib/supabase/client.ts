import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";

function getPublicEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
  };
}

/**
 * Browser/client Supabase helper (publishable key only; never service role or other secrets).
 * Does not throw if env vars are missing so `pnpm build` works before `.env.local` exists.
 */
export function createSupabaseBrowserClient(): SupabaseClient {
  const { url, key } = getPublicEnv();
  return createBrowserClient(url, key);
}

