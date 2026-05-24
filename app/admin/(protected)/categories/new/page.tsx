import Link from "next/link";

import { CategoryForm } from "@/components/admin/CategoryForm";
import { createCategory } from "@/lib/actions/admin-categories";

export default function NewCategoryPage() {
  return (
    <div>
      <Link
        href="/admin/categories"
        className="text-sm font-medium text-stone-400 underline-offset-4 hover:text-stone-100 hover:underline"
      >
        ← Kategorilere dön
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-medium tracking-tight text-stone-50 sm:text-3xl">Yeni Kategori</h1>
      <p className="mt-2 text-sm text-stone-400">Türkçe ad zorunludur. URL adı boş bırakılırsa bundan üretilir.</p>

      <div className="mt-8">
        <CategoryForm mode="create" saveAction={createCategory} />
      </div>
    </div>
  );
}
