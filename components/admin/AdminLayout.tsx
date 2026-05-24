import type { ReactNode } from "react";

import { AdminSidebar } from "@/components/admin/AdminSidebar";

type AdminLayoutProps = Readonly<{
  children: ReactNode;
  userEmail: string;
}>;

export function AdminLayout({ children, userEmail }: AdminLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <AdminSidebar />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col border-stone-800 bg-stone-950 md:border-s md:border-stone-800">
        <header className="flex min-w-0 items-center justify-between gap-4 border-b border-stone-800 px-4 py-4 sm:px-6">
          <p className="truncate text-xs text-stone-500 sm:text-sm">
            Oturum: <span className="font-medium text-stone-300">{userEmail}</span>
          </p>
        </header>
        <main className="min-w-0 flex-1 px-4 py-8 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
