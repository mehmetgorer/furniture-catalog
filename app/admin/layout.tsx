import type { ReactNode } from "react";

export default function AdminSegmentLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return <div className="min-h-full bg-stone-950 text-stone-100">{children}</div>;
}
