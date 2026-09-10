create table if not exists public.products (
  id text primary key,
  name text not null,
  category text not null default 'Lainnya',
  description text not null default '',
  caliber text not null default '-',
  length text not null default '-',
  weight text not null default '-',
  price_old numeric not null default 0,
  price numeric not null default 0,
  discount boolean not null default false,
  featured boolean not null default false,
  image text,
  created_at timestamptz not null default now()
);

create table if not exists public.settings (
  id integer primary key default 1 check (id = 1),
  whatsapp text not null default '6282178496326',
  phone text not null default '0821-7849-6326',
  email text not null default 'dpssport.id@gmail.com',
  instagram text not null default '@dps.sport',
  youtube text not null default 'https://www.youtube.com/@DwiPrast177',
  description text not null default 'Dps Sport adalah toko spesialis airgun dan sparepart.'
);

insert into public.settings (id)
values (1)
on conflict (id) do nothing;

alter table public.products enable row level security;
alter table public.settings enable row level security;

create policy "Public can read products"
  on public.products for select
  using (true);

create policy "Public can read settings"
  on public.settings for select
  using (true);

insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

insert into public.products
  (id, name, category, description, caliber, length, weight, price_old, price, discount, featured, image)
values
  ('p1', 'Predator OD 38', 'Senapan PCP', '', '4.5 mm', '100 cm', '3.2 kg', 1900000, 1800000, true, true, null),
  ('p2', 'Mauser M18', 'Senapan Per', '', '4.5 mm', '108 cm', '3.4 kg', 2200000, 2000000, true, true, null),
  ('p3', 'Black Army Magnum', 'Senapan PCP', '', '4.5 mm', '102 cm', '3.1 kg', 2100000, 1950000, true, true, null),
  ('p4', 'Sharp River', 'Senapan Angin', '', '4.5 mm', '105 cm', '3.0 kg', 1750000, 1600000, true, true, null),
  ('p5', 'Bullpup 500CC', 'Senapan PCP', '', '4.5 mm', '90 cm', '3.3 kg', 2300000, 2100000, true, true, null),
  ('p6', 'Tactical X9', 'Senapan PCP', '', '4.5 mm', '103 cm', '3.6 kg', 2400000, 2200000, true, true, null),
  ('p7', 'Scope Hunter 3-9x40', 'Aksesoris', '', '-', '32 cm', '0.5 kg', 650000, 580000, true, false, null),
  ('p8', 'Silincer Alumunium', 'Sparepart', '', '-', '18 cm', '0.2 kg', 250000, 220000, true, false, null)
on conflict (id) do nothing;
