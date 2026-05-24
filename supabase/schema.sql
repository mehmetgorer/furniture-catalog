-- Furniture Catalog (MVP) Supabase schema
-- Safe to run on a fresh project (no destructive table drops).

-- Required for gen_random_uuid()
create extension if not exists pgcrypto;

-- updated_at trigger helper
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Tables
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  image_url text,
  is_active boolean default true,
  sort_order integer default 0,
  name_tr text not null,
  name_en text,
  name_ar text,
  description_tr text,
  description_en text,
  description_ar text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  category_id uuid references public.categories(id) on delete set null,
  slug text unique not null,
  product_code text,
  image_urls text[] default '{}'::text[],
  is_active boolean default true,
  is_featured boolean default false,
  sort_order integer default 0,
  title_tr text not null,
  title_en text,
  title_ar text,
  description_tr text,
  description_en text,
  description_ar text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.hero_slides (
  id uuid primary key default gen_random_uuid(),
  image_url text not null,
  link_url text,
  is_active boolean default true,
  sort_order integer default 0,
  title_tr text not null,
  title_en text,
  title_ar text,
  description_tr text,
  description_en text,
  description_ar text,
  button_text_tr text,
  button_text_en text,
  button_text_ar text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.site_settings (
  id uuid primary key default gen_random_uuid(),
  logo_text text,
  logo_url text,
  phone text,
  whatsapp text,
  email text,
  instagram_url text,
  facebook_url text,
  map_url text,
  address_tr text,
  address_en text,
  address_ar text,
  about_tr text,
  about_en text,
  about_ar text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role text default 'admin',
  created_at timestamptz default now()
);

-- Indexes
create index if not exists products_category_id_idx on public.products(category_id);
create index if not exists products_slug_idx on public.products(slug);
create index if not exists products_is_active_idx on public.products(is_active);
create index if not exists products_is_featured_idx on public.products(is_featured);

-- Product catalog price / stock display (idempotent migration for existing projects)
alter table public.products
add column if not exists price_amount numeric(12,2);

alter table public.products
add column if not exists price_currency text not null default 'TRY';

alter table public.products
add column if not exists show_price boolean not null default true;

alter table public.products
add column if not exists stock_status text not null default 'in_stock';

alter table public.products
add column if not exists show_stock boolean not null default false;

do $$
begin
  alter table public.products
    add constraint products_price_amount_nonneg
    check (price_amount is null or price_amount >= 0);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.products
    add constraint products_price_currency_allowed
    check (price_currency in ('TRY', 'USD', 'EUR'));
exception
  when duplicate_object then null;
end $$;

do $$
begin
  alter table public.products
    add constraint products_stock_status_allowed
    check (stock_status in ('in_stock', 'out_of_stock', 'made_to_order'));
exception
  when duplicate_object then null;
end $$;

create index if not exists categories_slug_idx on public.categories(slug);
create index if not exists categories_is_active_idx on public.categories(is_active);

create index if not exists hero_slides_is_active_idx on public.hero_slides(is_active);

-- Triggers (updated_at)
drop trigger if exists set_updated_at_categories on public.categories;
create trigger set_updated_at_categories
before update on public.categories
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_products on public.products;
create trigger set_updated_at_products
before update on public.products
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_hero_slides on public.hero_slides;
create trigger set_updated_at_hero_slides
before update on public.hero_slides
for each row execute function public.set_updated_at();

drop trigger if exists set_updated_at_site_settings on public.site_settings;
create trigger set_updated_at_site_settings
before update on public.site_settings
for each row execute function public.set_updated_at();

-- RLS
alter table public.categories enable row level security;
alter table public.products enable row level security;
alter table public.hero_slides enable row level security;
alter table public.site_settings enable row level security;
alter table public.admin_profiles enable row level security;

-- Public read policies
drop policy if exists "public_select_active_categories" on public.categories;
create policy "public_select_active_categories"
on public.categories
for select
to anon, authenticated
using (is_active = true);

-- Admins can list all categories (including inactive) for the admin UI.
-- OR-combined with public_select_active_categories for authenticated admins.
drop policy if exists "admin_select_all_categories" on public.categories;
create policy "admin_select_all_categories"
on public.categories
for select
to authenticated
using (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

drop policy if exists "public_select_active_products" on public.products;
create policy "public_select_active_products"
on public.products
for select
to anon, authenticated
using (is_active = true);

-- Admins can list all products (including inactive) for the admin UI.
drop policy if exists "admin_select_all_products" on public.products;
create policy "admin_select_all_products"
on public.products
for select
to authenticated
using (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

drop policy if exists "public_select_active_hero_slides" on public.hero_slides;
create policy "public_select_active_hero_slides"
on public.hero_slides
for select
to anon, authenticated
using (is_active = true);

-- Admins can list all hero slides (including inactive) for the admin UI.
drop policy if exists "admin_select_all_hero_slides" on public.hero_slides;
create policy "admin_select_all_hero_slides"
on public.hero_slides
for select
to authenticated
using (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

drop policy if exists "public_select_site_settings" on public.site_settings;
create policy "public_select_site_settings"
on public.site_settings
for select
to anon, authenticated
using (true);

-- Explicit admin SELECT (redundant with public `using (true)` but keeps policy set consistent for tightening later).
drop policy if exists "admin_select_site_settings" on public.site_settings;
create policy "admin_select_site_settings"
on public.site_settings
for select
to authenticated
using (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

-- Helper condition for admin write policies:
-- exists (
--   select 1 from public.admin_profiles
--   where public.admin_profiles.id = auth.uid()
--   and public.admin_profiles.role = 'admin'
-- )

-- Admin write policies
drop policy if exists "admin_insert_categories" on public.categories;
create policy "admin_insert_categories"
on public.categories
for insert
to authenticated
with check (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

drop policy if exists "admin_update_categories" on public.categories;
create policy "admin_update_categories"
on public.categories
for update
to authenticated
using (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

drop policy if exists "admin_delete_categories" on public.categories;
create policy "admin_delete_categories"
on public.categories
for delete
to authenticated
using (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

drop policy if exists "admin_insert_products" on public.products;
create policy "admin_insert_products"
on public.products
for insert
to authenticated
with check (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

drop policy if exists "admin_update_products" on public.products;
create policy "admin_update_products"
on public.products
for update
to authenticated
using (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

drop policy if exists "admin_delete_products" on public.products;
create policy "admin_delete_products"
on public.products
for delete
to authenticated
using (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

drop policy if exists "admin_insert_hero_slides" on public.hero_slides;
create policy "admin_insert_hero_slides"
on public.hero_slides
for insert
to authenticated
with check (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

drop policy if exists "admin_update_hero_slides" on public.hero_slides;
create policy "admin_update_hero_slides"
on public.hero_slides
for update
to authenticated
using (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

drop policy if exists "admin_delete_hero_slides" on public.hero_slides;
create policy "admin_delete_hero_slides"
on public.hero_slides
for delete
to authenticated
using (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

drop policy if exists "admin_insert_site_settings" on public.site_settings;
create policy "admin_insert_site_settings"
on public.site_settings
for insert
to authenticated
with check (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

drop policy if exists "admin_update_site_settings" on public.site_settings;
create policy "admin_update_site_settings"
on public.site_settings
for update
to authenticated
using (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
)
with check (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

drop policy if exists "admin_delete_site_settings" on public.site_settings;
create policy "admin_delete_site_settings"
on public.site_settings
for delete
to authenticated
using (
  exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

-- admin_profiles policies
-- MVP: no admin list/management via RLS. Authenticated users may only read their own row.
-- We intentionally avoid a "select all admin_profiles for admins" policy: it would query
-- admin_profiles inside a policy on admin_profiles and can cause recursive RLS evaluation.
-- Admin INSERT/UPDATE/DELETE on categories/products/hero_slides/site_settings still work:
-- each policy's EXISTS subquery selects the current user's own admin_profiles row
-- (id = auth.uid()), which is allowed by users_select_own_admin_profile below.
drop policy if exists "users_select_own_admin_profile" on public.admin_profiles;
create policy "users_select_own_admin_profile"
on public.admin_profiles
for select
to authenticated
using (id = auth.uid());

-- Remove legacy policy if re-running this file (was self-referential on admin_profiles).
drop policy if exists "admins_select_all_admin_profiles" on public.admin_profiles;

-- NOTE: Granting/revoking admin access is manual (SQL or dashboard tooling). There is no admin_profiles
-- management UI in this MVP — intentionally no policy that lets admins SELECT all admin_profiles rows
-- (would be self-referential on this table and risks recursive RLS).

-- Storage (bucket + policies)
-- This creates a public bucket for easy image display in the MVP.
insert into storage.buckets (id, name, public)
values ('website-images', 'website-images', true)
on conflict (id) do update set public = excluded.public;

-- Public read for images
drop policy if exists "public_read_website_images" on storage.objects;
create policy "public_read_website_images"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'website-images');

-- Admin write for images (upload/update/delete)
drop policy if exists "admin_write_website_images" on storage.objects;
create policy "admin_write_website_images"
on storage.objects
for all
to authenticated
using (
  bucket_id = 'website-images'
  and exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
)
with check (
  bucket_id = 'website-images'
  and exists (
    select 1 from public.admin_profiles
    where public.admin_profiles.id = auth.uid()
    and public.admin_profiles.role = 'admin'
  )
);

