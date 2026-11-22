import { test } from 'node:test'
import assert from 'node:assert/strict'
import { getAvailableSlots, toDateKey, toTimeKey } from '../src/lib/availability.ts'

// Lundi 23 novembre 2026, ouvert de 9 h à 12 h, créneaux toutes les 30 min, service de 60 min.
const MONDAY = new Date(2026, 10, 23)
const HOURS = [{ id: 'h1', weekday: 1, is_open: true, start_time: '09:00:00', end_time: '12:00:00' }]
const SETTINGS = { slot_interval_minutes: 30, booking_notice_hours: 24 }
const LONG_BEFORE = new Date(2026, 10, 1, 8, 0)

function slots(overrides: Partial<Parameters<typeof getAvailableSlots>[0]> = {}) {
  return getAvailableSlots({
    date: MONDAY,
    serviceDurationMinutes: 60,
    businessHours: HOURS,
    blockedDates: [],
    settings: SETTINGS,
    existingAppointments: [],
    now: LONG_BEFORE,
    ...overrides,
  }).map((s) => s.label)
}

const appointment = (start: string, end: string, status?: 'cancelled' | 'confirmed', date = '2026-11-23') => ({
  appointment_date: date,
  start_time: start,
  end_time: end,
  status,
})

test('journée libre : un créneau toutes les 30 min, le dernier finit à la fermeture', () => {
  assert.deepEqual(slots(), ['09h00', '09h30', '10h00', '10h30', '11h00'])
})

test('un rendez-vous existant bloque les créneaux qui le chevauchent', () => {
  assert.deepEqual(slots({ existingAppointments: [appointment('10:00:00', '11:00:00')] }), ['09h00', '11h00'])
})

test('la marge de trajet bloque aussi les créneaux collés au rendez-vous', () => {
  assert.deepEqual(
    slots({
      existingAppointments: [appointment('10:00:00', '11:00:00')],
      settings: { ...SETTINGS, travel_buffer_minutes: 30 },
    }),
    [],
  )
})

test('un rendez-vous annulé libère ses créneaux', () => {
  assert.deepEqual(slots({ existingAppointments: [appointment('10:00:00', '11:00:00', 'cancelled')] }).length, 5)
})

test("un rendez-vous d'un autre jour ne bloque rien", () => {
  assert.equal(slots({ existingAppointments: [appointment('10:00:00', '11:00:00', 'confirmed', '2026-11-24')] }).length, 5)
})

test('le délai minimum avant réservation est respecté', () => {
  // 24 h de délai à partir du dimanche 10 h : rien avant lundi 10 h.
  assert.deepEqual(slots({ now: new Date(2026, 10, 22, 10, 0) }), ['10h00', '10h30', '11h00'])
})

test('date bloquée, jour fermé ou jour sans horaires : aucun créneau', () => {
  assert.deepEqual(slots({ blockedDates: [{ id: 'b', blocked_date: '2026-11-23', reason: null, created_at: '' }] }), [])
  assert.deepEqual(slots({ businessHours: [{ ...HOURS[0], is_open: false }] }), [])
  assert.deepEqual(slots({ date: new Date(2026, 10, 24) }), [])
})

test('entrées manquantes ou invalides : liste vide, jamais d’erreur', () => {
  assert.deepEqual(slots({ date: null }), [])
  assert.deepEqual(slots({ serviceDurationMinutes: 0 }), [])
  assert.deepEqual(slots({ settings: null }), [])
  assert.deepEqual(slots({ settings: { ...SETTINGS, slot_interval_minutes: 0 } }), [])
  assert.deepEqual(slots({ businessHours: [{ ...HOURS[0], end_time: '08:00:00' }] }), [])
})

test('service plus long que la journée : aucun créneau', () => {
  assert.deepEqual(slots({ serviceDurationMinutes: 240 }), [])
})

test('toDateKey et toTimeKey utilisent l’heure locale', () => {
  const d = new Date(2026, 0, 5, 7, 8, 9)
  assert.equal(toDateKey(d), '2026-01-05')
  assert.equal(toTimeKey(d), '07:08:09')
})
