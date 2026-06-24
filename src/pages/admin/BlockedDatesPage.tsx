import { useEffect, useState, type FormEvent } from 'react'
import { CalendarOff, Loader2, Plus, Trash2 } from 'lucide-react'
import { createBlockedDate, deleteBlockedDate, fetchBlockedDates } from '../../lib/api'
import { formatDateLong } from '../../lib/format'
import { PageHeader } from '../../components/admin/PageHeader'
import { ErrorBanner } from '../../components/admin/ErrorBanner'
import type { BlockedDate } from '../../types/database'

export function BlockedDatesPage() {
  const [dates, setDates] = useState<BlockedDate[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [newDate, setNewDate] = useState('')
  const [newReason, setNewReason] = useState('')
  const [adding, setAdding] = useState(false)
  const [removingId, setRemovingId] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  function load() {
    setLoading(true)
    setLoadError(null)
    fetchBlockedDates()
      .then(setDates)
      .catch((err) => {
        console.error('Failed to load blocked dates:', err)
        setLoadError('Impossible de charger les dates bloquées. Veuillez réessayer.')
      })
      .finally(() => setLoading(false))
  }

  async function handleAdd(e: FormEvent) {
    e.preventDefault()
    if (!newDate) return
    setAdding(true)
    setActionError(null)
    try {
      await createBlockedDate(newDate, newReason.trim() || null)
      setNewDate('')
      setNewReason('')
      load()
    } catch (err) {
      console.error('Failed to create blocked date:', err)
      setActionError('Impossible de bloquer cette date. Veuillez réessayer.')
    } finally {
      setAdding(false)
    }
  }

  async function handleRemove(id: string) {
    setRemovingId(id)
    setActionError(null)
    try {
      await deleteBlockedDate(id)
      setDates((prev) => prev.filter((d) => d.id !== id))
    } catch (err) {
      console.error('Failed to delete blocked date:', err)
      setActionError('Impossible de supprimer cette date bloquée. Veuillez réessayer.')
    } finally {
      setRemovingId(null)
    }
  }

  return (
    <div>
      <PageHeader title="Dates Bloquées" description="Marquez les jours fériés ou indisponibles pour empêcher les réservations." />

      {loadError && <ErrorBanner message={loadError} onRetry={load} />}
      {actionError && <ErrorBanner message={actionError} onDismiss={() => setActionError(null)} />}

      <form onSubmit={handleAdd} className="mb-8 flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-end">
        <label className="flex flex-1 flex-col gap-1.5">
          <span className="text-xs font-medium text-white/60">Date</span>
          <input
            type="date"
            required
            value={newDate}
            onChange={(e) => setNewDate(e.target.value)}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400/60"
          />
        </label>
        <label className="flex flex-[2] flex-col gap-1.5">
          <span className="text-xs font-medium text-white/60">Motif (facultatif)</span>
          <input
            value={newReason}
            onChange={(e) => setNewReason(e.target.value)}
            placeholder="ex. : Fermeture pour jour férié"
            className="rounded-lg border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/30 outline-none focus:border-cyan-400/60"
          />
        </label>
        <button
          type="submit"
          disabled={adding}
          className="flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-electric-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110 disabled:opacity-60"
        >
          {adding ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
          Ajouter
        </button>
      </form>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-white/50">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : dates.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/45">
          Aucune date bloquée pour le moment.
        </div>
      ) : (
        <div className="space-y-3">
          {dates.map((d) => (
            <div key={d.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-5 py-4">
              <div className="flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-danger-500/15 text-danger-500">
                  <CalendarOff className="h-4.5 w-4.5" />
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{formatDateLong(d.blocked_date)}</p>
                  {d.reason && <p className="text-xs text-white/45">{d.reason}</p>}
                </div>
              </div>
              <button
                type="button"
                disabled={removingId === d.id}
                onClick={() => handleRemove(d.id)}
                className="rounded-lg p-2 text-white/50 hover:bg-danger-500/10 hover:text-danger-500 disabled:opacity-60"
              >
                {removingId === d.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
