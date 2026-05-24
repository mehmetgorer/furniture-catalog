import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/lib/supabase/types";

import { isSupabaseConfigured } from "./env";

export async function getSiteSettings(): Promise<SiteSettings | null> {
  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("site_settings")
      .select("*")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as unknown as SiteSettings;
  } catch {
    return null;
  }
}

/** Same as `getSiteSettings` — first row by `created_at` (MVP single-row model). Alias for admin code clarity. */
export async function getAdminSiteSettings(): Promise<SiteSettings | null> {
  return getSiteSettings();
}
