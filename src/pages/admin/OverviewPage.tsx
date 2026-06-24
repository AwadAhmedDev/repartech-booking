import { useEffect, useMemo, useState } from 'react'
import { CalendarCheck2, CheckCircle2, Hourglass, Loader2 } from 'lucide-react'
import { fetchAllAppointments } from '../../lib/api'
import { formatTimeLabel } from '../../lib/format'
import { PageHeader } from '../../components/admin/PageHeader'
import { StatusBadge } from '../../components/admin/StatusBadge'
import { ErrorBanner } from '../../components/admin/ErrorBanner'
import type { AppointmentWithService } from '../../types/database'
import { toDateKey } from '../../lib/availability'

export function OverviewPage() {
  const [appointments, setAppointments] = useState<AppointmentWithService[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  function load() {
    setLoading(true)
    setError(null)
    fetchAllAppointments()
      .then(setAppointments)
      .catch((err) => {
        console.error('Failed to load appointments for overview:', err)
        setError('Impossible de charger les données du tableau de bord.')
      })
      .finally(() => setLoading(false))
  }

  const todayKey = useMemo(() => toDateKey(new Date()), [])

  const stats = useMemo(() => {
    const todays = appointments.filter((a) => a.appointment_date === todayKey)
    return {
      today: todays.filter((a) => a.status !== 'cancelled').length,
      pending: appointments.filter((a) => a.status === 'pending').length,
      upcomingConfirmed: appointments.filter(
        (a) => a.status === 'confirmed' && a.appointment_date >= todayKey,
      ).length,
      completed: appointments.filter((a) => a.status === 'completed').length,
      todaysList: [...todays].sort((a, b) => a.start_time.localeCompare(b.start_time)),
    }
  }, [appointments, todayKey])

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-white/50">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <PageHeader title="Vue d'ensemble" description="Un aperçu en temps réel de l'activité de réservation." />

      {error ? (
        <ErrorBanner message={error} onRetry={load} />
      ) : (
        <>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard icon={CalendarCheck2} label="Rendez-vous Aujourd'hui" value={stats.today} accent="electric" />
            <StatCard icon={Hourglass} label="Demandes en Attente" value={stats.pending} accent="warning" />
            <StatCard icon={CalendarCheck2} label="Confirmés à Venir" value={stats.upcomingConfirmed} accent="cyan" />
            <StatCard icon={CheckCircle2} label="Rendez-vous Terminés" value={stats.completed} accent="success" />
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <h2 className="font-display text-base font-semibold text-white">Planning d'Aujourd'hui</h2>

            {stats.todaysList.length === 0 ? (
              <p className="mt-4 text-sm text-white/45">Aucun rendez-vous prévu aujourd'hui.</p>
            ) : (
              <div className="mt-5 overflow-x-auto">
                <table className="w-full min-w-[640px] text-left text-sm">
                  <thead>
                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-white/40">
                      <th className="pb-3 pr-4 font-medium">Client</th>
                      <th className="pb-3 pr-4 font-medium">Service</th>
                      <th className="pb-3 pr-4 font-medium">Heure</th>
                      <th className="pb-3 font-medium">Statut</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {stats.todaysList.map((a) => (
                      <tr key={a.id}>
                        <td className="py-3 pr-4 font-medium text-white">{a.full_name}</td>
                        <td className="py-3 pr-4 text-white/65">{a.services?.name ?? '—'}</td>
                        <td className="py-3 pr-4 text-white/65">
                          {formatTimeLabel(a.start_time)} – {formatTimeLabel(a.end_time)}
                        </td>
                        <td className="py-3">
                          <StatusBadge status={a.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

function StatCard({
  icon: Icon,
  label,
  value,
  accent,
}: {
  icon: typeof CalendarCheck2
  label: string
  value: number
  accent: 'electric' | 'warning' | 'success' | 'cyan'
}) {
  const accentClasses: Record<typeof accent, string> = {
    electric: 'bg-electric-500/15 text-electric-300',
    warning: 'bg-warning-500/15 text-warning-500',
    success: 'bg-success-500/15 text-success-500',
    cyan: 'bg-cyan-400/15 text-cyan-300',
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <span className={`flex h-10 w-10 items-center justify-center rounded-lg ${accentClasses[accent]}`}>
        <Icon className="h-5 w-5" />
      </span>
      <p className="mt-4 font-display text-2xl font-bold text-white">{value}</p>
      <p className="mt-1 text-xs text-white/50">{label}</p>
    </div>
  )
}
