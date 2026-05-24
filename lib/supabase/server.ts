import { createServerClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";

function getPublicEnv() {
  return {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    key: process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ?? "",
  };
}

/**
 * Server-side Supabase helper for Next.js App Router (publishable key only; never service role).
 * Session refresh is handled in `middleware.ts`; that keeps auth cookies current for Server Components and actions.
 */
export async function createSupabaseServerClient(): Promise<SupabaseClient> {
  const { url, key } = getPublicEnv();
  const cookieStore = await cookies();

  return createServerClient(url, key, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        // `cookies().set` can throw in some Server Component contexts (read-only). Middleware still refreshes the session.
        try {
          for (const cookie of cookiesToSet) {
            cookieStore.set(cookie);
          }
        } catch {
          // Safe to ignore: auth refresh on navigations is handled by middleware.
        }
      },
    },
  });
}

