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
import { LINK_URL_DISALLOWED, MISSING_SLIDE_ID, TURKISH_TITLE_REQUIRED } from "@/lib/admin/admin-copy";
import { requireAdminForServerAction } from "@/lib/db/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseRequiredAllowedImageUrl } from "@/lib/utils/image-url";

export type HeroSlideFormState = { error?: string };

function emptyToNull(s: unknown): string | null {
  if (s == null) return null;
  const t = String(s).trim();
  return t === "" ? null : t;
}

const LOCALES = ["tr", "en", "ar"] as const;

function revalidateHomePages() {
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`);
  }
}

/** Reject obvious XSS / exfiltration schemes; internal paths and https are handled at render time. */
function parseHeroLinkUrl(raw: string): { ok: true; value: string | null } | { ok: false; error: string } {
  const t = raw.trim();
  if (t === "") return { ok: true, value: null };
  const lower = t.toLowerCase();
  if (
    lower.startsWith("javascript:") ||
    lower.startsWith("data:") ||
    lower.startsWith("vbscript:") ||
    lower.startsWith("file:")
  ) {
    return { ok: false, error: LINK_URL_DISALLOWED };
  }
  return { ok: true, value: t };
}

export async function createHeroSlide(_prev: HeroSlideFormState, formData: FormData): Promise<HeroSlideFormState> {
  const gate = await requireAdminForServerAction();
  if (!gate.ok) return { error: gate.error };

  const title_tr = String(formData.get("title_tr") ?? "").trim();
  const imageParsed = parseRequiredAllowedImageUrl(formData.get("image_url"));
  if (!imageParsed.ok) return { error: imageParsed.error };
  const image_url = imageParsed.value;
  const linkParsed = parseHeroLinkUrl(String(formData.get("link_url") ?? ""));
  if (!linkParsed.ok) return { error: linkParsed.error };
  const link_url = linkParsed.value;
  const sort_order = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10);
  const sortOrder = Number.isFinite(sort_order) ? sort_order : 0;
  const is_active = formData.get("is_active") === "true";

  if (!title_tr) {
    return { error: TURKISH_TITLE_REQUIRED };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("hero_slides").insert({
    image_url,
    link_url,
    is_active,
    sort_order: sortOrder,
    title_tr,
    title_en: emptyToNull(formData.get("title_en")),
    title_ar: emptyToNull(formData.get("title_ar")),
    description_tr: emptyToNull(formData.get("description_tr")),
    description_en: emptyToNull(formData.get("description_en")),
    description_ar: emptyToNull(formData.get("description_ar")),
    button_text_tr: emptyToNull(formData.get("button_text_tr")),
    button_text_en: emptyToNull(formData.get("button_text_en")),
    button_text_ar: emptyToNull(formData.get("button_text_ar")),
  });

  if (error) {
    return { error: error.message };
  }

  revalidateHomePages();
  redirect("/admin/hero-slides");
}

export async function updateHeroSlide(_prev: HeroSlideFormState, formData: FormData): Promise<HeroSlideFormState> {
  const gate = await requireAdminForServerAction();
  if (!gate.ok) return { error: gate.error };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: MISSING_SLIDE_ID };
  }

  const title_tr = String(formData.get("title_tr") ?? "").trim();
  const imageParsed = parseRequiredAllowedImageUrl(formData.get("image_url"));
  if (!imageParsed.ok) return { error: imageParsed.error };
  const image_url = imageParsed.value;
  const linkParsed = parseHeroLinkUrl(String(formData.get("link_url") ?? ""));
  if (!linkParsed.ok) return { error: linkParsed.error };
  const link_url = linkParsed.value;
  const sort_order = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10);
  const sortOrder = Number.isFinite(sort_order) ? sort_order : 0;
  const is_active = formData.get("is_active") === "true";

  if (!title_tr) {
    return { error: TURKISH_TITLE_REQUIRED };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("hero_slides")
    .update({
      image_url,
      link_url,
      is_active,
      sort_order: sortOrder,
      title_tr,
      title_en: emptyToNull(formData.get("title_en")),
      title_ar: emptyToNull(formData.get("title_ar")),
      description_tr: emptyToNull(formData.get("description_tr")),
      description_en: emptyToNull(formData.get("description_en")),
      description_ar: emptyToNull(formData.get("description_ar")),
      button_text_tr: emptyToNull(formData.get("button_text_tr")),
      button_text_en: emptyToNull(formData.get("button_text_en")),
      button_text_ar: emptyToNull(formData.get("button_text_ar")),
    })
    .eq("id", id);

  if (error) {
    return { error: error.message };
  }

  revalidateHomePages();
  redirect("/admin/hero-slides");
}

export async function deactivateHeroSlide(formData: FormData): Promise<void> {
  const listPath = "/admin/hero-slides" as const;
  const gate = await requireAdminForServerAction();
  if (!gate.ok) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    finishLifecycleRedirect(listPath, null, "deactivateError", MISSING_SLIDE_ID);
  }

  const result = await deactivateActiveRow("hero_slides", id);
  if (!result.ok) {
    finishLifecycleRedirect(listPath, null, "deactivateError", result.error);
  }

  revalidateHomePages();
  revalidateAdminListPath(listPath);
  revalidatePath(`/admin/hero-slides/${id}/edit`);
  finishLifecycleRedirect(listPath, "deactivated", "deactivateError", null);
}

export async function activateHeroSlide(formData: FormData): Promise<void> {
  const listPath = "/admin/hero-slides" as const;
  const gate = await requireAdminForServerAction();
  if (!gate.ok) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    finishLifecycleRedirect(listPath, null, "activateError", MISSING_SLIDE_ID);
  }

  const result = await activateInactiveRow("hero_slides", id);
  if (!result.ok) {
    finishLifecycleRedirect(listPath, null, "activateError", result.error);
  }

  revalidateHomePages();
  revalidateAdminListPath(listPath);
  revalidatePath(`/admin/hero-slides/${id}/edit`);
  finishLifecycleRedirect(listPath, "activated", "activateError", null);
}

/** Permanent delete removes the database row only; Storage objects are not removed. */
export async function deleteHeroSlidePermanently(formData: FormData): Promise<void> {
  const listPath = "/admin/hero-slides" as const;
  const gate = await requireAdminForServerAction();
  if (!gate.ok) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    finishLifecycleRedirect(listPath, null, "deleteError", MISSING_SLIDE_ID);
  }

  const result = await deleteInactiveRow("hero_slides", id);
  if (!result.ok) {
    finishLifecycleRedirect(listPath, null, "deleteError", result.error);
  }

  revalidateHomePages();
  revalidateAdminListPath(listPath);
  finishLifecycleRedirect(listPath, "deleted", "deleteError", null);
}
