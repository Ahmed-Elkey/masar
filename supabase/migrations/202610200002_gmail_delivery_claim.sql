-- SMTP does not provide idempotency guarantees. Reserve the notification once
-- before network I/O. An uncertain send remains in the inbox for owner review.
alter table public.messages add column if not exists notification_attempted_at timestamptz;
