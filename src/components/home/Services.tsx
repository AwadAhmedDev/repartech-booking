import { useEffect, useState } from 'react'
import { ArrowRight, Loader2, RotateCw } from 'lucide-react'
import { fetchActiveServices } from '../../lib/api'
import { formatCurrency, formatDuration } from '../../lib/format'
import { getServiceIcon } from '../../lib/iconMap'
import type { Service } from '../../types/database'

export function Services({ onSelectService }: { onSelectService: (serviceId: string) => void }) {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    load()
  }, [])

  function load() {
    setLoading(true)
    setError(null)
    fetchActiveServices()
      .then(setServices)
      .catch((err) => {
        console.error('Failed to load active services:', err)
        setError('Impossible de charger les services pour le moment.')
      })
      .finally(() => setLoading(false))
  }

  return (
    <section id="services" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Services Technologiques
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Support Technique pour Tous vos Appareils
            </h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-slate-500 sm:text-right">
            Diagnostics, réparations, sécurité et support réseau — des forfaits transparents sans
            frais cachés.
          </p>
        </div>

        {loading && (
          <div className="mt-16 flex items-center justify-center gap-2 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Chargement des services…
          </div>
        )}

        {error && (
          <div className="mt-16 flex flex-col items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-center text-sm text-red-600">
            <p>{error}</p>
            <button
              type="button"
              onClick={load}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-300 px-3 py-1.5 text-xs font-semibold hover:bg-red-100"
            >
              <RotateCw className="h-3.5 w-3.5" />
              Réessayer
            </button>
          </div>
        )}

        {!loading && !error && services.length === 0 && (
          <p className="mt-16 text-center text-slate-500">Aucun service n'est actuellement disponible.</p>
        )}

        <div className="mt-12 grid gap-px bg-slate-200 sm:grid-cols-2 lg:grid-cols-3 rounded-2xl overflow-hidden">
          {services.map((service, idx) => {
            const Icon = getServiceIcon(service.name)
            return (
              <div
                key={service.id}
                className="group relative flex flex-col bg-white p-8 transition-colors hover:bg-blue-50 animate-fade-up"
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-100 text-slate-600 transition-colors group-hover:bg-blue-100 group-hover:text-blue-700">
                    <Icon className="h-5 w-5" strokeWidth={1.75} />
                  </span>
                  <span className="font-display text-3xl font-bold text-slate-100 transition-colors group-hover:text-blue-100 select-none leading-none">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">{service.name}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{service.description}</p>

                <div className="mt-7 flex items-center justify-between">
                  <div>
                    <p className="font-display text-xl font-bold text-slate-900">
                      {formatCurrency(service.price)}
                    </p>
                    <p className="text-xs text-slate-500">{formatDuration(service.duration_minutes)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectService(service.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-600"
                  >
                    Réserver
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
