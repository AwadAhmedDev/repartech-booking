-- FINAL CUTOVER — do not run until the frontend build using book_appointment()
-- (this repo, current state) is deployed and a real booking has been
-- verified end-to-end against it. Running this before that deploy will break
-- the booking form on whatever frontend is currently live, because it still
-- inserts into appointments directly.
--
-- Effect: removes the direct public INSERT path entirely. From this point
-- on, the only way to create an appointment as an anonymous visitor is
-- through book_appointment(), which validates business hours, blocked
-- dates, notice window, and the per-email rate limit. This is what fully
-- closes blockers 2 and 4 — until this runs, a direct REST insert with
-- status = 'pending' still succeeds and skips all of that validation.
--
-- ROLLBACK (temporary — re-opens the gap this migration closes):
--   create policy "Anyone can create appointments" on public.appointments
--     for insert with check (status = 'pending');

drop policy if exists "Anyone can create appointments" on public.appointments;
