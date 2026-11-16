import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowLeft, ArrowRight, CheckCircle2, Clock, Loader2 } from 'lucide-react'
import { fetchActiveServices } from '../lib/api'
import { formatDuration, formatPriceRange } from '../lib/format'
import { getServiceIcon } from '../lib/iconMap'
import { slugify } from '../lib/slug'
import { SITE_URL, useJsonLd, usePageMeta } from '../lib/seo'
import { SERVICE_CONTENT } from '../data/serviceContent'
import type { Service } from '../types/database'

export function ServicePage() {
  const { slug = '' } = useParams()
  const [services, setServices] = useState<Service[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    fetchActiveServices()
      .then(setServices)
      .catch((err) => {
        console.error('Failed to load services:', err)
        setFailed(true)
      })
  }, [])

  const service = services?.find((s) => slugify(s.name) === slug) ?? null
  const content = SERVICE_CONTENT[slug]
  const notFound = services !== null && !service

  usePageMeta(service ? (content?.seoTitle ?? `${service.name} aux Ulis`) : notFound ? 'Service introuvable' : undefined, {
    noindex: notFound,
    description: service
      ? `${service.name} aux Ulis (91) et en Essonne : ${formatPriceRange(service.price, service.price_max)}, ${formatDuration(service.duration_minutes)}. Devis gratuit, service à domicile.`
      : undefined,
  })
  useJsonLd(
    service && {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: service.name,
      description: service.description,
      url: `${SITE_URL}/services/${slug}`,
      areaServed: ['Les Ulis', 'Essonne'],
      provider: { '@id': `${SITE_URL}/#entreprise` },
      offers: {
        '@type': 'Offer',
        priceCurrency: 'EUR',
        price: service.price,
        ...(service.price_max && service.price_max > service.price
          ? {
              priceSpecification: {
                '@type': 'PriceSpecification',
                priceCurrency: 'EUR',
                minPrice: service.price,
                maxPrice: service.price_max,
              },
            }
          : {}),
      },
    },
  )

  return (
    <div className="min-h-screen bg-white pt-24 pb-28 lg:pt-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        <Link to="/#services" className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-blue-600">
          <ArrowLeft className="h-4 w-4" />
          Tous les services
        </Link>

        {!services && !failed && (
          <p className="mt-16 flex items-center justify-center gap-2 text-slate-500">
            <Loader2 className="h-5 w-5 animate-spin" />
            Chargement…
          </p>
        )}

        {failed && (
          <p className="mt-16 rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-center text-sm text-red-600">
            Impossible de charger ce service pour le moment. Réessayez plus tard ou appelez-nous.
          </p>
        )}

        {notFound && (
          <div className="mt-16 text-center">
            <h1 className="font-display text-2xl font-bold text-slate-900">Service introuvable</h1>
            <p className="mt-3 text-slate-500">Ce service n'existe pas ou n'est plus proposé.</p>
          </div>
        )}

        {service && <ServiceDetails service={service} />}
      </div>
    </div>
  )
}

function ServiceDetails({ service }: { service: Service }) {
  const content = SERVICE_CONTENT[slugify(service.name)]
  const Icon = getServiceIcon(service.name)

  return (
    <article className="mt-8">
      <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-700">
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </span>
      <span className="mt-6 block text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
        Les Ulis · Essonne (91)
      </span>
      <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        {service.name}
      </h1>

      <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-700">
        <span className="font-display text-2xl font-bold text-slate-900">
          {formatPriceRange(service.price, service.price_max)}
        </span>
        <span className="inline-flex items-center gap-1.5 text-sm">
          <Clock className="h-4 w-4 text-slate-500" />
          {formatDuration(service.duration_minutes)}
        </span>
      </div>

      <div className="mt-8 space-y-5 leading-relaxed text-slate-700">
        {content && <p className="text-lg">{content.intro}</p>}
        <p>{service.description}</p>
      </div>

      {content && content.whenToCall.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-slate-900">Quand faire appel à nous ?</h2>
          <ul className="mt-4 space-y-2.5">
            {content.whenToCall.map((item) => (
              <li key={item} className="flex gap-2.5 text-slate-700">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-600" />
                {item}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10">
        <h2 className="font-display text-xl font-semibold text-slate-900">Comment ça se passe ?</h2>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-slate-700 marker:font-semibold marker:text-blue-600">
          <li>Vous réservez un créneau en ligne ou par téléphone.</li>
          <li>Je me déplace chez vous, j'établis un diagnostic et vous remets un devis gratuit, sans engagement.</li>
          <li>Après votre accord, je réalise l'intervention sur place (ou à distance pour les problèmes logiciels simples).</li>
          <li>Vous réglez à la fin de la prestation (espèces ou carte) ; la réparation est garantie 30 jours.</li>
        </ol>
      </section>

      {content && content.faq.length > 0 && (
        <section className="mt-10">
          <h2 className="font-display text-xl font-semibold text-slate-900">Questions fréquentes</h2>
          <dl className="mt-4 divide-y divide-slate-200 border-y border-slate-200">
            {content.faq.map(({ q, a }) => (
              <div key={q} className="py-4">
                <dt className="font-semibold text-slate-900">{q}</dt>
                <dd className="mt-1.5 text-slate-700">{a}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-4 text-sm text-slate-500">
            D'autres questions ? Consultez notre <Link to="/faq" className="font-medium text-blue-700 underline">FAQ</Link>.
          </p>
        </section>
      )}

      <div className="mt-12 flex flex-col items-start gap-4 rounded-2xl bg-slate-900 p-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-display text-lg font-semibold text-white">Besoin de ce service ?</p>
          <p className="mt-1 text-sm text-white/75">Devis gratuit, intervention aux Ulis et alentours.</p>
        </div>
        <Link
          to={`/?service=${service.id}#booking`}
          className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Réserver ce service
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </article>
  )
}
