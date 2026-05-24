export type Locale = "tr" | "en" | "ar";

export type Category = {
  id: string;
  slug: string;
  image_url: string | null;
  is_active: boolean;
  sort_order: number;
  name_tr: string;
  name_en: string | null;
  name_ar: string | null;
  description_tr: string | null;
  description_en: string | null;
  description_ar: string | null;
  created_at: string;
  updated_at: string;
};

export type StockStatus = "in_stock" | "out_of_stock" | "made_to_order";

export type Product = {
  id: string;
  category_id: string | null;
  slug: string;
  product_code: string | null;
  image_urls: string[];
  is_active: boolean;
  is_featured: boolean;
  sort_order: number;
  price_amount: number | null;
  price_currency: string;
  show_price: boolean;
  stock_status: StockStatus | string;
  show_stock: boolean;
  title_tr: string;
  title_en: string | null;
  title_ar: string | null;
  description_tr: string | null;
  description_en: string | null;
  description_ar: string | null;
  created_at: string;
  updated_at: string;
};

export type HeroSlide = {
  id: string;
  image_url: string;
  link_url: string | null;
  is_active: boolean;
  sort_order: number;
  title_tr: string;
  title_en: string | null;
  title_ar: string | null;
  description_tr: string | null;
  description_en: string | null;
  description_ar: string | null;
  button_text_tr: string | null;
  button_text_en: string | null;
  button_text_ar: string | null;
  created_at: string;
  updated_at: string;
};

export type SiteSettings = {
  id: string;
  logo_text: string | null;
  logo_url: string | null;
  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  instagram_url: string | null;
  facebook_url: string | null;
  map_url: string | null;
  address_tr: string | null;
  address_en: string | null;
  address_ar: string | null;
  about_tr: string | null;
  about_en: string | null;
  about_ar: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminProfile = {
  id: string;
  email: string;
  role: string;
  created_at: string;
};

