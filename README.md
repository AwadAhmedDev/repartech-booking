# RepaTek — Computer Repair & IT Support Booking Platform

A production-ready computer repair and IT support marketing site with a real Supabase-backed
booking system and a secure admin dashboard.

**Stack:** React + TypeScript + Vite + Supabase (Postgres, Auth, RLS)

## 1. Configure environment variables

Copy `.env.example` to `.env.local` (already done if you're reading this after setup) and fill in
your Supabase project credentials:

```
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-or-anon-key
```

`VITE_SUPABASE_URL` must be the **base project URL only** (no `/rest/v1` suffix) — the Supabase
client appends the correct path for REST, Auth, and Realtime itself.

## 2. Create the database schema

In the Supabase Dashboard, open the SQL Editor and run the entire contents of
[`supabase/schema.sql`](./supabase/schema.sql) once. This creates:

- `services`, `appointments`, `business_hours`, `blocked_dates`, `business_settings`, `admin_users`
- Row Level Security policies for every table (public can read active services/hours/settings/blocked
  dates and insert appointments only; all other access requires `admin_users.user_id = auth.uid()`)
- An `is_admin()` helper function used by the policies
- Seed data for business hours, business settings, and six starter services

## 3. Create your first admin user

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

## 4. Run the app

```bash
npm install
npm run dev      # local development
npm run build    # type-check + production build
npm run preview  # preview the production build
```

## Project structure

```
src/
  lib/            Supabase client, typed API calls, availability/slot-generation logic
  types/          Database row types matching supabase/schema.sql exactly
  contexts/       AdminAuthContext (session + admin check), BusinessSettingsContext
  components/
    layout/       Navbar, Footer, PublicLayout
    home/         Hero, Services, WhyChooseUs, About
    booking/      Multi-step booking flow (service → date/time → details → confirmation)
    admin/        Admin shell (sidebar, route guard), shared admin UI
  pages/          HomePage, admin/* dashboard pages
supabase/
  schema.sql      Full schema, RLS policies, and seed data
```

## How availability is calculated

`src/lib/availability.ts` generates bookable slots for a given date and service by combining:

- `business_hours` for that weekday (closed days return no slots)
- `blocked_dates` (blocked days return no slots)
- the service's `duration_minutes`
- `business_settings.slot_interval_minutes` for slot spacing
- `business_settings.booking_notice_hours` to exclude slots that start too soon
- existing non-cancelled appointments for that service/date, using the overlap rule
  `new_start < existing_end AND new_end > existing_start`

Booking submission uses `insert` only (no `.select()`), and the confirmation screen is rendered from
the locally-entered form data — the public `appointments` table has no public `SELECT` policy.
