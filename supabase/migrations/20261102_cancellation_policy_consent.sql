-- Cancellation policy consent: when the guest agreed and which policy version they saw
alter table public.reservation_requests
  add column if not exists cancellation_policy_agreed_at timestamptz,
  add column if not exists cancellation_policy_version text;
