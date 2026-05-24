import Link from "next/link";

import { getLocalizedField } from "@/lib/i18n/helpers";
import type { Locale } from "@/lib/i18n/locales";
import type { TranslationKey } from "@/lib/i18n/translations";
import type { Category } from "@/lib/supabase/types";

type FilterItem = { slug: string; label: string };

type Props = {
  productsBasePath: string;
  items: FilterItem[];
  activeSlug: string | null;
  t: (key: TranslationKey) => string;
};

function pill(active: boolean) {
  return [
    "inline-flex min-h-[44px] shrink-0 items-center justify-center rounded-full px-4 py-2 text-sm font-medium tracking-wide transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/50 focus-visible:ring-offset-2",
    active
      ? "bg-stone-900 text-white shadow-sm dark:bg-stone-100 dark:text-stone-900"
      : "bg-white text-stone-700 ring-1 ring-stone-200/90 hover:bg-stone-50 dark:bg-stone-900 dark:text-stone-200 dark:ring-stone-700 dark:hover:bg-stone-800",
  ].join(" ");
}

export function CategoryFilter({ productsBasePath, items, activeSlug, t }: Props) {
  return (
    <div className="space-y-4">
      <p className="public-eyebrow">{t("filterByCategory")}</p>
      <div className="-mx-1 overflow-x-auto overscroll-x-contain px-1 pb-1 [-webkit-overflow-scrolling:touch]">
        <div className="flex min-w-min flex-wrap gap-2">
          <Link href={productsBasePath} className={pill(!activeSlug)}>
            {t("allProducts")}
          </Link>
          {items.map((item) => {
            const href = `${productsBasePath}?category=${encodeURIComponent(item.slug)}`;
            const active = activeSlug === item.slug;
            return (
              <Link key={item.slug} href={href} className={pill(active)}>
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function mapCategoriesToFilterItems(categories: Category[], locale: Locale): FilterItem[] {
  return categories.map((cat) => {
    const row = cat as unknown as Record<string, unknown>;
    const label = getLocalizedField(row, "name", locale) || cat.slug;
    return { slug: cat.slug, label };
  });
}
