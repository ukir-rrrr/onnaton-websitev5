-- Overseas reservation: guest accommodation for travel-time guidance
alter table public.reservation_requests
  add column if not exists accommodation text,
  add column if not exists accommodation_address text;
