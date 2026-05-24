const UNSPLASH_HOST = "images.unsplash.com";
const SUPABASE_PUBLIC_PATH_PREFIX = "/storage/v1/object/public/";

const DISALLOWED_SCHEME_PREFIXES = ["javascript:", "data:", "file:", "vbscript:"] as const;

import {
  ALLOWED_IMAGE_URL_ERROR,
  ALLOWED_IMAGE_URL_HINT,
  IMAGE_REQUIRED_ERROR,
} from "@/lib/admin/admin-copy";

export { ALLOWED_IMAGE_URL_ERROR, ALLOWED_IMAGE_URL_HINT, IMAGE_REQUIRED_ERROR };

export function getSupabaseHostname(): string | null {
  const raw = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  if (!raw) return null;
  try {
    return new URL(raw).hostname.toLowerCase();
  } catch {
    return null;
  }
}

export function isHttpUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed) return false;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function hasDisallowedScheme(value: string): boolean {
  const lower = value.trim().toLowerCase();
  return DISALLOWED_SCHEME_PREFIXES.some((prefix) => lower.startsWith(prefix));
}

export function isAllowedPublicImageUrl(value: string): boolean {
  const trimmed = value.trim();
  if (!trimmed || hasDisallowedScheme(trimmed) || !isHttpUrl(trimmed)) {
    return false;
  }

  try {
    const parsed = new URL(trimmed);
    const host = parsed.hostname.toLowerCase();

    if (host === UNSPLASH_HOST) {
      return true;
    }

    const supabaseHost = getSupabaseHostname();
    if (supabaseHost && host === supabaseHost) {
      return parsed.pathname.startsWith(SUPABASE_PUBLIC_PATH_PREFIX);
    }

    return false;
  } catch {
    return false;
  }
}

export function getSafeImageSrc(value: string | null | undefined): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return isAllowedPublicImageUrl(trimmed) ? trimmed : null;
}

export function parseOptionalAllowedImageUrl(
  raw: unknown,
): { ok: true; value: string | null } | { ok: false; error: string } {
  const trimmed = String(raw ?? "").trim();
  if (trimmed === "") {
    return { ok: true, value: null };
  }
  if (!isAllowedPublicImageUrl(trimmed)) {
    return { ok: false, error: ALLOWED_IMAGE_URL_ERROR };
  }
  return { ok: true, value: trimmed };
}

export function parseRequiredAllowedImageUrl(
  raw: unknown,
): { ok: true; value: string } | { ok: false; error: string } {
  const trimmed = String(raw ?? "").trim();
  if (!trimmed) {
    return { ok: false, error: IMAGE_REQUIRED_ERROR };
  }
  if (!isAllowedPublicImageUrl(trimmed)) {
    return { ok: false, error: ALLOWED_IMAGE_URL_ERROR };
  }
  return { ok: true, value: trimmed };
}

export function parseAllowedImageUrlList(
  urls: string[],
): { ok: true; value: string[] } | { ok: false; error: string } {
  const deduped = [...new Set(urls.map((u) => String(u).trim()).filter((u) => u.length > 0))];
  for (const url of deduped) {
    if (!isAllowedPublicImageUrl(url)) {
      return { ok: false, error: ALLOWED_IMAGE_URL_ERROR };
    }
  }
  return { ok: true, value: deduped };
}
