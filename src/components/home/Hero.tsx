import { ArrowRight, Zap } from 'lucide-react'
import { images } from '../../data/images'

const STATS = [
  { label: 'Appareils réparés', value: '12 000+' },
  { label: 'Délai moyen', value: '24 h' },
  { label: 'Satisfaction client', value: '98 %' },
]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div
        className="absolute inset-0 -z-10 opacity-[0.04]"
        style={{
          backgroundImage:
            'linear-gradient(#0f172a 1px, transparent 1px), linear-gradient(90deg, #0f172a 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="absolute -top-40 -right-40 -z-10 h-[560px] w-[560px] rounded-full bg-blue-50 blur-[120px]" />

      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10">
        <div className="animate-fade-up">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">
              Diagnostic disponible le jour même
            </span>
          </div>

          <h1 className="mt-7 font-display text-4xl font-bold leading-[1.06] tracking-tight text-slate-900 sm:text-5xl lg:text-[3.75rem]">
            Réparation Informatique Experte
            <span className="block text-blue-600">&amp; Support IT de Confiance</span>
          </h1>

          <p className="mt-7 max-w-lg text-lg leading-relaxed text-slate-600">
            Des pannes matérielles aux interruptions réseau, nos techniciens certifiés offrent un
            support technique rapide, transparent et fiable — basé sur de vrais diagnostics, jamais
            des suppositions.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#booking"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
            >
              Réserver un Service
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-8 py-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
            >
              Découvrir nos Services
            </a>
          </div>

          <div className="mt-14 flex items-center gap-8 border-t border-slate-200 pt-8">
            {STATS.map((stat, i) => (
              <div key={stat.label} className={`${i > 0 ? 'border-l border-slate-200 pl-8' : ''}`}>
                <div className="font-display text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="mt-0.5 text-xs text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-fade-in">
          <div className="overflow-hidden rounded-2xl">
            <img
              src={images.heroWorkstation}
              alt="Technicien effectuant un diagnostic sur un ordinateur portable dans un atelier de réparation moderne"
              className="h-[500px] w-full object-cover lg:h-[580px]"
            />
          </div>

          <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-600">
              <Zap className="h-4 w-4 text-white" strokeWidth={2.5} />
            </span>
            <div>
              <p className="text-sm font-semibold text-slate-900">Réponse rapide garantie</p>
              <p className="text-xs text-slate-500">Diagnostic sous 24 h · Réparation sous 48 h</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
