import type { AppointmentStatus, BlockedDate, BusinessHours } from '../types/database'

export interface TimeSlot {
  start: Date
  end: Date
  label: string
}

interface ExistingAppointment {
  appointment_date: string
  start_time: string
  end_time: string
  status: AppointmentStatus
}

interface AvailabilitySettings {
  slot_interval_minutes: number
  booking_notice_hours: number
}

export function toDateKey(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

/** Formats a real Date's time-of-day as "HH:MM:SS" for writing to a time column. Never touches strings. */
export function toTimeKey(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}

/** Combines a calendar date with a "HH:MM:SS" time-of-day string into one real Date object. */
function combineDateAndTime(date: Date, timeStr: string): Date | null {
  const parts = timeStr.split(':').map(Number)
  if (parts.length < 2 || parts.some((n) => Number.isNaN(n))) return null
  const [h, m, s] = parts
  const combined = new Date(date)
  combined.setHours(h, m, s ?? 0, 0)
  return combined
}

function formatLabel(date: Date): string {
  return `${String(date.getHours()).padStart(2, '0')}h${String(date.getMinutes()).padStart(2, '0')}`
}

/**
 * Generates bookable time slots for a given date and service, applying every
 * availability rule: business hours, blocked dates, existing overlapping
 * non-cancelled appointments, and the minimum booking notice window.
 *
 * Returns an empty array (never throws) if inputs are missing or invalid —
 * callers should render a "no availability" fallback on an empty result.
 */
export function getAvailableSlots(params: {
  date: Date | null
  serviceDurationMinutes: number | null
  businessHours: BusinessHours[]
  blockedDates: BlockedDate[]
  settings: AvailabilitySettings | null
  existingAppointments: ExistingAppointment[]
  now?: Date
}): TimeSlot[] {
  try {
    const { date, serviceDurationMinutes, businessHours, blockedDates, settings, existingAppointments } = params

    if (!date || !serviceDurationMinutes || serviceDurationMinutes <= 0 || !settings) return []
    if (!settings.slot_interval_minutes || settings.slot_interval_minutes <= 0) return []

    const now = params.now ?? new Date()
    const dateKey = toDateKey(date)

    const isBlocked = blockedDates.some((b) => b.blocked_date === dateKey)
    if (isBlocked) return []

    const dayHours = businessHours.find((h) => h.weekday === date.getDay())
    if (!dayHours || !dayHours.is_open || !dayHours.start_time || !dayHours.end_time) return []

    const dayStart = combineDateAndTime(date, dayHours.start_time)
    const dayEnd = combineDateAndTime(date, dayHours.end_time)
    if (!dayStart || !dayEnd || dayEnd <= dayStart) return []

    const earliestBookable = new Date(now.getTime() + settings.booking_notice_hours * 60 * 60 * 1000)

    const activeAppointments = existingAppointments.filter(
      (a) => a.appointment_date === dateKey && a.status !== 'cancelled',
    )

    const slots: TimeSlot[] = []
    let cursor = new Date(dayStart)

    while (true) {
      const slotEnd = new Date(cursor.getTime() + serviceDurationMinutes * 60_000)
      if (slotEnd > dayEnd) break

      if (cursor >= earliestBookable) {
        const overlaps = activeAppointments.some((existing) => {
          const existingStart = combineDateAndTime(date, existing.start_time)
          const existingEnd = combineDateAndTime(date, existing.end_time)
          if (!existingStart || !existingEnd) return false
          // overlap rule: new_start < existing_end AND new_end > existing_start
          return cursor < existingEnd && slotEnd > existingStart
        })

        if (!overlaps) {
          slots.push({ start: new Date(cursor), end: slotEnd, label: formatLabel(cursor) })
        }
      }

      cursor = new Date(cursor.getTime() + settings.slot_interval_minutes * 60_000)
    }

    return slots
  } catch (err) {
    console.error('Failed to generate availability slots:', err)
    return []
  }
}
