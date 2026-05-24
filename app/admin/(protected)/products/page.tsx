import Link from "next/link";

import { AdminActionAlert } from "@/components/admin/AdminActionAlert";
import { AdminListRowLifecycle } from "@/components/admin/AdminListRowLifecycle";
import {
  activateProduct,
  deactivateProduct,
  deleteProductPermanently,
} from "@/lib/actions/admin-products";
import { getAdminProducts, type AdminProductListItem } from "@/lib/db/products";
import { formatProductPrice } from "@/lib/utils/price";
import { getStockLabel } from "@/lib/utils/stock";

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

function categoryLabel(row: AdminProductListItem): string {
  const c = row.categories;
  if (!c?.name_tr) return "—";
  return c.is_active ? c.name_tr : `${c.name_tr} (pasif kategori)`;
}

function priceSummary(row: AdminProductListItem): string {
  if (!row.show_price) return "Gizli";
  const formatted = formatProductPrice(row.price_amount, row.price_currency, "tr");
  return formatted ?? "Tutar yok";
}

function stockSummary(row: AdminProductListItem): string {
  const status = getStockLabel(row.stock_status, "tr");
  return row.show_stock ? status : `${status} (gizli)`;
}

export default async function AdminProductsPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const products = await getAdminProducts();

  return (
    <div className="min-w-0">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Katalog</p>
          <h1 className="mt-1 font-serif text-2xl font-medium tracking-tight text-stone-50 sm:text-3xl">Ürünler</h1>
          <p className="mt-2 max-w-xl text-sm text-stone-400">
            Aktif ürünler vitrin sitesinde görünür. Pasif ürünler düzenlemek için bu listede kalır.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center justify-center rounded-full bg-stone-100 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-white"
        >
          Yeni Ürün
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

      {products.length === 0 ? (
        <div className="mt-12 rounded-2xl border border-dashed border-stone-700 bg-stone-900/40 px-6 py-16 text-center">
          <p className="text-stone-300">Henüz ürün yok.</p>
          <p className="mt-2 text-sm text-stone-500">Aktif olduğunda vitrinde görünmesi için bir ürün oluşturun.</p>
          <Link
            href="/admin/products/new"
            className="mt-6 inline-flex rounded-full border border-stone-600 px-5 py-2 text-sm font-semibold text-stone-100 hover:bg-stone-800"
          >
            Yeni Ürün
          </Link>
        </div>
      ) : (
        <div className="mt-10 overflow-x-auto overscroll-x-contain [-webkit-overflow-scrolling:touch] rounded-2xl border border-stone-800 bg-stone-900/30">
          <table className="w-full min-w-[1100px] text-left text-sm">
            <thead>
              <tr className="border-b border-stone-800 text-xs uppercase tracking-widest text-stone-500">
                <th className="px-4 py-3 font-medium">Görsel</th>
                <th className="px-4 py-3 font-medium">Başlık (TR)</th>
                <th className="px-4 py-3 font-medium">URL adı</th>
                <th className="px-4 py-3 font-medium">Kod</th>
                <th className="px-4 py-3 font-medium">Kategori</th>
                <th className="px-4 py-3 font-medium">Fiyat</th>
                <th className="px-4 py-3 font-medium">Stok</th>
                <th className="px-4 py-3 font-medium">Durum</th>
                <th className="px-4 py-3 font-medium">Öne çıkan</th>
                <th className="px-4 py-3 font-medium">Sıra</th>
                <th className="px-4 py-3 font-medium text-right">İşlemler</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800">
              {products.map((p) => {
                const firstImg =
                  Array.isArray(p.image_urls) && p.image_urls.length > 0 ? String(p.image_urls[0]).trim() : "";
                return (
                  <tr key={p.id} className="text-stone-200">
                    <td className="px-4 py-3">
                      <div className="relative size-12 overflow-hidden rounded-lg border border-stone-700 bg-stone-950">
                        {firstImg ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={firstImg} alt="" className="size-full object-cover" />
                        ) : (
                          <span className="flex size-full items-center justify-center text-[10px] text-stone-600">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3 font-medium text-stone-100">{p.title_tr}</td>
                    <td className="px-4 py-3 font-mono text-xs text-stone-400">{p.slug}</td>
                    <td className="px-4 py-3 text-stone-400">{p.product_code?.trim() || "—"}</td>
                    <td className="px-4 py-3 text-stone-400">{categoryLabel(p)}</td>
                    <td className="px-4 py-3 text-stone-400">{priceSummary(p)}</td>
                    <td className="px-4 py-3 text-stone-400">{stockSummary(p)}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                          p.is_active ? "bg-emerald-950/80 text-emerald-200" : "bg-stone-800 text-stone-400"
                        }`}
                      >
                        {p.is_active ? "Aktif" : "Pasif"}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-xs text-stone-400">{p.is_featured ? "Evet" : "Hayır"}</span>
                    </td>
                    <td className="px-4 py-3 text-stone-400">{p.sort_order}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${p.id}/edit`}
                          className="rounded-full border border-stone-600 px-3 py-1.5 text-xs font-semibold text-stone-100 hover:bg-stone-800"
                        >
                          Düzenle
                        </Link>
                        <AdminListRowLifecycle
                          id={p.id}
                          isActive={p.is_active}
                          entityLabel="ürün"
                          deactivateAction={deactivateProduct}
                          activateAction={activateProduct}
                          deleteAction={deleteProductPermanently}
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
