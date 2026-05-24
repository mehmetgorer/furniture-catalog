"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";

import { ImageWithFallback } from "@/components/shared/ImageWithFallback";

export type HeroSlide = {
  imageUrl: string;
  title: string;
  subtitle: string;
  ctaLabel: string;
  ctaHref: string;
};

type Props = {
  slides: readonly HeroSlide[];
  intervalMs?: number;
};

export function HeroSlider({ slides, intervalMs = 6500 }: Props) {
  const [index, setIndex] = useState(0);
  const safeLen = slides.length;
  const current = safeLen > 0 ? slides[index % safeLen] : null;

  const go = useCallback(
    (delta: number) => {
      if (safeLen === 0) return;
      setIndex((i) => (i + delta + safeLen) % safeLen);
    },
    [safeLen],
  );

  useEffect(() => {
    if (safeLen <= 1) return;
    const id = window.setInterval(() => go(1), intervalMs);
    return () => window.clearInterval(id);
  }, [go, intervalMs, safeLen]);

  if (!current) return null;

  const fallbackLabel = current.title.slice(0, 48);

  return (
    <section className="relative isolate overflow-hidden rounded-[1.75rem] bg-stone-900 shadow-[0_20px_50px_rgba(28,25,23,0.12)] ring-1 ring-stone-900/10 dark:ring-stone-800">
      <div className="relative aspect-[16/11] min-h-[240px] w-full max-h-[72vh] bg-gradient-to-br from-stone-800 to-stone-950 sm:aspect-[21/9] sm:min-h-[300px] sm:max-h-none md:aspect-[21/8] md:min-h-[340px] lg:min-h-[400px]">
        <ImageWithFallback
          key={current.imageUrl}
          src={current.imageUrl}
          alt=""
          className="object-cover opacity-95 transition-opacity duration-700"
          sizes="(max-width: 768px) 100vw, 1200px"
          priority
          fallbackLabel={fallbackLabel}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/95 via-stone-950/45 to-stone-950/15" />
        <div className="absolute inset-0 flex min-w-0 flex-col justify-end px-6 pb-10 pt-16 sm:px-12 sm:pb-14 sm:pt-20 lg:px-16 lg:pb-16">
          <p className="max-w-xl text-pretty public-eyebrow text-stone-200/90 [overflow-wrap:anywhere]">
            {current.subtitle}
          </p>
          <h1 className="mt-4 max-w-3xl text-pretty font-serif text-3xl font-medium leading-[1.15] tracking-tight text-white [overflow-wrap:anywhere] sm:text-4xl lg:text-5xl">
            {current.title}
          </h1>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href={current.ctaHref}
              className="inline-flex min-h-[44px] min-w-[10rem] items-center justify-center rounded-full bg-white px-7 py-2.5 text-sm font-semibold tracking-wide text-stone-900 shadow-sm transition hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
            >
              {current.ctaLabel}
            </Link>
          </div>
        </div>
      </div>

      {safeLen > 1 ? (
        <>
          <div className="absolute bottom-5 start-1/2 z-10 flex -translate-x-1/2 gap-2 rtl:translate-x-1/2">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setIndex(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === index % safeLen ? "w-7 bg-white" : "w-1.5 bg-white/35 hover:bg-white/55"
                }`}
                aria-label={`Slide ${i + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={() => go(-1)}
            className="absolute start-4 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 md:flex"
            aria-label="Previous slide"
          >
            <Chevron dir="prev" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            className="absolute end-4 top-1/2 z-10 hidden size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white ring-1 ring-white/15 backdrop-blur-sm transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 md:flex"
            aria-label="Next slide"
          >
            <Chevron dir="next" />
          </button>
        </>
      ) : null}
    </section>
  );
}

function Chevron({ dir }: { dir: "prev" | "next" }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="rtl:rotate-180"
      aria-hidden
    >
      {dir === "prev" ? (
        <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}
