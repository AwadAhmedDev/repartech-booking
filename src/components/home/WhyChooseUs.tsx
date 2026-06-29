import { Clock, DollarSign, SearchCheck, ShieldCheck } from 'lucide-react'
import { images } from '../../data/images'

const REASONS = [
  {
    icon: SearchCheck,
    title: 'Une Approche Centrée sur le Diagnostic',
    description:
      'Chaque réparation commence par un diagnostic complet, pour que vous sachiez exactement ce qui ne va pas avant le début des travaux.',
  },
  {
    icon: Clock,
    title: 'Délai Rapide',
    description:
      'La plupart des diagnostics et réparations standards sont réalisés en 24 à 48 heures, avec des options prioritaires disponibles.',
  },
  {
    icon: DollarSign,
    title: 'Tarification Transparente',
    description: "Tarifs forfaitaires sans frais cachés — vous approuvez le coût avant toute réparation.",
  },
  {
    icon: ShieldCheck,
    title: 'Techniciens Certifiés',
    description:
      'Techniciens certifiés et vérifiés, expérimentés sur du matériel grand public et professionnel.',
  },
]

export function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-slate-50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Pourquoi Nous Choisir
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Un Support IT Fiable Soutenu par une Vraie Expertise
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Nous combinons précision technique et communication claire — pour que vous compreniez
              toujours ce qui se passe avec votre appareil ou votre réseau, et pourquoi.
            </p>

            <div className="mt-10 grid gap-6 sm:grid-cols-2">
              {REASONS.map((reason) => (
                <div
                  key={reason.title}
                  className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
                >
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <reason.icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-slate-900">{reason.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{reason.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <img
                src={images.serverRoom}
                alt="Salle de serveurs avec baies réseau et câblage"
                className="h-56 w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
              />
              <img
                src={images.cybersecurity}
                alt="Surveillance de cybersécurité sur un écran de poste de travail"
                className="h-40 w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src={images.networking}
                alt="Équipement réseau et panneau de brassage dans un environnement IT d'entreprise"
                className="h-40 w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
              />
              <img
                src={images.laptopParts}
                alt="Composants matériels d'un ordinateur portable disposés pour réparation"
                className="h-56 w-full rounded-2xl border border-slate-200 object-cover shadow-sm"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
