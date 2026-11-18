import { supabase } from './supabase'
import { withRetry } from './retry'
import type {
  AppointmentStatus,
  AppointmentWithService,
  BlockedDate,
  BusinessHours,
  BusinessSettings,
  NewAppointmentInput,
  Service,
} from '../types/database'

// ---------- Public reads ----------

export async function fetchActiveServices(): Promise<Service[]> {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('services')
      .select('*')
      .eq('is_active', true)
      .order('name', { ascending: true })

    if (error) throw error
    return data ?? []
  })
}

export async function fetchBusinessSettings(): Promise<BusinessSettings | null> {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('business_settings')
      .select('*')
      .limit(1)
      .maybeSingle()

    if (error) throw error
    return data
  })
}

export async function fetchBusinessHours(): Promise<BusinessHours[]> {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('business_hours')
      .select('*')
      .order('weekday', { ascending: true })

    if (error) throw error
    return data ?? []
  })
}

export async function fetchBlockedDates(): Promise<BlockedDate[]> {
  return withRetry(async () => {
    const { data, error } = await supabase
      .from('blocked_dates')
      .select('*')
      .order('blocked_date', { ascending: true })

    if (error) throw error
    return data ?? []
  })
}

// Busy time ranges (non-cancelled appointments) in the date range. Single technician:
// any appointment blocks the schedule. Read through get_busy_slots(), which returns
// times only — visitors cannot read the appointments table itself (RLS).
export async function fetchAppointmentsForDateRange(
  startDate: string,
  endDate: string,
): Promise<{ appointment_date: string; start_time: string; end_time: string }[]> {
  return withRetry(async () => {
    const { data, error } = await supabase.rpc('get_busy_slots', { p_from: startDate, p_to: endDate })
    if (error) throw error
    return data ?? []
  })
}

// ---------- Public write (booking) ----------

export class SlotConflictError extends Error {
  constructor() {
    super('slot_conflict')
    this.name = 'SlotConflictError'
  }
}

/**
 * Creates a pending appointment via the book_appointment() RPC instead of a
 * direct table insert. The server (not the browser) computes end_time from
 * the service's real duration and enforces business hours, blocked dates,
 * the booking-notice window, and a per-email rate limit — none of which a
 * direct insert could check. Returns the new appointment's id.
 */
export async function createAppointment(input: NewAppointmentInput): Promise<string> {
  const { data, error } = await supabase.rpc('book_appointment', {
    p_service_id: input.service_id,
    p_full_name: input.full_name,
    p_email: input.email,
    p_phone: input.phone,
    p_notes: input.notes,
    p_appointment_date: input.appointment_date,
    p_start_time: input.start_time,
    p_address: input.address,
  })

  if (error) {
    // Unique violation (identical start time) or exclusion violation (overlapping range)
    if (error.code === '23505' || error.code === '23P01') throw new SlotConflictError()
    throw error
  }

  return data as string
}

// ---------- Email notifications ----------

/**
 * Calls the Supabase Edge Function that dispatches booking confirmation emails.
 * Only the appointment id is sent — the function reads the customer/service
 * data itself from the database, so the email content can no longer be
 * forged by whoever calls this endpoint.
 * Non-blocking by design — callers should fire-and-forget after a successful
 * createAppointment so that an email failure never rolls back a confirmed booking.
 */
export async function sendBookingEmails(appointmentId: string): Promise<void> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const res = await fetch(`${supabaseUrl}/functions/v1/send-booking-confirmation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseAnonKey}`,
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify({ appointment_id: appointmentId }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Email notification failed (${res.status}): ${body}`)
  }
}

/**
 * Sends an "appointment confirmed" email to the client.
 * Called by the admin dashboard when status changes to 'confirmed'. Requires
 * the caller's own admin session token — the function verifies it server-side
 * against admin_users before sending anything.
 */
export async function sendAppointmentConfirmedEmail(appointmentId: string): Promise<void> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY
  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) throw new Error('Confirmation email failed: no active admin session')

  const res = await fetch(`${supabaseUrl}/functions/v1/send-appointment-confirmed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${session.access_token}`,
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify({ appointment_id: appointmentId }),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Confirmation email failed (${res.status}): ${body}`)
  }
}

// ---------- Admin: appointments ----------

export async function fetchAllAppointments(): Promise<AppointmentWithService[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('*, services(id, name, duration_minutes, price)')
    .order('appointment_date', { ascending: false })
    .order('start_time', { ascending: false })

  if (error) throw error
  return (data ?? []) as unknown as AppointmentWithService[]
}

export async function updateAppointmentStatus(id: string, status: AppointmentStatus): Promise<void> {
  const { error } = await supabase.from('appointments').update({ status }).eq('id', id)
  if (error) throw error
}

// ---------- Admin: services ----------

export async function fetchAllServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('name', { ascending: true })

  if (error) throw error
  return data ?? []
}

export type ServiceInput = Omit<Service, 'id' | 'created_at'>

export async function createService(input: ServiceInput): Promise<void> {
  const { error } = await supabase.from('services').insert(input)
  if (error) throw error
}

export async function updateService(id: string, input: Partial<ServiceInput>): Promise<void> {
  const { error } = await supabase.from('services').update(input).eq('id', id)
  if (error) throw error
}

export async function deleteService(id: string): Promise<void> {
  const { error } = await supabase.from('services').delete().eq('id', id)
  if (error) throw error
}

// ---------- Admin: business hours ----------

export async function updateBusinessHours(id: string, input: Partial<BusinessHours>): Promise<void> {
  const { error } = await supabase.from('business_hours').update(input).eq('id', id)
  if (error) throw error
}

// ---------- Admin: blocked dates ----------

export async function createBlockedDate(blocked_date: string, reason: string | null): Promise<void> {
  const { error } = await supabase.from('blocked_dates').insert({ blocked_date, reason })
  if (error) throw error
}

export async function deleteBlockedDate(id: string): Promise<void> {
  const { error } = await supabase.from('blocked_dates').delete().eq('id', id)
  if (error) throw error
}

// ---------- Admin: business settings ----------

export async function updateBusinessSettings(
  id: string,
  input: Partial<Omit<BusinessSettings, 'id' | 'created_at'>>,
): Promise<void> {
  const { error } = await supabase.from('business_settings').update(input).eq('id', id)
  if (error) throw error
}
