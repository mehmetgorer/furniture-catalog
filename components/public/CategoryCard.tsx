import Link from "next/link";

import { ImageWithFallback } from "@/components/shared/ImageWithFallback";

type Props = {
  title: string;
  description: string;
  imageUrl: string;
  href: string;
};

export function CategoryCard({ title, description, imageUrl, href }: Props) {
  return (
    <Link
      href={href}
      className="public-card-surface public-card-hover group relative flex min-h-0 min-w-0 flex-col"
    >
      <div className="relative aspect-[5/4] w-full overflow-hidden bg-gradient-to-br from-stone-800 to-stone-950">
        <ImageWithFallback
          src={imageUrl}
          alt=""
          className="object-cover transition duration-700 ease-out group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 100vw, 25vw"
          fallbackLabel={title}
        />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/35 to-stone-950/10 transition duration-500 group-hover:from-stone-950/95" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 min-w-0 p-5 sm:p-6">
          <h3 className="line-clamp-2 font-serif text-xl font-medium leading-snug text-white [overflow-wrap:anywhere] sm:text-2xl">
            {title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-stone-100/90">{description}</p>
        </div>
      </div>
    </Link>
  );
}
