import { supabase } from './supabase'
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
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function fetchBusinessSettings(): Promise<BusinessSettings | null> {
  const { data, error } = await supabase
    .from('business_settings')
    .select('*')
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function fetchBusinessHours(): Promise<BusinessHours[]> {
  const { data, error } = await supabase
    .from('business_hours')
    .select('*')
    .order('weekday', { ascending: true })

  if (error) throw error
  return data ?? []
}

export async function fetchBlockedDates(): Promise<BlockedDate[]> {
  const { data, error } = await supabase
    .from('blocked_dates')
    .select('*')
    .order('blocked_date', { ascending: true })

  if (error) throw error
  return data ?? []
}

// Returns every non-cancelled appointment that falls within the date range,
// across all services. The availability engine assumes a single-technician
// schedule — any booked slot blocks the entire shop regardless of which
// service it belongs to.
export async function fetchAppointmentsForDateRange(
  startDate: string,
  endDate: string,
): Promise<{ appointment_date: string; start_time: string; end_time: string; status: AppointmentStatus }[]> {
  const { data, error } = await supabase
    .from('appointments')
    .select('appointment_date, start_time, end_time, status')
    .neq('status', 'cancelled')
    .gte('appointment_date', startDate)
    .lte('appointment_date', endDate)

  if (error) throw error
  return data ?? []
}

// ---------- Public write (booking) ----------

export class SlotConflictError extends Error {
  constructor() {
    super('slot_conflict')
    this.name = 'SlotConflictError'
  }
}

export async function createAppointment(input: NewAppointmentInput): Promise<void> {
  const { error } = await supabase.from('appointments').insert(input)
  if (error) {
    // PostgreSQL unique violation — the slot was taken by a concurrent booking
    if (error.code === '23505') throw new SlotConflictError()
    throw error
  }
}

// ---------- Email notifications ----------

export interface BookingEmailPayload {
  customerName: string
  customerEmail: string
  customerPhone: string
  serviceName: string
  appointmentDate: string
  startTime: string
  endTime: string
  notes: string | null
}

/**
 * Calls the Supabase Edge Function that dispatches booking confirmation emails.
 * Non-blocking by design — callers should fire-and-forget after a successful
 * createAppointment so that an email failure never rolls back a confirmed booking.
 */
export async function sendBookingEmails(payload: BookingEmailPayload): Promise<void> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const res = await fetch(`${supabaseUrl}/functions/v1/send-booking-confirmation`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseAnonKey}`,
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`Email notification failed (${res.status}): ${body}`)
  }
}

export interface ConfirmedEmailPayload {
  customerName: string
  customerEmail: string
  serviceName: string
  appointmentDate: string
  startTime: string
  endTime: string
  notes: string | null
}

/**
 * Sends an "appointment confirmed" email to the client.
 * Called by the admin dashboard when status changes to 'confirmed'.
 */
export async function sendAppointmentConfirmedEmail(payload: ConfirmedEmailPayload): Promise<void> {
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  const res = await fetch(`${supabaseUrl}/functions/v1/send-appointment-confirmed`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${supabaseAnonKey}`,
      apikey: supabaseAnonKey,
    },
    body: JSON.stringify(payload),
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
