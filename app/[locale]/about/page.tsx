import { notFound } from "next/navigation";

import { AboutFeatureCard } from "@/components/public/AboutFeatureCard";
import { getSiteSettings } from "@/lib/db/site-settings";
import { getLocalizedField, getTranslator, parseLocale } from "@/lib/i18n/helpers";

export default async function AboutPage({
  params,
}: Readonly<{
  params: Promise<{ locale: string }>;
}>) {
  const { locale: segment } = await params;
  const locale = parseLocale(segment);
  if (!locale) {
    notFound();
  }

  const t = getTranslator(locale);
  const settings = await getSiteSettings();
  const row = settings ? (settings as unknown as Record<string, unknown>) : null;
  const fromDb = row ? getLocalizedField(row, "about", locale).trim() : "";
  const fallbackBody = `${t("aboutPreviewLead")}\n\n${t("aboutPreviewBody")}`;
  const aboutParagraph = fromDb || fallbackBody;

  return (
    <div className="mx-auto min-w-0 max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <p className="public-eyebrow">{t("aboutUs")}</p>
      <h1 className="public-page-title max-w-prose [overflow-wrap:anywhere]">{t("about")}</h1>

      <section className="mt-14 rounded-[1.75rem] border border-stone-200/70 bg-white/90 p-8 shadow-[0_1px_2px_rgba(28,25,23,0.05)] dark:border-stone-800 dark:bg-stone-900/40 sm:p-10 lg:p-12">
        <h2 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-50">{t("ourStory")}</h2>
        <p className="mt-6 whitespace-pre-line text-pretty text-base leading-relaxed text-stone-700 [overflow-wrap:anywhere] dark:text-stone-300">
          {aboutParagraph}
        </p>
      </section>

      <section className="mt-20">
        <h2 className="font-serif text-2xl font-medium tracking-tight text-stone-900 dark:text-stone-50">{t("furnitureCatalog")}</h2>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-stone-600 dark:text-stone-400">{t("aboutPreviewLead")}</p>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          <AboutFeatureCard title={t("qualityProduction")} description={t("benefitDescQuality")} />
          <AboutFeatureCard title={t("customDesign")} description={t("benefitDescCustom")} />
          <AboutFeatureCard title={t("projectSupport")} description={t("benefitDescProject")} />
          <AboutFeatureCard title={t("fastCommunication")} description={t("benefitDescFast")} />
        </div>
      </section>
    </div>
  );
}
