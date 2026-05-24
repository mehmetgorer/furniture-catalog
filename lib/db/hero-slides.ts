import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { HeroSlide as DbHeroSlide } from "@/lib/supabase/types";

import { isSupabaseConfigured } from "./env";

export async function getActiveHeroSlides(): Promise<DbHeroSlide[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data) {
      return [];
    }

    return data as unknown as DbHeroSlide[];
  } catch {
    return [];
  }
}

/** All hero slides for admin (active + inactive). */
export async function getAdminHeroSlides(): Promise<DbHeroSlide[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("hero_slides")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data) {
      return [];
    }

    return data as unknown as DbHeroSlide[];
  } catch {
    return [];
  }
}

/** Single hero slide for admin edit (includes inactive). */
export async function getHeroSlideForEdit(id: string): Promise<DbHeroSlide | null> {
  const trimmed = id?.trim();
  if (!trimmed || !isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("hero_slides").select("*").eq("id", trimmed).maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as unknown as DbHeroSlide;
  } catch {
    return null;
  }
}
