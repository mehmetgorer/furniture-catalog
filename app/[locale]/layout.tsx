import { notFound } from "next/navigation";

import { Footer } from "@/components/public/Footer";
import { Header } from "@/components/public/Header";
import { getActiveCategories } from "@/lib/db/categories";
import { getSiteSettings } from "@/lib/db/site-settings";
import { locales } from "@/lib/i18n/locales";
import type { Locale } from "@/lib/i18n/locales";
import { getDirection, getTranslator, parseLocale } from "@/lib/i18n/helpers";
import {
  buildFooterCategoryLinks,
  resolveBrandName,
  resolveLogoUrl,
} from "@/lib/public/shell-data";
import { getWhatsAppChatUrl } from "@/lib/utils/whatsapp";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale: segment } = await params;
  const locale = parseLocale(segment);
  if (!locale) {
    notFound();
  }

  const [siteSettings, categories] = await Promise.all([getSiteSettings(), getActiveCategories()]);

  return (
    <LocaleShell locale={locale} siteSettings={siteSettings} categories={categories}>
      {children}
    </LocaleShell>
  );
}

function LocaleShell({
  locale,
  siteSettings,
  categories,
  children,
}: Readonly<{
  locale: Locale;
  siteSettings: Awaited<ReturnType<typeof getSiteSettings>>;
  categories: Awaited<ReturnType<typeof getActiveCategories>>;
  children: React.ReactNode;
}>) {
  const t = getTranslator(locale);
  const dir = getDirection(locale);
  const base = `/${locale}`;
  const productsHref = `${base}/products`;

  const brandName = resolveBrandName(siteSettings, t("furnitureCatalog"));
  const logoUrl = resolveLogoUrl(siteSettings);
  const whatsappHref = getWhatsAppChatUrl(siteSettings?.whatsapp);
  const categoryLinks = buildFooterCategoryLinks(locale, categories, productsHref, t);

  return (
    <div
      lang={locale}
      dir={dir}
      className="flex min-h-full min-w-0 flex-col overflow-x-hidden bg-[var(--background)] text-stone-900 dark:text-stone-50"
    >
      <Header
        locale={locale}
        t={t}
        brandName={brandName}
        logoUrl={logoUrl}
        whatsappHref={whatsappHref}
      />
      <main className="min-w-0 flex-1">{children}</main>
      <Footer
        locale={locale}
        t={t}
        brandName={brandName}
        logoUrl={logoUrl}
        phone={siteSettings?.phone ?? null}
        email={siteSettings?.email ?? null}
        instagramUrl={siteSettings?.instagram_url ?? null}
        facebookUrl={siteSettings?.facebook_url ?? null}
        categoryLinks={categoryLinks}
      />
    </div>
  );
}
