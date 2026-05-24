"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function signOut() {
    setLoading(true);
    const supabase = createSupabaseBrowserClient();
    await supabase.auth.signOut();
    router.push("/admin/login");
    router.refresh();
    setLoading(false);
  }

  return (
    <button
      type="button"
      onClick={() => void signOut()}
      disabled={loading}
      className="min-h-[44px] w-full rounded-full border border-stone-600 px-3 py-2 text-sm font-semibold text-stone-100 transition hover:bg-stone-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500/60 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {loading ? "Çıkış yapılıyor…" : "Çıkış Yap"}
    </button>
  );
}
