-- RepaTek se déplace chez le client :
-- 1. adresse d'intervention sur le rendez-vous ;
-- 2. marge de trajet entre deux rendez-vous (réglable dans l'admin) ;
-- 3. créneaux occupés lisibles par les visiteurs, sans aucune donnée personnelle
--    (jusqu'ici la RLS les cachait : tous les créneaux paraissaient libres) ;
-- 4. contrôle des champs côté serveur et plafond global anti-robots ;
-- 5. e-mail « demande reçue » envoyé une seule fois par rendez-vous.
-- Compatible avec l'ancienne version du site (p_address facultatif).

alter table public.appointments
  add column if not exists address text,
  add column if not exists booking_email_sent_at timestamptz;

alter table public.business_settings
  add column if not exists travel_buffer_minutes integer not null default 30
    check (travel_buffer_minutes between 0 and 240);

create index if not exists appointments_service_id_idx on public.appointments (service_id);

-- Créneaux occupés : heures seulement, 62 jours maximum par appel.
create or replace function public.get_busy_slots(p_from date, p_to date)
returns table (appointment_date date, start_time time, end_time time)
language sql
stable
security definer
set search_path = public
as $$
  select a.appointment_date, a.start_time, a.end_time
  from appointments a
  where a.status <> 'cancelled'
    and a.appointment_date between p_from and p_to
    and p_to - p_from <= 62;
$$;

revoke all on function public.get_busy_slots(date, date) from public;
grant execute on function public.get_busy_slots(date, date) to anon, authenticated;

drop function if exists public.book_appointment(uuid, text, text, text, text, date, time);

create or replace function public.book_appointment(
  p_service_id uuid,
  p_full_name text,
  p_email text,
  p_phone text,
  p_notes text,
  p_appointment_date date,
  p_start_time time,
  p_address text default null
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
  v_name text := btrim(coalesce(p_full_name, ''));
  v_email text := lower(btrim(coalesce(p_email, '')));
  v_phone text := btrim(coalesce(p_phone, ''));
  v_notes text := nullif(btrim(coalesce(p_notes, '')), '');
  v_address text := nullif(btrim(coalesce(p_address, '')), '');
  v_duration integer;
  v_end_time time;
  v_weekday integer;
  v_day_open boolean;
  v_day_start time;
  v_day_end time;
  v_notice_hours integer;
  v_buffer integer;
  v_id uuid;
begin
  -- Champs : le navigateur vérifie déjà, mais il peut être contourné.
  if char_length(v_name) not between 2 and 100
     or char_length(v_email) > 254
     or v_email !~ '^[^@\s]+@[^@\s]+\.[^@\s]+$'
     or char_length(v_phone) > 25
     or v_phone !~ '^\+?[0-9 ().-]+$'
     or char_length(regexp_replace(v_phone, '[^0-9]', '', 'g')) not between 8 and 15
     or char_length(coalesce(v_notes, '')) > 2000
     or char_length(coalesce(v_address, '')) > 300 then
    raise exception 'invalid_input' using errcode = 'B0006';
  end if;

  -- Anti-abus : 3 demandes par e-mail sur 24 h, 10 demandes au total par heure.
  if (select count(*) from appointments
      where email = v_email and status <> 'cancelled' and created_at > now() - interval '24 hours') >= 3
     or (select count(*) from appointments where created_at > now() - interval '1 hour') >= 10 then
    raise exception 'too_many_requests' using errcode = 'B0001';
  end if;

  select duration_minutes into v_duration
  from services
  where id = p_service_id and is_active = true;

  if v_duration is null then
    raise exception 'invalid_service' using errcode = 'B0002';
  end if;

  v_end_time := p_start_time + (v_duration || ' minutes')::interval;
  v_weekday := extract(dow from p_appointment_date);

  select is_open, start_time, end_time
    into v_day_open, v_day_start, v_day_end
  from business_hours
  where weekday = v_weekday;

  if v_day_open is not true or v_day_start is null or v_day_end is null
     or p_start_time < v_day_start or v_end_time > v_day_end or v_end_time <= p_start_time then
    raise exception 'outside_business_hours' using errcode = 'B0003';
  end if;

  if exists (select 1 from blocked_dates where blocked_date = p_appointment_date) then
    raise exception 'date_blocked' using errcode = 'B0004';
  end if;

  select booking_notice_hours, travel_buffer_minutes
    into v_notice_hours, v_buffer
  from business_settings
  limit 1;

  if ((p_appointment_date::timestamp + p_start_time) at time zone 'Europe/Paris')
     < (now() + (coalesce(v_notice_hours, 0) || ' hours')::interval) then
    raise exception 'too_soon' using errcode = 'B0005';
  end if;

  -- Temps de trajet : aucun rendez-vous à moins de v_buffer minutes avant ou après.
  -- Même code d'erreur que la contrainte de chevauchement : le site propose un autre créneau.
  if exists (
    select 1 from appointments a
    where a.status <> 'cancelled'
      and a.appointment_date = p_appointment_date
      and p_start_time < a.end_time + make_interval(mins => coalesce(v_buffer, 0))
      and v_end_time + make_interval(mins => coalesce(v_buffer, 0)) > a.start_time
  ) then
    raise exception 'slot_conflict' using errcode = '23P01';
  end if;

  insert into appointments (
    service_id, full_name, email, phone, notes, address,
    appointment_date, start_time, end_time, status
  ) values (
    p_service_id, v_name, v_email, v_phone, v_notes, v_address,
    p_appointment_date, p_start_time, v_end_time, 'pending'
  ) returning id into v_id;

  return v_id;
end;
$$;

revoke all on function public.book_appointment(uuid, text, text, text, text, date, time, text) from public;
grant execute on function public.book_appointment(uuid, text, text, text, text, date, time, text) to anon, authenticated;
