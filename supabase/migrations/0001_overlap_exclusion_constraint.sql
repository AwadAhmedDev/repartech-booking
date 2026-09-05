-- Blocker 3 (pre-delivery review) — prevent overlapping appointments at the
-- database level, regardless of which code path performs the insert.
--
-- Verified before writing this migration: public.appointments has 0 rows in
-- production and no unique index beyond the primary key (the
-- appointments_unique_slot index documented in schema.sql was never actually
-- applied) — so there is no pre-existing conflicting data to reconcile.
--
-- ROLLBACK:
--   alter table public.appointments drop constraint if exists appointments_no_overlap;
--   alter table public.appointments drop column if exists starts_at;
--   alter table public.appointments drop column if exists ends_at;
--   -- (leave the btree_gist extension installed; dropping it is unnecessary
--   -- and can fail if anything else depends on it)

create extension if not exists btree_gist;

alter table public.appointments
  add column if not exists starts_at timestamptz
    generated always as (
      (appointment_date::timestamp + start_time) at time zone 'Europe/Paris'
    ) stored,
  add column if not exists ends_at timestamptz
    generated always as (
      (appointment_date::timestamp + end_time) at time zone 'Europe/Paris'
    ) stored;

alter table public.appointments
  add constraint appointments_no_overlap
  exclude using gist (
    tstzrange(starts_at, ends_at) with &&
  ) where (status <> 'cancelled');

-- Defensive no-op: the index documented in schema.sql was never applied to
-- this database, but drop it if present in any other environment that ran
-- the original schema.sql as-is.
drop index if exists appointments_unique_slot;
