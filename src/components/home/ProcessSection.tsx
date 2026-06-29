import { ClipboardCheck, Package, Search, Wrench } from 'lucide-react'

const STEPS = [
  {
    icon: Search,
    title: 'Diagnostiquer',
    description:
      "Nous évaluons l'appareil en profondeur pour identifier la cause exacte du problème avant toute intervention.",
    number: '01',
  },
  {
    icon: Wrench,
    title: 'Réparer',
    description:
      'Notre technicien effectue la réparation avec les pièces adaptées, en vous tenant informé à chaque étape.',
    number: '02',
  },
  {
    icon: ClipboardCheck,
    title: 'Vérifier',
    description:
      "Chaque réparation est soumise à une série de tests rigoureux pour s'assurer que tout fonctionne parfaitement.",
    number: '03',
  },
  {
    icon: Package,
    title: 'Restituer',
    description:
      "Votre appareil vous est restitué en parfait état, accompagné d'un rapport de service complet.",
    number: '04',
  },
]

export function ProcessSection() {
  return (
    <section className="bg-slate-50 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="mx-auto max-w-2xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            Notre Processus
          </span>
          <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Réparation Précise en Quatre Étapes
          </h2>
          <p className="mt-4 text-base leading-relaxed text-slate-600">
            Chaque intervention suit un processus structuré pour garantir des résultats fiables et une
            expérience transparente à chaque fois.
          </p>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-1/2 top-8 hidden h-0.5 w-3/4 -translate-x-1/2 bg-slate-200 lg:block" />

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {STEPS.map((step) => (
              <div key={step.number} className="relative flex flex-col items-center text-center">
                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-blue-600 bg-white shadow-sm">
                  <step.icon className="h-7 w-7 text-blue-600" strokeWidth={1.75} />
                  <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-5 font-display text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
