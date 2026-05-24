/** Stable string for controlled text/url/hidden inputs (never undefined/null). */
export function inputString(value: string | null | undefined): string {
  return value == null ? "" : String(value);
}

/** Stable string for controlled number inputs bound as text/number fields. */
export function inputNumberString(value: number | null | undefined, fallback = 0): string {
  if (value == null || Number.isNaN(value)) {
    return String(fallback);
  }
  return String(value);
}
