-- Overseas reservation: Okinawa arrival and return dates
alter table public.reservation_requests
  add column if not exists okinawa_arrival_date date,
  add column if not exists okinawa_return_date date;
