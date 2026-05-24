import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  CANNOT_DELETE_ACTIVE,
  NO_ROW_UPDATED,
  RECORD_NOT_FOUND,
  RLS_ACTION_FAILED,
} from "@/lib/admin/admin-copy";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AdminListPath = "/admin/categories" | "/admin/products" | "/admin/hero-slides";

type LifecycleTable = "categories" | "products" | "hero_slides";

export async function deactivateActiveRow(
  table: LifecycleTable,
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(table)
    .update({ is_active: false })
    .eq("id", id)
    .eq("is_active", true)
    .select("id");

  if (error) {
    return { ok: false, error: error.message || RLS_ACTION_FAILED };
  }

  if (!data?.length) {
    return { ok: false, error: NO_ROW_UPDATED };
  }

  return { ok: true };
}

export async function activateInactiveRow(
  table: LifecycleTable,
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from(table)
    .update({ is_active: true })
    .eq("id", id)
    .eq("is_active", false)
    .select("id");

  if (error) {
    return { ok: false, error: error.message || RLS_ACTION_FAILED };
  }

  if (!data?.length) {
    return { ok: false, error: NO_ROW_UPDATED };
  }

  return { ok: true };
}

export async function deleteInactiveRow(
  table: LifecycleTable,
  id: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const supabase = await createSupabaseServerClient();
  const { data: row, error: fetchError } = await supabase
    .from(table)
    .select("id, is_active")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) {
    return { ok: false, error: fetchError.message || RLS_ACTION_FAILED };
  }

  if (!row) {
    return { ok: false, error: RECORD_NOT_FOUND };
  }

  const record = row as { id: string; is_active: boolean };
  if (record.is_active) {
    return { ok: false, error: CANNOT_DELETE_ACTIVE };
  }

  const { data, error } = await supabase.from(table).delete().eq("id", id).eq("is_active", false).select("id");

  if (error) {
    return { ok: false, error: error.message || RLS_ACTION_FAILED };
  }

  if (!data?.length) {
    return { ok: false, error: RLS_ACTION_FAILED };
  }

  return { ok: true };
}

export function revalidateAdminListPath(listPath: AdminListPath) {
  revalidatePath(listPath);
}

type LifecycleSuccess = "deactivated" | "activated" | "deleted";
type LifecycleErrorKey = "deactivateError" | "activateError" | "deleteError";

export function finishLifecycleRedirect(
  listPath: AdminListPath,
  success: LifecycleSuccess | null,
  errorKey: LifecycleErrorKey,
  error: string | null,
): never {
  if (error) {
    redirect(`${listPath}?${errorKey}=${encodeURIComponent(error)}`);
  }
  if (success === "deactivated") {
    redirect(`${listPath}?deactivated=1`);
  }
  if (success === "activated") {
    redirect(`${listPath}?activated=1`);
  }
  redirect(`${listPath}?deleted=1`);
}
