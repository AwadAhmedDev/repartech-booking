import type { ReactNode } from 'react'

export interface BookingFormValues {
  name: string
  email: string
  phone: string
  notes: string
  address: string
  /** champ piège invisible : rempli seulement par les robots */
  website: string
}

export function DetailsStep({
  values,
  errors,
  onChange,
}: {
  values: BookingFormValues
  errors: Partial<Record<keyof BookingFormValues, string>>
  onChange: (field: keyof BookingFormValues, value: string) => void
}) {
  return (
    <div>
      <h3 className="font-display text-xl font-semibold text-slate-900">Vos Coordonnées</h3>
      <p className="mt-1.5 text-sm text-slate-500">
        Indiquez où intervenir, comment vous contacter, et décrivez le problème.
      </p>

      <div className="relative mt-6 grid gap-5 sm:grid-cols-2">
        <Field label="Nom Complet" error={errors.name}>
          <input
            type="text"
            autoComplete="name"
            maxLength={100}
            value={values.name}
            onChange={(e) => onChange('name', e.target.value)}
            placeholder="Camille Dupont"
            className={inputClass(!!errors.name)}
          />
        </Field>

        <Field label="Adresse E-mail" error={errors.email}>
          <input
            type="email"
            autoComplete="email"
            maxLength={254}
            value={values.email}
            onChange={(e) => onChange('email', e.target.value)}
            placeholder="vous@exemple.com"
            className={inputClass(!!errors.email)}
          />
        </Field>

        <Field label="Numéro de Téléphone" error={errors.phone}>
          <input
            type="tel"
            autoComplete="tel"
            maxLength={25}
            value={values.phone}
            onChange={(e) => onChange('phone', e.target.value)}
            placeholder="06 12 34 56 78"
            className={inputClass(!!errors.phone)}
          />
        </Field>

        <Field label="Adresse d'Intervention" error={errors.address}>
          <input
            type="text"
            autoComplete="street-address"
            value={values.address}
            onChange={(e) => onChange('address', e.target.value)}
            placeholder="12 rue de l'Exemple, 91940 Les Ulis"
            maxLength={300}
            className={inputClass(!!errors.address)}
          />
        </Field>

        {/* Piège à robots : invisible pour les visiteurs et les lecteurs d'écran */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
          <label>
            Site web
            <input
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.website}
              onChange={(e) => onChange('website', e.target.value)}
            />
          </label>
        </div>

        <Field label="Décrivez le Problème (facultatif)" error={errors.notes} full>
          <textarea
            value={values.notes}
            onChange={(e) => onChange('notes', e.target.value)}
            placeholder="ex. : l'ordinateur portable ne s'allume pas, l'écran clignote, erreur d'écran bleu…"
            rows={4}
            maxLength={2000}
            className={inputClass(!!errors.notes)}
          />
        </Field>
      </div>
    </div>
  )
}

function Field({
  label,
  error,
  full,
  children,
}: {
  label: string
  error?: string
  full?: boolean
  children: ReactNode
}) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-xs font-medium text-slate-700">{label}</span>
      {children}
      {error && <span className="text-xs text-danger-500">{error}</span>}
    </label>
  )
}

function inputClass(hasError: boolean) {
  return `rounded-lg border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 outline-none transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 ${
    hasError ? 'border-red-400' : 'border-slate-300'
  }`
}
