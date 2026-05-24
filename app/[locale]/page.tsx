import Link from "next/link";
import { notFound } from "next/navigation";

import { BenefitCard } from "@/components/public/BenefitCard";
import { CategoryCard } from "@/components/public/CategoryCard";
import { ContactCTA } from "@/components/public/ContactCTA";
import { HeroSlider, type HeroSlide } from "@/components/public/HeroSlider";
import { ProductCard } from "@/components/public/ProductCard";
import { getActiveCategories } from "@/lib/db/categories";
import { getActiveHeroSlides } from "@/lib/db/hero-slides";
import { getFeaturedProducts, getRecentNonFeaturedProducts } from "@/lib/db/products";
import { getSiteSettings } from "@/lib/db/site-settings";
import {
  getPublicProductPriceLabel,
  getPublicProductStockLabel,
} from "@/lib/db/product-catalog-display";
import { normalizeProductImageUrls } from "@/lib/db/product-utils";
import { mockCategoryImages, mockHeroImages, mockProductImages } from "@/lib/home/mock";
import { MOCK_FALLBACK_CATEGORIES, MOCK_LISTING_PRODUCTS } from "@/lib/home/products-fallback";
import { getLocalizedField, getTranslator, localizeInternalLink, parseLocale } from "@/lib/i18n/helpers";
import type { Locale } from "@/lib/i18n/locales";
import type { TranslationKey } from "@/lib/i18n/translations";
import type { Category, HeroSlide as DbHeroSlide, Product } from "@/lib/supabase/types";

function buildMockHeroSlides(
  t: ReturnType<typeof getTranslator>,
  base: string,
  productsHref: string,
): HeroSlide[] {
  return [
    {
      imageUrl: mockHeroImages[0],
      title: t("mockHeroSlide1Title"),
      subtitle: t("mockHeroSlide1Tagline"),
      ctaLabel: t("exploreCollection"),
      ctaHref: productsHref,
    },
    {
      imageUrl: mockHeroImages[1],
      title: t("mockHeroSlide2Title"),
      subtitle: t("mockHeroSlide2Tagline"),
      ctaLabel: t("viewProducts"),
      ctaHref: productsHref,
    },
    {
      imageUrl: mockHeroImages[2],
      title: t("mockHeroSlide3Title"),
      subtitle: t("mockHeroSlide3Tagline"),
      ctaLabel: t("getInTouch"),
      ctaHref: `${base}/contact`,
    },
  ];
}

function mapDbHeroToUi(
  rows: DbHeroSlide[],
  locale: Locale,
  t: ReturnType<typeof getTranslator>,
  productsHref: string,
): HeroSlide[] {
  return rows.map((row) => {
    const r = row as unknown as Record<string, unknown>;
    const title = getLocalizedField(r, "title", locale);
    const subtitle = getLocalizedField(r, "description", locale);
    const ctaFromDb = getLocalizedField(r, "button_text", locale);
    return {
      imageUrl: row.image_url,
      title: title || t("furnitureCatalog"),
      subtitle: subtitle || t("qualityProduction"),
      ctaLabel: ctaFromDb || t("viewProducts"),
      ctaHref: localizeInternalLink(row.link_url, locale, productsHref),
    };
  });
}

const MOCK_CATEGORY_KEYS: TranslationKey[] = ["mockCatKoltuk", "mockCatYatak", "mockCatYemek", "mockCatTv"];

export default async function HomePage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale: segment } = await params;
  const locale = parseLocale(segment);
  if (!locale) {
    notFound();
  }

  const t = getTranslator(locale);
  const base = `/${locale}`;
  const productsHref = `${base}/products`;
  const contactHref = `${base}/contact`;

  const [dbCategories, dbFeatured, dbRecent, dbHero, siteSettings] = await Promise.all([
    getActiveCategories(),
    getFeaturedProducts(8),
    getRecentNonFeaturedProducts(3),
    getActiveHeroSlides(),
    getSiteSettings(),
  ]);

  const heroSlides: HeroSlide[] =
    dbHero.length > 0 ? mapDbHeroToUi(dbHero, locale, t, productsHref) : buildMockHeroSlides(t, base, productsHref);

  const categoryCards: { key: string; title: string; description: string; imageUrl: string; href: string }[] =
    dbCategories.length > 0
      ? dbCategories.map((cat: Category, i: number) => {
          const row = cat as unknown as Record<string, unknown>;
          const title = getLocalizedField(row, "name", locale) || cat.slug;
          const description =
            getLocalizedField(row, "description", locale) || t("mockCategoryBlurb");
          const imageUrl = cat.image_url?.trim() || mockCategoryImages[i % mockCategoryImages.length];
          return {
            key: cat.id,
            title,
            description,
            imageUrl,
            href: `${productsHref}?category=${encodeURIComponent(cat.slug)}`,
          };
        })
      : MOCK_CATEGORY_KEYS.map((titleKey, i) => ({
          key: titleKey,
          title: t(titleKey),
          description: t("mockCategoryBlurb"),
          imageUrl: mockCategoryImages[i % mockCategoryImages.length],
          href: `${productsHref}?category=${encodeURIComponent(MOCK_FALLBACK_CATEGORIES[i]?.slug ?? "")}`,
        }));

  const toProductCard = (p: Product, i: number) => {
    const row = p as unknown as Record<string, unknown>;
    const title = getLocalizedField(row, "title", locale) || p.slug;
    return {
      key: p.id,
      title,
      imageUrls: normalizeProductImageUrls(p.image_urls, i),
      href: `${productsHref}/${encodeURIComponent(p.slug)}`,
      priceLabel: getPublicProductPriceLabel(p, locale),
      stockLabel: getPublicProductStockLabel(p, locale),
    };
  };

  const featuredCards =
    dbFeatured.length > 0
      ? dbFeatured.map((p, i) => toProductCard(p, i))
      : MOCK_LISTING_PRODUCTS.slice(0, 3).map((m) => ({
          key: m.slug,
          title: t(m.titleKey),
          imageUrl: mockProductImages[m.imageIndex % mockProductImages.length],
          href: `${productsHref}/${encodeURIComponent(m.slug)}`,
        }));

  const newestCards =
    dbRecent.length > 0
      ? dbRecent.map((p, i) => toProductCard(p, i + 1))
      : MOCK_LISTING_PRODUCTS.slice(1, 4).map((m) => ({
          key: `${m.slug}-new`,
          title: t(m.titleKey),
          imageUrl: mockProductImages[m.imageIndex % mockProductImages.length],
          href: `${productsHref}/${encodeURIComponent(m.slug)}`,
        }));

  const benefitDefs: { titleKey: TranslationKey; descKey: TranslationKey }[] = [
    { titleKey: "qualityProduction", descKey: "benefitDescQuality" },
    { titleKey: "customDesign", descKey: "benefitDescCustom" },
    { titleKey: "fastCommunication", descKey: "benefitDescFast" },
    { titleKey: "projectSupport", descKey: "benefitDescProject" },
  ];

  const settingsRow = siteSettings ? (siteSettings as unknown as Record<string, unknown>) : null;
  const aboutBody = settingsRow
    ? getLocalizedField(settingsRow, "about", locale) || t("aboutPreviewBody")
    : t("aboutPreviewBody");

  const contactDescription = (() => {
    if (!siteSettings) return t("fastCommunication");
    const parts = [siteSettings.phone, siteSettings.email].filter((x) => x && String(x).trim() !== "");
    if (parts.length === 0) return t("fastCommunication");
    return parts.join(" · ");
  })();

  return (
    <div className="pb-24">
      <div className="mx-auto min-w-0 max-w-7xl px-4 pt-8 sm:px-6 sm:pt-10 lg:px-8 lg:pt-12">
        <HeroSlider slides={heroSlides} />
      </div>

      <div className="mx-auto min-w-0 max-w-7xl space-y-24 px-4 py-20 sm:px-6 lg:px-8 lg:space-y-28 lg:py-24">
        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="public-eyebrow">{t("discoverCategories")}</p>
              <h2 className="public-section-title">{t("ourCategories")}</h2>
            </div>
            <Link
              href={productsHref}
              className="text-sm font-medium text-stone-700 underline-offset-4 transition hover:text-stone-950 hover:underline dark:text-stone-300 dark:hover:text-white"
            >
              {t("viewProducts")}
            </Link>
          </div>
          <div className="mt-12 grid auto-rows-fr items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {categoryCards.map((c) => (
              <CategoryCard
                key={c.key}
                title={c.title}
                description={c.description}
                imageUrl={c.imageUrl}
                href={c.href}
              />
            ))}
          </div>
        </section>

        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="public-eyebrow">{t("featuredProducts")}</p>
              <h2 className="public-section-title">{t("exploreCollection")}</h2>
            </div>
          </div>
          <div className="mt-12 grid auto-rows-fr items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {featuredCards.map((p) => (
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
        </section>

        <section>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="public-eyebrow">{t("newProducts")}</p>
              <h2 className="public-section-title">{t("furnitureCatalog")}</h2>
            </div>
          </div>
          <div className="mt-12 grid auto-rows-fr items-stretch gap-7 sm:grid-cols-2 lg:grid-cols-3">
            {newestCards.map((p) => (
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
        </section>

        <section>
          <h2 className="sr-only">{t("furnitureCatalog")}</h2>
          <div className="grid auto-rows-fr items-stretch gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefitDefs.map((b, i) => (
              <BenefitCard key={b.titleKey} title={t(b.titleKey)} description={t(b.descKey)} index={i} />
            ))}
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-stone-200/70 bg-white/95 p-8 shadow-[0_1px_2px_rgba(28,25,23,0.05)] dark:border-stone-800 dark:bg-stone-900/60 sm:p-10 lg:p-14">
          <p className="public-eyebrow">{t("aboutUs")}</p>
          <h2 className="mt-3 font-serif text-2xl font-medium tracking-tight text-stone-900 dark:text-stone-50 sm:text-3xl">
            {t("aboutPreviewLead")}
          </h2>
          <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-stone-600 dark:text-stone-400">
            {aboutBody}
          </p>
          <Link
            href={`${base}/about`}
            className="mt-8 inline-flex text-sm font-semibold text-stone-900 underline-offset-4 transition hover:underline dark:text-stone-100"
          >
            {t("aboutUs")}
          </Link>
        </section>

        <ContactCTA
          title={t("getInTouch")}
          description={contactDescription}
          primaryLabel={t("contactUs")}
          primaryHref={contactHref}
          secondaryLabel={t("viewProducts")}
          secondaryHref={productsHref}
        />
      </div>
    </div>
  );
}
