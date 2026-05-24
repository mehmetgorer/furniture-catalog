-- Demo seed content (safe-ish to run once).
-- Does NOT create admin users.

-- Stable UUIDs for consistent relations
-- Categories
with cat as (
  insert into public.categories (
    id, slug, image_url, is_active, sort_order,
    name_tr, name_en, name_ar,
    description_tr, description_en, description_ar
  )
  values
    (
      '11111111-1111-1111-1111-111111111111',
      'koltuk-takimlari',
      'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1400&q=80',
      true,
      10,
      'Koltuk Takımları',
      'Sofa Sets',
      'أطقم الأرائك',
      'Konfor ve şıklık bir arada.',
      'Comfort and style together.',
      'راحة وأناقة معًا.'
    ),
    (
      '22222222-2222-2222-2222-222222222222',
      'yatak-odasi',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80',
      true,
      20,
      'Yatak Odası',
      'Bedroom',
      'غرفة النوم',
      'Modern yatak odası çözümleri.',
      'Modern bedroom solutions.',
      'حلول غرف نوم حديثة.'
    ),
    (
      '33333333-3333-3333-3333-333333333333',
      'yemek-odasi',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80',
      true,
      30,
      'Yemek Odası',
      'Dining Room',
      'غرفة الطعام',
      'Aile sofraları için tasarım.',
      'Design for family tables.',
      'تصميم لموائد العائلة.'
    ),
    (
      '44444444-4444-4444-4444-444444444444',
      'tv-uniteleri',
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80',
      true,
      40,
      'TV Üniteleri',
      'TV Units',
      'وحدات التلفاز',
      'Fonksiyonel ve minimal üniteler.',
      'Functional and minimal units.',
      'وحدات عملية وبسيطة.'
    )
  on conflict (slug) do nothing
  returning id
)
select 1;

-- Products
insert into public.products (
  id, category_id, slug, product_code, image_urls,
  is_active, is_featured, sort_order,
  price_amount, price_currency, show_price, stock_status, show_stock,
  title_tr, title_en, title_ar,
  description_tr, description_en, description_ar
)
values
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa1',
    '11111111-1111-1111-1111-111111111111',
    'modern-koltuk-takimi',
    'SOFA-001',
    array['https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1400&q=80'],
    true, true, 10,
    45900, 'TRY', true, 'in_stock', true,
    'Modern Koltuk Takımı',
    'Modern Sofa Set',
    'طقم أرائك حديث',
    'Modern çizgiler, rahat kullanım.',
    'Modern lines, comfortable use.',
    'خطوط عصرية واستخدام مريح.'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa2',
    '44444444-4444-4444-4444-444444444444',
    'minimal-tv-unitesi',
    'TV-010',
    array['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80'],
    true, true, 20,
    18900, 'TRY', true, 'in_stock', false,
    'Minimal TV Ünitesi',
    'Minimal TV Unit',
    'وحدة تلفاز بسيطة',
    'Minimal görünüm, maksimum düzen.',
    'Minimal look, maximum organization.',
    'مظهر بسيط وتنظيم أقصى.'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa3',
    '33333333-3333-3333-3333-333333333333',
    'ahsap-yemek-masasi',
    'DIN-120',
    array['https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80'],
    true, false, 30,
    2200, 'EUR', true, 'made_to_order', true,
    'Ahşap Yemek Masası',
    'Wooden Dining Table',
    'طاولة طعام خشبية',
    'Dayanıklı malzeme, zamansız tasarım.',
    'Durable material, timeless design.',
    'مادة متينة وتصميم خالد.'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa4',
    '22222222-2222-2222-2222-222222222222',
    'konfor-yatak-odasi',
    'BED-200',
    array['https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1400&q=80'],
    true, true, 40,
    null, 'TRY', false, 'in_stock', false,
    'Konfor Yatak Odası',
    'Comfort Bedroom Set',
    'طقم غرفة نوم مريح',
    'Konfor odaklı tasarım.',
    'Comfort-focused design.',
    'تصميم يركز على الراحة.'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa5',
    '11111111-1111-1111-1111-111111111111',
    'berjer-koltuk',
    'SOFA-055',
    array['https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1400&q=80'],
    true, false, 50,
    null, 'TRY', true, 'in_stock', false,
    'Berjer Koltuk',
    'Armchair',
    'كرسي مفرد',
    'Tekli kullanım için şık berjer.',
    'A stylish armchair for single use.',
    'كرسي أنيق للاستخدام الفردي.'
  ),
  (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaa6',
    '33333333-3333-3333-3333-333333333333',
    'orta-sehpa',
    'TAB-030',
    array['https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=1400&q=80'],
    true, false, 60,
    8900, 'TRY', true, 'out_of_stock', true,
    'Orta Sehpa',
    'Coffee Table',
    'طاولة قهوة',
    'Salonlar için kompakt sehpa.',
    'Compact table for living rooms.',
    'طاولة مدمجة لغرف المعيشة.'
  )
on conflict (slug) do nothing;

-- NOTE: hero_slides has no slug; use idempotent insert by id
-- (On conflict by primary key)
insert into public.hero_slides (
  id, image_url, link_url, is_active, sort_order,
  title_tr, title_en, title_ar,
  description_tr, description_en, description_ar,
  button_text_tr, button_text_en, button_text_ar
)
values
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb1',
    'https://images.unsplash.com/photo-1540574163026-643ea20ade25?auto=format&fit=crop&w=1600&q=80',
    '/tr/products',
    true,
    10,
    'Yeni Koleksiyon',
    'New Collection',
    'مجموعة جديدة',
    'Modern çizgiler, güçlü duruş.',
    'Modern lines, strong presence.',
    'خطوط عصرية وحضور قوي.',
    'Ürünleri Gör',
    'View Products',
    'عرض المنتجات'
  ),
  (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbb2',
    'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1600&q=80',
    '/tr/contact',
    true,
    20,
    'Proje Desteği',
    'Project Support',
    'دعم المشاريع',
    'Özel ölçü ve tasarım seçenekleri.',
    'Custom sizing and design options.',
    'خيارات قياس وتصميم مخصص.',
    'Bize Ulaşın',
    'Contact Us',
    'تواصل معنا'
  )
on conflict (id) do nothing;

-- Site settings (single row)
insert into public.site_settings (
  id, logo_text, logo_url,
  phone, whatsapp, email,
  instagram_url, facebook_url, map_url,
  address_tr, address_en, address_ar,
  about_tr, about_en, about_ar
)
values (
  '00000000-0000-0000-0000-000000000001',
  'Mobilya Kataloğu',
  null,
  '+90 (000) 000 00 00',
  '+90 (000) 000 00 00',
  'hello@example.com',
  'https://instagram.com/',
  'https://facebook.com/',
  null,
  'İstanbul, Türkiye',
  'Istanbul, Türkiye',
  'اسطنبول، تركيا',
  'Kaliteli üretim, özel tasarım ve proje desteği.',
  'Quality production, custom design, and project support.',
  'إنتاج عالي الجودة وتصميم مخصص ودعم للمشاريع.'
)
on conflict (id) do update set
  logo_text = excluded.logo_text,
  phone = excluded.phone,
  whatsapp = excluded.whatsapp,
  email = excluded.email,
  instagram_url = excluded.instagram_url,
  facebook_url = excluded.facebook_url,
  map_url = excluded.map_url,
  address_tr = excluded.address_tr,
  address_en = excluded.address_en,
  address_ar = excluded.address_ar,
  about_tr = excluded.about_tr,
  about_en = excluded.about_en,
  about_ar = excluded.about_ar;

