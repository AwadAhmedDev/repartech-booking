import { Star } from 'lucide-react'

const TESTIMONIALS = [
  {
    quote:
      "Mon ordinateur portable était complètement mort avant de venir ici. En moins de 24 heures, il était réparé et parfaitement fonctionnel. Service impeccable, prix honnêtes, rien à redire.",
    name: 'Marc Lefebvre',
    role: 'Entrepreneur, Lyon',
    rating: 5,
  },
  {
    quote:
      "Après une attaque par ransomware sur notre réseau d'entreprise, RéparTech est intervenu rapidement et professionnellement. Tout a été récupéré. Je les recommande sans hésitation à toute PME.",
    name: 'Sophie Durand',
    role: 'Directrice Administrative, PME Textile',
    rating: 5,
  },
  {
    quote:
      "Transparent, rapide, et vraiment compétent. Ils m'ont expliqué clairement le diagnostic avant de commencer les réparations. Je ne fais plus confiance à personne d'autre pour mes appareils.",
    name: 'Antoine Moreau',
    role: 'Développeur Freelance, Paris',
    rating: 5,
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
      ))}
    </div>
  )
}

export function Testimonials() {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Témoignages
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Ce que Disent nos Clients
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Des milliers de clients et d'entreprises nous confient leurs appareils. Voici ce qu'ils en
            disent.
          </p>
        </div>

        <div className="mt-16 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div
              key={t.name}
              className="flex flex-col rounded-2xl border border-slate-200 bg-slate-50 p-8"
            >
              <Stars count={t.rating} />
              <blockquote className="mt-5 flex-1 text-sm leading-relaxed text-slate-700">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3 border-t border-slate-200 pt-6">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">{t.name}</p>
                  <p className="text-xs text-slate-500">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
