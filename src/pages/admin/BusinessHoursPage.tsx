import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { fetchBusinessHours, updateBusinessHours } from '../../lib/api'
import { DAY_NAMES } from '../../lib/format'
import { PageHeader } from '../../components/admin/PageHeader'
import { ErrorBanner } from '../../components/admin/ErrorBanner'
import type { BusinessHours } from '../../types/database'

export function BusinessHoursPage() {
  const [hours, setHours] = useState<BusinessHours[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [savingId, setSavingId] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  function load() {
    setLoading(true)
    setLoadError(null)
    fetchBusinessHours()
      .then(setHours)
      .catch((err) => {
        console.error('Failed to load business hours:', err)
        setLoadError('Impossible de charger les horaires d\'ouverture.')
      })
      .finally(() => setLoading(false))
  }

  async function handleChange(id: string, patch: Partial<BusinessHours>) {
    const previous = hours.find((h) => h.id === id)
    setHours((prev) => prev.map((h) => (h.id === id ? { ...h, ...patch } : h)))
    setSavingId(id)
    setActionError(null)
    try {
      await updateBusinessHours(id, patch)
    } catch (err) {
      console.error('Failed to update business hours:', err)
      setActionError("Impossible d'enregistrer cette modification d'horaire. Veuillez réessayer.")
      // Revert the optimistic update since Supabase did not persist it —
      // the UI must never claim a change succeeded when it didn't.
      if (previous) setHours((prev) => prev.map((h) => (h.id === id ? previous : h)))
    } finally {
      setSavingId(null)
    }
  }

  function handleToggleOpen(day: BusinessHours, isOpen: boolean) {
    if (isOpen && (!day.start_time || !day.end_time)) {
      handleChange(day.id, { is_open: true, start_time: '09:00:00', end_time: '17:00:00' })
    } else {
      handleChange(day.id, { is_open: isOpen })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-white/50">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Horaires d'Ouverture" description="Définissez votre planning hebdomadaire et les horaires de réservation pour les clients." />

      {loadError && <ErrorBanner message={loadError} onRetry={load} />}
      {actionError && <ErrorBanner message={actionError} onDismiss={() => setActionError(null)} />}

      {!loadError && hours.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/45">
          Aucun horaire configuré pour le moment.
        </div>
      ) : (
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
        {[...hours]
          .sort((a, b) => a.weekday - b.weekday)
          .map((day, idx) => (
            <div
              key={day.id}
              className={`flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center sm:justify-between ${
                idx !== 0 ? 'border-t border-white/5' : ''
              }`}
            >
              <div className="flex items-center gap-3 sm:w-44">
                <label className="relative inline-flex cursor-pointer items-center">
                  <input
                    type="checkbox"
                    checked={day.is_open}
                    onChange={(e) => handleToggleOpen(day, e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="h-5 w-9 rounded-full bg-white/10 transition-colors peer-checked:bg-cyan-400/80" />
                  <div className="absolute left-0.5 top-0.5 h-4 w-4 rounded-full bg-white transition-transform peer-checked:translate-x-4" />
                </label>
                <span className="text-sm font-medium text-white">{DAY_NAMES[day.weekday]}</span>
              </div>

              {day.is_open ? (
                <div className="flex items-center gap-3">
                  <input
                    type="time"
                    value={(day.start_time ?? '09:00:00').slice(0, 5)}
                    onChange={(e) => handleChange(day.id, { start_time: `${e.target.value}:00` })}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-400/60"
                  />
                  <span className="text-xs text-white/40">à</span>
                  <input
                    type="time"
                    value={(day.end_time ?? '17:00:00').slice(0, 5)}
                    onChange={(e) => handleChange(day.id, { end_time: `${e.target.value}:00` })}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-400/60"
                  />
                  {savingId === day.id && <Loader2 className="h-3.5 w-3.5 animate-spin text-white/40" />}
                </div>
              ) : (
                <span className="text-sm text-white/35">Fermé</span>
              )}
            </div>
          ))}
      </div>
      )}
    </div>
  )
}
