import type { Locale } from "@/lib/i18n/locales";

export type StockStatus = "in_stock" | "out_of_stock" | "made_to_order";

const STOCK_STATUSES: StockStatus[] = ["in_stock", "out_of_stock", "made_to_order"];

const LABELS: Record<Locale, Record<StockStatus, string>> = {
  tr: {
    in_stock: "Stokta var",
    out_of_stock: "Stokta yok",
    made_to_order: "Sipariş üzerine",
  },
  en: {
    in_stock: "In stock",
    out_of_stock: "Out of stock",
    made_to_order: "Made to order",
  },
  ar: {
    in_stock: "متوفر",
    out_of_stock: "غير متوفر",
    made_to_order: "حسب الطلب",
  },
};

export function isStockStatus(value: string): value is StockStatus {
  return STOCK_STATUSES.includes(value as StockStatus);
}

export function normalizeStockStatus(value: string | null | undefined): StockStatus {
  const v = String(value ?? "in_stock").trim() as StockStatus;
  return isStockStatus(v) ? v : "in_stock";
}

export function getStockLabel(stockStatus: string | null | undefined, locale: Locale): string {
  const status = normalizeStockStatus(stockStatus);
  return LABELS[locale][status];
}
