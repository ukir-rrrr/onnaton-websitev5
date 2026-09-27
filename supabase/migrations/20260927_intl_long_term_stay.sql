-- Overseas reservation: guest lives in / is staying long-term in Okinawa (trip dates optional)
alter table public.reservation_requests
  add column if not exists okinawa_long_term_stay boolean not null default false;
