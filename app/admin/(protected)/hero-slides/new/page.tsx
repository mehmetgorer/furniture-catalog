import Link from "next/link";

import { HeroSlideForm } from "@/components/admin/HeroSlideForm";
import { createHeroSlide } from "@/lib/actions/admin-hero-slides";

export default function NewHeroSlidePage() {
  return (
    <div>
      <Link
        href="/admin/hero-slides"
        className="text-sm font-medium text-stone-400 underline-offset-4 hover:text-stone-100 hover:underline"
      >
        ← Slider görsellerine dön
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-medium tracking-tight text-stone-50 sm:text-3xl">Yeni Slider</h1>
      <p className="mt-2 text-sm text-stone-400">Türkçe başlık ve slider görseli zorunludur.</p>

      <div className="mt-8">
        <HeroSlideForm mode="create" saveAction={createHeroSlide} />
      </div>
    </div>
  );
}
