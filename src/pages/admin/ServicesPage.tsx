import { useEffect, useState } from 'react'
import { Loader2, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  createService,
  deleteService,
  fetchAllServices,
  updateService,
  type ServiceInput,
} from '../../lib/api'
import { formatCurrency, formatDuration } from '../../lib/format'
import { getServiceIcon } from '../../lib/iconMap'
import { PageHeader } from '../../components/admin/PageHeader'
import { ServiceFormDialog } from '../../components/admin/ServiceFormDialog'
import { ErrorBanner } from '../../components/admin/ErrorBanner'
import type { Service } from '../../types/database'

export function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [dialogState, setDialogState] = useState<'closed' | 'new' | Service>('closed')
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  function load() {
    setLoading(true)
    setLoadError(null)
    fetchAllServices()
      .then(setServices)
      .catch((err) => {
        console.error('Failed to load services:', err)
        setLoadError('Impossible de charger les services. Veuillez réessayer.')
      })
      .finally(() => setLoading(false))
  }

  // Throws on failure so ServiceFormDialog can display the error inline and
  // keep the form open with the user's input intact.
  async function handleSave(input: ServiceInput) {
    if (dialogState !== 'closed' && dialogState !== 'new') {
      await updateService(dialogState.id, input)
    } else {
      await createService(input)
    }
    setDialogState('closed')
    load()
  }

  async function handleToggleActive(service: Service) {
    setTogglingId(service.id)
    setActionError(null)
    try {
      await updateService(service.id, { is_active: !service.is_active })
      setServices((prev) => prev.map((s) => (s.id === service.id ? { ...s, is_active: !s.is_active } : s)))
    } catch (err) {
      console.error('Failed to toggle service active state:', err)
      setActionError(`Impossible de modifier la disponibilité de « ${service.name} ». Veuillez réessayer.`)
    } finally {
      setTogglingId(null)
    }
  }

  async function handleDelete(service: Service) {
    if (!window.confirm(`Supprimer « ${service.name} » ? Cette action est irréversible.`)) return
    setDeletingId(service.id)
    setActionError(null)
    try {
      await deleteService(service.id)
      setServices((prev) => prev.filter((s) => s.id !== service.id))
    } catch (err) {
      console.error('Failed to delete service:', err)
      setActionError(`Impossible de supprimer « ${service.name} ». Veuillez réessayer.`)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div>
      <PageHeader
        title="Services"
        description="Gérez les services que les clients peuvent réserver sur le site public."
        action={
          <button
            type="button"
            onClick={() => setDialogState('new')}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-electric-500 to-cyan-400 px-4 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110"
          >
            <Plus className="h-4 w-4" />
            Ajouter un Service
          </button>
        }
      />

      {loadError && <ErrorBanner message={loadError} onRetry={load} />}
      {actionError && <ErrorBanner message={actionError} onDismiss={() => setActionError(null)} />}

      {loading ? (
        <div className="flex items-center justify-center py-24 text-white/50">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      ) : services.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center text-sm text-white/45">
          Aucun service pour le moment. Ajoutez-en un pour le proposer sur le site public.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service) => {
            const Icon = getServiceIcon(service.name)
            return (
              <div key={service.id} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-500/15 text-electric-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setDialogState(service)}
                      className="rounded-lg p-1.5 text-white/50 hover:bg-white/5 hover:text-white"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      type="button"
                      disabled={deletingId === service.id}
                      onClick={() => handleDelete(service)}
                      className="rounded-lg p-1.5 text-white/50 hover:bg-danger-500/10 hover:text-danger-500 disabled:opacity-60"
                    >
                      {deletingId === service.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <h3 className="mt-4 font-display text-sm font-semibold text-white">{service.name}</h3>
                <p className="mt-1.5 line-clamp-2 text-xs text-white/50">{service.description}</p>

                <div className="mt-4 flex items-center justify-between text-xs text-white/45">
                  <span>{formatCurrency(service.price)}</span>
                  <span>{formatDuration(service.duration_minutes)}</span>
                </div>

                <button
                  type="button"
                  disabled={togglingId === service.id}
                  onClick={() => handleToggleActive(service)}
                  className={`mt-4 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold transition-colors disabled:opacity-60 ${
                    service.is_active
                      ? 'bg-success-500/15 text-success-500 hover:bg-success-500/25'
                      : 'bg-white/5 text-white/50 hover:bg-white/10'
                  }`}
                >
                  {togglingId === service.id && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
                  {service.is_active ? 'Actif — Cliquer pour Désactiver' : 'Inactif — Cliquer pour Activer'}
                </button>
              </div>
            )
          })}
        </div>
      )}

      {dialogState !== 'closed' && (
        <ServiceFormDialog
          initial={dialogState === 'new' ? null : dialogState}
          onSave={handleSave}
          onClose={() => setDialogState('closed')}
        />
      )}
    </div>
  )
}
