"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense } from "react";

import type { Locale } from "@/lib/i18n/locales";
import { locales } from "@/lib/i18n/locales";

const localeLabels: Record<Locale, string> = {
  tr: "TR",
  en: "EN",
  ar: "AR",
};

function hrefForLocale(pathname: string, searchSuffix: string, nextLocale: Locale): string {
  const segments = pathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return `/${nextLocale}${searchSuffix}`;
  }
  segments[0] = nextLocale;
  const path = `/${segments.join("/")}`;
  return searchSuffix ? `${path}${searchSuffix}` : path;
}

export function LanguageSwitcher({
  currentLocale,
  ariaLabel,
}: {
  currentLocale: Locale;
  ariaLabel: string;
}) {
  return (
    <Suspense fallback={<div className="h-11 min-w-[5.5rem] rounded-full border border-stone-200 bg-stone-50/90 dark:border-stone-700 dark:bg-stone-900/90" aria-hidden />}>
      <LanguageSwitcherInner currentLocale={currentLocale} ariaLabel={ariaLabel} />
    </Suspense>
  );
}

function LanguageSwitcherInner({
  currentLocale,
  ariaLabel,
}: {
  currentLocale: Locale;
  ariaLabel: string;
}) {
  const pathname = usePathname() || `/${currentLocale}`;
  const searchParams = useSearchParams();
  const searchSuffix = searchParams?.toString() ? `?${searchParams.toString()}` : "";

  return (
    <div
      className="inline-flex min-h-[44px] items-center gap-0.5 rounded-full border border-stone-200 bg-stone-50/90 p-1 text-xs font-medium shadow-sm dark:border-stone-700 dark:bg-stone-900/90 sm:text-sm"
      role="navigation"
      aria-label={ariaLabel}
    >
      {locales.map((locale) => {
        const active = locale === currentLocale;
        return (
          <Link
            key={locale}
            href={hrefForLocale(pathname, searchSuffix, locale)}
            className={
              active
                ? "inline-flex min-h-[40px] min-w-[2.75rem] items-center justify-center rounded-full bg-white px-3 py-2 text-stone-900 shadow-sm dark:bg-stone-800 dark:text-stone-50"
                : "inline-flex min-h-[40px] min-w-[2.75rem] items-center justify-center rounded-full px-3 py-2 text-stone-500 transition hover:text-stone-900 dark:text-stone-400 dark:hover:text-stone-100"
            }
            hrefLang={locale}
            aria-current={active ? "true" : undefined}
          >
            {localeLabels[locale]}
          </Link>
        );
      })}
    </div>
  );
}
