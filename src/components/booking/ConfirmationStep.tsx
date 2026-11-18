import { Calendar, CheckCircle2, Clock, Mail, MapPin, Phone, User, Wrench } from 'lucide-react'
import { formatDateLong, formatTimeLabel } from '../../lib/format'

export interface BookingSummary {
  serviceName: string
  date: string
  startTime: string
  endTime: string
  name: string
  email: string
  phone: string
  address: string
  notes: string
}

export function ConfirmationStep({
  summary,
  onBookAnother,
}: {
  summary: BookingSummary
  onBookAnother: () => void
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
        <CheckCircle2 className="h-9 w-9 text-green-600" />
      </span>

      <h3 className="mt-6 font-display text-2xl font-bold text-slate-900">Rendez-vous Demandé</h3>
      <p className="mt-2 max-w-md text-sm leading-relaxed text-slate-600">
        Merci, {summary.name.split(' ')[0]} ! Votre demande de service a bien été reçue. Je vous
        contacterai prochainement à {summary.email} pour confirmer votre rendez-vous.
      </p>

      <div className="mt-8 w-full max-w-md rounded-2xl border border-slate-200 bg-slate-50 p-6 text-left">
        <SummaryRow icon={Wrench} label="Service" value={summary.serviceName} />
        <SummaryRow icon={Calendar} label="Date" value={formatDateLong(summary.date)} />
        <SummaryRow
          icon={Clock}
          label="Heure"
          value={`${formatTimeLabel(summary.startTime)} – ${formatTimeLabel(summary.endTime)}`}
        />
        <SummaryRow icon={User} label="Nom" value={summary.name} />
        <SummaryRow icon={Mail} label="E-mail" value={summary.email} />
        <SummaryRow icon={Phone} label="Téléphone" value={summary.phone} />
        <SummaryRow icon={MapPin} label="Adresse" value={summary.address} />
        {summary.notes && (
          <div className="mt-4 border-t border-slate-200 pt-4">
            <p className="text-xs font-medium text-slate-500">Remarques</p>
            <p className="mt-1 text-sm text-slate-700">{summary.notes}</p>
          </div>
        )}
      </div>

      <span className="mt-6 inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-1.5 text-xs font-medium text-amber-700">
        Statut : en attente de confirmation
      </span>

      <button
        type="button"
        onClick={onBookAnother}
        className="mt-8 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
      >
        Réserver un Autre Service
      </button>
    </div>
  )
}

function SummaryRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Calendar
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 py-2 first:pt-0">
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-50">
        <Icon className="h-4 w-4 text-blue-600" />
      </span>
      <div>
        <p className="text-[11px] text-slate-500">{label}</p>
        <p className="text-sm font-medium text-slate-900">{value}</p>
      </div>
    </div>
  )
}
