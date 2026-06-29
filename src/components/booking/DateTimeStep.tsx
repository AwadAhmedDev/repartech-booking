import { Loader2 } from 'lucide-react'
import type { TimeSlot } from '../../lib/availability'

interface DateOption {
  date: Date
  disabled: boolean
}

export function DateTimeStep({
  dateOptions,
  selectedDate,
  onSelectDate,
  slots,
  loadingSlots,
  selectedSlot,
  onSelectSlot,
}: {
  dateOptions: DateOption[]
  selectedDate: Date | null
  onSelectDate: (date: Date) => void
  slots: TimeSlot[]
  loadingSlots: boolean
  selectedSlot: TimeSlot | null
  onSelectSlot: (slot: TimeSlot) => void
}) {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-slate-900">
        Sélectionnez une Date et une Heure
      </h3>
      <p className="mt-1.5 text-sm text-slate-500">
        Choisissez un jour, puis sélectionnez un créneau horaire disponible.
      </p>

      <div className="mt-6 flex gap-2.5 overflow-x-auto pb-2">
        {dateOptions.map(({ date, disabled }) => {
          const selected = selectedDate?.toDateString() === date.toDateString()
          return (
            <button
              key={date.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => onSelectDate(date)}
              className={`flex shrink-0 flex-col items-center rounded-xl border px-4 py-3 transition-all ${
                disabled
                  ? 'cursor-not-allowed border-slate-100 bg-slate-50 text-slate-300'
                  : selected
                    ? 'border-blue-500 bg-blue-50 text-slate-900 shadow-sm'
                    : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                {date.toLocaleDateString('fr-FR', { weekday: 'short' })}
              </span>
              <span className="mt-1 font-display text-lg font-bold">{date.getDate()}</span>
              <span className="text-[10px] text-slate-400">
                {date.toLocaleDateString('fr-FR', { month: 'short' })}
              </span>
            </button>
          )
        })}
      </div>

      <div className="mt-7">
        {!selectedDate && (
          <p className="text-sm text-slate-400">
            Sélectionnez une date pour voir les horaires disponibles.
          </p>
        )}

        {selectedDate && loadingSlots && (
          <div className="flex items-center gap-2 text-sm text-slate-500">
            <Loader2 className="h-4 w-4 animate-spin" />
            Vérification des disponibilités…
          </div>
        )}

        {selectedDate && !loadingSlots && slots.length === 0 && (
          <div className="rounded-xl border border-warning-500/30 bg-warning-500/10 px-5 py-4 text-sm text-warning-500">
            Aucun horaire disponible à cette date. Veuillez choisir une autre date.
          </div>
        )}

        {selectedDate && !loadingSlots && slots.length > 0 && (
          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {slots.map((slot) => {
              const selected = selectedSlot?.start.getTime() === slot.start.getTime()
              return (
                <button
                  key={slot.start.getTime()}
                  type="button"
                  onClick={() => onSelectSlot(slot)}
                  className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-all ${
                    selected
                      ? 'border-blue-500 bg-blue-50 text-blue-700 shadow-sm'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {slot.label}
                </button>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
