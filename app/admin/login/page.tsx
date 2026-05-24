import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/AdminLoginForm";
import { getCurrentAdmin } from "@/lib/db/admin";
import { isSupabaseConfigured } from "@/lib/db/env";

type PageProps = Readonly<{
  searchParams: Promise<{ denied?: string }>;
}>;

export default async function AdminLoginPage({ searchParams }: PageProps) {
  const sp = await searchParams;
  const admin = await getCurrentAdmin();
  if (admin.status === "ok") {
    redirect("/admin/dashboard");
  }

  const configured = isSupabaseConfigured();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-16">
      <AdminLoginForm configured={configured} denied={sp.denied === "1"} />
    </div>
  );
}
