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
  price_max numeric(10, 2),
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
  business_email text not null default 'repatekcontact@gmail.com',
  business_phone text not null default '+33 7 49 87 16 52',
  business_address text not null default '1 avenue de Saintonge, 91940 Les Ulis',
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
select 'RepaTek', 'repatekcontact@gmail.com', '+33 7 49 87 16 52', '1 avenue de Saintonge, 91940 Les Ulis', 30, 4
where not exists (select 1 from public.business_settings);

insert into public.services (name, description, duration_minutes, price, is_active)
values
  ('Diagnostic système & panne', 'Analyse complète du matériel et des logiciels pour identifier la cause des ralentissements, pannes, écrans bleus et erreurs système. Le montant du diagnostic est déduit du prix de la réparation si vous l''acceptez.', 45, 39.00, true),
  ('Optimisation & nettoyage système', 'Suppression des fichiers inutiles, désactivation des programmes au démarrage, nettoyage du registre et réglages pour optimiser la vitesse.', 60, 59.00, true),
  ('Maintenance préventive', 'Dépoussiérage interne complet, remplacement de la pâte thermique, tests de charge et mise à jour des pilotes pour éviter la surchauffe et prolonger la durée de vie du matériel.', 90, 69.00, true),
  ('Désinfection & suppression de virus', 'Élimination complète des malwares, spywares, ransomwares et virus, suivie du renforcement de la sécurité et du paramétrage d''un antivirus.', 75, 69.00, true),
  ('Récupération de données & Sauvegarde', 'Extraction de vos fichiers importants depuis un disque dur défaillant ou un système bloqué, et mise en place d''une solution de sauvegarde automatique.', 120, 89.00, true),
  ('Réinstallation de système (Windows / macOS)', 'Installation propre du système d''exploitation, configuration des pilotes, réinstallation de vos logiciels et transfert complet de vos données.', 150, 109.00, true),
  ('Réparation & remplacement de composants', 'Changement des pièces défectueuses ou obsolètes : alimentation, mémoire RAM, carte graphique, carte mère, écran ou batterie d''ordinateur portable. Prix hors pièces.', 60, 59.00, true),
  ('Passage au SSD & Clonage', 'Remplacement de votre ancien disque dur lent par un disque SSD rapide, avec clonage à l''identique de votre système sans perte de données. Prix hors SSD.', 90, 79.00, true),
  ('Assemblage PC sur mesure', 'Conseil sur le choix des composants, montage complet, rangement des câbles, paramétrage du BIOS et installation de votre PC (bureau, gaming ou création).', 180, 129.00, true),
  ('Assistance & Dépannage à distance', 'Intervention rapide par prise en main à distance pour résoudre les bugs logiciels, configurer vos e-mails ou débloquer une situation simple. Tarif par tranche de 30 minutes.', 30, 29.00, true),
  ('Configuration réseau & Wi-Fi', 'Installation de routeurs, répéteurs Wi-Fi, imprimantes en réseau et configuration de partages de fichiers sécurisés (NAS).', 90, 69.00, true)
on conflict do nothing;
