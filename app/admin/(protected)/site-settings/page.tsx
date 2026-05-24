import Link from "next/link";

import { SiteSettingsForm } from "@/components/admin/SiteSettingsForm";
import { getAdminSiteSettings } from "@/lib/db/site-settings";

export default async function AdminSiteSettingsPage() {
  const settings = await getAdminSiteSettings();

  return (
    <div className="min-w-0">
      <Link
        href="/admin/dashboard"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-stone-400 underline-offset-4 hover:text-stone-100 hover:underline"
      >
        <span className="inline-block rtl:rotate-180" aria-hidden>
          ←
        </span>
        Panele dön
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-medium tracking-tight text-stone-50 sm:text-3xl">Site Ayarları</h1>
      <p className="mt-2 max-w-2xl text-pretty text-sm leading-relaxed text-stone-400">
        Marka, iletişim, sosyal bağlantılar ve vitrin için TR/EN/AR hakkımızda ile adres metinleri. Tek ayar satırı
        kullanılır: <code className="text-stone-300">created_at</code> ile ilk satır yüklenir ve güncellenir. Kayıt yoksa
        kaydetmek ilk satırı oluşturur.
      </p>

      <div className="mt-8">
        <SiteSettingsForm key={settings?.updated_at ?? settings?.id ?? "create"} initialData={settings} />
      </div>
    </div>
  );
}
