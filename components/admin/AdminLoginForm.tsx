"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

type AdminLoginFormProps = Readonly<{
  configured: boolean;
  denied?: boolean;
}>;

export function AdminLoginForm({ configured, denied }: AdminLoginFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!configured) {
      setError(
        "Supabase yapılandırılmamış. .env.local dosyasına NEXT_PUBLIC_SUPABASE_URL ve NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ekleyin.",
      );
      return;
    }

    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    const { error: signError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (signError) {
      setError(signError.message);
      return;
    }

    router.push("/admin/dashboard");
    router.refresh();
  }

  return (
    <div className="w-full max-w-md">
      <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-8 shadow-xl backdrop-blur-sm">
        <p className="text-xs font-semibold uppercase tracking-widest text-stone-500">Yönetim</p>
        <h1 className="mt-2 font-serif text-2xl font-medium tracking-tight text-stone-50">Giriş Yap</h1>
        <p className="mt-2 text-sm text-stone-400">Yalnızca yetkili personel. Herkese açık kayıt yoktur.</p>

        {denied ? (
          <p className="mt-4 rounded-xl border border-amber-900/60 bg-amber-950/40 px-3 py-2 text-sm text-amber-100">
            Oturumunuz açık olabilir ancak yönetim yetkisi yoktur.{" "}
            <code className="rounded bg-stone-950 px-1 py-0.5 text-xs text-stone-200">admin_profiles</code> satırı ve{" "}
            <code className="rounded bg-stone-950 px-1 py-0.5 text-xs text-stone-200">admin</code> rolü olan bir hesapla
            giriş yapın.
          </p>
        ) : null}

        {!configured ? (
          <p className="mt-4 rounded-xl border border-stone-700 bg-stone-950/80 px-3 py-2 text-sm text-stone-300">
            Supabase ortam değişkenleri eksik. Giriş için <code className="text-stone-100">.env.local</code> dosyasına
            ekleyin.
          </p>
        ) : null}

        <form className="mt-6 space-y-4" onSubmit={onSubmit}>
          <div>
            <label htmlFor="admin-email" className="block text-xs font-medium uppercase tracking-wide text-stone-500">
              E-posta
            </label>
            <input
              id="admin-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(ev) => setEmail(ev.target.value)}
              className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none ring-stone-500/30 placeholder:text-stone-600 focus:border-stone-500 focus:ring-2"
              placeholder="siz@sirket.com"
              disabled={loading}
            />
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="block text-xs font-medium uppercase tracking-wide text-stone-500"
            >
              Şifre
            </label>
            <input
              id="admin-password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(ev) => setPassword(ev.target.value)}
              className="mt-1.5 w-full rounded-xl border border-stone-700 bg-stone-950 px-3 py-2.5 text-sm text-stone-100 outline-none ring-stone-500/30 placeholder:text-stone-600 focus:border-stone-500 focus:ring-2"
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          {error ? (
            <p className="rounded-xl border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-100" role="alert">
              {error}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={loading}
            className="flex min-h-[44px] w-full items-center justify-center rounded-full bg-stone-100 px-4 py-2.5 text-sm font-semibold text-stone-900 transition hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-400/80 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Giriş yapılıyor…" : "Giriş Yap"}
          </button>
        </form>
      </div>
    </div>
  );
}
