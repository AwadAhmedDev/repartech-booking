-- Blocker 4 (server-side validation) + rate-limiting half of blocker 2
-- (pre-delivery review) — a single RPC that the public client now calls
-- instead of inserting into appointments directly. It:
--   1. rejects a caller who has made 3+ non-cancelled requests with the same
--      email in the last 24h (stops a naive flooding script without any
--      external CAPTCHA dependency);
--   2. re-derives end_time from the service's real duration_minutes —
--      the browser can no longer dictate it;
--   3. enforces business_hours, blocked_dates and booking_notice_hours,
--      none of which were previously checked outside the browser.
--
-- The appointments_no_overlap exclusion constraint (migration 0001) still
-- provides the final, un-bypassable guarantee against double-booking for
-- ANY insert path, including this one.
--
-- This migration does NOT yet remove the old "Anyone can create
-- appointments" policy — that stays in place, tightened, until the new
-- frontend (calling this RPC) is confirmed deployed. See
-- 0003_lock_down_public_insert.sql for that final step.
--
-- ROLLBACK:
--   drop function if exists public.book_appointment(uuid, text, text, text, text, date, time);
--   -- the "Anyone can create appointments" policy is restored to its
--   -- pre-migration state by re-running:
--   drop policy if exists "Anyone can create appointments" on public.appointments;
--   create policy "Anyone can create appointments" on public.appointments
--     for insert with check (true);

-- Tighten the still-active direct-insert policy to match what the current
-- frontend already always sends (status = 'pending'). Zero behavior change
-- for any legitimate caller; closes the gap where a direct insert could set
-- any status, including 'confirmed' or 'completed', with no review at all.
drop policy if exists "Anyone can create appointments" on public.appointments;
create policy "Anyone can create appointments" on public.appointments
  for insert with check (status = 'pending');

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
  -- 1. Rate limit: at most 3 active requests per email per rolling 24h.
  select count(*) into v_recent_count
  from appointments
  where email = p_email
    and status <> 'cancelled'
    and created_at > now() - interval '24 hours';

  if v_recent_count >= 3 then
    raise exception 'too_many_requests' using errcode = 'B0001';
  end if;

  -- 2. Service must exist and be active; duration comes from the DB, not the caller.
  select duration_minutes into v_duration
  from services
  where id = p_service_id and is_active = true;

  if v_duration is null then
    raise exception 'invalid_service' using errcode = 'B0002';
  end if;

  v_end_time := p_start_time + (v_duration || ' minutes')::interval;

  -- 3. Business hours for that weekday (0 = Sunday, matches business_hours.weekday).
  v_weekday := extract(dow from p_appointment_date);

  select is_open, start_time, end_time
    into v_day_open, v_day_start, v_day_end
  from business_hours
  where weekday = v_weekday;

  if v_day_open is not true or v_day_start is null or v_day_end is null
     or p_start_time < v_day_start or v_end_time > v_day_end then
    raise exception 'outside_business_hours' using errcode = 'B0003';
  end if;

  -- 4. Blocked dates.
  select exists(
    select 1 from blocked_dates where blocked_date = p_appointment_date
  ) into v_is_blocked;

  if v_is_blocked then
    raise exception 'date_blocked' using errcode = 'B0004';
  end if;

  -- 5. Minimum booking notice window, evaluated in the business's own timezone.
  select booking_notice_hours into v_notice_hours from business_settings limit 1;

  if v_notice_hours is not null
     and ((p_appointment_date::timestamp + p_start_time) at time zone 'Europe/Paris')
         < (now() + (v_notice_hours || ' hours')::interval) then
    raise exception 'too_soon' using errcode = 'B0005';
  end if;

  -- 6. Insert. appointments_no_overlap (migration 0001) is the final guard
  --    against a conflicting slot regardless of any check above.
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
