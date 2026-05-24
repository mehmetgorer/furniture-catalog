import Link from "next/link";
import { notFound } from "next/navigation";

import { CategoryForm } from "@/components/admin/CategoryForm";
import { updateCategory } from "@/lib/actions/admin-categories";
import { getCategoryForEdit } from "@/lib/db/categories";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type PageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function EditCategoryPage({ params }: PageProps) {
  const { id } = await params;
  const trimmed = id?.trim() ?? "";
  if (!trimmed || !UUID_RE.test(trimmed)) {
    notFound();
  }

  const category = await getCategoryForEdit(trimmed);
  if (!category) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/categories"
        className="text-sm font-medium text-stone-400 underline-offset-4 hover:text-stone-100 hover:underline"
      >
        ← Kategorilere dön
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-medium tracking-tight text-stone-50 sm:text-3xl">Kategori Düzenle</h1>
      <p className="mt-2 text-sm text-stone-400">{category.name_tr}</p>

      <div className="mt-8">
        <CategoryForm key={category.id} mode="edit" categoryId={category.id} initialData={category} saveAction={updateCategory} />
      </div>
    </div>
  );
}
