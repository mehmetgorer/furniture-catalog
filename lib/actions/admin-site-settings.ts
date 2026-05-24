"use server";

import { revalidatePath } from "next/cache";

import { optionalHttpUrlError } from "@/lib/admin/admin-copy";
import { requireAdminForServerAction } from "@/lib/db/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { parseOptionalAllowedImageUrl } from "@/lib/utils/image-url";

export type SiteSettingsFormState = { error?: string; success?: boolean };

function emptyToNull(s: unknown): string | null {
  const t = String(s ?? "").trim();
  return t === "" ? null : t;
}

function parseOptionalHttpUrl(raw: unknown, label: string): { ok: true; value: string | null } | { ok: false; error: string } {
  const t = String(raw ?? "").trim();
  if (t === "") return { ok: true, value: null };
  if (!/^https?:\/\//i.test(t)) {
    return { ok: false, error: optionalHttpUrlError(label) };
  }
  return { ok: true, value: t };
}

const LOCALES = ["tr", "en", "ar"] as const;

function revalidatePublicSiteSettingsConsumers() {
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/about`);
    revalidatePath(`/${locale}/contact`);
    revalidatePath(`/${locale}/products`);
  }
}

export async function upsertSiteSettings(
  _prev: SiteSettingsFormState,
  formData: FormData,
): Promise<SiteSettingsFormState> {
  const gate = await requireAdminForServerAction();
  if (!gate.ok) return { error: gate.error };

  const logoUrlCheck = parseOptionalAllowedImageUrl(formData.get("logo_url"));
  if (!logoUrlCheck.ok) return { error: logoUrlCheck.error };
  const igCheck = parseOptionalHttpUrl(formData.get("instagram_url"), "Instagram URL");
  if (!igCheck.ok) return { error: igCheck.error };
  const fbCheck = parseOptionalHttpUrl(formData.get("facebook_url"), "Facebook URL");
  if (!fbCheck.ok) return { error: fbCheck.error };
  const mapCheck = parseOptionalHttpUrl(formData.get("map_url"), "Harita URL");
  if (!mapCheck.ok) return { error: mapCheck.error };

  const payload = {
    logo_text: emptyToNull(formData.get("logo_text")),
    logo_url: logoUrlCheck.value,
    phone: emptyToNull(formData.get("phone")),
    whatsapp: emptyToNull(formData.get("whatsapp")),
    email: emptyToNull(formData.get("email")),
    instagram_url: igCheck.value,
    facebook_url: fbCheck.value,
    map_url: mapCheck.value,
    address_tr: emptyToNull(formData.get("address_tr")),
    address_en: emptyToNull(formData.get("address_en")),
    address_ar: emptyToNull(formData.get("address_ar")),
    about_tr: emptyToNull(formData.get("about_tr")),
    about_en: emptyToNull(formData.get("about_en")),
    about_ar: emptyToNull(formData.get("about_ar")),
  };

  const supabase = await createSupabaseServerClient();

  const { data: firstRow, error: firstErr } = await supabase
    .from("site_settings")
    .select("id")
    .order("created_at", { ascending: true })
    .limit(1)
    .maybeSingle();

  if (firstErr) {
    return { error: firstErr.message };
  }

  /** MVP: always update the first row by `created_at` when any row exists (ignores tampered form ids). */
  const existingId = (firstRow as { id: string } | null)?.id ?? null;

  if (existingId) {
    const { error } = await supabase.from("site_settings").update(payload).eq("id", existingId);
    if (error) {
      return { error: error.message };
    }
  } else {
    const { error } = await supabase.from("site_settings").insert(payload);
    if (error) {
      return { error: error.message };
    }
  }

  revalidatePublicSiteSettingsConsumers();
  return { success: true };
}
