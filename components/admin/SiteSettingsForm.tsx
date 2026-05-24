"use client";

import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { useFormStatus } from "react-dom";

import { ImageUploader } from "@/components/admin/ImageUploader";
import { LocaleTabs } from "@/components/admin/LocaleTabs";
import { upsertSiteSettings, type SiteSettingsFormState } from "@/lib/actions/admin-site-settings";
import type { SiteSettings } from "@/lib/supabase/types";
import { inputString } from "@/lib/utils/admin-form";
import { ALLOWED_IMAGE_URL_HINT } from "@/lib/utils/image-url";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-[44px] rounded-full bg-stone-100 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Kaydediliyor…" : "Kaydet"}
    </button>
  );
}

type SiteSettingsFormProps = Readonly<{
  initialData: SiteSettings | null;
}>;

const initialFormState: SiteSettingsFormState = {};

export function SiteSettingsForm({ initialData }: SiteSettingsFormProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(upsertSiteSettings, initialFormState);
  const [logoUrl, setLogoUrl] = useState(() => inputString(initialData?.logo_url));

  useEffect(() => {
    if (state.success) {
      router.refresh();
    }
  }, [state.success, router]);

  return (
    <div className="max-w-3xl min-w-0 space-y-8">
      {state.error ? (
        <p className="rounded-xl border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-100" role="alert">
          {state.error}
        </p>
      ) : null}
      {state.success ? (
        <p className="rounded-xl border border-emerald-900/50 bg-emerald-950/40 px-4 py-3 text-sm text-emerald-100">
          Ayarlar kaydedildi. Vitrin sayfaları yeniledikten sonra güncellenir.
        </p>
      ) : null}

      <form action={formAction} className="space-y-8">
        <input type="hidden" name="logo_url" value={logoUrl ?? ""} />

        <section className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-500">Marka</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="logo_text" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                Logo / site adı
              </label>
              <input
                id="logo_text"
                name="logo_text"
                defaultValue={initialData?.logo_text ?? ""}
                className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                placeholder="Üst bilgide gösterilir"
              />
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Logo görseli</p>
              <ImageUploader value={logoUrl} onChange={setLogoUrl} storageFolder="site" />
              <label htmlFor="logo_url_text" className="mt-3 block text-xs text-stone-500">
                veya logo görsel URL yapıştırın (https://…)
              </label>
              <p className="mt-1 text-xs text-stone-600">{ALLOWED_IMAGE_URL_HINT}</p>
              <input
                id="logo_url_text"
                type="url"
                value={logoUrl ?? ""}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                placeholder="https://…"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-500">İletişim</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="phone" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                Telefon
              </label>
              <input
                id="phone"
                name="phone"
                defaultValue={initialData?.phone ?? ""}
                className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
              />
            </div>
            <div>
              <label htmlFor="whatsapp" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                WhatsApp
              </label>
              <input
                id="whatsapp"
                name="whatsapp"
                defaultValue={initialData?.whatsapp ?? ""}
                className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                placeholder="+90… or https://wa.me/…"
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="email" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                E-posta
              </label>
              <input
                id="email"
                name="email"
                type="email"
                defaultValue={initialData?.email ?? ""}
                className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-500">Sosyal ve harita</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="instagram_url" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                Instagram URL
              </label>
              <input
                id="instagram_url"
                name="instagram_url"
                defaultValue={initialData?.instagram_url ?? ""}
                className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                placeholder="https://instagram.com/…"
              />
            </div>
            <div>
              <label htmlFor="facebook_url" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                Facebook URL
              </label>
              <input
                id="facebook_url"
                name="facebook_url"
                defaultValue={initialData?.facebook_url ?? ""}
                className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                placeholder="https://facebook.com/…"
              />
            </div>
            <div>
              <label htmlFor="map_url" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                Harita URL
              </label>
              <input
                id="map_url"
                name="map_url"
                defaultValue={initialData?.map_url ?? ""}
                className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                placeholder="https://… (gömme veya harita bağlantısı)"
              />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-500">Adres</h2>
          <p className="mt-1 text-xs text-stone-500">İletişim sayfasında gösterilir; boş EN/AR için Türkçe yedek kullanılır.</p>
          <div className="mt-4">
            <LocaleTabs
              tr={
                <div>
                  <label htmlFor="address_tr" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                    Adres (TR)
                  </label>
                  <textarea
                    id="address_tr"
                    name="address_tr"
                    rows={4}
                    defaultValue={initialData?.address_tr ?? ""}
                    className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                  />
                </div>
              }
              en={
                <div>
                  <label htmlFor="address_en" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                    Adres (EN)
                  </label>
                  <textarea
                    id="address_en"
                    name="address_en"
                    rows={4}
                    defaultValue={initialData?.address_en ?? ""}
                    className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                  />
                </div>
              }
              ar={
                <div>
                  <label htmlFor="address_ar" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                    Adres (AR)
                  </label>
                  <textarea
                    id="address_ar"
                    name="address_ar"
                    rows={4}
                    defaultValue={initialData?.address_ar ?? ""}
                    className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                    dir="rtl"
                  />
                </div>
              }
            />
          </div>
        </section>

        <section className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-500">Hakkımızda</h2>
          <p className="mt-1 text-xs text-stone-500">
            Ana sayfa önizlemesi ve /about sayfası; EN/AR boşsa Türkçe yedek kullanılır.
          </p>
          <div className="mt-4">
            <LocaleTabs
              tr={
                <div>
                  <label htmlFor="about_tr" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                    Hakkımızda (TR)
                  </label>
                  <textarea
                    id="about_tr"
                    name="about_tr"
                    rows={8}
                    defaultValue={initialData?.about_tr ?? ""}
                    className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                  />
                </div>
              }
              en={
                <div>
                  <label htmlFor="about_en" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                    About (EN)
                  </label>
                  <textarea
                    id="about_en"
                    name="about_en"
                    rows={8}
                    defaultValue={initialData?.about_en ?? ""}
                    className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                  />
                </div>
              }
              ar={
                <div>
                  <label htmlFor="about_ar" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                    Hakkımızda (AR)
                  </label>
                  <textarea
                    id="about_ar"
                    name="about_ar"
                    rows={8}
                    defaultValue={initialData?.about_ar ?? ""}
                    className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                    dir="rtl"
                  />
                </div>
              }
            />
          </div>
        </section>

        <div className="flex flex-wrap gap-3">
          <SubmitButton />
        </div>
      </form>
    </div>
  );
}
