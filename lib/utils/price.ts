import type { Locale } from "@/lib/i18n/locales";

export type ProductCurrency = "TRY" | "USD" | "EUR";

const SUPPORTED_CURRENCIES: ProductCurrency[] = ["TRY", "USD", "EUR"];

function normalizeCurrency(currency: string | null | undefined): ProductCurrency {
  const upper = String(currency ?? "TRY")
    .trim()
    .toUpperCase();
  if (SUPPORTED_CURRENCIES.includes(upper as ProductCurrency)) {
    return upper as ProductCurrency;
  }
  return "TRY";
}

function localeToIntl(locale: Locale): string {
  if (locale === "tr") return "tr-TR";
  if (locale === "ar") return "ar";
  return "en-US";
}

/** Returns formatted price or null when amount is missing/invalid. */
export function formatProductPrice(
  amount: number | string | null | undefined,
  currency: string | null | undefined,
  locale: Locale,
): string | null {
  if (amount == null || amount === "") {
    return null;
  }

  const num = typeof amount === "number" ? amount : Number.parseFloat(String(amount));
  if (!Number.isFinite(num) || num < 0) {
    return null;
  }

  const curr = normalizeCurrency(currency);
  return new Intl.NumberFormat(localeToIntl(locale), {
    style: "currency",
    currency: curr,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
}

export function isSupportedCurrency(value: string): value is ProductCurrency {
  return SUPPORTED_CURRENCIES.includes(value.trim().toUpperCase() as ProductCurrency);
}

export function normalizeCurrencyCode(value: string | null | undefined): ProductCurrency {
  return normalizeCurrency(value);
}
