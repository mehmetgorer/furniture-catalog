import type { ReactNode } from "react";

type ContactInfoCardProps = Readonly<{
  label: string;
  children: ReactNode;
}>;

export function ContactInfoCard({ label, children }: ContactInfoCardProps) {
  return (
    <div className="min-w-0 rounded-[1.25rem] border border-stone-200/70 bg-white/95 p-6 shadow-[0_1px_2px_rgba(28,25,23,0.04)] dark:border-stone-800 dark:bg-stone-900/50 sm:p-7">
      <p className="public-eyebrow">{label}</p>
      <div className="mt-3 min-w-0 break-words text-base text-stone-800 dark:text-stone-100">{children}</div>
    </div>
  );
}
