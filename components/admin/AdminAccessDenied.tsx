import Link from "next/link";

import { LogoutButton } from "@/components/admin/LogoutButton";

export function AdminAccessDenied() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <div className="max-w-md rounded-3xl border border-stone-800 bg-stone-900/60 p-8 text-center shadow-xl">
        <h1 className="font-serif text-2xl font-medium text-stone-50">Erişim reddedildi</h1>
        <p className="mt-3 text-sm leading-relaxed text-stone-400">
          Bu hesap yönetim alanı için yetkili değil. Erişim için{" "}
          <code className="rounded bg-stone-950 px-1 py-0.5 text-xs text-stone-200">public.admin_profiles</code>{" "}
          tablosunda <code className="rounded bg-stone-950 px-1 py-0.5 text-xs text-stone-200">id</code> değerinin
          Supabase Auth kullanıcı kimliğinizle eşleşmesi ve{" "}
          <code className="rounded bg-stone-950 px-1 py-0.5 text-xs text-stone-200">role</code> alanının{" "}
          <code className="rounded bg-stone-950 px-1 py-0.5 text-xs text-stone-200">admin</code> olması gerekir.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <LogoutButton />
          <Link
            href="/tr"
            className="inline-flex items-center justify-center rounded-full border border-stone-600 px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-stone-800"
          >
            Vitrin sitesi
          </Link>
        </div>
      </div>
    </div>
  );
}
