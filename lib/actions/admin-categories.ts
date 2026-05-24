"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  activateInactiveRow,
  deactivateActiveRow,
  deleteInactiveRow,
  finishLifecycleRedirect,
  revalidateAdminListPath,
} from "@/lib/actions/admin-lifecycle-helpers";
import {
  MISSING_CATEGORY_ID,
  SLUG_CATEGORY_ERROR,
  SLUG_IN_USE,
  TURKISH_NAME_REQUIRED,
} from "@/lib/admin/admin-copy";
import { requireAdminForServerAction } from "@/lib/db/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseOptionalAllowedImageUrl } from "@/lib/utils/image-url";
import { isValidKebabSlug, resolveCategorySlug } from "@/lib/utils/slug";

export type CategoryFormState = { error?: string };

function emptyToNull(s: unknown): string | null {
  if (s == null) return null;
  const t = String(s).trim();
  return t === "" ? null : t;
}

function revalidatePublicCatalog() {
  revalidatePath("/tr");
  revalidatePath("/en");
  revalidatePath("/ar");
  revalidatePath("/tr/products");
  revalidatePath("/en/products");
  revalidatePath("/ar/products");
}

export async function createCategory(_prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const gate = await requireAdminForServerAction();
  if (!gate.ok) return { error: gate.error };

  const name_tr = String(formData.get("name_tr") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const imageParsed = parseOptionalAllowedImageUrl(formData.get("image_url"));
  if (!imageParsed.ok) return { error: imageParsed.error };
  const image_url = imageParsed.value;
  const sort_order = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10);
  const sortOrder = Number.isFinite(sort_order) ? sort_order : 0;
  const is_active = formData.get("is_active") === "true";

  if (!name_tr) {
    return { error: TURKISH_NAME_REQUIRED };
  }

  const slug = resolveCategorySlug(name_tr, slugRaw);
  if (!slug || !isValidKebabSlug(slug)) {
    return {
      error: SLUG_CATEGORY_ERROR,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("categories").insert({
    slug,
    image_url,
    is_active,
    sort_order: sortOrder,
    name_tr,
    name_en: emptyToNull(formData.get("name_en")),
    name_ar: emptyToNull(formData.get("name_ar")),
    description_tr: emptyToNull(formData.get("description_tr")),
    description_en: emptyToNull(formData.get("description_en")),
    description_ar: emptyToNull(formData.get("description_ar")),
  });

  if (error) {
    if (error.code === "23505") {
      return { error: SLUG_IN_USE };
    }
    return { error: error.message };
  }

  revalidatePublicCatalog();
  redirect("/admin/categories");
}

export async function updateCategory(_prev: CategoryFormState, formData: FormData): Promise<CategoryFormState> {
  const gate = await requireAdminForServerAction();
  if (!gate.ok) return { error: gate.error };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: MISSING_CATEGORY_ID };
  }

  const name_tr = String(formData.get("name_tr") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const imageParsed = parseOptionalAllowedImageUrl(formData.get("image_url"));
  if (!imageParsed.ok) return { error: imageParsed.error };
  const image_url = imageParsed.value;
  const sort_order = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10);
  const sortOrder = Number.isFinite(sort_order) ? sort_order : 0;
  const is_active = formData.get("is_active") === "true";

  if (!name_tr) {
    return { error: TURKISH_NAME_REQUIRED };
  }

  const slug = resolveCategorySlug(name_tr, slugRaw);
  if (!slug || !isValidKebabSlug(slug)) {
    return {
      error: SLUG_CATEGORY_ERROR,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("categories")
    .update({
      slug,
      image_url,
      is_active,
      sort_order: sortOrder,
      name_tr,
      name_en: emptyToNull(formData.get("name_en")),
      name_ar: emptyToNull(formData.get("name_ar")),
      description_tr: emptyToNull(formData.get("description_tr")),
      description_en: emptyToNull(formData.get("description_en")),
      description_ar: emptyToNull(formData.get("description_ar")),
    })
    .eq("id", id);

  if (error) {
    if (error.code === "23505") {
      return { error: SLUG_IN_USE };
    }
    return { error: error.message };
  }

  revalidatePublicCatalog();
  redirect("/admin/categories");
}

export async function deactivateCategory(formData: FormData): Promise<void> {
  const listPath = "/admin/categories" as const;
  const gate = await requireAdminForServerAction();
  if (!gate.ok) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    finishLifecycleRedirect(listPath, null, "deactivateError", MISSING_CATEGORY_ID);
  }

  const result = await deactivateActiveRow("categories", id);
  if (!result.ok) {
    finishLifecycleRedirect(listPath, null, "deactivateError", result.error);
  }

  revalidatePublicCatalog();
  revalidateAdminListPath(listPath);
  revalidatePath(`/admin/categories/${id}/edit`);
  finishLifecycleRedirect(listPath, "deactivated", "deactivateError", null);
}

export async function activateCategory(formData: FormData): Promise<void> {
  const listPath = "/admin/categories" as const;
  const gate = await requireAdminForServerAction();
  if (!gate.ok) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    finishLifecycleRedirect(listPath, null, "activateError", MISSING_CATEGORY_ID);
  }

  const result = await activateInactiveRow("categories", id);
  if (!result.ok) {
    finishLifecycleRedirect(listPath, null, "activateError", result.error);
  }

  revalidatePublicCatalog();
  revalidateAdminListPath(listPath);
  revalidatePath(`/admin/categories/${id}/edit`);
  finishLifecycleRedirect(listPath, "activated", "activateError", null);
}

/** Permanent delete removes the database row only; Storage objects are not removed. */
export async function deleteCategoryPermanently(formData: FormData): Promise<void> {
  const listPath = "/admin/categories" as const;
  const gate = await requireAdminForServerAction();
  if (!gate.ok) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    finishLifecycleRedirect(listPath, null, "deleteError", MISSING_CATEGORY_ID);
  }

  const result = await deleteInactiveRow("categories", id);
  if (!result.ok) {
    finishLifecycleRedirect(listPath, null, "deleteError", result.error);
  }

  revalidatePublicCatalog();
  revalidateAdminListPath(listPath);
  finishLifecycleRedirect(listPath, "deleted", "deleteError", null);
}
