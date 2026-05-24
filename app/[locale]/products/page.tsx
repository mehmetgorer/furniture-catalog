import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryFilter, mapCategoriesToFilterItems } from "@/components/public/CategoryFilter";
import { ProductCard } from "@/components/public/ProductCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { getActiveCategories } from "@/lib/db/categories";
import { isSupabaseConfigured } from "@/lib/db/env";
import {
  getPublicProductPriceLabel,
  getPublicProductStockLabel,
} from "@/lib/db/product-catalog-display";
import { normalizeProductImageUrls } from "@/lib/db/product-utils";
import { getActiveProducts } from "@/lib/db/products";
import { mockProductImages } from "@/lib/home/mock";
import { MOCK_FALLBACK_CATEGORIES, MOCK_LISTING_PRODUCTS } from "@/lib/home/products-fallback";
import { getLocalizedField, getTranslator, parseLocale } from "@/lib/i18n/helpers";
import type { Product } from "@/lib/supabase/types";

export default async function ProductsPage({
  params,
  searchParams,
}: Readonly<{
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}>) {
  const { locale: segment } = await params;
  const locale = parseLocale(segment);
  if (!locale) {
    notFound();
  }

  const sp = await searchParams;
  const rawCategory = typeof sp.category === "string" ? sp.category : undefined;
  const categorySlug = rawCategory?.trim() || null;

  const t = getTranslator(locale);
  const base = `/${locale}`;
  const productsBase = `${base}/products`;

  const configured = isSupabaseConfigured();
  const dbCategories = configured ? await getActiveCategories() : [];
  const dbProducts = configured ? await getActiveProducts(categorySlug) : [];

  const useMockListing = !configured;

  const filterItems = useMockListing
    ? MOCK_FALLBACK_CATEGORIES.map((c) => ({ slug: c.slug, label: t(c.titleKey) }))
    : mapCategoriesToFilterItems(dbCategories, locale);

  const productCards = useMockListing
    ? MOCK_LISTING_PRODUCTS.filter((p) => !categorySlug || p.categorySlug === categorySlug).map((p) => ({
        key: p.slug,
        title: t(p.titleKey),
        imageUrl: mockProductImages[p.imageIndex % mockProductImages.length],
        href: `${productsBase}/${encodeURIComponent(p.slug)}`,
      }))
    : dbProducts.map((p: Product, i: number) => {
        const row = p as unknown as Record<string, unknown>;
        const title = getLocalizedField(row, "title", locale) || p.slug;
        return {
          key: p.id,
          title,
          imageUrls: normalizeProductImageUrls(p.image_urls, i),
          href: `${productsBase}/${encodeURIComponent(p.slug)}`,
          priceLabel: getPublicProductPriceLabel(p, locale),
          stockLabel: getPublicProductStockLabel(p, locale),
        };
      });

  const showEmpty = productCards.length === 0;

  return (
    <div className="mx-auto min-w-0 max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <div className="flex flex-col gap-8 border-b border-stone-200/80 pb-12 dark:border-stone-800">
        <div>
          <p className="public-eyebrow">{t("furnitureCatalog")}</p>
          <h1 className="public-page-title">{t("products")}</h1>
        </div>
        <CategoryFilter
          productsBasePath={productsBase}
          items={filterItems}
          activeSlug={categorySlug}
          t={t}
        />
      </div>

      <div className="mt-12">
        {showEmpty ? (
          <EmptyState title={t("noProductsFound")} description={t("viewProducts")} />
        ) : (
          <div className="grid auto-rows-fr items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {productCards.map((p) => (
              <ProductCard
                key={p.key}
                title={p.title}
                imageUrls={"imageUrls" in p ? p.imageUrls : undefined}
                imageUrl={"imageUrl" in p ? p.imageUrl : undefined}
                href={p.href}
                ctaLabel={t("viewDetails")}
                priceLabel={"priceLabel" in p ? p.priceLabel : undefined}
                stockLabel={"stockLabel" in p ? p.stockLabel : undefined}
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-12 text-center">
        <Link
          href={base}
          className="text-sm font-medium text-stone-700 underline-offset-4 hover:underline dark:text-stone-300"
        >
          {t("home")}
        </Link>
      </div>
    </div>
  );
}
