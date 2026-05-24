/**
 * Turkish user-facing copy for the admin panel only (not a full i18n system).
 */

export const ADMIN_ACTION_NOT_ALLOWED = "Bu işlemi yapma yetkiniz yok." as const;

export const ALLOWED_IMAGE_URL_ERROR =
  "Lütfen geçerli bir görsel URL'si girin veya görsel yükleyin.";

export const ALLOWED_IMAGE_URL_HINT =
  "Görsel yüklemek en güvenli yöntemdir. Manuel adresler yalnızca izin verilen kaynaklardan olmalıdır.";

export const IMAGE_REQUIRED_ERROR = "Görsel zorunludur. Görsel yükleyin veya geçerli bir URL yapıştırın.";

export const RLS_ACTION_FAILED =
  "İşlem tamamlanamadı. Yetkinizi kontrol edin veya tekrar giriş yapın.";

export const NO_ROW_UPDATED =
  "Güncelleme yapılamadı. Yönetici olarak giriş yaptığınızdan emin olun.";

export const RECORD_NOT_FOUND = "Kayıt bulunamadı.";

export const CANNOT_DELETE_ACTIVE =
  "Aktif bir kayıt kalıcı olarak silinemez. Önce pasife alın.";

export const TURKISH_NAME_REQUIRED = "Türkçe ad zorunludur.";

export const TURKISH_TITLE_REQUIRED = "Türkçe başlık zorunludur.";

export const SLUG_CATEGORY_ERROR =
  "URL adı küçük harf ve tireli formatta olmalıdır (harf, rakam, tire). Boş bırakırsanız Türkçe addan üretilir; isterseniz elle girin.";

export const SLUG_PRODUCT_ERROR =
  "URL adı küçük harf ve tireli formatta olmalıdır (harf, rakam, tire). Boş bırakırsanız Türkçe başlıktan üretilir; isterseniz elle girin.";

export const SLUG_IN_USE = "Bu URL adı zaten kullanılıyor. Başka bir URL adı seçin.";

export const MISSING_CATEGORY_ID = "Kategori kimliği eksik.";

export const MISSING_PRODUCT_ID = "Ürün kimliği eksik.";

export const MISSING_SLIDE_ID = "Slider kimliği eksik.";

export const PRODUCT_NOT_FOUND = "Ürün bulunamadı veya yüklenemedi.";

export const PRICE_NONNEG_ERROR = "Fiyat 0 veya daha büyük bir sayı olmalıdır.";

export const CURRENCY_ERROR = "Para birimi TRY, USD veya EUR olmalıdır.";

export const STOCK_STATUS_ERROR = "Stok durumu stokta var, stokta yok veya sipariş üzerine olmalıdır.";

export const LINK_URL_DISALLOWED = "Bağlantı URL adresinde izin verilmeyen bir şema kullanıldı.";

export function optionalHttpUrlError(label: string): string {
  return `${label} boş olmalı veya geçerli bir http(s) URL olmalıdır.`;
}

const ENTITY_ACCUSATIVE: Record<string, string> = {
  kategori: "kategoriyi",
  ürün: "ürünü",
  "slider görseli": "slider görselini",
};

export function entityDeactivateButtonLabel(entityLabel: string): string {
  const map: Record<string, string> = {
    kategori: "Kategoriyi Pasife Al",
    ürün: "Ürünü Pasife Al",
    "slider görseli": "Slider Görselini Pasife Al",
  };
  return map[entityLabel] ?? "Pasife Al";
}

export function entityActivateButtonLabel(entityLabel: string): string {
  const map: Record<string, string> = {
    kategori: "Kategoriyi Aktifleştir",
    ürün: "Ürünü Aktifleştir",
    "slider görseli": "Slider Görselini Aktifleştir",
  };
  return map[entityLabel] ?? "Aktifleştir";
}

export function permanentDeleteConfirm(entityLabel: string): string {
  const target = ENTITY_ACCUSATIVE[entityLabel] ?? entityLabel;
  return `Bu ${target} kalıcı olarak silmek istediğinizden emin misiniz? Bu işlem geri alınamaz. Yüklenen görseller dosya depolama alanında kalabilir.`;
}
