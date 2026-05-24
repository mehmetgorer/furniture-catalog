# Furniture Catalog

Mobilya firmaları için çok dilli (TR / EN / AR) vitrin sitesi. Ürünler listelenir, detay sayfası vardır, iletişim ve WhatsApp üzerinden talep edilir. Yanında içerik yönetimi için basit bir admin paneli var. **Online mağaza değil** — sepet, ödeme, sipariş yok.

> **English version** — [aşağıda](#english)

## Kullanılan teknolojiler

React tabanlı **Next.js** (App Router) projesi. Arayüz **TypeScript** ve **Tailwind CSS** ile yazıldı. Veritabanı, giriş ve dosya yükleme **Supabase** üzerinde. Canlıya almak için genelde **Vercel** kullanılır.

## Ne var, ne yok?

**Var:** Ana sayfa slider, kategoriler, ürün listesi/detay, çoklu ürün görseli, isteğe bağlı fiyat ve stok metni, hakkımızda/iletişim, admin paneli (kategori, ürün, slider, site ayarları).

**Yok:** Sepet, checkout, ödeme, sipariş, müşteri hesabı, gerçek stok takibi, indirim/kupon.

## Kurulum

Node 20+ ve pnpm lazım.

```bash
git clone <repo-url>
cd furniture-catalog
pnpm install
cp .env.example .env.local
```

Windows’ta `cp` yerine: `copy .env.example .env.local`

`.env.local` içine Supabase bilgilerini yaz, sonra:

```bash
pnpm dev
```

Site `http://localhost:3000` adresinde açılır, `/tr`’ye yönlendirir.

```bash
pnpm lint
pnpm build
```

### Ortam değişkenleri

[`.env.example`](./.env.example) dosyasında üç satır var:

```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`.env.local` repoya gitmesin (zaten `.gitignore`’da). Canlıda aynı değişkenleri Vercel’e gir. Service role key **gerekmez**.

### Supabase tarafı

1. Supabase’te proje aç.
2. SQL Editor’da [`supabase/schema.sql`](./supabase/schema.sql) dosyasını çalıştır.
3. Demo içerik istersen [`supabase/seed.sql`](./supabase/seed.sql) — admin oluşturmaz, onu sen yapacaksın.
4. Storage’da `website-images` bucket’ının oluştuğuna bak.
5. Authentication → Users’dan bir admin kullanıcı ekle.
6. Kullanıcının UUID’sini alıp şunu çalıştır:

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

Panel: **`/admin/login`** (arayüz Türkçe).

## Site sahibi / admin için kısa notlar

- İçerik formlarında Türkçe ana dil; EN/AR boş kalırsa sitede Türkçe görünür.
- Pasife alınan kayıt admin’de durur, sitede görünmez.
- Görselleri mümkünse yükleme butonuyla ekle; URL yapıştırmak daha riskli.
- Fiyat ve stok alanları sadece vitrin bilgisi, sipariş sistemi değil.

**Şifre unutulursa:** Panelde sıfırlama ekranı yok. Supabase Dashboard → Authentication → Users’dan şifreyi güncelle veya yeni kullanıcı açıp yukarıdaki SQL ile `admin_profiles` satırını ekle.

## Vercel’e atmak

Repoyu GitHub’a push et, Vercel’den import et. Build: `pnpm build`, install: `pnpm install`. Üç env değişkenini production’a yaz. Deploy sonrası `/tr`, `/admin/login` ve bir kayıt kaydetmeyi dene.

---

<a id="english"></a>

## English

Same project — multilingual (TR / EN / AR) furniture showroom site with an admin panel. Browse products, contact the business. **Not an e-commerce store** — no cart, checkout, or orders.

### Stack

**React** + **Next.js** (App Router), **TypeScript**, **Tailwind CSS**, **Supabase** (auth, database, storage), typically deployed on **Vercel**.

### Setup

```bash
git clone <repo-url>
cd furniture-catalog
pnpm install
cp .env.example .env.local   # Windows: copy .env.example .env.local
```

Fill in [`.env.example`](./.env.example) values in `.env.local`, then `pnpm dev`. App runs at `http://localhost:3000` → `/tr`.

Run [`supabase/schema.sql`](./supabase/schema.sql) in Supabase SQL Editor. Optional demo: [`supabase/seed.sql`](./supabase/seed.sql).

Create a user under Authentication → Users, then:

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

Admin panel: **`/admin/login`**.

No in-app password reset — use Supabase Dashboard → Authentication → Users.

For production, set the three `NEXT_PUBLIC_*` env vars on Vercel. Do not commit `.env.local`. No service role key needed.

[↑ Türkçe](#furniture-catalog)
