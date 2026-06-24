import { ArrowRight, ShieldCheck, Wrench, Zap } from 'lucide-react'
import { images } from '../../data/images'

const STATS = [
  { label: 'Appareils réparés', value: '12 000+' },
  { label: 'Délai moyen', value: '24 h' },
  { label: 'Satisfaction client', value: '98 %' },
]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-navy-950 pt-32 pb-24 lg:pt-40 lg:pb-32">
      <div
        className="absolute inset-0 -z-10 grid-fade-mask opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px)',
          backgroundSize: '64px 64px',
        }}
      />
      <div className="absolute -top-24 right-0 -z-10 h-[480px] w-[480px] rounded-full bg-electric-500/20 blur-[120px]" />
      <div className="absolute top-1/2 left-0 -z-10 h-[400px] w-[400px] rounded-full bg-cyan-400/10 blur-[120px]" />

      <div className="mx-auto grid max-w-7xl gap-16 px-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-10">
        <div className="animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-cyan-300">
            <Zap className="h-3.5 w-3.5" />
            Diagnostic disponible le jour même
          </div>

          <h1 className="mt-6 font-display text-4xl font-bold leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-6xl">
            Réparation Informatique Experte
            <span className="block text-gradient">&amp; Support IT de Confiance</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-white/60">
            Des pannes matérielles aux interruptions réseau, nos techniciens certifiés offrent un
            support technique rapide, transparent et fiable pour particuliers et entreprises — basé sur
            de vrais diagnostics, jamais des suppositions.
          </p>

          <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href="#booking"
              className="group inline-flex items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-electric-500 to-cyan-400 px-7 py-3.5 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110 hover:shadow-[0_0_40px_-4px_rgba(34,211,238,0.55)]"
            >
              Réserver un Service
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </a>
            <a
              href="#services"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/15 bg-white/5 px-7 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
            >
              Voir les Services
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <div className="font-display text-2xl font-bold text-white">{stat.value}</div>
                <div className="mt-1 text-xs text-white/50">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative animate-fade-in">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 shadow-premium">
            <img
              src={images.heroWorkstation}
              alt="Technicien effectuant un diagnostic sur un ordinateur portable dans un atelier de réparation moderne"
              className="h-[480px] w-full object-cover lg:h-[560px]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/10 to-transparent" />
          </div>

          <div className="absolute -bottom-6 -left-6 hidden w-56 animate-float rounded-xl glass-panel p-4 shadow-premium sm:block">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-success-500/15">
                <ShieldCheck className="h-5 w-5 text-success-500" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Techniciens Certifiés</p>
                <p className="text-xs text-white/50">Vérifiés et qualifiés</p>
              </div>
            </div>
          </div>

          <div className="absolute -top-6 -right-4 hidden w-52 animate-float rounded-xl glass-panel p-4 shadow-premium sm:block" style={{ animationDelay: '1.2s' }}>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-electric-500/15">
                <Wrench className="h-5 w-5 text-electric-300" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">Diagnostic Avant Tout</p>
                <p className="text-xs text-white/50">Réparations sans incertitude</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
