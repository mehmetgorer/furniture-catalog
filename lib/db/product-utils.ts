import { mockProductImages } from "@/lib/home/mock";

export function firstProductImageUrl(urls: string[] | null | undefined, fallbackIndex: number): string {
  const list = normalizeProductImageUrls(urls);
  if (list.length > 0) return list[0];
  return mockProductImages[fallbackIndex % mockProductImages.length];
}

/** Trim and filter product image URLs; optional mock fallback when empty. */
export function normalizeProductImageUrls(
  urls: string[] | null | undefined,
  fallbackIndex?: number,
): string[] {
  const list = (urls ?? []).map((x) => String(x).trim()).filter((x) => x.length > 0);
  if (list.length > 0) return list;
  if (fallbackIndex !== undefined) {
    return [mockProductImages[fallbackIndex % mockProductImages.length]];
  }
  return [];
}
