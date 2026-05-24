# Furniture Catalog

Çok dilli mobilya katalog ve showroom sitesi ile özel yönetim paneli. Ziyaretçiler ürünleri inceler ve işletmeyle iletişime geçer; bu proje **online mağaza değildir**.

**English:** [README (English)](#english)

---

## İçindekiler

- [Furniture Catalog](#furniture-catalog)
  - [İçindekiler](#i̇çindekiler)
  - [Özellikler](#özellikler)
  - [Dahil Değildir](#dahil-değildir)
  - [Teknoloji](#teknoloji)
  - [Yerel Kurulum](#yerel-kurulum)
  - [Ortam Değişkenleri](#ortam-değişkenleri)
  - [Supabase Kurulumu](#supabase-kurulumu)
  - [Yönetim Paneli](#yönetim-paneli)
  - [Admin Şifre Sıfırlama](#admin-şifre-sıfırlama)
  - [İçerik Yönetimi Notları](#i̇çerik-yönetimi-notları)
  - [Vercel'e Yayın](#vercele-yayın)
  - [Son Kontrol](#son-kontrol)
  - [Depo Yapısı](#depo-yapısı)
- [Furniture Catalog (English)](#furniture-catalog-english)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Not Included](#not-included)
  - [Tech Stack](#tech-stack)
  - [Local Setup](#local-setup)
  - [Environment Variables](#environment-variables)
  - [Supabase Setup](#supabase-setup)
  - [Admin Panel](#admin-panel)
  - [Admin Password Reset](#admin-password-reset)
  - [Content Management Notes](#content-management-notes)
  - [Deploy on Vercel](#deploy-on-vercel)
  - [Final Check](#final-check)
  - [Repository Layout](#repository-layout)

## Özellikler

**Herkese açık site (Türkçe, İngilizce, Arapça)**

- Ana sayfa hero slider
- Ürün kategorileri ve filtreli ürün listesi
- Görsel galerili ürün detay sayfaları
- Birden fazla görselde kart önizleme carousel
- İsteğe bağlı fiyat gösterimi ve basit stok durumu (stokta, stokta yok, sipariş üzerine)
- Site ayarlarından beslenen hakkımızda ve iletişim sayfaları
- Arapça için RTL düzen

**Yönetim paneli** ([`/admin/login`](#yönetim-paneli), arayüz Türkçe)

- Kategori, ürün, slider ve site ayarları yönetimi
- Supabase Storage üzerinden görsel yükleme
- İçerikleri pasife alma, tekrar aktifleştirme ve kalıcı silme

## Dahil Değildir

Sepet, ödeme, online ödeme, sipariş sistemi, müşteri hesabı, gerçek stok adedi takibi veya indirim/kupon sistemi yoktur.

## Teknoloji

| Katman | Araç |
|--------|------|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS |
| Backend | Supabase Auth, PostgreSQL, Storage, RLS |
| Yayın | Vercel |

## Yerel Kurulum

**Gereksinimler:** Node.js 20+, [pnpm](https://pnpm.io)

```bash
git clone <repo-url>
cd furniture-catalog
pnpm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
```

[`.env.example`](./.env.example) dosyasını kopyalayıp Supabase bilgilerinizi `.env.local` içine yazın:

```bash
pnpm dev
```

Tarayıcı: [http://localhost:3000](http://localhost:3000) → `/tr` yönlendirmesi.

```bash
pnpm lint
pnpm build
```

## Ortam Değişkenleri

Şablon: [`.env.example`](./.env.example)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- Yerelde gerçek değerleri **`.env.local`** içine yazın (bu dosya [`.gitignore`](./.gitignore) ile repoya girmez).
- Canlı ortamda aynı üç değişkeni Vercel **Environment Variables** bölümüne ekleyin.
- `NEXT_PUBLIC_SITE_URL` canlı domain olmalı; sonda `/` olmamalı.
- Bu uygulama **Supabase service role anahtarı gerektirmez**.

## Supabase Kurulumu

1. [supabase.com](https://supabase.com) üzerinde proje oluşturun.
2. Proje URL ve **publishable (anon)** anahtarını `.env.local` dosyasına kopyalayın.
3. **SQL Editor**’da [`supabase/schema.sql`](./supabase/schema.sql) dosyasının tamamını çalıştırın.
4. İsteğe bağlı demo veri: [`supabase/seed.sql`](./supabase/seed.sql) (admin kullanıcı **oluşturmaz**).
5. **Storage** → `website-images` bucket’ının var olduğunu doğrulayın (şema ile oluşur).
6. **Authentication → Users** → admin kullanıcı oluşturun (e-posta + şifre).
7. Kullanıcı UUID’sini kopyalayıp çalıştırın:

```sql
insert into public.admin_profiles (id, email, role)
values (
  'AUTH_USER_ID_HERE',
  'admin@example.com',
  'admin'
)
on conflict (id) do update set
  email = excluded.email,
  role = excluded.role;
```

Ardından `/admin/login` adresinden giriş yapın.

## Yönetim Paneli

| Adres | Açıklama |
|-------|----------|
| `/admin/login` | Giriş |
| `/admin/dashboard` | Panel özeti |
| `/admin/categories` | Kategoriler |
| `/admin/products` | Ürünler |
| `/admin/hero-slides` | Slider görselleri |
| `/admin/site-settings` | Site ayarları |

Pasif içerikler admin listelerinde kalır, vitrin sitesinde görünmez. Kalıcı silme yalnızca veritabanı satırını kaldırır; yüklenen dosyalar Supabase Storage’da kalabilir.

Ürün fiyatı ve stok alanları yalnızca **vitrin bilgisidir**; sipariş veya stok takibi değildir.

## Admin Şifre Sıfırlama

Panel içinde “şifremi unuttum” ekranı **yoktur**.

1. **Supabase Dashboard** → **Authentication → Users**
2. Mevcut kullanıcının şifresini güncelleyin veya yeni auth kullanıcısı oluşturun
3. Yeni kullanıcı için UUID’yi kopyalayıp yukarıdaki `admin_profiles` SQL’ini çalıştırın
4. `/admin/login` üzerinden tekrar giriş yapın

Güçlü şifre ve Supabase hesabında **2FA** önerilir.

## İçerik Yönetimi Notları

- Ana içerik dili **Türkçe**; EN/AR boşsa vitrinde TR metin gösterilebilir.
- Slider için net, **yatay** görseller kullanın.
- Ürün başına genelde **2–5 görsel** yeterlidir.
- URL yapıştırmak yerine paneldeki **yükleme** butonlarını tercih edin.
- Hatalı görsel adresi siteyi çökertmez; yedek görünüm gösterilir.

## Vercel'e Yayın

1. Bu repoyu GitHub’a push edin.
2. [Vercel](https://vercel.com) → **Add New → Project** → repoyu import edin.
3. Ortam değişkenlerini girin: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`
4. **Install command:** `pnpm install`
5. **Build command:** `pnpm build`
6. Deploy sonrası canlı URL ile [Son Kontrol](#son-kontrol) maddelerini tekrarlayın.

## Son Kontrol

- [ ] `/` → `/tr`
- [ ] `/tr`, `/en`, `/ar` (`/ar` RTL)
- [ ] `/tr/products` ve en az bir ürün detayı
- [ ] `/tr/about`, `/tr/contact`
- [ ] `/admin/login` ve admin girişi
- [ ] Kategori, ürün, slider, site ayarları kaydı
- [ ] Panelden en az bir görsel yükleme
- [ ] `pnpm lint` ve `pnpm build` hatasız

## Depo Yapısı

| Yol | Açıklama |
|-----|----------|
| [`app/[locale]/`](./app/%5Blocale%5D/) | Halka açık sayfalar |
| [`app/admin/`](./app/admin/) | Yönetim paneli |
| [`supabase/schema.sql`](./supabase/schema.sql) | Veritabanı şeması ve RLS |
| [`supabase/seed.sql`](./supabase/seed.sql) | Örnek demo verisi |
| [`.env.example`](./.env.example) | Ortam değişkeni şablonu |

---

<a id="english"></a>

# Furniture Catalog (English)

Multilingual furniture catalog and showroom website with a custom admin panel. Visitors browse products and contact the business; this is **not** an online store.

**Türkçe:** [README (Türkçe)](#furniture-catalog)

---

## Table of Contents

- [Furniture Catalog](#furniture-catalog)
  - [İçindekiler](#i̇çindekiler)
  - [Özellikler](#özellikler)
  - [Dahil Değildir](#dahil-değildir)
  - [Teknoloji](#teknoloji)
  - [Yerel Kurulum](#yerel-kurulum)
  - [Ortam Değişkenleri](#ortam-değişkenleri)
  - [Supabase Kurulumu](#supabase-kurulumu)
  - [Yönetim Paneli](#yönetim-paneli)
  - [Admin Şifre Sıfırlama](#admin-şifre-sıfırlama)
  - [İçerik Yönetimi Notları](#i̇çerik-yönetimi-notları)
  - [Vercel'e Yayın](#vercele-yayın)
  - [Son Kontrol](#son-kontrol)
  - [Depo Yapısı](#depo-yapısı)
- [Furniture Catalog (English)](#furniture-catalog-english)
  - [Table of Contents](#table-of-contents)
  - [Features](#features)
  - [Not Included](#not-included)
  - [Tech Stack](#tech-stack)
  - [Local Setup](#local-setup)
  - [Environment Variables](#environment-variables)
  - [Supabase Setup](#supabase-setup)
  - [Admin Panel](#admin-panel)
  - [Admin Password Reset](#admin-password-reset)
  - [Content Management Notes](#content-management-notes)
  - [Deploy on Vercel](#deploy-on-vercel)
  - [Final Check](#final-check)
  - [Repository Layout](#repository-layout)

## Features

**Public site (Turkish, English, Arabic)**

- Homepage hero slider
- Product categories and filtered product listing
- Product detail pages with image gallery
- Card image carousel for multiple product images
- Optional price display and simple stock status (in stock, out of stock, made to order)
- About and contact pages from site settings
- RTL layout for Arabic

**Admin panel** ([`/admin/login`](#admin-panel), Turkish UI)

- Category, product, slider, and site settings management
- Image upload via Supabase Storage
- Deactivate, reactivate, and permanent delete for content

## Not Included

No shopping cart, checkout, online payment, order system, customer accounts, real stock quantity tracking, or discount/coupon system.

## Tech Stack

| Layer | Tools |
|-------|-------|
| Frontend | Next.js (App Router), TypeScript, Tailwind CSS |
| Backend | Supabase Auth, PostgreSQL, Storage, RLS |
| Hosting | Vercel |

## Local Setup

**Requirements:** Node.js 20+, [pnpm](https://pnpm.io)

```bash
git clone <repo-url>
cd furniture-catalog
pnpm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
```

Copy [`.env.example`](./.env.example) to `.env.local` and add your Supabase values:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) (redirects to `/tr`).

```bash
pnpm lint
pnpm build
```

## Environment Variables

Template: [`.env.example`](./.env.example)

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

- Use real values in **`.env.local`** locally (ignored by [`.gitignore`](./.gitignore)).
- Set the same three variables in Vercel **Environment Variables** for production.
- `NEXT_PUBLIC_SITE_URL` must be your live domain without a trailing slash.
- This app does **not** require a Supabase service role key.

## Supabase Setup

1. Create a project at [supabase.com](https://supabase.com).
2. Copy the project URL and **publishable (anon)** key into `.env.local`.
3. Run the full [`supabase/schema.sql`](./supabase/schema.sql) in **SQL Editor**.
4. Optional demo data: [`supabase/seed.sql`](./supabase/seed.sql) (does **not** create an admin user).
5. Confirm the `website-images` bucket exists under **Storage** (created by the schema).
6. **Authentication → Users** → create an admin user (email + password).
7. Copy the user UUID and run:

```sql
insert into public.admin_profiles (id, email, role)
values (
  'AUTH_USER_ID_HERE',
  'admin@example.com',
  'admin'
)
on conflict (id) do update set
  email = excluded.email,
  role = excluded.role;
```

Sign in at `/admin/login`.

## Admin Panel

| URL | Purpose |
|-----|---------|
| `/admin/login` | Sign in |
| `/admin/dashboard` | Dashboard |
| `/admin/categories` | Categories |
| `/admin/products` | Products |
| `/admin/hero-slides` | Hero slides |
| `/admin/site-settings` | Site settings |

Inactive items stay in admin lists but are hidden on the public site. Permanent delete removes the database row only; uploaded files may remain in Supabase Storage.

Product price and stock fields are **display-only** catalog information, not order or inventory tracking.

## Admin Password Reset

There is **no** in-app “forgot password” screen.

1. **Supabase Dashboard** → **Authentication → Users**
2. Update the existing user’s password or create a new auth user
3. For a new user, copy the UUID and run the `admin_profiles` SQL above
4. Sign in again at `/admin/login`

Use a strong password and enable **2FA** on your Supabase account.

## Content Management Notes

- **Turkish** is the main content language; empty EN/AR fields may fall back to TR on the public site.
- Use clear, **horizontal** images for hero slides.
- **2–5 images** per product is usually enough.
- Prefer **upload** buttons over pasted image URLs.
- Invalid image URLs will not crash the site; a neutral fallback is shown instead.

## Deploy on Vercel

1. Push this repository to GitHub.
2. [Vercel](https://vercel.com) → **Add New → Project** → import the repo.
3. Set: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL`
4. **Install command:** `pnpm install`
5. **Build command:** `pnpm build`
6. After deploy, repeat the [Final Check](#final-check) on the live URL.

## Final Check

- [ ] `/` → `/tr`
- [ ] `/tr`, `/en`, `/ar` (`/ar` RTL)
- [ ] `/tr/products` and at least one product detail page
- [ ] `/tr/about`, `/tr/contact`
- [ ] `/admin/login` and successful admin sign-in
- [ ] Save a category, product, slider slide, and site settings
- [ ] Upload at least one image from the admin panel
- [ ] `pnpm lint` and `pnpm build` pass without errors

## Repository Layout

| Path | Description |
|------|-------------|
| [`app/[locale]/`](./app/%5Blocale%5D/) | Public pages |
| [`app/admin/`](./app/admin/) | Admin panel |
| [`supabase/schema.sql`](./supabase/schema.sql) | Database schema and RLS |
| [`supabase/seed.sql`](./supabase/seed.sql) | Optional demo seed data |
| [`.env.example`](./.env.example) | Environment variable template |
