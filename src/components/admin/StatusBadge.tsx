import type { AppointmentStatus } from '../../types/database'

const STYLES: Record<AppointmentStatus, string> = {
  pending: 'bg-warning-500/15 text-warning-500',
  confirmed: 'bg-electric-500/15 text-electric-300',
  completed: 'bg-success-500/15 text-success-500',
  cancelled: 'bg-danger-500/15 text-danger-500',
}

export const STATUS_LABELS: Record<AppointmentStatus, string> = {
  pending: 'En attente',
  confirmed: 'Confirmé',
  completed: 'Terminé',
  cancelled: 'Annulé',
}

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${STYLES[status]}`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
