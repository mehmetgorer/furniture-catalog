import type { Locale } from "@/lib/i18n/locales";
import type { Product } from "@/lib/supabase/types";
import { formatProductPrice } from "@/lib/utils/price";
import { getStockLabel } from "@/lib/utils/stock";

/** Public card/detail price label when show_price and amount are set. */
export function getPublicProductPriceLabel(product: Product, locale: Locale): string | null {
  if (!product.show_price) {
    return null;
  }
  return formatProductPrice(product.price_amount, product.price_currency, locale);
}

/** Public stock status label when show_stock is enabled. */
export function getPublicProductStockLabel(product: Product, locale: Locale): string | null {
  if (!product.show_stock) {
    return null;
  }
  return getStockLabel(product.stock_status, locale);
}

/** Detail page: formatted price, or contact-for-price when hidden or amount missing. */
export function getProductDetailPriceText(
  product: Product,
  locale: Locale,
  contactForPriceLabel: string,
): { kind: "price"; text: string } | { kind: "contact"; text: string } {
  const priceLabel = getPublicProductPriceLabel(product, locale);
  if (priceLabel) {
    return { kind: "price", text: priceLabel };
  }
  return { kind: "contact", text: contactForPriceLabel };
}
