import Link from "next/link";

type Props = {
  title: string;
  description: string;
  primaryLabel: string;
  primaryHref: string;
  secondaryLabel: string;
  secondaryHref: string;
};

export function ContactCTA({
  title,
  description,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
}: Props) {
  return (
    <section className="relative overflow-hidden rounded-[1.75rem] bg-stone-900 px-6 py-16 text-center shadow-[0_20px_50px_rgba(28,25,23,0.14)] ring-1 ring-stone-800 sm:px-12 sm:py-20">
      <div className="pointer-events-none absolute -start-24 -top-24 h-64 w-64 rounded-full bg-stone-700/35 blur-3xl" />
      <div className="pointer-events-none absolute -end-24 bottom-0 h-48 w-48 rounded-full bg-stone-600/25 blur-3xl" />
      <h2 className="relative font-serif text-2xl font-medium tracking-tight text-white sm:text-3xl">{title}</h2>
      <p className="relative mx-auto mt-4 max-w-xl text-pretty text-sm leading-relaxed text-stone-300 sm:text-base">
        {description}
      </p>
      <div className="relative mt-9 flex w-full min-w-0 flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-center">
        <Link
          href={primaryHref}
          className="inline-flex min-h-[44px] w-full min-w-0 items-center justify-center rounded-full bg-white px-7 py-2.5 text-sm font-semibold tracking-wide text-stone-900 shadow-sm transition hover:bg-stone-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 sm:w-auto sm:min-w-[10rem]"
        >
          {primaryLabel}
        </Link>
        <Link
          href={secondaryHref}
          className="inline-flex min-h-[44px] w-full min-w-0 items-center justify-center rounded-full border border-white/20 bg-white/5 px-7 py-2.5 text-sm font-semibold tracking-wide text-white transition hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 sm:w-auto sm:min-w-[10rem]"
        >
          {secondaryLabel}
        </Link>
      </div>
    </section>
  );
}
