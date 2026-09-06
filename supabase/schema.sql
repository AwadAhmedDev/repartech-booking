-- RepaTek — Computer Repair & IT Support Booking Platform
-- Run this entire file once in the Supabase SQL editor for a fresh project.
-- This is the single source of truth — it already includes what used to be
-- separate files under supabase/migrations/ (kept there only as a dated
-- history of how production got here, not as extra setup steps to run).
--
-- This matches the live schema exactly — column names below are
-- authoritative for the application code (src/types/database.ts,
-- src/lib/api.ts, src/lib/availability.ts). Do not rename them.
--
-- After running this file, also deploy the two Edge Functions under
-- supabase/functions/ and set the RESEND_API_KEY secret (see README.md)
-- — without it, confirmation emails silently fail closed.

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
-- OVERLAP PROTECTION
-- =========================================================

-- Prevents any two non-cancelled appointments from overlapping in time,
-- regardless of start time — catches concurrent double-bookings at the
-- database level for ANY insert path, not just the app's own code. The
-- application code surfaces a user-friendly "slot taken" message on the
-- exclusion violation error code (23P01, alongside 23505 for the rare
-- identical-start-time case).
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
  drop constraint if exists appointments_no_overlap;

alter table public.appointments
  add constraint appointments_no_overlap
  exclude using gist (
    tstzrange(starts_at, ends_at) with &&
  ) where (status <> 'cancelled');

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

-- appointments: no direct public INSERT policy at all — the public booking
--   form calls book_appointment() below instead, which validates business
--   hours, blocked dates, the notice window, and a per-email rate limit
--   before inserting (as security definer, it bypasses RLS to do so).
--   No public read; admins can read/update/delete.
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
-- BOOKING RPC — the only way an anonymous visitor can create an appointment
-- =========================================================

create or replace function public.book_appointment(
  p_service_id uuid,
  p_full_name text,
  p_email text,
  p_phone text,
  p_notes text,
  p_appointment_date date,
  p_start_time time
) returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_duration integer;
  v_end_time time;
  v_weekday integer;
  v_day_open boolean;
  v_day_start time;
  v_day_end time;
  v_is_blocked boolean;
  v_notice_hours integer;
  v_recent_count integer;
  v_id uuid;
begin
  -- Rate limit: at most 3 active requests per email per rolling 24h.
  select count(*) into v_recent_count
  from appointments
  where email = p_email
    and status <> 'cancelled'
    and created_at > now() - interval '24 hours';

  if v_recent_count >= 3 then
    raise exception 'too_many_requests' using errcode = 'B0001';
  end if;

  -- Service must exist and be active; duration comes from the DB, not the caller.
  select duration_minutes into v_duration
  from services
  where id = p_service_id and is_active = true;

  if v_duration is null then
    raise exception 'invalid_service' using errcode = 'B0002';
  end if;

  v_end_time := p_start_time + (v_duration || ' minutes')::interval;

  -- Business hours for that weekday (0 = Sunday, matches business_hours.weekday).
  v_weekday := extract(dow from p_appointment_date);

  select is_open, start_time, end_time
    into v_day_open, v_day_start, v_day_end
  from business_hours
  where weekday = v_weekday;

  if v_day_open is not true or v_day_start is null or v_day_end is null
     or p_start_time < v_day_start or v_end_time > v_day_end then
    raise exception 'outside_business_hours' using errcode = 'B0003';
  end if;

  -- Blocked dates.
  select exists(
    select 1 from blocked_dates where blocked_date = p_appointment_date
  ) into v_is_blocked;

  if v_is_blocked then
    raise exception 'date_blocked' using errcode = 'B0004';
  end if;

  -- Minimum booking notice window, evaluated in the business's own timezone.
  select booking_notice_hours into v_notice_hours from business_settings limit 1;

  if v_notice_hours is not null
     and ((p_appointment_date::timestamp + p_start_time) at time zone 'Europe/Paris')
         < (now() + (v_notice_hours || ' hours')::interval) then
    raise exception 'too_soon' using errcode = 'B0005';
  end if;

  -- Insert. appointments_no_overlap is the final guard against a
  -- conflicting slot regardless of any check above.
  insert into appointments (
    service_id, full_name, email, phone, notes,
    appointment_date, start_time, end_time, status
  ) values (
    p_service_id, p_full_name, p_email, p_phone, p_notes,
    p_appointment_date, p_start_time, v_end_time, 'pending'
  ) returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.book_appointment(uuid, text, text, text, text, date, time) from public;
grant execute on function public.book_appointment(uuid, text, text, text, text, date, time) to anon, authenticated;

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
