-- RepaTek — Computer Repair & IT Support Booking Platform
-- Run this entire file once in the Supabase SQL editor for a fresh project.
--
-- This matches the live schema exactly — column names below are
-- authoritative for the application code (src/types/database.ts,
-- src/lib/api.ts, src/lib/availability.ts). Do not rename them.

create extension if not exists "pgcrypto";

-- =========================================================
-- TABLES
-- =========================================================

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text not null default '',
  duration_minutes integer not null default 60,
  price numeric(10, 2) not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.appointments (
  id uuid primary key default gen_random_uuid(),
  service_id uuid not null references public.services(id) on delete restrict,
  full_name text not null,
  email text not null,
  phone text not null,
  notes text,
  appointment_date date not null,
  start_time time not null,
  end_time time not null,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz not null default now()
);

create table if not exists public.business_hours (
  id uuid primary key default gen_random_uuid(),
  weekday integer not null unique check (weekday between 0 and 6),
  is_open boolean not null default true,
  start_time time,
  end_time time
);

create table if not exists public.blocked_dates (
  id uuid primary key default gen_random_uuid(),
  blocked_date date not null unique,
  reason text,
  created_at timestamptz not null default now()
);

create table if not exists public.business_settings (
  id uuid primary key default gen_random_uuid(),
  business_name text not null default 'RepaTek',
  business_email text not null default 'support@repatek.fr',
  business_phone text not null default '(555) 010-2040',
  business_address text not null default '480 Harbor Tech Plaza, Suite 220, Seattle, WA',
  slot_interval_minutes integer not null default 30,
  booking_notice_hours integer not null default 4,
  created_at timestamptz not null default now()
);

create table if not exists public.admin_users (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- =========================================================
-- INDEXES
-- =========================================================

-- Prevents two non-cancelled appointments from sharing the same date and
-- start time, catching concurrent double-bookings at the database level.
-- The application code surfaces a user-friendly "slot taken" message on
-- the unique violation error code (23505).
create unique index if not exists appointments_unique_slot
  on public.appointments (appointment_date, start_time)
  where status <> 'cancelled';

-- =========================================================
-- HELPER FUNCTION — used by RLS policies below
-- =========================================================

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select exists (
    select 1 from public.admin_users where user_id = auth.uid()
  );
$$;

-- =========================================================
-- ROW LEVEL SECURITY
-- =========================================================

alter table public.services enable row level security;
alter table public.appointments enable row level security;
alter table public.business_hours enable row level security;
alter table public.blocked_dates enable row level security;
alter table public.business_settings enable row level security;
alter table public.admin_users enable row level security;

-- services: public can read active services, admins can read/manage all
drop policy if exists "services_public_select" on public.services;
create policy "services_public_select" on public.services
  for select using (is_active = true or public.is_admin());

drop policy if exists "services_admin_write" on public.services;
create policy "services_admin_write" on public.services
  for all using (public.is_admin()) with check (public.is_admin());

-- appointments: public can INSERT only with status = 'pending' (booking form),
--   no public read, admins can read/update/delete
drop policy if exists "appointments_public_insert" on public.appointments;
create policy "appointments_public_insert" on public.appointments
  for insert with check (status = 'pending');

drop policy if exists "appointments_admin_select" on public.appointments;
create policy "appointments_admin_select" on public.appointments
  for select using (public.is_admin());

drop policy if exists "appointments_admin_update" on public.appointments;
create policy "appointments_admin_update" on public.appointments
  for update using (public.is_admin()) with check (public.is_admin());

drop policy if exists "appointments_admin_delete" on public.appointments;
create policy "appointments_admin_delete" on public.appointments
  for delete using (public.is_admin());

-- business_hours: public read, admin write
drop policy if exists "business_hours_public_select" on public.business_hours;
create policy "business_hours_public_select" on public.business_hours
  for select using (true);

drop policy if exists "business_hours_admin_write" on public.business_hours;
create policy "business_hours_admin_write" on public.business_hours
  for all using (public.is_admin()) with check (public.is_admin());

-- blocked_dates: public read, admin write
drop policy if exists "blocked_dates_public_select" on public.blocked_dates;
create policy "blocked_dates_public_select" on public.blocked_dates
  for select using (true);

drop policy if exists "blocked_dates_admin_write" on public.blocked_dates;
create policy "blocked_dates_admin_write" on public.blocked_dates
  for all using (public.is_admin()) with check (public.is_admin());

-- business_settings: public read, admin write
drop policy if exists "business_settings_public_select" on public.business_settings;
create policy "business_settings_public_select" on public.business_settings
  for select using (true);

drop policy if exists "business_settings_admin_write" on public.business_settings;
create policy "business_settings_admin_write" on public.business_settings
  for all using (public.is_admin()) with check (public.is_admin());

-- admin_users: a signed-in user may only read their own membership row
drop policy if exists "admin_users_self_select" on public.admin_users;
create policy "admin_users_self_select" on public.admin_users
  for select using (user_id = auth.uid());

-- =========================================================
-- SEED DATA
-- =========================================================

insert into public.business_hours (weekday, is_open, start_time, end_time)
values
  (0, false, null,     null),     -- Sunday
  (1, true,  '09:00',  '18:00'),  -- Monday
  (2, true,  '09:00',  '18:00'),  -- Tuesday
  (3, true,  '09:00',  '18:00'),  -- Wednesday
  (4, true,  '09:00',  '18:00'),  -- Thursday
  (5, true,  '09:00',  '18:00'),  -- Friday
  (6, true,  '10:00',  '15:00')   -- Saturday
on conflict (weekday) do nothing;

insert into public.business_settings (business_name, business_email, business_phone, business_address, slot_interval_minutes, booking_notice_hours)
select 'RepaTek', 'support@repatek.fr', '(555) 010-2040', '480 Harbor Tech Plaza, Suite 220, Seattle, WA', 30, 4
where not exists (select 1 from public.business_settings);

insert into public.services (name, description, duration_minutes, price, is_active)
values
  ('Service de Diagnostic Informatique', 'Diagnostic complet du matériel et des logiciels pour identifier précisément le problème avant toute réparation.', 45, 49.00, true),
  ('Suppression de Virus et Logiciels Malveillants', 'Analyse approfondie du système et suppression des virus, logiciels espions, rançongiciels et autres logiciels malveillants.', 60, 89.00, true),
  ('Service de Réparation d''Ordinateurs Portables', 'Réparation d''écran, de clavier, de batterie, de charnière et de carte mère pour toutes les grandes marques d''ordinateurs portables.', 90, 129.00, true),
  ('Réparation d''Ordinateurs de Bureau', 'Réparation au niveau des composants : alimentations, cartes graphiques, cartes mères et stockage.', 90, 119.00, true),
  ('Consultation de Récupération de Données', 'Évaluation professionnelle et plan de récupération pour les données perdues, corrompues ou inaccessibles.', 60, 99.00, true),
  ('Session de Support IT pour Entreprises', 'Session de support IT sur site ou à distance pour les réseaux, serveurs et postes de travail professionnels.', 120, 199.00, true)
on conflict do nothing;
