import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote:
      "Mon ordinateur portable était complètement mort avant de venir ici. En moins de 24 heures, il était réparé et parfaitement fonctionnel. Service impeccable, prix honnêtes, rien à redire.",
    name: 'Marc Lefebvre',
    role: 'Entrepreneur',
    location: 'Lyon',
    rating: 5,
  },
  {
    quote:
      "Après une attaque par ransomware sur notre réseau d'entreprise, RéparTech est intervenu rapidement et professionnellement. Tout a été récupéré. Je les recommande sans hésitation.",
    name: 'Sophie Durand',
    role: 'Directrice Administrative',
    location: 'PME Textile',
    rating: 5,
  },
  {
    quote:
      "Transparent, rapide, et vraiment compétent. Ils m'ont expliqué clairement le diagnostic avant de commencer. Je ne fais plus confiance à personne d'autre pour mes appareils.",
    name: 'Antoine Moreau',
    role: 'Développeur Freelance',
    location: 'Paris',
    rating: 5,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

export function Testimonials() {
  const [featured, ...rest] = TESTIMONIALS

  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Témoignages
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Ce que Disent nos Clients
            </h2>
          </div>
          <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-4 py-2 self-start sm:self-auto">
            <Stars count={5} />
            <span className="text-xs font-semibold text-amber-700">4.9 / 5 · 200+ avis</span>
          </div>
        </div>

        <div className="mt-12 relative overflow-hidden rounded-2xl bg-slate-900 p-10 lg:p-14">
          <span className="pointer-events-none absolute -top-4 left-8 font-display text-[10rem] leading-none text-white/5 select-none lg:text-[14rem]">
            "
          </span>
          <div className="relative max-w-3xl">
            <Stars count={featured.rating} />
            <blockquote className="mt-6 font-display text-xl font-medium leading-relaxed text-white sm:text-2xl lg:text-3xl lg:leading-snug">
              {featured.quote}
            </blockquote>
            <div className="mt-8 flex items-center gap-3">
              <span className="h-px w-8 bg-white/20" />
              <span className="text-sm font-semibold text-white">{featured.name}</span>
              <span className="text-sm text-white/40">{featured.role} · {featured.location}</span>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          {rest.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-8"
            >
              <Stars count={t.rating} />
              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-slate-700">
                {t.quote}
              </blockquote>
              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                <p className="text-xs text-slate-500">{t.role} · {t.location}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
