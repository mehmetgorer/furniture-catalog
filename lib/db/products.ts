import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Category, Product } from "@/lib/supabase/types";

import { getAdminCategories, getCategoryBySlug } from "./categories";
import { isSupabaseConfigured } from "./env";

/** Nested category label for admin product list (joined in app layer). */
export type AdminProductCategoryEmbed = {
  name_tr: string;
  is_active: boolean;
  slug: string;
} | null;

export type AdminProductListItem = Product & {
  categories: AdminProductCategoryEmbed;
};

const DEFAULT_FEATURED_LIMIT = 6;
const DEFAULT_RECENT_LIMIT = 3;

export async function getFeaturedProducts(limit: number = DEFAULT_FEATURED_LIMIT): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error || !data) {
      return [];
    }

    return data as unknown as Product[];
  } catch {
    return [];
  }
}

/** Active products that are not featured, newest first (homepage “new” row). */
export async function getRecentNonFeaturedProducts(limit: number = DEFAULT_RECENT_LIMIT): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("is_featured", false)
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error || !data) {
      return [];
    }

    return data as unknown as Product[];
  } catch {
    return [];
  }
}

/**
 * Active products, optionally filtered by active category slug (`?category=`).
 * Unknown/inactive category slug → no category filter (all active products).
 */
export async function getActiveProducts(categorySlug?: string | null): Promise<Product[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    let query = supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true });

    const slug = categorySlug?.trim();
    if (slug) {
      const category = await getCategoryBySlug(slug);
      if (category) {
        query = query.eq("category_id", category.id);
      }
    }

    const { data, error } = await query;

    if (error || !data) {
      return [];
    }

    return data as unknown as Product[];
  } catch {
    return [];
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const trimmed = slug?.trim();
  if (!trimmed || !isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", trimmed)
      .eq("is_active", true)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return data as unknown as Product;
  } catch {
    return null;
  }
}

function attachCategoryLabels(products: Product[], categories: Category[]): AdminProductListItem[] {
  const byId = new Map(categories.map((c) => [c.id, c]));
  return products.map((p) => {
    const cat = p.category_id ? byId.get(p.category_id) : undefined;
    const embed: AdminProductCategoryEmbed = cat
      ? { name_tr: cat.name_tr, is_active: cat.is_active, slug: cat.slug }
      : null;
    return { ...p, categories: embed };
  });
}

/** All products for admin (active + inactive), with category labels. */
export async function getAdminProducts(): Promise<AdminProductListItem[]> {
  if (!isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    const [productsRes, categories] = await Promise.all([
      supabase
        .from("products")
        .select("*")
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: true }),
      getAdminCategories(),
    ]);

    if (productsRes.error || !productsRes.data) {
      return [];
    }

    return attachCategoryLabels(productsRes.data as unknown as Product[], categories);
  } catch {
    return [];
  }
}

/** Single product for admin edit (includes inactive). */
export async function getProductForEdit(id: string): Promise<AdminProductListItem | null> {
  const trimmed = id?.trim();
  if (!trimmed || !isSupabaseConfigured()) {
    return null;
  }

  try {
    const supabase = await createSupabaseServerClient();
    const [productRes, categories] = await Promise.all([
      supabase.from("products").select("*").eq("id", trimmed).maybeSingle(),
      getAdminCategories(),
    ]);

    if (productRes.error || !productRes.data) {
      return null;
    }

    const product = productRes.data as unknown as Product;
    const [row] = attachCategoryLabels([product], categories);
    return row ?? null;
  } catch {
    return null;
  }
}

export async function getRelatedProducts(
  productId: string,
  categoryId: string | null,
  limit: number = 3,
): Promise<Product[]> {
  if (!categoryId?.trim() || !isSupabaseConfigured()) {
    return [];
  }

  try {
    const supabase = await createSupabaseServerClient();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("is_active", true)
      .eq("category_id", categoryId)
      .neq("id", productId)
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: true })
      .limit(limit);

    if (error || !data) {
      return [];
    }

    return data as unknown as Product[];
  } catch {
    return [];
  }
}
