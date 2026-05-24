import Link from "next/link";

import { AdminActionAlert } from "@/components/admin/AdminActionAlert";
import { AdminListRowLifecycle } from "@/components/admin/AdminListRowLifecycle";
import {
  activateCategory,
  deactivateCategory,
  deleteCategoryPermanently,
} from "@/lib/actions/admin-categories";
import { getAdminCategories } from "@/lib/db/categories";

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

export default async function AdminCategoriesPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const categories = await getAdminCategories();

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Katalog</p>
          <h1 className="mt-1 font-serif text-2xl font-medium tracking-tight text-stone-50 sm:text-3xl">Kategoriler</h1>
          <p className="mt-2 max-w-xl text-sm text-stone-400">
            Aktif kategoriler vitrin sitesinde görünür. Pasif olanlar düzenlemek için bu listede kalır.
          </p>
        </div>
        <Link
          href="/admin/categories/new"
          className="inline-flex items-center justify-center rounded-full bg-stone-100 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-white"
        >
          Yeni Kategori
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

      {categories.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-stone-700 bg-stone-900/40 px-6 py-16 text-center">
          <p className="text-stone-300">Henüz kategori yok.</p>
          <p className="mt-2 text-sm text-stone-500">Vitrinde ürünleri düzenlemek için ilk kategorinizi oluşturun.</p>
          <Link
            href="/admin/categories/new"
            className="mt-6 inline-flex rounded-full border border-stone-600 px-5 py-2 text-sm font-semibold text-stone-100 hover:bg-stone-800"
          >
            Yeni Kategori
          </Link>
        </div>
      ) : (
        <div className="mt-10 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] rounded-2xl border border-stone-800 bg-stone-900/30">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-800 text-xs uppercase tracking-widest text-stone-500">
                <th className="px-4 py-3 font-medium">Görsel</th>
                <th className="px-4 py-3 font-medium">Ad (TR)</th>
                <th className="px-4 py-3 font-medium">URL adı</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium">Sıra</th>
                <th className="px-4 py-3 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {categories.map((c) => (
                <tr key={c.id} className="text-stone-200">
                  <td className="px-4 py-3">
                    <div className="relative size-12 overflow-hidden rounded-lg border border-stone-700 bg-stone-950">
                      {c.image_url ? (
                        // eslint-disable-next-line @next/next/no-img-element -- arbitrary Supabase / external URLs
                        <img src={c.image_url} alt="" className="size-full object-cover" />
                      ) : (
                        <span className="flex size-full items-center justify-center text-[10px] text-stone-600">—</span>
                      )}
                    </div>
                  </td>
                  <td className="px-4 py-3 font-medium text-stone-100">{c.name_tr}</td>
                  <td className="px-4 py-3 font-mono text-xs text-stone-400">{c.slug}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                        c.is_active ? "bg-emerald-950/80 text-emerald-200" : "bg-stone-800 text-stone-400"
                      }`}
                    >
                      {c.is_active ? "Aktif" : "Pasif"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-stone-400">{c.sort_order}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex flex-wrap items-center justify-end gap-2">
                      <Link
                        href={`/admin/categories/${c.id}/edit`}
                        className="rounded-full border border-stone-600 px-3 py-1.5 text-xs font-semibold text-stone-100 hover:bg-stone-800"
                      >
                        Düzenle
                      </Link>
                      <AdminListRowLifecycle
                        id={c.id}
                        isActive={c.is_active}
                        entityLabel="kategori"
                        deactivateAction={deactivateCategory}
                        activateAction={activateCategory}
                        deleteAction={deleteCategoryPermanently}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
