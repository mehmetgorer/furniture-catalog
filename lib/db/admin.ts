import type { User } from "@supabase/supabase-js";

import { isSupabaseConfigured } from "@/lib/db/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { AdminProfile } from "@/lib/supabase/types";

export type CurrentAdminResult =
  | { status: "no-session" }
  | { status: "forbidden"; user: Pick<User, "id" | "email"> }
  | { status: "ok"; user: Pick<User, "id" | "email">; profile: AdminProfile };

/**
 * Resolves the signed-in Supabase user and whether they have an `admin_profiles` row with role `admin`.
 * Uses the server Supabase client (RLS: users may only read their own `admin_profiles` row).
 */
export async function getCurrentAdmin(): Promise<CurrentAdminResult> {
  if (!isSupabaseConfigured()) {
    return { status: "no-session" };
  }

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return { status: "no-session" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("admin_profiles")
    .select("id, email, role, created_at")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    return { status: "forbidden", user: { id: user.id, email: user.email } };
  }

  const row = profile as unknown as AdminProfile;
  if (String(row.role ?? "").trim() !== "admin") {
    return { status: "forbidden", user: { id: user.id, email: user.email } };
  }

  return { status: "ok", user: { id: user.id, email: user.email }, profile: row };
}

import { ADMIN_ACTION_NOT_ALLOWED } from "@/lib/admin/admin-copy";

/** Generic message for server actions when the caller is not an admin (avoid leaking session vs role). */
export { ADMIN_ACTION_NOT_ALLOWED };

/**
 * Defense-in-depth for server actions: same rules as the admin layout, before hitting Supabase.
 * Mutations still rely on RLS; this fails fast with a stable error instead of relying on RLS alone.
 */
export async function requireAdminForServerAction(): Promise<{ ok: true } | { ok: false; error: string }> {
  const result = await getCurrentAdmin();
  if (result.status !== "ok") {
    return { ok: false, error: ADMIN_ACTION_NOT_ALLOWED };
  }
  return { ok: true };
}
