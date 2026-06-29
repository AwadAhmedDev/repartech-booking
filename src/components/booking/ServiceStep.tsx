import { Check } from 'lucide-react'
import { formatCurrency, formatDuration } from '../../lib/format'
import { getServiceIcon } from '../../lib/iconMap'
import type { Service } from '../../types/database'

export function ServiceStep({
  services,
  selectedServiceId,
  onSelect,
}: {
  services: Service[]
  selectedServiceId: string | null
  onSelect: (id: string) => void
}) {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-slate-900">Sélectionnez un Service</h3>
      <p className="mt-1.5 text-sm text-slate-500">
        Choisissez le service qui correspond le mieux à votre problème.
      </p>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        {services.map((service) => {
          const Icon = getServiceIcon(service.name)
          const selected = service.id === selectedServiceId
          return (
            <button
              key={service.id}
              type="button"
              onClick={() => onSelect(service.id)}
              className={`relative flex flex-col items-start rounded-xl border p-5 text-left transition-all ${
                selected
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              {selected && (
                <span className="absolute right-4 top-4 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white">
                  <Check className="h-3.5 w-3.5" strokeWidth={3} />
                </span>
              )}
              <span
                className={`flex h-10 w-10 items-center justify-center rounded-lg ${
                  selected ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                }`}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="mt-3 text-sm font-semibold text-slate-900">{service.name}</span>
              <span className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <span>{formatCurrency(service.price)}</span>
                <span aria-hidden>&middot;</span>
                <span>{formatDuration(service.duration_minutes)}</span>
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
