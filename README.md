# RepaTek — Computer Repair & IT Support Booking Platform

A production computer repair and IT support marketing site with a real Supabase-backed booking
system and a secure admin dashboard, deployed on Hostinger with an automatic deploy pipeline.

**Stack:** React + TypeScript + Vite + Supabase (Postgres, Auth, RLS, Edge Functions) + Resend

**Live site:** https://repatek.fr

## 1. Configure environment variables

Copy `.env.example` to `.env.local` (already done if you're reading this after setup) and fill in
your Supabase project credentials:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

`VITE_SUPABASE_URL` must be the **base project URL only** (no `/rest/v1` suffix) — the Supabase
client appends the correct path for REST, Auth, and Realtime itself.

These two values are not secret in the traditional sense — they ship inside the built JS bundle
regardless of where it's hosted. Real access control is enforced entirely by Row Level Security
(see below), not by keeping them hidden.

## 2. Create the database schema

In the Supabase Dashboard, open the SQL Editor and run the entire contents of
[`supabase/schema.sql`](./supabase/schema.sql) once. This is the single source of truth for a
fresh project — it creates:

- `services`, `appointments`, `business_hours`, `blocked_dates`, `business_settings`, `admin_users`
- Row Level Security policies for every table (public can read active services/hours/settings/blocked
  dates; **no direct public write to `appointments`** — see below)
- An `is_admin()` helper function used by most policies
- An exclusion constraint (`appointments_no_overlap`) that rejects any overlapping, non-cancelled
  appointment at the database level, regardless of which code path inserted it
- `book_appointment()`, a `security definer` RPC that is the **only** way an anonymous visitor can
  create an appointment — it validates business hours, blocked dates, the minimum notice window,
  and a per-email rate limit (max 3 requests/24h) before inserting
- Seed data for business hours, business settings, and the real service catalog

`supabase/migrations/*.sql` are kept as a dated record of how the live database arrived at this
state — they are already folded into `schema.sql` and don't need to be run separately for a fresh
project.

## 3. Deploy the Edge Functions and configure email

The booking flow sends two kinds of transactional email via [Resend](https://resend.com):
a receipt when a customer books, and a confirmation when an admin approves the appointment.

1. Deploy both functions from `supabase/functions/`:
   ```bash
   supabase functions deploy send-booking-confirmation
   supabase functions deploy send-appointment-confirmed
   ```
2. Create a Resend account, verify your sending domain (adds a few DNS records), and generate an
   API key.
3. In the Supabase Dashboard → Edge Functions → Secrets, set:

   | Secret | Required | Notes |
   |---|---|---|
   | `RESEND_API_KEY` | Yes | Without this, both functions return `500` and log `RESEND_API_KEY secret is not set` — no email is ever sent, silently. |
   | `ADMIN_NOTIFICATION_EMAIL` | Recommended | Address that receives a copy of every new booking. |
   | `FROM_EMAIL` | No | Defaults to `noreply@repatek.fr`. |
   | `BUSINESS_NAME` | No | Defaults to `RepaTek`. Shown in email headers. |

`send-appointment-confirmed` additionally requires the caller to be a signed-in admin — it verifies
the bearer token itself against `admin_users` and never trusts the request body for who the email
should go to.

## 4. Create your first admin user

1. In Supabase Dashboard → Authentication → Users, click **Add user** and create an email/password
   account for yourself.
2. Copy the new user's UUID.
3. In the SQL Editor, run:

   ```sql
   insert into public.admin_users (user_id)
   values ('PASTE_USER_UUID_HERE');
   ```

4. Sign in at `/admin/login` with that email/password.

Admin access is determined **only** by the presence of a matching row in `admin_users.user_id` —
never by email — so this step is required before the dashboard will load.

## 5. Run the app locally

```bash
npm install
npm run dev      # local development
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## 6. Deployment

Every push to `main` triggers [`.github/workflows/deploy.yml`](./.github/workflows/deploy.yml),
which builds the app and deploys it to Hostinger automatically via their REST API (upload +
static-site-archive deploy) — no manual step needed. It requires a `HOSTINGER_API_TOKEN` repository
secret (generate one from hPanel → API).

The frontend is a static SPA — no Node.js runtime is needed on the hosting side. The workflow adds
an `.htaccess` rewrite rule so client-side routes (`/admin`, `/mentions-legales`, etc.) resolve
correctly on direct navigation, since Apache/LiteSpeed otherwise 404s on anything but `/`.

## Project structure

```
src/
  lib/            Supabase client, typed API calls, availability/slot-generation logic, retry helper
  types/          Database row types matching supabase/schema.sql exactly
  contexts/       AdminAuthContext (session + admin check), BusinessSettingsContext
  components/
    layout/       Navbar, Footer, PublicLayout, LegalLayout
    home/         Hero, Services, WhyChooseUs, About, ProcessSection, TrustBar
    booking/      Multi-step booking flow (service → date/time → details → confirmation)
    admin/        Admin shell (sidebar, route guard), shared admin UI
  pages/          HomePage, legal/*, admin/* dashboard pages
supabase/
  schema.sql      Full schema, RLS policies, book_appointment() RPC, and seed data — run this
  migrations/     Historical record of how schema.sql evolved — not a setup step
  functions/      send-booking-confirmation, send-appointment-confirmed (Resend)
.github/
  workflows/      deploy.yml — build + auto-deploy to Hostinger on push to main
```

## How availability and booking work

`src/lib/availability.ts` generates the bookable slots *shown to the visitor* by combining:

- `business_hours` for that weekday (closed days return no slots)
- `blocked_dates` (blocked days return no slots)
- the service's `duration_minutes`
- `business_settings.slot_interval_minutes` for slot spacing
- `business_settings.booking_notice_hours` to exclude slots that start too soon
- existing non-cancelled appointments for that date, using the overlap rule
  `new_start < existing_end AND new_end > existing_start`

This client-side calculation is only for a good UX (showing sensible options) — it is **not** the
security boundary. The actual booking submission calls the `book_appointment()` Postgres RPC
(`src/lib/api.ts` → `createAppointment()`), which re-derives `end_time` from the service's real
duration server-side and re-validates business hours, blocked dates, the notice window, and a rate
limit before inserting. The `appointments_no_overlap` exclusion constraint is the final guard —
it rejects a conflicting slot at the database level no matter what inserted it, surfaced to the UI
as `SlotConflictError` on Postgres error codes `23505` / `23P01`.

There is no public `SELECT` policy on `appointments`; the confirmation screen after a successful
booking is rendered entirely from the locally-entered form data, not a re-fetch.
