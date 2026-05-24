"use client";

import { useState } from "react";

import { ImageWithFallback } from "@/components/shared/ImageWithFallback";

type Props = {
  images: string[];
  /** Shown on fallback / empty gallery */
  altLabel: string;
};

export function ProductGallery({ images, altLabel }: Props) {
  const safe = images.filter((u) => u && u.trim() !== "");
  const hasReal = safe.length > 0;
  const [active, setActive] = useState(0);
  const current = hasReal ? safe[active % safe.length] : null;

  return (
    <div className="space-y-4">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-stone-800 to-stone-950 shadow-[0_1px_2px_rgba(28,25,23,0.06)] ring-1 ring-stone-200/70 dark:ring-stone-800">
        {current ? (
          <ImageWithFallback
            src={current}
            alt=""
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 720px"
            fallbackLabel={altLabel}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950">
            <span className="max-w-[80%] truncate px-4 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500 sm:text-xs">
              {altLabel}
            </span>
          </div>
        )}
      </div>
      {safe.length > 1 ? (
        <div className="-mx-1 flex max-w-full gap-2.5 overflow-x-auto overflow-y-hidden overscroll-x-contain px-1 pb-1 [-webkit-overflow-scrolling:touch]">
          {safe.map((src, i) => (
            <button
              key={`${src}-${i}`}
              type="button"
              onClick={() => setActive(i)}
              className={`relative h-[4.5rem] w-[5.5rem] shrink-0 overflow-hidden rounded-xl ring-2 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400 sm:h-20 sm:w-28 ${
                i === active % safe.length
                  ? "ring-stone-900 dark:ring-stone-100"
                  : "ring-transparent opacity-80 hover:opacity-100 hover:ring-stone-300 dark:hover:ring-stone-600"
              }`}
              aria-label={`Image ${i + 1}`}
              aria-current={i === active % safe.length ? "true" : undefined}
            >
              <ImageWithFallback
                src={src}
                alt=""
                className="object-cover"
                sizes="112px"
                fallbackLabel={altLabel}
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
