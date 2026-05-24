# Furniture Catalog

Çok dilli mobilya katalog ve showroom sitesi ile özel yönetim paneli. Ziyaretçiler ürünleri inceler ve işletmeyle iletişime geçer; bu proje online mağaza değildir.

## Özellikler

**Herkese açık site (Türkçe, İngilizce, Arapça)**

- Ana sayfa hero slider
- Ürün kategorileri ve filtreli ürün listesi
- Görsel galerili ürün detay sayfaları
- Birden fazla görselde kart önizleme carousel
- İsteğe bağlı fiyat gösterimi ve basit stok durumu (stokta, stokta yok, sipariş üzerine)
- Site ayarlarından beslenen hakkımızda ve iletişim sayfaları
- Arapça için RTL düzen

**Yönetim paneli** (`/admin/login`, arayüz Türkçe)

- Kategori, ürün, slider ve site ayarları yönetimi
- Supabase Storage üzerinden görsel yükleme
- İçerikleri pasife alma, tekrar aktifleştirme ve kalıcı silme

## Dahil Değildir

Sepet, ödeme, online ödeme, sipariş sistemi, müşteri hesabı, gerçek stok adedi takibi veya indirim/kupon sistemi yoktur.

## Teknoloji

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Supabase Auth, PostgreSQL, Storage ve Row Level Security
- Vercel (yayın için tipik seçenek)

## Yerel Kurulum

Node.js 20+ ve [pnpm](https://pnpm.io) gerekir.

```bash
pnpm install
cp .env.example .env.local
```

Supabase bilgilerinizi `.env.local` dosyasına yazın, ardından:

```bash
pnpm dev
```

[http://localhost:3000](http://localhost:3000) adresini açın (`/tr` yönlendirmesi yapılır).

Diğer komutlar:

```bash
pnpm lint
pnpm build
```

## Ortam Değişkenleri

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

Yerelde gerçek değerleri `.env.local` içine yazın. Canlı ortamda aynı üç değişkeni Vercel **Environment Variables** bölümüne ekleyin (`NEXT_PUBLIC_SITE_URL` canlı domain olmalı, sonda `/` olmamalı). `.env.local` dosyasını commit etmeyin. Bu uygulama Supabase service role anahtarı gerektirmez.

## Supabase Kurulumu

1. [supabase.com](https://supabase.com) üzerinde proje oluşturun.
2. Proje URL ve **publishable (anon)** anahtarını `.env.local` dosyasına kopyalayın.
3. **SQL Editor**’ı açın ve `supabase/schema.sql` dosyasının tamamını çalıştırın.
4. İsteğe bağlı: örnek kategori, ürün, slider ve site ayarları için `supabase/seed.sql` (admin kullanıcı oluşturmaz).
5. **Storage** altında `website-images` bucket’ının var olduğunu doğrulayın (şema ile oluşur).
6. **Authentication → Users** bölümünden admin kullanıcı oluşturun (e-posta ve şifre).
7. Kullanıcının UUID’sini kopyalayıp şu sorguyu çalıştırın:

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

`/admin/login` adresinden giriş yapın.

## Yönetim Paneli

Panel adresi: **`/admin/login`**

Panelden kategori, ürün, ana sayfa slider görselleri ve site geneli ayarlarını (logo, iletişim, hakkımızda metni) yönetebilirsiniz. Pasif içerikler admin listelerinde kalır, vitrin sitesinde görünmez. Kalıcı silme yalnızca veritabanı satırını kaldırır; yüklenen dosyalar Supabase Storage’da kalabilir.

Ürün fiyatı ve stok alanları yalnızca **vitrin bilgisidir**; sipariş veya stok takibi değildir.

## Admin Şifre Sıfırlama

Bu sürümde panel içinde “şifremi unuttum” ekranı yoktur.

Admin şifresi unutulduysa:

1. Projenin **Supabase Dashboard**’unu açın.
2. **Authentication → Users** bölümüne gidin.
3. Mevcut kullanıcının şifresini güncelleyin/sıfırlayın veya yeni bir auth kullanıcısı oluşturun.
4. Yeni kullanıcı oluşturduysanız kullanıcı id’sini kopyalayıp yukarıdaki SQL ile `public.admin_profiles` satırını `role = 'admin'` olacak şekilde ekleyin veya güncelleyin.
5. `/admin/login` üzerinden tekrar giriş yapın.

Güçlü şifre kullanın. Supabase hesabınızda iki adımlı doğrulama (2FA) açmanız önerilir.

## İçerik Yönetimi Notları

Ana içerik dili Türkçedir. İngilizce veya Arapça alanlar boş bırakılırsa vitrinde Türkçe metin gösterilebilir.

Slider ve hakkımızda için net, yatay görseller kullanın. Ürün başına genelde 2–5 görsel yeterlidir. URL yapıştırmak yerine paneldeki yükleme butonlarını tercih edin. Hatalı görsel adresi siteyi çökertmez; düzeltene kadar nötr bir yedek görünüm olabilir.

## Vercel’e Yayın

1. Depoyu GitHub’a (veya desteklenen başka bir Git sağlayıcısına) gönderin.
2. Vercel’de projeyi Next.js uygulaması olarak **Import** edin.
3. Ortam değişkenlerini ayarlayın: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `NEXT_PUBLIC_SITE_URL` (canlı URL).
4. Install komutu: `pnpm install`
5. Build komutu: `pnpm build`
6. Deploy edin ve canlı adresi açın.
7. Canlı domain üzerinde vitrin sayfalarını ve admin girişini test edin.

## Son Kontrol

Teslim öncesi doğrulayın:

- `/` → `/tr` yönlendirmesi
- `/tr`, `/en`, `/ar` açılıyor (`/ar` RTL)
- `/tr/products` ve en az bir ürün detayı
- `/tr/about` ve `/tr/contact`
- `/admin/login` ve başarılı admin girişi
- Kategori, ürün, slider ve site ayarları kaydı
- Panelden en az bir görsel yükleme
- `pnpm lint` ve `pnpm build` hatasız tamamlanıyor
