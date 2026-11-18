import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Loader2, RotateCw } from 'lucide-react'
import {
  createAppointment,
  fetchActiveServices,
  fetchAppointmentsForDateRange,
  fetchBlockedDates,
  fetchBusinessHours,
  fetchBusinessSettings,
  sendBookingEmails,
  SlotConflictError,
} from '../../lib/api'
import { getAvailableSlots, toDateKey, toTimeKey, type TimeSlot } from '../../lib/availability'
import type { BlockedDate, BusinessHours, BusinessSettings, Service } from '../../types/database'
import { ServiceStep } from './ServiceStep'
import { DateTimeStep } from './DateTimeStep'
import { DetailsStep, type BookingFormValues } from './DetailsStep'
import { ConfirmationStep, type BookingSummary } from './ConfirmationStep'

type Step = 'service' | 'datetime' | 'details' | 'success'

const STEP_LABELS: { key: Step; label: string }[] = [
  { key: 'service', label: 'Service' },
  { key: 'datetime', label: 'Date et Heure' },
  { key: 'details', label: 'Vos Coordonnées' },
]

const DAYS_AHEAD = 21

const EMPTY_FORM: BookingFormValues = { name: '', email: '', phone: '', notes: '', address: '', website: '' }

export function BookingSection({
  preselectedServiceId,
  selectionToken,
}: {
  preselectedServiceId: string | null
  selectionToken: number
}) {
  const [step, setStep] = useState<Step>('service')

  const [services, setServices] = useState<Service[]>([])
  const [businessHours, setBusinessHours] = useState<BusinessHours[]>([])
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([])
  const [settings, setSettings] = useState<BusinessSettings | null>(null)
  const [loadingConfig, setLoadingConfig] = useState(true)
  const [configError, setConfigError] = useState<string | null>(null)

  const [selectedServiceId, setSelectedServiceId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)

  const [formValues, setFormValues] = useState<BookingFormValues>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BookingFormValues, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [slotConflict, setSlotConflict] = useState(false)
  const [summary, setSummary] = useState<BookingSummary | null>(null)

  useEffect(() => {
    let isMounted = true
    loadConfig(isMounted)
    return () => {
      isMounted = false
    }
  }, [])

  function loadConfig(isMounted: boolean) {
    setLoadingConfig(true)
    setConfigError(null)
    Promise.all([fetchActiveServices(), fetchBusinessHours(), fetchBlockedDates(), fetchBusinessSettings()])
      .then(([s, h, b, settingsData]) => {
        if (!isMounted) return
        if (!settingsData) throw new Error('Business settings not configured')
        setServices(s)
        setBusinessHours(h)
        setBlockedDates(b)
        setSettings(settingsData)
      })
      .catch((err) => {
        console.error('Failed to load booking configuration:', err)
        if (isMounted) setConfigError('Impossible de charger la configuration de réservation.')
      })
      .finally(() => {
        if (isMounted) setLoadingConfig(false)
      })
  }

  useEffect(() => {
    if (selectionToken > 0 && preselectedServiceId) {
      setSelectedServiceId(preselectedServiceId)
      setSelectedDate(null)
      setSelectedSlot(null)
      setStep('datetime')
    }
  }, [selectionToken, preselectedServiceId])

  const selectedService = useMemo(
    () => services.find((s) => s.id === selectedServiceId) ?? null,
    [services, selectedServiceId],
  )

  const dateOptions = useMemo(() => {
    const options: { date: Date; disabled: boolean }[] = []
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (let i = 0; i < DAYS_AHEAD; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() + i)
      const dateKey = toDateKey(date)
      const dayHours = businessHours.find((h) => h.weekday === date.getDay())
      const isClosed = !dayHours || !dayHours.is_open
      const isBlocked = blockedDates.some((b) => b.blocked_date === dateKey)
      options.push({ date, disabled: isClosed || isBlocked })
    }
    return options
  }, [businessHours, blockedDates])

  useEffect(() => {
    setSelectedSlot(null)
    setSlotConflict(false)

    if (!selectedDate || !selectedService || !settings) {
      setSlots([])
      return
    }

    let isMounted = true
    setLoadingSlots(true)
    const dateKey = toDateKey(selectedDate)

    fetchAppointmentsForDateRange(dateKey, dateKey)
      .then((appointments) => {
        if (!isMounted) return
        const available = getAvailableSlots({
          date: selectedDate,
          serviceDurationMinutes: selectedService.duration_minutes,
          businessHours,
          blockedDates,
          settings,
          existingAppointments: appointments,
        })
        setSlots(available)
      })
      .catch((err) => {
        console.error('Failed to check appointment availability:', err)
        if (isMounted) setSlots([])
      })
      .finally(() => {
        if (isMounted) setLoadingSlots(false)
      })

    return () => {
      isMounted = false
    }
  }, [selectedDate, selectedService, businessHours, blockedDates, settings])

  function handleFormChange(field: keyof BookingFormValues, value: string) {
    setFormValues((prev) => ({ ...prev, [field]: value }))
    setFormErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validateForm(): boolean {
    const errors: Partial<Record<keyof BookingFormValues, string>> = {}
    if (!formValues.name.trim()) errors.name = 'Le nom complet est requis.'
    if (!formValues.email.trim()) {
      errors.email = "L'e-mail est requis."
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      errors.email = 'Veuillez saisir une adresse e-mail valide.'
    }
    const phone = formValues.phone.trim()
    if (!phone) errors.phone = 'Le numéro de téléphone est requis.'
    // Même règle que book_appointment() côté serveur
    else if (!/^\+?[0-9 ().-]+$/.test(phone) || !/^\d{8,15}$/.test(phone.replace(/\D/g, '')))
      errors.phone = 'Veuillez saisir un numéro de téléphone valide.'
    if (formValues.name.trim().length === 1) errors.name = 'Veuillez saisir votre nom complet.'
    if (formValues.address.trim().length < 5) errors.address = "L'adresse d'intervention est requise."

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit() {
    if (!selectedService || !selectedDate || !selectedSlot) return
    if (!validateForm()) return
    // Piège rempli : robot. On affiche le succès sans rien enregistrer.
    if (formValues.website) {
      setStep('success')
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    const appointmentDate = toDateKey(selectedSlot.start)
    const startTime = toTimeKey(selectedSlot.start)
    const endTime = toTimeKey(selectedSlot.end)

    try {
      const trimmedName = formValues.name.trim()
      const trimmedEmail = formValues.email.trim()
      const trimmedPhone = formValues.phone.trim()
      const trimmedNotes = formValues.notes.trim() || null
      const trimmedAddress = formValues.address.trim()

      const appointmentId = await createAppointment({
        service_id: selectedService.id,
        full_name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        notes: trimmedNotes,
        address: trimmedAddress,
        appointment_date: appointmentDate,
        start_time: startTime,
      })

      sendBookingEmails(appointmentId).catch((err) =>
        console.error('Booking email notification failed:', err),
      )

      setSummary({
        serviceName: selectedService.name,
        date: appointmentDate,
        startTime,
        endTime,
        name: trimmedName,
        email: trimmedEmail,
        phone: trimmedPhone,
        address: trimmedAddress,
        notes: formValues.notes.trim(),
      })
      setStep('success')
    } catch (err) {
      if (err instanceof SlotConflictError) {
        setSelectedSlot(null)
        setSlotConflict(true)
        setStep('datetime')
        setSelectedDate((prev) => (prev ? new Date(prev.getTime()) : null))
      } else {
        console.error('Failed to submit appointment request:', err)
        setSubmitError("Nous n'avons pas pu envoyer votre demande. Veuillez réessayer.")
      }
    } finally {
      setSubmitting(false)
    }
  }

  function resetFlow() {
    setStep('service')
    setSelectedServiceId(null)
    setSelectedDate(null)
    setSelectedSlot(null)
    setFormValues(EMPTY_FORM)
    setFormErrors({})
    setSubmitError(null)
    setSummary(null)
  }

  const canContinueFromDateTime = !!selectedSlot

  return (
    <section id="booking" className="relative bg-slate-50 py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Réserver un Rendez-vous
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Planifiez votre Intervention en 3 Étapes
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Choisissez un service, sélectionnez un créneau disponible et laissez vos coordonnées.
              Nous confirmons par e-mail dans les minutes qui suivent.
            </p>
          </div>
          {settings?.business_phone && (
            <a
              href={`tel:${settings.business_phone}`}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-50"
            >
              Ou appelez-nous directement : {settings.business_phone}
            </a>
          )}
        </div>

        <div className="mt-12 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-10">
          {step !== 'success' && (
            <div className="mb-9 flex items-center justify-center gap-3">
              {STEP_LABELS.map((s, idx) => {
                const currentIdx = STEP_LABELS.findIndex((x) => x.key === step)
                const isDone = idx < currentIdx
                const isCurrent = idx === currentIdx
                return (
                  <div key={s.key} className="flex items-center gap-3">
                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold ${
                          isCurrent
                            ? 'bg-blue-600 text-white'
                            : isDone
                              ? 'bg-blue-100 text-blue-600'
                              : 'bg-slate-100 text-slate-400'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span
                        className={`hidden text-xs font-medium sm:inline ${
                          isCurrent ? 'text-slate-900' : 'text-slate-500'
                        }`}
                      >
                        {s.label}
                      </span>
                    </div>
                    {idx < STEP_LABELS.length - 1 && <span className="h-px w-8 bg-slate-200" />}
                  </div>
                )
              })}
            </div>
          )}

          {loadingConfig && (
            <div className="flex items-center justify-center gap-2 py-16 text-slate-500">
              <Loader2 className="h-5 w-5 animate-spin" />
              Chargement du système de réservation…
            </div>
          )}

          {configError && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-center text-sm text-red-600">
              <p>{configError}</p>
              <button
                type="button"
                onClick={() => loadConfig(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold hover:bg-red-100"
              >
                <RotateCw className="h-3.5 w-3.5" />
                Réessayer
              </button>
            </div>
          )}

          {!loadingConfig && !configError && (
            <>
              {step === 'service' && (
                <ServiceStep
                  services={services}
                  selectedServiceId={selectedServiceId}
                  onSelect={setSelectedServiceId}
                />
              )}

              {step === 'datetime' && slotConflict && (
                <div className="mb-5 rounded-xl border border-warning-500/30 bg-warning-500/10 px-5 py-4 text-sm text-warning-500">
                  Ce créneau vient d'être réservé par quelqu'un d'autre. Veuillez choisir un autre
                  horaire.
                </div>
              )}

              {step === 'datetime' && (
                <DateTimeStep
                  dateOptions={dateOptions}
                  selectedDate={selectedDate}
                  onSelectDate={setSelectedDate}
                  slots={slots}
                  loadingSlots={loadingSlots}
                  selectedSlot={selectedSlot}
                  onSelectSlot={setSelectedSlot}
                />
              )}

              {step === 'details' && (
                <DetailsStep values={formValues} errors={formErrors} onChange={handleFormChange} />
              )}

              {step === 'success' && summary && (
                <ConfirmationStep summary={summary} onBookAnother={resetFlow} />
              )}

              {submitError && step === 'details' && (
                <p className="mt-4 text-sm text-danger-500">{submitError}</p>
              )}

              {step !== 'success' && (
                <div className="mt-9 flex items-center justify-between border-t border-slate-200 pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(step === 'details' ? 'datetime' : 'service')}
                    disabled={step === 'service'}
                    className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-slate-500 transition-colors hover:text-slate-900 disabled:opacity-0"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                  </button>

                  {step === 'service' && (
                    <button
                      type="button"
                      disabled={!selectedServiceId}
                      onClick={() => setStep('datetime')}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Continuer
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}

                  {step === 'datetime' && (
                    <button
                      type="button"
                      disabled={!canContinueFromDateTime}
                      onClick={() => setStep('details')}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      Continuer
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  )}

                  {step === 'details' && (
                    <button
                      type="button"
                      disabled={submitting}
                      onClick={handleSubmit}
                      className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                      Envoyer la Demande
                    </button>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  )
}
