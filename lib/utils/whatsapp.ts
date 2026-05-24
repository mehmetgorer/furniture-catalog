/**
 * Build safe `tel:` / WhatsApp chat URLs from raw site_settings values.
 */

function digitsOnly(input: string): string | null {
  const d = input.replace(/\D/g, "");
  return d.length > 0 ? d : null;
}

export function getWhatsAppChatUrl(whatsapp: string | null | undefined): string | null {
  const raw = whatsapp?.trim();
  if (!raw) return null;

  if (/^https?:\/\//i.test(raw)) {
    try {
      const u = new URL(raw);
      const host = u.hostname.toLowerCase();
      if (host.includes("wa.me") || host.includes("whatsapp.com")) {
        return u.toString();
      }
    } catch {
      return null;
    }
    return raw;
  }

  const d = digitsOnly(raw);
  if (!d) return null;
  return `https://wa.me/${d}`;
}

export function getTelHref(phone: string | null | undefined): string | null {
  const raw = phone?.trim();
  if (!raw) return null;
  const cleaned = raw.replace(/[^\d+]/g, "");
  if (!cleaned || cleaned === "+") return null;
  return `tel:${cleaned}`;
}

export function getMailtoHref(email: string | null | undefined): string | null {
  const raw = email?.trim();
  if (!raw || !raw.includes("@")) return null;
  return `mailto:${raw}`;
}

/** Returns `src` for an iframe when the URL is a simple embed-style maps URL; otherwise null (use link only). */
export function getMapEmbedSrc(mapUrl: string | null | undefined): string | null {
  const raw = mapUrl?.trim();
  if (!raw) return null;
  const lower = raw.toLowerCase();
  if (lower.includes("/maps/embed") || lower.includes("maps/embed?")) {
    return raw;
  }
  if (lower.includes("google.") && lower.includes("output=embed")) {
    return raw;
  }
  return null;
}
