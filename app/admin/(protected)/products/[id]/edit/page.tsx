import Link from "next/link";
import { notFound } from "next/navigation";

import { ProductForm } from "@/components/admin/ProductForm";
import { updateProduct } from "@/lib/actions/admin-products";
import { getCategoriesForProductForm } from "@/lib/db/categories";
import { getProductForEdit } from "@/lib/db/products";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type PageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const trimmed = id?.trim() ?? "";
  if (!trimmed || !UUID_RE.test(trimmed)) {
    notFound();
  }

  const [product, categories] = await Promise.all([getProductForEdit(trimmed), getCategoriesForProductForm()]);

  if (!product) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/products"
        className="text-sm font-medium text-stone-400 underline-offset-4 hover:text-stone-100 hover:underline"
      >
        ← Ürünlere dön
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-medium tracking-tight text-stone-50 sm:text-3xl">Ürün Düzenle</h1>
      <p className="mt-2 text-sm text-stone-400">{product.title_tr}</p>

      <div className="mt-8">
        <ProductForm
          key={product.id}
          mode="edit"
          productId={product.id}
          initialData={product}
          categories={categories}
          saveAction={updateProduct}
        />
      </div>
    </div>
  );
}
