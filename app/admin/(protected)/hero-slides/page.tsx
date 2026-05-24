import Link from "next/link";

import { AdminActionAlert } from "@/components/admin/AdminActionAlert";
import { AdminListRowLifecycle } from "@/components/admin/AdminListRowLifecycle";
import {
  activateHeroSlide,
  deactivateHeroSlide,
  deleteHeroSlidePermanently,
} from "@/lib/actions/admin-hero-slides";
import { getAdminHeroSlides } from "@/lib/db/hero-slides";

type PageProps = Readonly<{
  searchParams: Promise<{
    deactivateError?: string;
    deactivated?: string;
    activateError?: string;
    activated?: string;
    deleteError?: string;
    deleted?: string;
  }>;
}>;

export default async function AdminHeroSlidesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const slides = await getAdminHeroSlides();

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Ana sayfa</p>
          <h1 className="mt-1 font-serif text-2xl font-medium tracking-tight text-stone-50 sm:text-3xl">Slider Görselleri</h1>
          <p className="mt-2 max-w-xl text-sm text-stone-400">
            Aktif slaytlar vitrin ana sayfasında görünür. Pasif olanlar düzenlemek için burada kalır.
          </p>
        </div>
        <Link
          href="/admin/hero-slides/new"
          className="inline-flex items-center justify-center rounded-full bg-stone-100 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-white"
        >
          Yeni Slider
        </Link>
      </div>

      <AdminActionAlert
        deactivateError={sp.deactivateError}
        deactivated={sp.deactivated}
        activateError={sp.activateError}
        activated={sp.activated}
        deleteError={sp.deleteError}
        deleted={sp.deleted}
      />

      {slides.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-stone-700 bg-stone-900/40 px-6 py-16 text-center">
          <p className="text-stone-300">Henüz slider görseli yok.</p>
          <p className="mt-2 text-sm text-stone-500">Aktif slayt yoksa ana sayfa örnek slider içeriği kullanır.</p>
          <Link
            href="/admin/hero-slides/new"
            className="mt-6 inline-flex rounded-full border border-stone-600 px-5 py-2 text-sm font-semibold text-stone-100 hover:bg-stone-800"
          >
            Yeni Slider
          </Link>
        </div>
      ) : (
        <div className="mt-10 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] rounded-2xl border border-stone-800 bg-stone-900/30">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-800 text-xs uppercase tracking-widest text-stone-500">
                <th className="px-4 py-3 font-medium">Görsel</th>
                <th className="px-4 py-3 font-medium">Başlık (TR)</th>
                <th className="px-4 py-3 font-medium">Bağlantı</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium">Sıra</th>
                <th className="px-4 py-3 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {slides.map((s) => {
                const img = s.image_url?.trim() ?? "";
                const link = s.link_url?.trim() ?? "";
                return (
                  <tr key={s.id} className="text-stone-200">
                    <td className="px-4 py-3">
                      <div className="relative size-14 overflow-hidden rounded-lg border border-stone-700 bg-stone-950">
                        {img ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={img} alt="" className="size-full object-cover" />
                        ) : (
                          <span className="flex size-full items-center justify-center text-[10px] text-stone-600">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-100">{s.title_tr}</td>
                    <td className="max-w-[200px] truncate px-4 py-3 font-mono text-xs text-stone-400">{link || "—"}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          s.is_active ? "bg-emerald-950/80 text-emerald-200" : "bg-stone-800 text-stone-400"
                        }`}
                      >
                        {s.is_active ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-stone-400">{s.sort_order}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <Link
                          href={`/admin/hero-slides/${s.id}/edit`}
                          className="rounded-full border border-stone-600 px-3 py-1.5 text-xs font-semibold text-stone-100 hover:bg-stone-800"
                        >
                          Düzenle
                        </Link>
                        <AdminListRowLifecycle
                          id={s.id}
                          isActive={s.is_active}
                          entityLabel="slider görseli"
                          deactivateAction={deactivateHeroSlide}
                          activateAction={activateHeroSlide}
                          deleteAction={deleteHeroSlidePermanently}
                        />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
