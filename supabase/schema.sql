-- Run in Supabase Dashboard → SQL Editor (once per project).
-- Multi-tenant: one Supabase project, many restaurant sites.

create extension if not exists "pgcrypto";

create table if not exists public.sites (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  sort_order smallint not null default 0 check (sort_order between 0 and 2),
  enabled boolean not null default false,
  body_en text not null default '',
  body_ja text not null default '',
  visible_until date,
  updated_at timestamptz not null default now(),
  unique (site_id, sort_order)
);

create table if not exists public.reservation_requests (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  reference text not null unique,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled')),
  name text not null,
  email text not null,
  phone_country text,
  phone_country_code text,
  phone_national text,
  country text not null,
  date_preference_1 date not null,
  date_preference_2 date,
  date_preference_3 date,
  adults smallint not null check (adults > 0),
  age_0_5 smallint not null default 0 check (age_0_5 >= 0),
  age_6_12 smallint not null default 0 check (age_6_12 >= 0),
  age_13_19 smallint not null default 0 check (age_13_19 >= 0),
  children smallint not null default 0 check (children >= 0),
  referral_source text,
  notes text,
  locale text,
  agreed_at timestamptz not null,
  created_at timestamptz not null default now()
);

create table if not exists public.reservation_date_overrides (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  date date not null,
  status text not null check (status in ('open', 'closed')),
  updated_at timestamptz not null default now(),
  unique (site_id, date)
);

create index if not exists notices_site_id_idx on public.notices (site_id);
create index if not exists reservation_requests_site_id_idx on public.reservation_requests (site_id);
create index if not exists reservation_requests_created_at_idx on public.reservation_requests (created_at desc);
create index if not exists reservation_date_overrides_site_date_idx
  on public.reservation_date_overrides (site_id, date);

-- Rate limiting (service role only; no public access)
create table if not exists public.rate_limits (
  bucket_key text primary key,
  attempt_count int not null default 0,
  window_start timestamptz not null default now(),
  locked_until timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists rate_limits_locked_until_idx on public.rate_limits (locked_until)
  where locked_until is not null;

-- Seed: 恩納豚 (safe to re-run)
insert into public.sites (slug, name)
values ('onnaton', '恩納豚')
on conflict (slug) do nothing;

insert into public.notices (site_id, sort_order, enabled, body_en, body_ja)
select s.id, gs.sort_order, false, '', ''
from public.sites s
cross join generate_series(0, 2) as gs (sort_order)
where s.slug = 'onnaton'
on conflict (site_id, sort_order) do nothing;

-- RLS: enabled for future client-side reads; server uses service role today.
alter table public.sites enable row level security;
alter table public.notices enable row level security;
alter table public.reservation_requests enable row level security;
alter table public.reservation_date_overrides enable row level security;

create policy "Public read sites"
  on public.sites for select
  to anon, authenticated
  using (true);

create policy "Public read active notices"
  on public.notices for select
  to anon, authenticated
  using (
    enabled
    and (body_en <> '' or body_ja <> '')
    and (visible_until is null or visible_until >= current_date)
  );

-- Reservations are inserted only via Server Actions (service role).
-- Do not allow anon insert (NEXT_PUBLIC_SUPABASE_ANON_KEY is exposed in the browser).
drop policy if exists "Public insert reservation requests" on public.reservation_requests;
