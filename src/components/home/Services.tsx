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
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Services Technologiques
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Support Technique pour Tous vos Appareils et Réseaux
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Des forfaits de service transparents et menés par des experts couvrant le diagnostic, la
            réparation, la sécurité, la récupération et le support IT continu pour les entreprises.
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

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((service, idx) => {
            const Icon = getServiceIcon(service.name)
            return (
              <div
                key={service.id}
                className="group relative flex flex-col rounded-2xl border border-slate-200 bg-white p-7 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-blue-300 hover:shadow-md animate-fade-up"
                style={{ animationDelay: `${idx * 80}ms` }}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50 text-blue-600 transition-colors group-hover:bg-blue-100">
                  <Icon className="h-6 w-6" strokeWidth={2} />
                </span>

                <h3 className="mt-5 font-display text-lg font-semibold text-slate-900">{service.name}</h3>
                <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">{service.description}</p>

                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                  <div>
                    <p className="font-display text-lg font-bold text-slate-900">
                      {formatCurrency(service.price)}
                    </p>
                    <p className="text-xs text-slate-500">{formatDuration(service.duration_minutes)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => onSelectService(service.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-xs font-semibold text-slate-700 transition-colors group-hover:border-blue-300 group-hover:bg-blue-50 group-hover:text-blue-700"
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
