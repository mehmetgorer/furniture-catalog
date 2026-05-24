"use client";

import { useActionState, useState } from "react";
import { useFormStatus } from "react-dom";

import { AdminRecordLifecycle } from "@/components/admin/AdminRecordLifecycle";
import { ImageUploader } from "@/components/admin/ImageUploader";
import { LocaleTabs } from "@/components/admin/LocaleTabs";
import {
  activateCategory,
  deactivateCategory,
  deleteCategoryPermanently,
  type CategoryFormState,
} from "@/lib/actions/admin-categories";
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

type CategoryFormProps = Readonly<{
  mode: "create" | "edit";
  categoryId?: string;
  initialData?: Partial<Category>;
  saveAction: (prev: CategoryFormState, formData: FormData) => Promise<CategoryFormState>;
}>;

const initialFormState: CategoryFormState = {};

export function CategoryForm({ mode, categoryId, initialData, saveAction }: CategoryFormProps) {
  const [state, formAction] = useActionState(saveAction, initialFormState);
  const [imageUrl, setImageUrl] = useState(() => inputString(initialData?.image_url));
  const [nameTr, setNameTr] = useState(() => inputString(initialData?.name_tr));
  const [slugManual, setSlugManual] = useState(() => inputString(initialData?.slug));
  const [sortOrder, setSortOrder] = useState(() => inputNumberString(initialData?.sort_order, 0));
  const [isActive, setIsActive] = useState(initialData?.is_active !== false);

  const previewSlug = slugManual.trim() ? slugifyToKebab(slugManual) : slugifyToKebab(nameTr);

  return (
    <div className="max-w-3xl min-w-0 space-y-8">
      {state.error ? (
        <p className="rounded-xl border border-red-900/50 bg-red-950/40 px-4 py-3 text-sm text-red-100" role="alert">
          {state.error}
        </p>
      ) : null}

      <form action={formAction} className="space-y-8">
        {mode === "edit" && categoryId ? <input type="hidden" name="id" value={categoryId} /> : null}
        <input type="hidden" name="image_url" value={imageUrl ?? ""} />

        <section className="rounded-2xl border border-stone-800 bg-stone-900/40 p-6">
          <h2 className="text-sm font-semibold uppercase tracking-widest text-stone-500">Genel</h2>
          <div className="mt-4 space-y-4">
            <div>
              <label htmlFor="slug" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                URL adı / slug (isteğe bağlı — boşsa Türkçe addan üretilir)
              </label>
              <input
                id="slug"
                name="slug"
                value={slugManual ?? ""}
                onChange={(e) => setSlugManual(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                placeholder="e.g. koltuk-takimlari"
                autoComplete="off"
              />
              <p className="mt-1 text-xs text-stone-500">
                Önizleme: <span className="font-mono text-stone-300">{previewSlug || "—"}</span>
              </p>
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
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                />
              </div>
              <div className="flex items-end pb-2">
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
              </div>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-stone-500">Görsel</p>
              <ImageUploader value={imageUrl} onChange={setImageUrl} />
              <label htmlFor="image_url_text" className="mt-3 block text-xs text-stone-500">
                veya görsel URL yapıştırın
              </label>
              <p className="mt-1 text-xs text-stone-600">{ALLOWED_IMAGE_URL_HINT}</p>
              <input
                id="image_url_text"
                type="url"
                value={imageUrl ?? ""}
                onChange={(e) => setImageUrl(e.target.value)}
                className="mt-1 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                placeholder="https://…"
              />
            </div>
          </div>
        </section>

        <LocaleTabs
          tr={
            <div className="space-y-4">
              <div>
                <label htmlFor="name_tr" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                  Ad (TR) <span className="text-red-400">*</span>
                </label>
                <input
                  id="name_tr"
                  name="name_tr"
                  required
                  value={nameTr ?? ""}
                  onChange={(e) => setNameTr(e.target.value)}
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
                  defaultValue={initialData?.description_tr ?? ""}
                  className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                />
              </div>
            </div>
          }
          en={
            <div className="space-y-4">
              <div>
                <label htmlFor="name_en" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                  Ad (EN)
                </label>
                <input
                  id="name_en"
                  name="name_en"
                  defaultValue={initialData?.name_en ?? ""}
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
                  defaultValue={initialData?.description_en ?? ""}
                  className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                />
              </div>
            </div>
          }
          ar={
            <div className="space-y-4">
              <div>
                <label htmlFor="name_ar" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
                  Ad (AR)
                </label>
                <input
                  id="name_ar"
                  name="name_ar"
                  defaultValue={initialData?.name_ar ?? ""}
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
                  defaultValue={initialData?.description_ar ?? ""}
                  className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none focus:border-stone-500 focus:ring-2 focus:ring-stone-500/30"
                  dir="rtl"
                />
              </div>
            </div>
          }
        />

        <div className="flex flex-wrap gap-3">
          <SubmitButton label={mode === "create" ? "Kategori Oluştur" : "Kaydet"} />
        </div>
      </form>

      {mode === "edit" && categoryId ? (
        <AdminRecordLifecycle
          entityLabel="kategori"
          recordId={categoryId}
          isActive={initialData?.is_active !== false}
          deactivateAction={deactivateCategory}
          activateAction={activateCategory}
          deleteAction={deleteCategoryPermanently}
        />
      ) : null}
    </div>
  );
}
