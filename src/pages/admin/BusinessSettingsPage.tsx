import { useEffect, useState, type FormEvent, type ReactNode } from 'react'
import { CheckCircle2, Loader2 } from 'lucide-react'
import { fetchBusinessSettings, updateBusinessSettings } from '../../lib/api'
import { PageHeader } from '../../components/admin/PageHeader'
import { ErrorBanner } from '../../components/admin/ErrorBanner'
import type { BusinessSettings } from '../../types/database'

export function BusinessSettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    load()
  }, [])

  function load() {
    setLoading(true)
    setLoadError(null)
    fetchBusinessSettings()
      .then(setSettings)
      .catch((err) => {
        console.error('Failed to load business settings:', err)
        setLoadError('Impossible de charger les paramètres de l\'entreprise.')
      })
      .finally(() => setLoading(false))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!settings) return
    setSaving(true)
    setSaved(false)
    setSaveError(null)
    try {
      await updateBusinessSettings(settings.id, {
        business_name: settings.business_name,
        business_email: settings.business_email,
        business_phone: settings.business_phone,
        business_address: settings.business_address,
        slot_interval_minutes: settings.slot_interval_minutes,
        booking_notice_hours: settings.booking_notice_hours,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (err) {
      console.error('Failed to save business settings:', err)
      setSaveError('Impossible d\'enregistrer les paramètres. Veuillez réessayer.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-white/50">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    )
  }

  if (loadError) {
    return <ErrorBanner message={loadError} onRetry={load} />
  }

  if (!settings) {
    return <p className="text-sm text-white/50">Aucun paramètre d'entreprise trouvé.</p>
  }

  return (
    <div>
      <PageHeader title="Paramètres de l'Entreprise" description="Mettez à jour les informations de votre entreprise et les règles de réservation." />

      {saveError && <ErrorBanner message={saveError} onDismiss={() => setSaveError(null)} />}

      <form onSubmit={handleSubmit} className="max-w-2xl rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-7">
        <div className="grid gap-5 sm:grid-cols-2">
          <Field label="Nom de l'Entreprise" full>
            <input
              required
              value={settings.business_name}
              onChange={(e) => setSettings({ ...settings, business_name: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="E-mail de l'Entreprise">
            <input
              required
              type="email"
              value={settings.business_email}
              onChange={(e) => setSettings({ ...settings, business_email: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="Téléphone de l'Entreprise">
            <input
              required
              value={settings.business_phone}
              onChange={(e) => setSettings({ ...settings, business_phone: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="Adresse de l'Entreprise" full>
            <input
              required
              value={settings.business_address}
              onChange={(e) => setSettings({ ...settings, business_address: e.target.value })}
              className="input"
            />
          </Field>

          <Field label="Intervalle des Créneaux (minutes)">
            <input
              required
              type="number"
              min={5}
              step={5}
              value={settings.slot_interval_minutes}
              onChange={(e) => setSettings({ ...settings, slot_interval_minutes: Number(e.target.value) })}
              className="input"
            />
          </Field>

          <Field label="Délai de Préavis de Réservation (heures)">
            <input
              required
              type="number"
              min={0}
              value={settings.booking_notice_hours}
              onChange={(e) => setSettings({ ...settings, booking_notice_hours: Number(e.target.value) })}
              className="input"
            />
          </Field>
        </div>

        <div className="mt-7 flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-electric-500 to-cyan-400 px-6 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110 disabled:opacity-60"
          >
            {saving && <Loader2 className="h-4 w-4 animate-spin" />}
            Enregistrer les Modifications
          </button>
          {saved && (
            <span className="flex items-center gap-1.5 text-sm text-success-500">
              <CheckCircle2 className="h-4 w-4" />
              Enregistré
            </span>
          )}
        </div>
      </form>
    </div>
  )
}

function Field({ label, full, children }: { label: string; full?: boolean; children: ReactNode }) {
  return (
    <label className={`flex flex-col gap-1.5 ${full ? 'sm:col-span-2' : ''}`}>
      <span className="text-xs font-medium text-white/60">{label}</span>
      {children}
    </label>
  )
}
