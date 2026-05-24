const TR_CHAR_MAP: Record<string, string> = {
  ç: "c",
  Ç: "c",
  ğ: "g",
  Ğ: "g",
  ı: "i",
  İ: "i",
  i: "i",
  I: "i",
  ö: "o",
  Ö: "o",
  ş: "s",
  Ş: "s",
  ü: "u",
  Ü: "u",
};

function transliterateTr(input: string): string {
  return [...input].map((ch) => TR_CHAR_MAP[ch] ?? ch).join("");
}

/**
 * Lowercase kebab-case slug (ASCII). Empty string if nothing usable remains.
 */
export function slugifyToKebab(input: string): string {
  const base = transliterateTr(input.trim().toLocaleLowerCase("tr-TR"));
  const kebab = base
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return kebab;
}

/**
 * If `slugInput` is non-empty after trim, normalize it; otherwise derive from `nameTr`.
 */
export function resolveCategorySlug(nameTr: string, slugInput: string): string {
  const manual = slugInput.trim();
  if (manual.length > 0) {
    return slugifyToKebab(manual);
  }
  return slugifyToKebab(nameTr);
}

/** Same rules as category slug: derive from Turkish title when manual slug is empty. */
export function resolveProductSlug(titleTr: string, slugInput: string): string {
  return resolveCategorySlug(titleTr, slugInput);
}

export function isValidKebabSlug(slug: string): boolean {
  if (!slug || slug.length === 0) return false;
  return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug);
}
