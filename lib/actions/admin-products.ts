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
  CURRENCY_ERROR,
  MISSING_PRODUCT_ID,
  PRICE_NONNEG_ERROR,
  PRODUCT_NOT_FOUND,
  SLUG_IN_USE,
  SLUG_PRODUCT_ERROR,
  STOCK_STATUS_ERROR,
  TURKISH_TITLE_REQUIRED,
} from "@/lib/admin/admin-copy";
import { requireAdminForServerAction } from "@/lib/db/admin";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isSupportedCurrency, normalizeCurrencyCode } from "@/lib/utils/price";
import { isStockStatus, normalizeStockStatus } from "@/lib/utils/stock";
import { parseAllowedImageUrlList } from "@/lib/utils/image-url";
import { isValidKebabSlug, resolveProductSlug } from "@/lib/utils/slug";

export type ProductFormState = { error?: string };

function emptyToNull(s: unknown): string | null {
  if (s == null) return null;
  const t = String(s).trim();
  return t === "" ? null : t;
}

function parseImageUrls(formData: FormData): { ok: true; value: string[] } | { ok: false; error: string } {
  const raw = formData
    .getAll("image_urls")
    .map((v) => String(v).trim())
    .filter((s) => s.length > 0);
  return parseAllowedImageUrlList(raw);
}

const LOCALES = ["tr", "en", "ar"] as const;

type CatalogFields =
  | {
      ok: true;
      price_amount: number | null;
      price_currency: string;
      show_price: boolean;
      stock_status: string;
      show_stock: boolean;
    }
  | { ok: false; error: string };

function parseProductCatalogFields(formData: FormData): CatalogFields {
  const rawPrice = String(formData.get("price_amount") ?? "").trim();
  let price_amount: number | null = null;
  if (rawPrice !== "") {
    const n = Number.parseFloat(rawPrice);
    if (!Number.isFinite(n) || n < 0) {
      return { ok: false, error: PRICE_NONNEG_ERROR };
    }
    price_amount = n;
  }

  const currencyRaw = String(formData.get("price_currency") ?? "TRY").trim().toUpperCase();
  if (!isSupportedCurrency(currencyRaw)) {
    return { ok: false, error: CURRENCY_ERROR };
  }

  const stockRaw = String(formData.get("stock_status") ?? "in_stock").trim();
  if (!isStockStatus(stockRaw)) {
    return { ok: false, error: STOCK_STATUS_ERROR };
  }

  return {
    ok: true,
    price_amount,
    price_currency: normalizeCurrencyCode(currencyRaw),
    show_price: formData.get("show_price") === "true",
    stock_status: normalizeStockStatus(stockRaw),
    show_stock: formData.get("show_stock") === "true",
  };
}

function revalidatePublicProductPages(slugs: string[]) {
  const unique = [...new Set(slugs.map((s) => s.trim()).filter(Boolean))];
  for (const locale of LOCALES) {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/products`);
    for (const slug of unique) {
      revalidatePath(`/${locale}/products/${slug}`);
    }
  }
}

export async function createProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const gate = await requireAdminForServerAction();
  if (!gate.ok) return { error: gate.error };

  const title_tr = String(formData.get("title_tr") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const product_code = emptyToNull(formData.get("product_code"));
  const categoryRaw = String(formData.get("category_id") ?? "").trim();
  const category_id = categoryRaw === "" ? null : categoryRaw;
  const sort_order = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10);
  const sortOrder = Number.isFinite(sort_order) ? sort_order : 0;
  const is_active = formData.get("is_active") === "true";
  const is_featured = formData.get("is_featured") === "true";
  const imageParsed = parseImageUrls(formData);
  if (!imageParsed.ok) return { error: imageParsed.error };
  const image_urls = imageParsed.value;

  if (!title_tr) {
    return { error: TURKISH_TITLE_REQUIRED };
  }

  const slug = resolveProductSlug(title_tr, slugRaw);
  if (!slug || !isValidKebabSlug(slug)) {
    return {
      error: SLUG_PRODUCT_ERROR,
    };
  }

  const catalog = parseProductCatalogFields(formData);
  if (!catalog.ok) {
    return { error: catalog.error };
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("products").insert({
    slug,
    product_code,
    category_id,
    image_urls,
    is_active,
    is_featured,
    sort_order: sortOrder,
    price_amount: catalog.price_amount,
    price_currency: catalog.price_currency,
    show_price: catalog.show_price,
    stock_status: catalog.stock_status,
    show_stock: catalog.show_stock,
    title_tr,
    title_en: emptyToNull(formData.get("title_en")),
    title_ar: emptyToNull(formData.get("title_ar")),
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

  revalidatePublicProductPages([slug]);
  redirect("/admin/products");
}

export async function updateProduct(_prev: ProductFormState, formData: FormData): Promise<ProductFormState> {
  const gate = await requireAdminForServerAction();
  if (!gate.ok) return { error: gate.error };

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    return { error: MISSING_PRODUCT_ID };
  }

  const title_tr = String(formData.get("title_tr") ?? "").trim();
  const slugRaw = String(formData.get("slug") ?? "").trim();
  const product_code = emptyToNull(formData.get("product_code"));
  const categoryRaw = String(formData.get("category_id") ?? "").trim();
  const category_id = categoryRaw === "" ? null : categoryRaw;
  const sort_order = Number.parseInt(String(formData.get("sort_order") ?? "0"), 10);
  const sortOrder = Number.isFinite(sort_order) ? sort_order : 0;
  const is_active = formData.get("is_active") === "true";
  const is_featured = formData.get("is_featured") === "true";
  const imageParsed = parseImageUrls(formData);
  if (!imageParsed.ok) return { error: imageParsed.error };
  const image_urls = imageParsed.value;

  if (!title_tr) {
    return { error: TURKISH_TITLE_REQUIRED };
  }

  const slug = resolveProductSlug(title_tr, slugRaw);
  if (!slug || !isValidKebabSlug(slug)) {
    return {
      error: SLUG_PRODUCT_ERROR,
    };
  }

  const supabase = await createSupabaseServerClient();
  const { data: existing, error: fetchErr } = await supabase.from("products").select("slug").eq("id", id).maybeSingle();

  if (fetchErr || !existing) {
    return { error: PRODUCT_NOT_FOUND };
  }

  const prevSlug = String((existing as { slug: string }).slug ?? "").trim();

  const catalog = parseProductCatalogFields(formData);
  if (!catalog.ok) {
    return { error: catalog.error };
  }

  const { error } = await supabase
    .from("products")
    .update({
      slug,
      product_code,
      category_id,
      image_urls,
      is_active,
      is_featured,
      sort_order: sortOrder,
      price_amount: catalog.price_amount,
      price_currency: catalog.price_currency,
      show_price: catalog.show_price,
      stock_status: catalog.stock_status,
      show_stock: catalog.show_stock,
      title_tr,
      title_en: emptyToNull(formData.get("title_en")),
      title_ar: emptyToNull(formData.get("title_ar")),
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

  revalidatePublicProductPages(prevSlug === slug ? [slug] : [prevSlug, slug]);
  redirect("/admin/products");
}

async function getProductSlugById(id: string): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const { data: row } = await supabase.from("products").select("slug").eq("id", id).maybeSingle();
  return row ? String((row as { slug: string }).slug ?? "").trim() : "";
}

function revalidateProductPaths(slug: string) {
  if (slug) {
    revalidatePublicProductPages([slug]);
  } else {
    revalidatePublicProductPages([]);
  }
}

export async function deactivateProduct(formData: FormData): Promise<void> {
  const listPath = "/admin/products" as const;
  const gate = await requireAdminForServerAction();
  if (!gate.ok) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    finishLifecycleRedirect(listPath, null, "deactivateError", MISSING_PRODUCT_ID);
  }

  const slug = await getProductSlugById(id);
  const result = await deactivateActiveRow("products", id);
  if (!result.ok) {
    finishLifecycleRedirect(listPath, null, "deactivateError", result.error);
  }

  revalidateProductPaths(slug);
  revalidateAdminListPath(listPath);
  revalidatePath(`/admin/products/${id}/edit`);
  finishLifecycleRedirect(listPath, "deactivated", "deactivateError", null);
}

export async function activateProduct(formData: FormData): Promise<void> {
  const listPath = "/admin/products" as const;
  const gate = await requireAdminForServerAction();
  if (!gate.ok) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    finishLifecycleRedirect(listPath, null, "activateError", MISSING_PRODUCT_ID);
  }

  const slug = await getProductSlugById(id);
  const result = await activateInactiveRow("products", id);
  if (!result.ok) {
    finishLifecycleRedirect(listPath, null, "activateError", result.error);
  }

  revalidateProductPaths(slug);
  revalidateAdminListPath(listPath);
  revalidatePath(`/admin/products/${id}/edit`);
  finishLifecycleRedirect(listPath, "activated", "activateError", null);
}

/** Permanent delete removes the database row only; Storage objects are not removed. */
export async function deleteProductPermanently(formData: FormData): Promise<void> {
  const listPath = "/admin/products" as const;
  const gate = await requireAdminForServerAction();
  if (!gate.ok) {
    redirect("/admin/login");
  }

  const id = String(formData.get("id") ?? "").trim();
  if (!id) {
    finishLifecycleRedirect(listPath, null, "deleteError", MISSING_PRODUCT_ID);
  }

  const slug = await getProductSlugById(id);
  const result = await deleteInactiveRow("products", id);
  if (!result.ok) {
    finishLifecycleRedirect(listPath, null, "deleteError", result.error);
  }

  revalidateProductPaths(slug);
  revalidateAdminListPath(listPath);
  finishLifecycleRedirect(listPath, "deleted", "deleteError", null);
}
