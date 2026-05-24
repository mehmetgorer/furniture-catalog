import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div className="min-w-0">
      <h1 className="font-serif text-2xl font-medium tracking-tight text-stone-50 sm:text-3xl">Yönetim Paneli</h1>
      <p className="mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-stone-400">
        Katalog içeriğini, slider görsellerini ve site ayarlarını buradan yönetin.
      </p>

      <section className="mt-10 grid min-w-0 gap-4 sm:grid-cols-2">
        <Link
          href="/admin/categories"
          className="block min-h-[8.5rem] rounded-2xl border border-stone-800 bg-stone-900/50 p-5 transition hover:border-stone-600 hover:bg-stone-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-500">Kategoriler</h2>
          <p className="mt-2 text-sm text-stone-400">Oluşturun, düzenleyin, pasife alın ve kategori görseli yükleyin.</p>
          <p className="mt-3 text-xs font-medium text-stone-300">Aç →</p>
        </Link>
        <Link
          href="/admin/products"
          className="block min-h-[8.5rem] rounded-2xl border border-stone-800 bg-stone-900/50 p-5 transition hover:border-stone-600 hover:bg-stone-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-500">Ürünler</h2>
          <p className="mt-2 text-sm text-stone-400">Oluşturun, düzenleyin, pasife alın; öne çıkarma ve çoklu görsel.</p>
          <p className="mt-3 text-xs font-medium text-stone-300">Aç →</p>
        </Link>
        <Link
          href="/admin/hero-slides"
          className="block min-h-[8.5rem] rounded-2xl border border-stone-800 bg-stone-900/50 p-5 transition hover:border-stone-600 hover:bg-stone-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-500">Slider Görselleri</h2>
          <p className="mt-2 text-sm text-stone-400">Ana sayfa slider: görseller, metinler, bağlantılar, sıralama.</p>
          <p className="mt-3 text-xs font-medium text-stone-300">Aç →</p>
        </Link>
        <Link
          href="/admin/site-settings"
          className="block min-h-[8.5rem] rounded-2xl border border-stone-800 bg-stone-900/50 p-5 transition hover:border-stone-600 hover:bg-stone-900/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950"
        >
          <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-500">Site Ayarları</h2>
          <p className="mt-2 text-sm text-stone-400">İletişim, hakkımızda, marka, logo ve sosyal bağlantılar.</p>
          <p className="mt-3 text-xs font-medium text-stone-300">Aç →</p>
        </Link>
      </section>
    </div>
  );
}
