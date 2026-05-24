"use client";

import Image from "next/image";
import { useState } from "react";

import { getSafeImageSrc } from "@/lib/utils/image-url";

type Props = {
  src: string;
  alt: string;
  fill?: boolean;
  className?: string;
  sizes: string;
  priority?: boolean;
  /** Optional short label on gradient fallback (e.g. title). */
  fallbackLabel?: string;
};

function GradientFallback({ fallbackLabel }: { fallbackLabel?: string }) {
  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-stone-800 via-stone-900 to-stone-950 ring-1 ring-inset ring-white/5"
      aria-hidden
    >
      {fallbackLabel ? (
        <span className="max-w-[85%] truncate px-3 text-center text-[10px] font-semibold uppercase tracking-[0.18em] text-stone-500 sm:text-xs">
          {fallbackLabel}
        </span>
      ) : null}
    </div>
  );
}

/**
 * External images: invalid/unconfigured URLs render a gradient fallback (never passed to next/image).
 * On load error, swaps to the same fallback so no broken-image icon appears.
 */
export function ImageWithFallback({
  src,
  alt,
  fill = true,
  className = "",
  sizes,
  priority,
  fallbackLabel,
}: Props) {
  const [failed, setFailed] = useState(false);
  const safeSrc = getSafeImageSrc(src);

  if (!safeSrc || failed) {
    return <GradientFallback fallbackLabel={fallbackLabel} />;
  }

  return (
    <Image
      src={safeSrc}
      alt={alt}
      fill={fill}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={() => setFailed(true)}
    />
  );
}
