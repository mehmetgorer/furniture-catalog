import Link from "next/link";
import { notFound } from "next/navigation";

import { ContactCTA } from "@/components/public/ContactCTA";
import { ProductCard } from "@/components/public/ProductCard";
import { ProductGallery } from "@/components/public/ProductGallery";
import { getCategoryById } from "@/lib/db/categories";
import { isSupabaseConfigured } from "@/lib/db/env";
import {
  getProductDetailPriceText,
  getPublicProductPriceLabel,
  getPublicProductStockLabel,
} from "@/lib/db/product-catalog-display";
import { normalizeProductImageUrls } from "@/lib/db/product-utils";
import { getProductBySlug, getRelatedProducts } from "@/lib/db/products";
import { getSiteSettings } from "@/lib/db/site-settings";
import { getLocalizedField, getTranslator, parseLocale } from "@/lib/i18n/helpers";
import type { Product } from "@/lib/supabase/types";
import { getWhatsAppChatUrl } from "@/lib/utils/whatsapp";

type PageProps = Readonly<{
  params: Promise<{ locale: string; slug: string }>;
}>;

export default async function ProductDetailPage({ params }: PageProps) {
  const { locale: segment, slug: slugParam } = await params;
  const locale = parseLocale(segment);
  if (!locale) {
    notFound();
  }

  const slug = decodeURIComponent(slugParam || "").trim();
  if (!slug) {
    notFound();
  }

  const t = getTranslator(locale);
  const base = `/${locale}`;
  const productsHref = `${base}/products`;
  const contactHref = `${base}/contact`;

  if (!isSupabaseConfigured()) {
    notFound();
  }

  const product = await getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const [category, related, siteSettings] = await Promise.all([
    product.category_id ? getCategoryById(product.category_id) : Promise.resolve(null),
    getRelatedProducts(product.id, product.category_id, 3),
    getSiteSettings(),
  ]);

  const pRow = product as unknown as Record<string, unknown>;
  const title = getLocalizedField(pRow, "title", locale) || product.slug;
  const description = getLocalizedField(pRow, "description", locale);
  const categoryLabel = category
    ? getLocalizedField(category as unknown as Record<string, unknown>, "name", locale) || category.slug
    : "";

  const images =
    Array.isArray(product.image_urls) && product.image_urls.length > 0
      ? product.image_urls.filter((u) => u && String(u).trim() !== "")
      : [];

  const contactLine = [siteSettings?.phone, siteSettings?.email].filter((x) => x && String(x).trim() !== "").join(" · ");
  const ctaDescription = contactLine || `${title} — ${t("fastCommunication")}`;

  const whatsappRaw = siteSettings?.whatsapp?.trim();
  const whatsappHref = getWhatsAppChatUrl(whatsappRaw);

  const priceDisplay = getProductDetailPriceText(product, locale, t("contactForPrice"));
  const stockLabel = getPublicProductStockLabel(product, locale);

  return (
    <div className="mx-auto min-w-0 max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-14">
      <Link
        href={productsHref}
        className="inline-flex items-center gap-1.5 text-sm font-medium tracking-wide text-stone-600 underline-offset-4 transition hover:text-stone-900 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/50 focus-visible:ring-offset-2 dark:text-stone-400 dark:hover:text-stone-100"
      >
        <span className="inline-block rtl:rotate-180" aria-hidden>
          ←
        </span>
        {t("backToProducts")}
      </Link>

      <div className="mt-10 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <ProductGallery images={images} altLabel={title} />
        <div className="flex min-w-0 flex-col">
          <p className="public-eyebrow">{t("productDetails")}</p>
          <h1 className="mt-3 max-w-prose text-pretty font-serif text-3xl font-medium leading-tight tracking-tight text-stone-900 [overflow-wrap:anywhere] dark:text-stone-50 sm:text-4xl">
            {title}
          </h1>
          {categoryLabel ? (
            <p className="mt-3 text-sm text-stone-600 dark:text-stone-400">
              <span className="font-medium text-stone-800 dark:text-stone-200">{t("category")}: </span>
              {categoryLabel}
            </p>
          ) : null}
          {product.product_code?.trim() ? (
            <p className="mt-2 text-sm text-stone-600 dark:text-stone-400">
              <span className="font-medium text-stone-800 dark:text-stone-200">{t("productCode")}: </span>
              {product.product_code}
            </p>
          ) : null}
          <div className="mt-8 space-y-2 border-b border-stone-200/80 pb-8 dark:border-stone-800">
            {priceDisplay.kind === "price" ? (
              <p className="font-serif text-2xl font-medium tracking-tight text-stone-900 dark:text-stone-50">
                {priceDisplay.text}
              </p>
            ) : (
              <p className="text-sm font-medium tracking-wide text-stone-600 dark:text-stone-400">{priceDisplay.text}</p>
            )}
            {stockLabel ? (
              <p className="text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400">
                {stockLabel}
              </p>
            ) : null}
          </div>
          {description ? (
            <p className="mt-8 text-pretty text-base leading-relaxed text-stone-700 dark:text-stone-300">
              {description}
            </p>
          ) : null}

          <div className="mt-8 flex flex-wrap gap-3">
            {whatsappHref ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] min-w-[10rem] items-center justify-center rounded-full bg-stone-900 px-6 py-2.5 text-sm font-semibold tracking-wide text-white shadow-sm transition hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 focus-visible:ring-offset-2 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
              >
                {t("whatsapp")}
              </a>
            ) : null}
            <Link
              href={contactHref}
              className="inline-flex min-h-[44px] min-w-[10rem] items-center justify-center rounded-full border border-stone-300/90 bg-white/80 px-6 py-2.5 text-sm font-semibold tracking-wide text-stone-900 transition hover:bg-stone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/50 focus-visible:ring-offset-2 dark:border-stone-600 dark:bg-stone-900/40 dark:text-stone-100 dark:hover:bg-stone-900"
            >
              {t("contact")}
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16">
        <ContactCTA
          title={t("contactForProduct")}
          description={ctaDescription}
          primaryLabel={t("contactUs")}
          primaryHref={contactHref}
          secondaryLabel={t("viewProducts")}
          secondaryHref={productsHref}
        />
      </div>

      {related.length > 0 ? (
        <section className="mt-24 border-t border-stone-200/80 pt-16 dark:border-stone-800">
          <h2 className="font-serif text-2xl font-medium tracking-tight text-stone-900 dark:text-stone-50 sm:text-3xl">
            {t("relatedProducts")}
          </h2>
          <div className="mt-10 grid auto-rows-fr items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((rp: Product, i: number) => {
              const row = rp as unknown as Record<string, unknown>;
              const pt = getLocalizedField(row, "title", locale) || rp.slug;
              return (
                <ProductCard
                  key={rp.id}
                  title={pt}
                  imageUrls={normalizeProductImageUrls(rp.image_urls, i)}
                  href={`${productsHref}/${encodeURIComponent(rp.slug)}`}
                  ctaLabel={t("viewDetails")}
                  priceLabel={getPublicProductPriceLabel(rp, locale)}
                  stockLabel={getPublicProductStockLabel(rp, locale)}
                />
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
