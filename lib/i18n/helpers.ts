import type { Locale } from "./locales";
import { isLocale } from "./locales";
import type { TranslationKey } from "./translations";
import { translations } from "./translations";

export type TextDirection = "ltr" | "rtl";

export function getDirection(locale: Locale): TextDirection {
  return locale === "ar" ? "rtl" : "ltr";
}

/**
 * Read localized DB column `baseField_<locale>` with safe fallback to `baseField_tr`.
 * Example: baseField "title" → title_en, then title_tr.
 */
export function getLocalizedField(row: Record<string, unknown>, baseField: string, locale: Locale): string {
  const pick = (suffix: string): string | null => {
    const key = `${baseField}_${suffix}`;
    const v = row[key];
    if (v == null) return null;
    const s = String(v).trim();
    return s === "" ? null : s;
  };

  const localized = pick(locale);
  if (localized) return localized;

  const tr = pick("tr");
  if (tr) return tr;

  return "";
}

/**
 * Rewrites internal links like `/tr/products` to `/en/products` for the active locale.
 * External http(s) URLs are returned unchanged.
 */
export function localizeInternalLink(href: string | null | undefined, locale: Locale, fallback: string): string {
  if (href == null) return fallback;
  const raw = String(href).trim();
  if (raw === "") return fallback;
  if (/^https?:\/\//i.test(raw)) return raw;
  const m = raw.match(/^\/(tr|en|ar)(\/.*)?$/);
  if (m) {
    const rest = m[2] ?? "";
    return `/${locale}${rest}`;
  }
  if (raw.startsWith("/")) {
    return `/${locale}${raw}`;
  }
  return fallback;
}

export function getTranslator(locale: Locale) {
  const table = translations[locale];

  function t(key: TranslationKey): string {
    return table[key];
  }

  return t;
}

export function parseLocale(segment: string): Locale | null {
  return isLocale(segment) ? segment : null;
}
