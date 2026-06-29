import { images } from '../../data/images'

const REASONS = [
  {
    title: 'Une Approche Centrée sur le Diagnostic',
    description:
      'Chaque réparation commence par un diagnostic complet, pour que vous sachiez exactement ce qui ne va pas avant le début des travaux.',
  },
  {
    title: 'Délai Rapide, Garanti',
    description:
      'La plupart des diagnostics et réparations standards sont réalisés en 24 à 48 heures, avec des options prioritaires disponibles.',
  },
  {
    title: 'Tarification 100 % Transparente',
    description: 'Tarifs forfaitaires sans frais cachés. Vous approuvez le coût avant toute réparation.',
  },
  {
    title: 'Techniciens Certifiés et Vérifiés',
    description:
      'Expérimentés sur du matériel grand public et professionnel. Chaque intervention est documentée.',
  },
]

export function WhyChooseUs() {
  return (
    <section id="why-us" className="bg-slate-50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-start">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Pourquoi Nous Choisir
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Un Support IT Fiable Soutenu par une Vraie Expertise
            </h2>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Nous combinons précision technique et communication claire — pour que vous compreniez
              toujours ce qui se passe avec votre appareil ou votre réseau.
            </p>

            <div className="mt-12 flex flex-col gap-0 divide-y divide-slate-200">
              {REASONS.map((reason, idx) => (
                <div key={reason.title} className="flex gap-6 py-7 first:pt-0 last:pb-0">
                  <span className="font-display text-4xl font-bold leading-none text-blue-600/[0.18] select-none w-10 shrink-0 pt-0.5">
                    {String(idx + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{reason.title}</h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{reason.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 lg:sticky lg:top-28">
            <div className="space-y-4">
              <img
                src={images.serverRoom}
                alt="Salle de serveurs avec baies réseau et câblage"
                className="h-56 w-full rounded-2xl object-cover"
              />
              <img
                src={images.cybersecurity}
                alt="Surveillance de cybersécurité sur un écran de poste de travail"
                className="h-40 w-full rounded-2xl object-cover"
              />
            </div>
            <div className="space-y-4 pt-8">
              <img
                src={images.networking}
                alt="Équipement réseau et panneau de brassage dans un environnement IT d'entreprise"
                className="h-40 w-full rounded-2xl object-cover"
              />
              <img
                src={images.laptopParts}
                alt="Composants matériels d'un ordinateur portable disposés pour réparation"
                className="h-56 w-full rounded-2xl object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
