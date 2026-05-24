"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { AdminRecordLifecycle } from "@/components/admin/AdminRecordLifecycle";
import { LocaleTabs } from "@/components/admin/LocaleTabs";
import { ProductImageUploader } from "@/components/admin/ProductImageUploader";
import {
  activateProduct,
  deactivateProduct,
  deleteProductPermanently,
  type ProductFormState,
} from "@/lib/actions/admin-products";
import type { AdminProductListItem } from "@/lib/db/products";
import type { Category } from "@/lib/supabase/types";
import { inputNumberString, inputString } from "@/lib/utils/admin-form";
import { ALLOWED_IMAGE_URL_HINT } from "@/lib/utils/image-url";
import { slugifyToKebab } from "@/lib/utils/slug";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="min-h-[44px] rounded-full bg-stone-100 px-5 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Kaydediliyor…" : label}
    </button>
  );
}

function normalizeInitialUrls(p?: AdminProductListItem | null): string[] {
  if (!p?.image_urls || !Array.isArray(p.image_urls)) {
    return [];
  }
  return p.image_urls.map((u) => String(u).trim()).filter((s) => s.length > 0);
}

type ProductFormProps = Readonly<{
  mode: "create" | "edit";
  productId?: string;
  initialData?: AdminProductListItem | null;
  categories: Category[];
  saveAction: (prev: ProductFormState, formData: FormData) => Promise<ProductFormState>;
}>;

const initialFormState: ProductFormState = {};

export function ProductForm({ mode, productId, initialData, categories, saveAction }: ProductFormProps) {
  const [state, formAction] = useActionState(saveAction, initialFormState);
  const [imageUrls, setImageUrls] = useState<string[]>(() => normalizeInitialUrls(initialData));
  const [manualUrl, setManualUrl] = useState<string>("");
  const [titleTr, setTitleTr] = useState<string>(() => inputString(initialData?.title_tr));
  const [titleEn, setTitleEn] = useState<string>(() => inputString(initialData?.title_en));
  const [titleAr, setTitleAr] = useState<string>(() => inputString(initialData?.title_ar));
  const [descriptionTr, setDescriptionTr] = useState<string>(() => inputString(initialData?.description_tr));
  const [descriptionEn, setDescriptionEn] = useState<string>(() => inputString(initialData?.description_en));
  const [descriptionAr, setDescriptionAr] = useState<string>(() => inputString(initialData?.description_ar));
  const [slugManual, setSlugManual] = useState<string>(() => inputString(initialData?.slug));
  const [categoryId, setCategoryId] = useState<string>(() => inputString(initialData?.category_id));
  const [productCode, setProductCode] = useState<string>(() => inputString(initialData?.product_code));
  const [sortOrder, setSortOrder] = useState<string>(() => inputNumberString(initialData?.sort_order, 0));
  const [isActive, setIsActive] = useState<boolean>(initialData?.is_active ?? true);
  const [isFeatured, setIsFeatured] = useState<boolean>(initialData?.is_featured ?? false);
  const [priceAmount, setPriceAmount] = useState<string>(() =>
    initialData?.price_amount != null && initialData.price_amount !== undefined
      ? String(initialData.price_amount)
      : "",
  );
  const [priceCurrency, setPriceCurrency] = useState<string>(() =>
    inputString(initialData?.price_currency) || "TRY",
  );
  const [showPrice, setShowPrice] = useState<boolean>(initialData?.show_price ?? true);
  const [stockStatus, setStockStatus] = useState<string>(() =>
    inputString(initialData?.stock_status) || "in_stock",
  );
  const [showStock, setShowStock] = useState<boolean>(initialData?.show_stock ?? false);

  const titleTrValue = titleTr ?? "";
  const titleEnValue = titleEn ?? "";
  const titleArValue = titleAr ?? "";
  const descriptionTrValue = descriptionTr ?? "";
  const descriptionEnValue = descriptionEn ?? "";
  const descriptionArValue = descriptionAr ?? "";
  const slugValue = slugManual ?? "";
  const productCodeValue = productCode ?? "";
  const sortOrderValue = sortOrder ?? "0";
  const categoryIdValue = categoryId ?? "";
  const manualUrlValue = manualUrl ?? "";
  const priceAmountValue = priceAmount ?? "";
  const priceCurrencyValue = priceCurrency ?? "TRY";
  const stockStatusValue = stockStatus ?? "in_stock";

  const previewSlug = slugValue.trim() ? slugifyToKebab(slugValue) : slugifyToKebab(titleTrValue);

  function addManualUrl() {
    const t = manualUrlValue.trim();
    if (!t) return;
    if (!/^https?:\/\//i.test(t)) {
      return;
    }
    setImageUrls((prev) => (prev.includes(t) ? prev : [...prev, t]));
    setManualUrl("");
  }

  function removeUrl(index: number) {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
  }

  function moveUrl(index: number, dir: -1 | 1) {
    setImageUrls((prev) => {
      const next = index + dir;
      if (next < 0 || next >= prev.length) return prev;
      const copy = [...prev];
      const tmp = copy[index];
      copy[index] = copy[next]!;
      copy[next] = tmp!;
      return copy;
    });
  }

  return (
    <div className="max-w-3xl min-w-0 space-y-8">
      {state.error ? (
        <p className="rounded-xl border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-100" role="alert">
          {state.error}
        </p>
      ) : null}

      <form action={formAction} className="space-y-8">
        {mode === "edit" && productId ? <input type="hidden" name="id" value={productId} /> : null}
        {imageUrls.map((url, i) => (
          <input key={`img-${i}-${url}`} type="hidden" name="image_urls" value={url} />
        ))}

        <section className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-500">Genel</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="category_id" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                Kategori
              </label>
              <select
                id="category_id"
                name="category_id"
                value={categoryIdValue}
                onChange={(e) => setCategoryId(e.currentTarget.value)}
                className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
              >
                <option value="">Kategorisiz</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name_tr}
                    {!c.is_active ? " (Pasif)" : ""}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="slug" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                URL adı / slug (isteğe bağlı — boşsa Türkçe başlıktan üretilir)
              </label>
              <input
                id="slug"
                name="slug"
                value={slugValue}
                onChange={(e) => setSlugManual(e.currentTarget.value)}
                className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                placeholder="e.g. modern-koltuk-takimi"
                autoComplete="off"
              />
              <p className="mt-1 text-xs text-stone-500">
                Önizleme: <span className="font-mono text-stone-300">{previewSlug || "—"}</span>
              </p>
            </div>

            <div>
              <label htmlFor="product_code" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                Ürün kodu (isteğe bağlı)
              </label>
              <input
                id="product_code"
                name="product_code"
                value={productCodeValue}
                onChange={(e) => setProductCode(e.currentTarget.value)}
                className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
              />
            </div>

            <div className="rounded-xl border border-stone-800 bg-stone-950/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Fiyat (katalog gösterimi)</p>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="price_amount" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                    Fiyat tutarı
                  </label>
                  <input
                    id="price_amount"
                    name="price_amount"
                    type="number"
                    min={0}
                    step={0.01}
                    value={priceAmountValue}
                    onChange={(e) => setPriceAmount(e.currentTarget.value)}
                    className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                    placeholder="İsteğe bağlı"
                  />
                </div>
                <div>
                  <label htmlFor="price_currency" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                    Para birimi
                  </label>
                  <select
                    id="price_currency"
                    name="price_currency"
                    value={priceCurrencyValue}
                    onChange={(e) => setPriceCurrency(e.currentTarget.value)}
                    className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                  >
                    <option value="TRY">TRY</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-stone-300">
                <input
                  type="checkbox"
                  name="show_price"
                  value="true"
                  checked={showPrice}
                  onChange={(e) => setShowPrice(e.target.checked)}
                  className="size-4 rounded border-stone-600 bg-stone-900 text-stone-100 focus:ring-stone-500"
                />
                Fiyatı sitede göster
              </label>
            </div>

            <div className="rounded-xl border border-stone-800 bg-stone-950/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Stok gösterimi</p>
              <p className="mt-1 text-xs text-stone-500">Yalnızca vitrin metni; gerçek stok takibi yoktur.</p>
              <div className="mt-4">
                <label htmlFor="stock_status" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                  Stok durumu
                </label>
                <select
                  id="stock_status"
                  name="stock_status"
                  value={stockStatusValue}
                  onChange={(e) => setStockStatus(e.currentTarget.value)}
                  className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                >
                  <option value="in_stock">Stokta var</option>
                  <option value="out_of_stock">Stokta yok</option>
                  <option value="made_to_order">Sipariş üzerine</option>
                </select>
              </div>
              <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm text-stone-300">
                <input
                  type="checkbox"
                  name="show_stock"
                  value="true"
                  checked={showStock}
                  onChange={(e) => setShowStock(e.target.checked)}
                  className="size-4 rounded border-stone-600 bg-stone-900 text-stone-100 focus:ring-stone-500"
                />
                Stok bilgisini sitede göster
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="sort_order" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                  Sıralama
                </label>
                <input
                  id="sort_order"
                  name="sort_order"
                  type="number"
                  value={sortOrderValue}
                  onChange={(e) => setSortOrder(e.currentTarget.value)}
                  className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                />
              </div>
              <div className="flex flex-col gap-3 pt-6 sm:pt-8">
                <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-300">
                  <input
                    type="checkbox"
                    name="is_active"
                    value="true"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="size-4 rounded border-stone-600 bg-stone-900 text-stone-100 focus:ring-stone-500"
                  />
                  Aktif (vitrin sitesinde görünür)
                </label>
                <label className="flex cursor-pointer items-center gap-2 text-sm text-stone-300">
                  <input
                    type="checkbox"
                    name="is_featured"
                    value="true"
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="size-4 rounded border-stone-600 bg-stone-900 text-stone-100 focus:ring-stone-500"
                  />
                  Öne çıkan (aktifken ana sayfa öne çıkan bölümünde)
                </label>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Görseller</p>
              <p className="mt-1 text-xs text-stone-500">İlk görsel kartlarda ve galeride ana küçük resim olarak kullanılır.</p>
              <ProductImageUploader onUploaded={(url) => setImageUrls((prev) => (prev.includes(url) ? prev : [...prev, url]))} />
              <p className="mt-2 text-xs text-stone-600">{ALLOWED_IMAGE_URL_HINT}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <input
                  type="url"
                  value={manualUrlValue}
                  onChange={(e) => setManualUrl(e.currentTarget.value)}
                  className="min-w-[12rem] flex-1 rounded-xl border border-stone-700 bg-stone-950 px-3 py-2 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                  placeholder="https://… görsel URL yapıştırın"
                />
                <button
                  type="button"
                  onClick={addManualUrl}
                  className="rounded-full border border-stone-600 px-4 py-2 text-sm font-semibold text-stone-100 hover:bg-stone-900"
                >
                  URL Ekle
                </button>
              </div>

              {imageUrls.length > 0 ? (
                <ul className="mt-4 space-y-3">
                  {imageUrls.map((url, index) => (
                    <li
                      key={`${index}-${url}`}
                      className="flex flex-wrap items-center gap-3 rounded-xl border border-stone-800 bg-stone-950/80 p-3"
                    >
                      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg border border-stone-700 bg-stone-900">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={url} alt="" className="size-full object-cover" />
                      </div>
                      <p className="min-w-0 flex-1 truncate font-mono text-xs text-stone-400">{url}</p>
                      <div className="flex flex-wrap gap-1">
                        <button
                          type="button"
                          className="rounded border border-stone-600 px-2 py-1 text-xs text-stone-300 hover:bg-stone-800"
                          onClick={() => moveUrl(index, -1)}
                          disabled={index === 0}
                        >
                          Yukarı
                        </button>
                        <button
                          type="button"
                          className="rounded border border-stone-600 px-2 py-1 text-xs text-stone-300 hover:bg-stone-800"
                          onClick={() => moveUrl(index, 1)}
                          disabled={index === imageUrls.length - 1}
                        >
                          Aşağı
                        </button>
                        <button
                          type="button"
                          className="rounded border border-red-900/50 px-2 py-1 text-xs text-red-200 hover:bg-red-950/40"
                          onClick={() => removeUrl(index)}
                        >
                          Kaldır
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-3 text-sm text-stone-500">Henüz görsel yok. Yukarıdan yükleyin veya URL ekleyin.</p>
              )}
            </div>
          </div>
        </section>

        <LocaleTabs
          tr={
            <div className="space-y-4">
              <div>
                <label htmlFor="title_tr" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                  Başlık (TR) <span className="text-red-400">*</span>
                </label>
                <input
                  id="title_tr"
                  name="title_tr"
                  required
                  value={titleTrValue}
                  onChange={(e) => setTitleTr(e.currentTarget.value)}
                  className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                />
              </div>
              <div>
                <label htmlFor="description_tr" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                  Açıklama (isteğe bağlı)
                </label>
                <textarea
                  id="description_tr"
                  name="description_tr"
                  rows={4}
                  value={descriptionTrValue}
                  onChange={(e) => setDescriptionTr(e.currentTarget.value)}
                  className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                />
              </div>
            </div>
          }
          en={
            <div className="space-y-4">
              <div>
                <label htmlFor="title_en" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                  Başlık (EN)
                </label>
                <input
                  id="title_en"
                  name="title_en"
                  value={titleEnValue}
                  onChange={(e) => setTitleEn(e.currentTarget.value)}
                  className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                />
              </div>
              <div>
                <label htmlFor="description_en" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                  Açıklama (isteğe bağlı)
                </label>
                <textarea
                  id="description_en"
                  name="description_en"
                  rows={4}
                  value={descriptionEnValue}
                  onChange={(e) => setDescriptionEn(e.currentTarget.value)}
                  className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                />
              </div>
            </div>
          }
          ar={
            <div className="space-y-4">
              <div>
                <label htmlFor="title_ar" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                  Başlık (AR)
                </label>
                <input
                  id="title_ar"
                  name="title_ar"
                  value={titleArValue}
                  onChange={(e) => setTitleAr(e.currentTarget.value)}
                  className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                  dir="rtl"
                />
              </div>
              <div>
                <label htmlFor="description_ar" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                  Açıklama (isteğe bağlı)
                </label>
                <textarea
                  id="description_ar"
                  name="description_ar"
                  rows={4}
                  value={descriptionArValue}
                  onChange={(e) => setDescriptionAr(e.currentTarget.value)}
                  className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                  dir="rtl"
                />
              </div>
            </div>
          }
        />

        <div className="flex flex-wrap gap-3">
          <SubmitButton label={mode === "create" ? "Ürün Oluştur" : "Kaydet"} />
        </div>
      </form>

      {mode === "edit" && productId ? (
        <AdminRecordLifecycle
          entityLabel="ürün"
          recordId={productId}
          isActive={initialData?.is_active !== false}
          deactivateAction={deactivateProduct}
          activateAction={activateProduct}
          deleteAction={deleteProductPermanently}
        />
      ) : null}
    </div>
  );
}
