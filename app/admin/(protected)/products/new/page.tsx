import Link from "next/link";

import { ProductForm } from "@/components/admin/ProductForm";
import { createProduct } from "@/lib/actions/admin-products";
import { getCategoriesForProductForm } from "@/lib/db/categories";

export default async function NewProductPage() {
  const categories = await getCategoriesForProductForm();

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-sm font-medium text-stone-400 underline-offset-4 hover:text-stone-100 hover:underline"
      >
        ← Ürünlere dön
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-medium tracking-tight text-stone-50 sm:text-3xl">Yeni Ürün</h1>
      <p className="mt-2 text-sm text-stone-400">Türkçe başlık zorunludur. URL adı boş bırakılırsa bundan üretilir.</p>

      <div className="mt-8">
        <ProductForm mode="create" categories={categories} saveAction={createProduct} />
      </div>
    </div>
  );
}
