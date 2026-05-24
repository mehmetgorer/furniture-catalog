import { MOCK_FALLBACK_CATEGORIES } from "@/lib/home/products-fallback";
import { getLocalizedField } from "@/lib/i18n/helpers";
import type { Locale } from "@/lib/i18n/locales";
import type { TranslationKey } from "@/lib/i18n/translations";
import type { Category, SiteSettings } from "@/lib/supabase/types";
import { getSafeImageSrc } from "@/lib/utils/image-url";

export type FooterCategoryLink = {
  href: string;
  label: string;
};

export function resolveBrandName(
  siteSettings: SiteSettings | null,
  fallbackLabel: string,
): string {
  const text = siteSettings?.logo_text?.trim();
  return text && text.length > 0 ? text : fallbackLabel;
}

export function resolveLogoUrl(siteSettings: SiteSettings | null): string | null {
  return getSafeImageSrc(siteSettings?.logo_url);
}

export function buildFooterCategoryLinks(
  locale: Locale,
  categories: Category[],
  productsBase: string,
  t: (key: TranslationKey) => string,
): FooterCategoryLink[] {
  if (categories.length > 0) {
    return categories.map((c) => {
      const row = c as unknown as Record<string, unknown>;
      return {
        href: `${productsBase}?category=${encodeURIComponent(c.slug)}`,
        label: getLocalizedField(row, "name", locale) || c.slug,
      };
    });
  }

  return MOCK_FALLBACK_CATEGORIES.map((c) => ({
    href: `${productsBase}?category=${encodeURIComponent(c.slug)}`,
    label: t(c.titleKey),
  }));
}
