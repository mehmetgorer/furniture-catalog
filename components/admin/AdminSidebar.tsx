"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { LogoutButton } from "@/components/admin/LogoutButton";

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col border-b border-stone-800 bg-stone-950 py-4 md:w-56 md:border-e md:border-stone-800 md:py-6 lg:w-64">
      <div className="px-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Mobilya Kataloğu</p>
        <p className="mt-1 text-sm font-medium text-stone-200">Yönetim</p>
      </div>

      <nav className="mt-4 flex flex-1 flex-row flex-wrap content-start gap-1 px-2 md:mt-8 md:flex-col md:flex-nowrap" aria-label="Yönetim menüsü">
        <Link
          href="/admin/dashboard"
          className={`rounded-lg px-3 py-2.5 text-sm font-medium transition md:py-2 ${
            pathname === "/admin/dashboard"
              ? "bg-stone-800 text-stone-50"
              : "text-stone-400 hover:bg-stone-900 hover:text-stone-100"
          }`}
        >
          Panel
        </Link>

        <Link
          href="/admin/categories"
          className={`rounded-lg px-3 py-2.5 text-sm font-medium transition md:py-2 ${
            pathname === "/admin/categories" || pathname.startsWith("/admin/categories/")
              ? "bg-stone-800 text-stone-50"
              : "text-stone-400 hover:bg-stone-900 hover:text-stone-100"
          }`}
        >
          Kategoriler
        </Link>

        <Link
          href="/admin/products"
          className={`rounded-lg px-3 py-2.5 text-sm font-medium transition md:py-2 ${
            pathname === "/admin/products" || pathname.startsWith("/admin/products/")
              ? "bg-stone-800 text-stone-50"
              : "text-stone-400 hover:bg-stone-900 hover:text-stone-100"
          }`}
        >
          Ürünler
        </Link>

        <Link
          href="/admin/hero-slides"
          className={`rounded-lg px-3 py-2.5 text-sm font-medium transition md:py-2 ${
            pathname === "/admin/hero-slides" || pathname.startsWith("/admin/hero-slides/")
              ? "bg-stone-800 text-stone-50"
              : "text-stone-400 hover:bg-stone-900 hover:text-stone-100"
          }`}
        >
          Slider Görselleri
        </Link>

        <Link
          href="/admin/site-settings"
          className={`rounded-lg px-3 py-2.5 text-sm font-medium transition md:py-2 ${
            pathname === "/admin/site-settings"
              ? "bg-stone-800 text-stone-50"
              : "text-stone-400 hover:bg-stone-900 hover:text-stone-100"
          }`}
        >
          Site Ayarları
        </Link>
      </nav>

      <div className="mt-auto border-t border-stone-800 px-4 pt-4">
        <LogoutButton />
      </div>
    </aside>
  );
}
