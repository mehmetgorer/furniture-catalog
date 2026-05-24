import { redirect } from "next/navigation";
import type { ReactNode } from "react";

import { AdminAccessDenied } from "@/components/admin/AdminAccessDenied";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { getCurrentAdmin } from "@/lib/db/admin";

export default async function ProtectedAdminLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const result = await getCurrentAdmin();

  if (result.status === "no-session") {
    redirect("/admin/login");
  }

  if (result.status === "forbidden") {
    return <AdminAccessDenied />;
  }

  return <AdminLayout userEmail={result.profile.email}>{children}</AdminLayout>;
}
