import { useEffect, useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { fetchAllAppointments, updateAppointmentStatus } from '../../lib/api'
import { formatCurrency, formatDateLong, formatTimeLabel } from '../../lib/format'
import { PageHeader } from '../../components/admin/PageHeader'
import { StatusBadge, STATUS_LABELS } from '../../components/admin/StatusBadge'
import { ErrorBanner } from '../../components/admin/ErrorBanner'
import type { AppointmentStatus, AppointmentWithService } from '../../types/database'

const STATUS_OPTIONS: AppointmentStatus[] = ['pending', 'confirmed', 'completed', 'cancelled']
const FILTERS: { key: AppointmentStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'Tous' },
  { key: 'pending', label: 'En attente' },
  { key: 'confirmed', label: 'Confirmé' },
  { key: 'completed', label: 'Terminé' },
  { key: 'cancelled', label: 'Annulé' },
]

export function AppointmentsPage() {
  const [appointments, setAppointments] = useState<AppointmentWithService[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [statusFilter, setStatusFilter] = useState<AppointmentStatus | 'all'>('all')
  const [dateFilter, setDateFilter] = useState('')
  const [updatingId, setUpdatingId] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  function load() {
    setLoading(true)
    setLoadError(null)
    fetchAllAppointments()
      .then(setAppointments)
      .catch((err) => {
        console.error('Failed to load appointments:', err)
        setLoadError('Impossible de charger les rendez-vous. Veuillez réessayer.')
      })
      .finally(() => setLoading(false))
  }

  async function handleStatusChange(id: string, status: AppointmentStatus) {
    setUpdatingId(id)
    setActionError(null)
    try {
      await updateAppointmentStatus(id, status)
      // Only sync local state after Supabase confirms the write succeeded,
      // so the UI never shows a status that wasn't actually persisted.
      setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
    } catch (err) {
      console.error('Failed to update appointment status:', err)
      setActionError('Impossible de mettre à jour le statut de ce rendez-vous. Veuillez réessayer.')
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = appointments.filter((a) => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false
    if (dateFilter && a.appointment_date !== dateFilter) return false
    return true
  })

  return (
    <div>
      <PageHeader title="Rendez-vous" description="Consultez les demandes des clients et gérez le statut des réservations." />

      {loadError && <ErrorBanner message={loadError} onRetry={load} />}
      {actionError && <ErrorBanner message={actionError} onDismiss={() => setActionError(null)} />}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setStatusFilter(f.key)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-colors ${
                statusFilter === f.key ? 'bg-cyan-400/15 text-cyan-300' : 'bg-white/5 text-white/50 hover:bg-white/10'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1.5">
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-1.5 text-sm text-white outline-none focus:border-cyan-400/60"
          />
          {dateFilter && (
            <button
              type="button"
              onClick={() => setDateFilter('')}
              className="rounded-lg p-1.5 text-white/50 hover:bg-white/5 hover:text-white"
              aria-label="Effacer le filtre de date"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-white/50">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/45">
          Aucun rendez-vous trouvé.
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((a) => (
            <div key={a.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-display text-base font-semibold text-white">{a.full_name}</h3>
                    <StatusBadge status={a.status} />
                  </div>
                  <p className="mt-1 text-sm text-white/55">
                    {a.services?.name ?? 'Service inconnu'} &middot; {formatDateLong(a.appointment_date)} &middot;{' '}
                    {formatTimeLabel(a.start_time)} – {formatTimeLabel(a.end_time)}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-4 text-xs text-white/45">
                    <span>{a.email}</span>
                    <span>{a.phone}</span>
                    {a.services && <span>{formatCurrency(a.services.price)}</span>}
                  </div>
                  {a.notes && (
                    <p className="mt-3 max-w-xl rounded-lg bg-white/[0.04] px-3.5 py-2.5 text-sm text-white/65">
                      {a.notes}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {updatingId === a.id && <Loader2 className="h-4 w-4 animate-spin text-white/40" />}
                  <select
                    value={a.status}
                    disabled={updatingId === a.id}
                    onChange={(e) => handleStatusChange(a.id, e.target.value as AppointmentStatus)}
                    className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-white outline-none transition-colors focus:border-cyan-400/60 disabled:opacity-60"
                  >
                    {STATUS_OPTIONS.map((status) => (
                      <option key={status} value={status} className="bg-navy-900">
                        {STATUS_LABELS[status]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
