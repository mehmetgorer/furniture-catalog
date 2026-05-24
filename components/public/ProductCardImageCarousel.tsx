"use client";

import { useState } from "react";

import { ImageWithFallback } from "@/components/shared/ImageWithFallback";

type Props = {
  imageUrls: string[];
  alt: string;
  fallbackLabel?: string;
};

function FallbackFrame({ label }: { label?: string }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950"
      aria-hidden
    >
      {label ? (
        <span className="max-w-[85%] truncate px-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500 sm:text-xs">
          {label}
        </span>
      ) : null}
    </div>
  );
}

const controlBtnClass =
  "absolute top-1/2 z-10 flex size-8 -translate-y-1/2 items-center justify-center rounded-full bg-stone-950/50 text-white opacity-90 ring-1 ring-white/10 backdrop-blur-sm transition hover:bg-stone-950/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 sm:opacity-0 sm:group-hover/carousel:opacity-100 sm:group-focus-within/carousel:opacity-100";

export function ProductCardImageCarousel({ imageUrls, alt, fallbackLabel }: Props) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const count = imageUrls.length;
  const hasMultiple = count > 1;
  const safeIndex = count > 0 ? Math.min(currentIndex, count - 1) : 0;

  function goTo(index: number) {
    if (count < 2) return;
    setCurrentIndex((index + count) % count);
  }

  if (count === 0) {
    return (
      <div className="relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-gradient-to-br from-stone-800 to-stone-950">
        <FallbackFrame label={fallbackLabel} />
      </div>
    );
  }

  return (
    <div className="group/carousel relative aspect-[4/3] w-full shrink-0 overflow-hidden bg-gradient-to-br from-stone-800 to-stone-950">
      <ImageWithFallback
        key={safeIndex}
        src={imageUrls[safeIndex]}
        alt={alt}
        className="object-cover transition duration-700 ease-out group-hover:scale-[1.03]"
        sizes="(max-width: 768px) 100vw, 33vw"
        fallbackLabel={fallbackLabel}
      />

      {hasMultiple ? (
        <>
          <div
            className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-gradient-to-t from-stone-950/40 to-transparent"
            aria-hidden
          />
          <div className="absolute inset-x-0 bottom-3 flex justify-center gap-1">
            {imageUrls.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Image ${i + 1} of ${count}`}
                aria-current={i === safeIndex ? "true" : undefined}
                className={`rounded-full transition-all duration-300 ${
                  i === safeIndex ? "size-1.5 bg-white" : "size-1 bg-white/40 hover:bg-white/65"
                }`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => goTo(safeIndex - 1)}
            aria-label="Previous image"
            className={`${controlBtnClass} start-2`}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5 rtl:rotate-180" aria-hidden>
              <path
                fillRule="evenodd"
                d="M12.79 4.23a.75.75 0 0 1-.02 1.06L8.168 10l4.6 4.71a.75.75 0 1 1-1.06 1.06l-5.25-5.25a.75.75 0 0 1 0-1.06l5.25-5.25a.75.75 0 0 1 1.08.02Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => goTo(safeIndex + 1)}
            aria-label="Next image"
            className={`${controlBtnClass} end-2`}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" className="size-3.5 rtl:rotate-180" aria-hidden>
              <path
                fillRule="evenodd"
                d="M7.21 15.77a.75.75 0 0 1 .02-1.06L11.832 10 7.23 5.29a.75.75 0 1 1 1.06-1.06l5.25 5.25a.75.75 0 0 1 0 1.06l-5.25 5.25a.75.75 0 0 1-1.08-.02Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <p className="sr-only" aria-live="polite">
            Image {safeIndex + 1} of {count}
          </p>
        </>
      ) : null}
    </div>
  );
}
