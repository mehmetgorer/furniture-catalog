import type { TranslationKey } from "@/lib/i18n/translations";

/** Stable slugs aligned with `supabase/seed.sql` for listing fallback when Supabase is off or empty. */
export const MOCK_FALLBACK_CATEGORIES: { slug: string; titleKey: TranslationKey }[] = [
  { slug: "koltuk-takimlari", titleKey: "mockCatKoltuk" },
  { slug: "yatak-odasi", titleKey: "mockCatYatak" },
  { slug: "yemek-odasi", titleKey: "mockCatYemek" },
  { slug: "tv-uniteleri", titleKey: "mockCatTv" },
];

export const MOCK_LISTING_PRODUCTS: {
  slug: string;
  titleKey: TranslationKey;
  imageIndex: number;
  categorySlug: string;
}[] = [
  { slug: "modern-koltuk-takimi", titleKey: "mockProdModernSofa", imageIndex: 0, categorySlug: "koltuk-takimlari" },
  { slug: "minimal-tv-unitesi", titleKey: "mockProdMinimalTv", imageIndex: 1, categorySlug: "tv-uniteleri" },
  { slug: "ahsap-yemek-masasi", titleKey: "mockProdWoodDining", imageIndex: 2, categorySlug: "yemek-odasi" },
  { slug: "konfor-yatak-odasi", titleKey: "mockProdComfortBedroom", imageIndex: 3, categorySlug: "yatak-odasi" },
  { slug: "berjer-koltuk", titleKey: "mockProdMinimalTv", imageIndex: 1, categorySlug: "koltuk-takimlari" },
  { slug: "orta-sehpa", titleKey: "mockProdWoodDining", imageIndex: 2, categorySlug: "yemek-odasi" },
];
