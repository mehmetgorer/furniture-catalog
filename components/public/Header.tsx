import Image from "next/image";
import Link from "next/link";

import type { Locale } from "@/lib/i18n/locales";
import type { TranslationKey } from "@/lib/i18n/translations";

import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav, type NavItem } from "./MobileNav";

type T = (key: TranslationKey) => string;

const NAV_KEYS: TranslationKey[] = ["home", "products", "about", "contact"];

const PATH_BY_KEY: Partial<Record<TranslationKey, string>> = {
  home: "",
  products: "/products",
  about: "/about",
  contact: "/contact",
};

function navItems(base: string, t: T): NavItem[] {
  return NAV_KEYS.map((key) => {
    const suffix = PATH_BY_KEY[key] ?? "";
    return { href: suffix ? `${base}${suffix}` : base, label: t(key) };
  });
}

function BrandMark({
  href,
  brandName,
  logoUrl,
}: Readonly<{
  href: string;
  brandName: string;
  logoUrl: string | null;
}>) {
  return (
    <Link
      href={href}
      className="flex min-w-0 max-w-[min(100%,14rem)] shrink items-center gap-2 sm:max-w-[18rem] sm:gap-3"
    >
      {logoUrl ? (
        <span className="relative block h-7 w-14 shrink-0 sm:h-8 sm:w-16">
          <Image
            src={logoUrl}
            alt=""
            fill
            className="object-contain object-start"
            sizes="64px"
            unoptimized
          />
        </span>
      ) : null}
      <span
        className={`min-w-0 font-serif font-medium tracking-tight text-stone-900 [overflow-wrap:anywhere] dark:text-stone-50 ${
          logoUrl ? "text-base leading-tight sm:text-lg" : "text-lg sm:text-2xl"
        }`}
      >
        {brandName}
      </span>
    </Link>
  );
}

function WhatsAppCta({
  whatsappHref,
  contactHref,
  label,
  className,
}: Readonly<{
  whatsappHref: string | null;
  contactHref: string;
  label: string;
  className: string;
}>) {
  if (whatsappHref) {
    return (
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={className}
        aria-label={label}
      >
        {label}
      </a>
    );
  }

  return (
    <Link href={contactHref} className={className} aria-label={label}>
      {label}
    </Link>
  );
}

export function Header({
  locale,
  t,
  brandName,
  logoUrl,
  whatsappHref,
}: Readonly<{
  locale: Locale;
  t: T;
  brandName: string;
  logoUrl: string | null;
  whatsappHref: string | null;
}>) {
  const base = `/${locale}`;
  const contactHref = `${base}/contact`;
  const items = navItems(base, t);
  const ctaClassName =
    "inline-flex min-h-[44px] min-w-[8.5rem] items-center justify-center rounded-full bg-stone-900 px-5 py-2 text-sm font-medium tracking-wide text-white shadow-sm transition hover:bg-stone-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/60 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white dark:focus-visible:ring-offset-stone-950";

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200/70 bg-white/90 shadow-[0_1px_0_rgba(28,25,23,0.04)] backdrop-blur-md dark:border-stone-800/80 dark:bg-stone-950/92 dark:shadow-none">
      <div className="relative mx-auto flex h-[4.25rem] max-w-7xl min-w-0 items-center justify-between gap-3 px-4 sm:h-[4.5rem] sm:gap-4 sm:px-6 lg:px-8">
        <BrandMark href={base} brandName={brandName} logoUrl={logoUrl} />

        <nav className="absolute start-1/2 hidden -translate-x-1/2 items-center gap-7 md:flex rtl:translate-x-1/2">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-[0.8125rem] font-medium tracking-wide text-stone-600 transition hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/50 focus-visible:ring-offset-2 dark:text-stone-400 dark:hover:text-stone-50"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2.5 md:flex">
          <LanguageSwitcher currentLocale={locale} ariaLabel={t("language")} />
          <WhatsAppCta
            whatsappHref={whatsappHref}
            contactHref={contactHref}
            label={t("whatsapp")}
            className={ctaClassName}
          />
        </div>

        <div className="md:hidden">
          <MobileNav items={items} menuLabel={t("navMenu")}>
            <LanguageSwitcher currentLocale={locale} ariaLabel={t("language")} />
            <WhatsAppCta
              whatsappHref={whatsappHref}
              contactHref={contactHref}
              label={t("whatsapp")}
              className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-full bg-stone-900 px-4 py-2 text-sm font-medium text-white dark:bg-stone-100 dark:text-stone-900 sm:min-w-[8.5rem] sm:flex-none"
            />
          </MobileNav>
        </div>
      </div>
    </header>
  );
}
