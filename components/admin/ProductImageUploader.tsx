"use client";

import { useState } from "react";

import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const BUCKET = "website-images";
const ACCEPT = "image/jpeg,image/png,image/webp,image/gif";

type ProductImageUploaderProps = Readonly<{
  onUploaded: (publicUrl: string) => void;
  disabled?: boolean;
}>;

function extensionFromMime(mime: string): string | null {
  if (mime === "image/png") return "png";
  if (mime === "image/webp") return "webp";
  if (mime === "image/gif") return "gif";
  if (mime === "image/jpeg") return "jpg";
  return null;
}

function extensionFromFileName(fileName: string): string | null {
  const ext = fileName.split(".").pop()?.toLowerCase();
  if (ext === "jpeg" || ext === "jpg") return "jpg";
  if (ext === "png" || ext === "webp" || ext === "gif") return ext;
  return null;
}

function pickImageExtension(file: File): string {
  return extensionFromMime(file.type) ?? extensionFromFileName(file.name) ?? "jpg";
}

export function ProductImageUploader({ onUploaded, disabled }: ProductImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || disabled) return;

    setError(null);
    setUploading(true);
    try {
      const supabase = createSupabaseBrowserClient();
      const safeExt = pickImageExtension(file);
      const path = `products/${crypto.randomUUID()}.${safeExt}`;

      const { error: upErr } = await supabase.storage.from(BUCKET).upload(path, file, {
        cacheControl: "3600",
        upsert: true,
        contentType: file.type || `image/${safeExt === "jpg" ? "jpeg" : safeExt}`,
      });

      if (upErr) {
        setError(upErr.message);
        return;
      }

      const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
      if (data?.publicUrl) {
        onUploaded(data.publicUrl);
      } else {
        setError("Yüklenen dosya için genel URL oluşturulamadı.");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Yükleme başarısız.");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap items-center gap-3">
        <label className="inline-flex min-h-[44px] cursor-pointer items-center justify-center rounded-full border border-stone-600 px-4 py-2 text-sm font-semibold text-stone-100 transition hover:bg-stone-900 disabled:cursor-not-allowed disabled:opacity-50">
          <input type="file" accept={ACCEPT} className="sr-only" onChange={(ev) => void onFileChange(ev)} disabled={disabled || uploading} />
          {uploading ? "Yükleniyor…" : "Görsel Yükle"}
        </label>
        <span className="text-xs text-stone-500">
          Galeriye eklenir · {BUCKET}/products/
        </span>
      </div>
      {error ? (
        <p className="rounded-lg border border-red-900/50 bg-red-950/40 px-3 py-2 text-sm text-red-100" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
