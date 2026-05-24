import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Category } from "@/lib/supabase/types";

import { isSupabaseConfigured } from "./env";

export async function getActiveCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data) {
      return [];
    }

    return data as unknown as Category[];
  } catch {
    return [];
  }
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const trimmed = slug?.trim();
  if (!trimmed || !isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("slug", trimmed)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as unknown as Category;
  } catch {
    return null;
  }
}

export async function getCategoryById(id: string): Promise<Category | null> {
  const trimmed = id?.trim();
  if (!trimmed || !isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .eq("id", trimmed)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as unknown as Category;
  } catch {
    return null;
  }
}

/** All categories for admin (active + inactive). Requires admin RLS + authenticated session. */
export async function getAdminCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    if (error || !data) {
      return [];
    }

    return data as unknown as Category[];
  } catch {
    return [];
  }
}

/** Categories for admin product forms: active first, then name (TR). */
export async function getCategoriesForProductForm(): Promise<Category[]> {
  const all = await getAdminCategories();
  return [...all].sort((a, b) => {
    if (a.is_active !== b.is_active) {
      return a.is_active ? -1 : 1;
    }
    return a.name_tr.localeCompare(b.name_tr, "tr");
  });
}

/** Single category by id for admin edit (includes inactive). */
export async function getCategoryForEdit(id: string): Promise<Category | null> {
  const trimmed = id?.trim();
  if (!trimmed || !isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase.from("categories").select("*").eq("id", trimmed).maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as unknown as Category;
  } catch {
    return null;
  }
}
