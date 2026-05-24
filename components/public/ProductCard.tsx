import Link from "next/link";

import { ProductCardImageCarousel } from "@/components/public/ProductCardImageCarousel";

type Props = {
  title: string;
  href: string;
  ctaLabel: string;
  imageUrl?: string;
  imageUrls?: string[];
  priceLabel?: string | null;
  stockLabel?: string | null;
};

function normalizeCardImages(imageUrls?: string[], imageUrl?: string): string[] {
  if (imageUrls?.length) {
    return imageUrls.map((u) => String(u).trim()).filter((u) => u.length > 0);
  }
  if (imageUrl?.trim()) {
    return [imageUrl.trim()];
  }
  return [];
}

export function ProductCard({
  title,
  href,
  ctaLabel,
  imageUrl,
  imageUrls,
  priceLabel,
  stockLabel,
}: Props) {
  const showMeta = Boolean(priceLabel?.trim() || stockLabel?.trim());
  const normalizedImages = normalizeCardImages(imageUrls, imageUrl);

  return (
    <article className="public-card-surface public-card-hover group flex h-full min-h-0 min-w-0 flex-col">
      <div className="overflow-hidden bg-stone-100 dark:bg-stone-950">
        <ProductCardImageCarousel imageUrls={normalizedImages} alt={title} fallbackLabel={title} />
      </div>
      <div className="flex min-h-[8.5rem] min-w-0 flex-1 flex-col px-5 pb-5 pt-5">
        <h3 className="line-clamp-3 font-serif text-lg font-medium leading-snug text-stone-900 [overflow-wrap:anywhere] dark:text-stone-50">
          <Link
            href={href}
            className="transition hover:text-stone-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/50 focus-visible:ring-offset-2 dark:hover:text-stone-200"
          >
            {title}
          </Link>
        </h3>
        {showMeta ? (
          <div className="mt-3 flex flex-wrap items-baseline gap-x-3 gap-y-1.5">
            {priceLabel?.trim() ? (
              <span className="font-serif text-lg font-medium tracking-tight text-stone-900 dark:text-stone-100">
                {priceLabel}
              </span>
            ) : null}
            {stockLabel?.trim() ? (
              <span className="text-[0.6875rem] font-medium uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400">
                {stockLabel}
              </span>
            ) : null}
          </div>
        ) : null}
        <div className="mt-auto border-t border-stone-100 pt-4 dark:border-stone-800">
          <Link
            href={href}
            className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-medium text-stone-700 underline-offset-4 transition group-hover:text-stone-950 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/50 focus-visible:ring-offset-2 dark:text-stone-300 dark:group-hover:text-white"
          >
            {ctaLabel}
            <span className="inline-block text-stone-400 transition group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5" aria-hidden>
              →
            </span>
          </Link>
        </div>
      </div>
    </article>
  );
}
