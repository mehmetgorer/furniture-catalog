"use client";

import type { ReactNode } from "react";
import { useState } from "react";

type TabId = "tr" | "en" | "ar";

const tabs: { id: TabId; label: string }[] = [
  { id: "tr", label: "Türkçe" },
  { id: "en", label: "İngilizce" },
  { id: "ar", label: "العربية" },
];

type LocaleTabsProps = Readonly<{
  tr: ReactNode;
  en: ReactNode;
  ar: ReactNode;
}>;

export function LocaleTabs({ tr, en, ar }: LocaleTabsProps) {
  const [active, setActive] = useState<TabId>("tr");
  const panels: Record<TabId, ReactNode> = { tr, en, ar };

  return (
    <div>
      <div className="flex flex-wrap gap-1 rounded-xl border border-stone-800 bg-stone-900/50 p-1 sm:flex-nowrap">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            className={`flex-1 min-w-0 rounded-lg px-3 py-3 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-950 sm:py-2 ${
              active === t.id ? "bg-stone-700 text-stone-50" : "text-stone-400 hover:text-stone-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-4 min-w-0 rounded-xl border border-stone-800 bg-stone-950/60 p-4 sm:p-5">
        {(Object.keys(panels) as TabId[]).map((id) => (
          <div key={id} hidden={active !== id}>
            {panels[id]}
          </div>
        ))}
      </div>
    </div>
  );
}
