import { ClipboardCheck, Package, Search, Wrench } from 'lucide-react'

const STEPS = [
  {
    icon: Search,
    number: '01',
    title: 'Diagnostiquer',
    duration: '~30 min',
    description:
      "Évaluation complète de l'appareil pour identifier la cause exacte du problème avant toute intervention.",
  },
  {
    icon: Wrench,
    number: '02',
    title: 'Réparer',
    duration: '2 – 4 h',
    description:
      'Réparation avec les pièces adaptées. Vous êtes informé à chaque étape, sans surprise sur le prix.',
  },
  {
    icon: ClipboardCheck,
    number: '03',
    title: 'Vérifier',
    duration: '~30 min',
    description:
      "Tests rigoureux post-réparation pour s'assurer que tout fonctionne parfaitement avant la restitution.",
  },
  {
    icon: Package,
    number: '04',
    title: 'Restituer',
    duration: 'Immédiat',
    description:
      "Votre appareil vous est rendu en parfait état, accompagné d'un rapport de service complet.",
  },
]

export function ProcessSection() {
  return (
    <section className="bg-slate-900 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">
              Notre Processus
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Réparation Précise en Quatre Étapes
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-white/50">
            Un processus structuré pour garantir des résultats fiables à chaque intervention.
          </p>
        </div>

        <div className="mt-14 grid gap-px bg-white/10 sm:grid-cols-2 rounded-2xl overflow-hidden">
          {STEPS.map((step) => (
            <div
              key={step.number}
              className="group relative overflow-hidden bg-slate-900 p-10 transition-colors hover:bg-slate-800"
            >
              <span className="absolute right-6 bottom-4 font-display text-[7rem] font-bold leading-none text-white/[0.07] select-none transition-all group-hover:text-white/[0.12]">
                {step.number}
              </span>

              <div className="flex items-start justify-between gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-blue-400">
                  <step.icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <span className="rounded-full border border-white/10 px-3 py-1 text-xs font-medium text-white/40">
                  {step.duration}
                </span>
              </div>

              <h3 className="mt-8 font-display text-xl font-semibold text-white">{step.title}</h3>
              <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/55">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
