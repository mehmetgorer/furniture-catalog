import { notFound } from "next/navigation";

import { ContactInfoCard } from "@/components/public/ContactInfoCard";
import { getSiteSettings } from "@/lib/db/site-settings";
import { getLocalizedField, getTranslator, parseLocale } from "@/lib/i18n/helpers";
import { getMailtoHref, getMapEmbedSrc, getTelHref, getWhatsAppChatUrl } from "@/lib/utils/whatsapp";

export default async function ContactPage({
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

  const phone = settings?.phone?.trim();
  const email = settings?.email?.trim();
  const whatsappRaw = settings?.whatsapp?.trim();
  const address = row ? getLocalizedField(row, "address", locale).trim() : "";
  const instagram = settings?.instagram_url?.trim();
  const facebook = settings?.facebook_url?.trim();
  const mapUrl = settings?.map_url?.trim();

  const telHref = getTelHref(phone);
  const mailHref = getMailtoHref(email);
  const waHref = getWhatsAppChatUrl(whatsappRaw);
  const embedSrc = getMapEmbedSrc(mapUrl);

  return (
    <div className="mx-auto min-w-0 max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
      <p className="public-eyebrow">{t("getInTouch")}</p>
      <h1 className="public-page-title max-w-prose [overflow-wrap:anywhere]">{t("contact")}</h1>
      <p className="mt-4 max-w-2xl text-pretty text-base leading-relaxed text-stone-600 dark:text-stone-400">
        {t("weAreHereToHelp")}
      </p>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {phone ? (
          <ContactInfoCard label={t("callUs")}>
            {telHref ? (
              <a
                href={telHref}
                className="font-medium text-stone-900 underline-offset-4 hover:underline dark:text-stone-50"
              >
                {phone}
              </a>
            ) : (
              <span className="font-medium">{phone}</span>
            )}
          </ContactInfoCard>
        ) : null}

        {email ? (
          <ContactInfoCard label={t("emailUs")}>
            {mailHref ? (
              <a
                href={mailHref}
                className="font-medium text-stone-900 underline-offset-4 hover:underline dark:text-stone-50"
              >
                {email}
              </a>
            ) : (
              <span className="font-medium">{email}</span>
            )}
          </ContactInfoCard>
        ) : null}

        {waHref ? (
          <ContactInfoCard label={t("whatsapp")}>
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium text-stone-900 underline-offset-4 hover:underline dark:text-stone-50"
            >
              {whatsappRaw ?? t("whatsapp")}
            </a>
          </ContactInfoCard>
        ) : null}

        {address ? (
          <ContactInfoCard label={t("addressLabel")}>
            <p className="whitespace-pre-line font-medium leading-relaxed">{address}</p>
          </ContactInfoCard>
        ) : null}
      </div>

      {instagram || facebook ? (
        <section className="mt-14">
          <h2 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-50">{t("socialMedia")}</h2>
          <div className="mt-4 flex flex-wrap gap-4">
            {instagram ? (
              <a
                href={instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-50 dark:border-stone-600 dark:text-stone-100 dark:hover:bg-stone-900"
              >
                Instagram
              </a>
            ) : null}
            {facebook ? (
              <a
                href={facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 transition hover:bg-stone-50 dark:border-stone-600 dark:text-stone-100 dark:hover:bg-stone-900"
              >
                Facebook
              </a>
            ) : null}
          </div>
        </section>
      ) : null}

      {mapUrl ? (
        <section className="mt-14">
          <h2 className="font-serif text-xl font-medium text-stone-900 dark:text-stone-50">{t("visitUs")}</h2>
          {embedSrc ? (
            <div className="mt-6 overflow-hidden rounded-2xl border border-stone-200/80 bg-stone-100 dark:border-stone-800 dark:bg-stone-900/60">
              <div className="relative aspect-video w-full">
                <iframe
                  title={t("openInMaps")}
                  src={embedSrc}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </div>
            </div>
          ) : null}
          <div className={embedSrc ? "mt-4" : "mt-6"}>
            <a
              href={mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-stone-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-stone-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-white"
            >
              {t("openInMaps")}
            </a>
          </div>
        </section>
      ) : null}
    </div>
  );
}
