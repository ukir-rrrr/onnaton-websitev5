-- Run once in Supabase SQL Editor on existing projects.
-- Extra-open (Tue/Wed) and extra-closed (regular days) for the booking calendar.

create table if not exists public.reservation_date_overrides (
  id uuid primary key default gen_random_uuid(),
  site_id uuid not null references public.sites (id) on delete cascade,
  date date not null,
  status text not null check (status in ('open', 'closed')),
  updated_at timestamptz not null default now(),
  unique (site_id, date)
);

create index if not exists reservation_date_overrides_site_date_idx
  on public.reservation_date_overrides (site_id, date);

alter table public.reservation_date_overrides enable row level security;
