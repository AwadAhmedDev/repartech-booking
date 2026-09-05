import { ArrowRight, CheckCircle2, Clock, MapPin, ShieldCheck } from 'lucide-react'
import { images } from '../../data/images'

const GUARANTEES = [
  'Devis gratuit',
  'Garantie 30 jours',
  'Pas de frais cachés',
  'Diagnostic sous 24 h',
]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white pt-[var(--nav-h)]">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid items-center gap-12 py-14 sm:py-16 lg:min-h-[calc(100svh-var(--nav-h))] lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch lg:gap-14 lg:py-20">

          {/* Left — content */}
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-2 rounded-full border border-blue-100 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold tracking-wide text-blue-700">
              <ShieldCheck className="h-3.5 w-3.5" />
              Techniciens certifiés · Intervention sous 24 h
            </span>

            <h1 className="mt-6 font-display text-[2.6rem] font-bold leading-[1.06] tracking-tight text-slate-900 sm:text-6xl lg:text-[4.25rem]">
              Réparation
              <br />
              Informatique
              <span className="block text-blue-600">Experte &amp; Fiable</span>
            </h1>

            <p className="mt-6 max-w-lg text-base leading-relaxed text-slate-600 sm:text-lg">
              Pannes matérielles, virus, réseaux — nos techniciens certifiés diagnostiquent et réparent
              vos appareils rapidement, avec un devis clair avant toute intervention.
            </p>

            <div className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center">
              <a
                href="#booking"
                className="group inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-4 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700"
              >
                Prendre Rendez-vous
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
              <a
                href="#services"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 bg-white px-8 py-4 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
              >
                Voir nos services
              </a>
            </div>

            {/* Trust guarantees */}
            <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 border-t border-slate-200 pt-8">
              {GUARANTEES.map((g) => (
                <span key={g} className="flex items-center gap-2 text-sm text-slate-600">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-blue-600" />
                  {g}
                </span>
              ))}
            </div>
          </div>

          {/* Right — full-height image card, desktop only */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 overflow-hidden rounded-2xl shadow-[0_24px_70px_-30px_rgba(15,23,42,0.55)] ring-1 ring-slate-900/5">
              <img
                src={images.heroWorkstation}
                alt="Technicien certifié RéparTech effectuant un diagnostic sur un ordinateur portable"
                className="h-full w-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/85 via-slate-900/20 to-transparent" />
              {/* Info chips at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-8 xl:p-10">
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2.5">
                    <Clock className="h-4 w-4 shrink-0 text-white/60" />
                    <span className="text-sm font-medium text-white/90">
                      Diagnostic disponible le jour même
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <MapPin className="h-4 w-4 shrink-0 text-white/60" />
                    <span className="text-sm font-medium text-white/90">
                      Lun – Sam, 9h – 18h · Service à domicile disponible
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Mobile image */}
      <div className="px-6 pb-14 lg:hidden">
        <div className="relative overflow-hidden rounded-2xl ring-1 ring-slate-900/5">
          <img
            src={images.heroWorkstation}
            alt="Technicien certifié RéparTech"
            className="h-60 w-full object-cover sm:h-72"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex flex-col gap-2 p-5">
            <span className="flex items-center gap-2 text-sm font-medium text-white/90">
              <Clock className="h-4 w-4 shrink-0 text-white/60" />
              Diagnostic disponible le jour même
            </span>
            <span className="flex items-center gap-2 text-sm font-medium text-white/90">
              <MapPin className="h-4 w-4 shrink-0 text-white/60" />
              Lun – Sam, 9h – 18h
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
