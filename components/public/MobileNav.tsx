"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export type NavItem = { href: string; label: string };

type Props = {
  items: NavItem[];
  menuLabel: string;
  children: React.ReactNode;
};

export function MobileNav({ items, menuLabel, children }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-stone-200 bg-white text-stone-800 shadow-sm dark:border-stone-700 dark:bg-stone-900 dark:text-stone-100"
        aria-expanded={open}
        aria-controls="mobile-nav-panel"
        aria-label={menuLabel}
      >
        {open ? <IconClose /> : <IconMenu />}
      </button>
      {open ? (
        <div
          id="mobile-nav-panel"
          className="fixed inset-x-0 top-[4.25rem] z-50 max-h-[min(70vh,calc(100dvh-4.25rem))] overflow-y-auto overscroll-y-contain border-b border-stone-200 bg-white/98 px-4 py-5 shadow-xl backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/98 sm:top-[4.5rem] sm:max-h-[min(70vh,calc(100dvh-4.5rem))] sm:px-6"
        >
          <nav className="flex flex-col gap-1">
            {items.map((item) => (
              <Link
                key={item.href + item.label}
                href={item.href}
                className="rounded-xl px-3 py-3 text-sm font-medium text-stone-800 hover:bg-stone-100 dark:text-stone-100 dark:hover:bg-stone-900"
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-stone-200 pt-4 dark:border-stone-800">
            {children}
          </div>
        </div>
      ) : null}
    </>
  );
}

function IconMenu() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
    </svg>
  );
}

function IconClose() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
    </svg>
  );
}
