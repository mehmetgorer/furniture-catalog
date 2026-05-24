import Link from "next/link";
import { notFound } from "next/navigation";

import { HeroSlideForm } from "@/components/admin/HeroSlideForm";
import { updateHeroSlide } from "@/lib/actions/admin-hero-slides";
import { getHeroSlideForEdit } from "@/lib/db/hero-slides";

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type PageProps = Readonly<{
  params: Promise<{ id: string }>;
}>;

export default async function EditHeroSlidePage({ params }: PageProps) {
  const { id } = await params;
  const trimmed = id?.trim() ?? "";
  if (!trimmed || !UUID_RE.test(trimmed)) {
    notFound();
  }

  const slide = await getHeroSlideForEdit(trimmed);
  if (!slide) {
    notFound();
  }

  return (
    <div>
      <Link
        href="/admin/hero-slides"
        className="text-sm font-medium text-stone-400 underline-offset-4 hover:text-stone-100 hover:underline"
      >
        ← Slider görsellerine dön
      </Link>
      <h1 className="mt-4 font-serif text-2xl font-medium tracking-tight text-stone-50 sm:text-3xl">Slider Düzenle</h1>
      <p className="mt-2 text-sm text-stone-400">{slide.title_tr}</p>

      <div className="mt-8">
        <HeroSlideForm key={slide.id} mode="edit" slideId={slide.id} initialData={slide} saveAction={updateHeroSlide} />
      </div>
    </div>
  );
}
