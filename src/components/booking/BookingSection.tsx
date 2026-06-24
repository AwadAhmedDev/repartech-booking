import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft, ArrowRight, Loader2, RotateCw } from 'lucide-react'
import {
  createAppointment,
  fetchActiveServices,
  fetchAppointmentsForDateRange,
  fetchBlockedDates,
  fetchBusinessHours,
  fetchBusinessSettings,
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

  const [formValues, setFormValues] = useState<BookingFormValues>({ name: '', email: '', phone: '', notes: '' })
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof BookingFormValues, string>>>({})
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
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

  // Recalculates whenever the selected service or date changes. Always clears
  // the previously selected time slot first, since a slot from a different
  // service/date is no longer valid.
  useEffect(() => {
    setSelectedSlot(null)

    if (!selectedDate || !selectedService || !settings) {
      setSlots([])
      return
    }

    let isMounted = true
    setLoadingSlots(true)
    const dateKey = toDateKey(selectedDate)

    fetchAppointmentsForDateRange(selectedService.id, dateKey, dateKey)
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
    if (!formValues.phone.trim()) errors.phone = 'Le numéro de téléphone est requis.'

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit() {
    if (!selectedService || !selectedDate || !selectedSlot) return
    if (!validateForm()) return

    setSubmitting(true)
    setSubmitError(null)

    // Derive the DB-bound strings from the slot's real Date objects — never
    // from hand-built date strings — so they always stay in sync with what
    // was actually offered and selected.
    const appointmentDate = toDateKey(selectedSlot.start)
    const startTime = toTimeKey(selectedSlot.start)
    const endTime = toTimeKey(selectedSlot.end)

    try {
      await createAppointment({
        service_id: selectedService.id,
        full_name: formValues.name.trim(),
        email: formValues.email.trim(),
        phone: formValues.phone.trim(),
        notes: formValues.notes.trim() || null,
        appointment_date: appointmentDate,
        start_time: startTime,
        end_time: endTime,
        status: 'pending',
      })

      setSummary({
        serviceName: selectedService.name,
        date: appointmentDate,
        startTime,
        endTime,
        name: formValues.name.trim(),
        email: formValues.email.trim(),
        phone: formValues.phone.trim(),
        notes: formValues.notes.trim(),
      })
      setStep('success')
    } catch (err) {
      console.error('Failed to submit appointment request:', err)
      setSubmitError('Nous n\'avons pas pu envoyer votre demande. Veuillez réessayer.')
    } finally {
      setSubmitting(false)
    }
  }

  function resetFlow() {
    setStep('service')
    setSelectedServiceId(null)
    setSelectedDate(null)
    setSelectedSlot(null)
    setFormValues({ name: '', email: '', phone: '', notes: '' })
    setFormErrors({})
    setSubmitError(null)
    setSummary(null)
  }

  const canContinueFromDateTime = !!selectedSlot

  return (
    <section id="booking" className="relative bg-charcoal-900 py-24 lg:py-32">
      <div className="mx-auto max-w-4xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
            Réserver un Rendez-vous
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Demandez de l'Aide en Moins d'une Minute
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/55">
            Sélectionnez un service, choisissez un horaire qui vous convient, et nous nous occupons du
            reste.
          </p>
        </div>

        <div className="mt-12 rounded-3xl border border-white/10 bg-gradient-to-b from-charcoal-800 to-charcoal-900 p-6 shadow-premium sm:p-10">
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
                            ? 'bg-gradient-to-br from-electric-500 to-cyan-400 text-white'
                            : isDone
                              ? 'bg-cyan-400/20 text-cyan-300'
                              : 'bg-white/5 text-white/40'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      <span className={`hidden text-xs font-medium sm:inline ${isCurrent ? 'text-white' : 'text-white/40'}`}>
                        {s.label}
                      </span>
                    </div>
                    {idx < STEP_LABELS.length - 1 && <span className="h-px w-8 bg-white/10" />}
                  </div>
                )
              })}
            </div>
          )}

          {loadingConfig && (
            <div className="flex items-center justify-center gap-2 py-16 text-white/50">
              <Loader2 className="h-5 w-5 animate-spin" />
              Chargement du système de réservation…
            </div>
          )}

          {configError && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-danger-500/30 bg-danger-500/10 px-6 py-4 text-center text-sm text-danger-500">
              <p>{configError}</p>
              <button
                type="button"
                onClick={() => loadConfig(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-danger-500/30 px-3 py-1.5 text-xs font-semibold hover:bg-danger-500/10"
              >
                <RotateCw className="h-3.5 w-3.5" />
                Réessayer
              </button>
            </div>
          )}

          {!loadingConfig && !configError && (
            <>
              {step === 'service' && (
                <ServiceStep services={services} selectedServiceId={selectedServiceId} onSelect={setSelectedServiceId} />
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
                <div className="mt-9 flex items-center justify-between border-t border-white/10 pt-6">
                  <button
                    type="button"
                    onClick={() => setStep(step === 'details' ? 'datetime' : 'service')}
                    disabled={step === 'service'}
                    className="inline-flex items-center gap-1.5 rounded-lg px-4 py-2.5 text-sm font-medium text-white/60 transition-colors hover:text-white disabled:opacity-0"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Retour
                  </button>

                  {step === 'service' && (
                    <button
                      type="button"
                      disabled={!selectedServiceId}
                      onClick={() => setStep('datetime')}
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-electric-500 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
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
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-electric-500 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
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
                      className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-electric-500 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
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
