import Image from "next/image";
import Link from "next/link";

import type { FooterCategoryLink } from "@/lib/public/shell-data";
import type { Locale } from "@/lib/i18n/locales";
import type { TranslationKey } from "@/lib/i18n/translations";
import { getMailtoHref, getTelHref } from "@/lib/utils/whatsapp";

type T = (key: TranslationKey) => string;

const NAV_KEYS: TranslationKey[] = ["home", "products", "about", "contact"];

const PATH_BY_KEY: Partial<Record<TranslationKey, string>> = {
  home: "",
  products: "/products",
  about: "/about",
  contact: "/contact",
};

function navItems(base: string, t: T) {
  return NAV_KEYS.map((key) => {
    const suffix = PATH_BY_KEY[key] ?? "";
    return { href: suffix ? `${base}${suffix}` : base, label: t(key) };
  });
}

function BrandBlock({
  brandName,
  logoUrl,
  tagline,
}: Readonly<{
  brandName: string;
  logoUrl: string | null;
  tagline: string;
}>) {
  return (
    <>
      <div className="flex min-w-0 items-center gap-2.5">
        {logoUrl ? (
          <span className="relative block h-7 w-14 shrink-0">
            <Image
              src={logoUrl}
              alt=""
              fill
              className="object-contain object-start"
              sizes="56px"
              unoptimized
            />
          </span>
        ) : null}
        <p className="font-serif text-lg font-medium tracking-tight text-stone-900 dark:text-stone-50 sm:text-xl">
          {brandName}
        </p>
      </div>
      <p className="mt-4 max-w-prose text-pretty text-sm leading-relaxed text-stone-600 [overflow-wrap:anywhere] dark:text-stone-400">
        {tagline}
      </p>
    </>
  );
}

export function Footer({
  locale,
  t,
  brandName,
  logoUrl,
  phone,
  email,
  instagramUrl,
  facebookUrl,
  categoryLinks,
}: Readonly<{
  locale: Locale;
  t: T;
  brandName: string;
  logoUrl: string | null;
  phone: string | null;
  email: string | null;
  instagramUrl: string | null;
  facebookUrl: string | null;
  categoryLinks: FooterCategoryLink[];
}>) {
  const base = `/${locale}`;
  const contactHref = `${base}/contact`;
  const nav = navItems(base, t);

  const phoneValue = phone?.trim() || null;
  const emailValue = email?.trim() || null;
  const instagram = instagramUrl?.trim() || null;
  const facebook = facebookUrl?.trim() || null;
  const telHref = getTelHref(phoneValue);
  const mailHref = getMailtoHref(emailValue);
  const hasContactDetails = Boolean(phoneValue || emailValue || instagram || facebook);

  return (
    <footer className="mt-auto min-w-0 border-t border-stone-200/80 bg-stone-100/90 dark:border-stone-800 dark:bg-stone-950">
      <div className="mx-auto grid min-w-0 max-w-7xl gap-12 px-4 py-14 sm:grid-cols-2 sm:px-6 sm:py-16 lg:grid-cols-4 lg:gap-10 lg:px-8">
        <div className="min-w-0 sm:col-span-2 lg:col-span-1">
          <BrandBlock brandName={brandName} logoUrl={logoUrl} tagline={t("qualityProduction")} />
        </div>

        <div className="min-w-0">
          <p className="public-eyebrow">{t("footerExplore")}</p>
          <ul className="mt-5 space-y-3 text-sm">
            {nav.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="text-stone-700 transition hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/50 focus-visible:ring-offset-2 dark:text-stone-300 dark:hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <p className="public-eyebrow">{t("footerCategories")}</p>
          <ul className="mt-5 space-y-3 text-sm">
            {categoryLinks.map((item) => (
              <li key={item.href + item.label}>
                <Link
                  href={item.href}
                  className="text-stone-700 transition hover:text-stone-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/50 focus-visible:ring-offset-2 dark:text-stone-300 dark:hover:text-white"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="min-w-0">
          <p className="public-eyebrow">{t("contactUs")}</p>
          {hasContactDetails ? (
            <div className="mt-5 space-y-2.5 text-sm text-stone-600 dark:text-stone-400">
              {phoneValue ? (
                <p>
                  {telHref ? (
                    <a
                      href={telHref}
                      className="break-words transition hover:text-stone-900 hover:underline dark:hover:text-stone-100"
                    >
                      {phoneValue}
                    </a>
                  ) : (
                    <span className="break-words">{phoneValue}</span>
                  )}
                </p>
              ) : null}
              {emailValue ? (
                <p>
                  {mailHref ? (
                    <a
                      href={mailHref}
                      className="break-words transition hover:text-stone-900 hover:underline dark:hover:text-stone-100"
                    >
                      {emailValue}
                    </a>
                  ) : (
                    <span className="break-words">{emailValue}</span>
                  )}
                </p>
              ) : null}
              {instagram || facebook ? (
                <div className="flex flex-wrap gap-x-4 gap-y-2 pt-2">
                  {instagram ? (
                    <a
                      href={instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-600 transition hover:text-stone-950 hover:underline dark:text-stone-400 dark:hover:text-white"
                    >
                      Instagram
                    </a>
                  ) : null}
                  {facebook ? (
                    <a
                      href={facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-stone-600 transition hover:text-stone-950 hover:underline dark:text-stone-400 dark:hover:text-white"
                    >
                      Facebook
                    </a>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : (
            <p className="mt-5 text-sm">
              <Link
                href={contactHref}
                className="text-stone-700 transition hover:text-stone-950 hover:underline dark:text-stone-300 dark:hover:text-white"
              >
                {t("contact")}
              </Link>
            </p>
          )}
        </div>
      </div>
      <div className="border-t border-stone-200/80 px-4 py-6 text-center text-xs tracking-wide text-stone-500 dark:border-stone-800 dark:text-stone-500">
        © {new Date().getFullYear()} {brandName}
      </div>
    </footer>
  );
}
