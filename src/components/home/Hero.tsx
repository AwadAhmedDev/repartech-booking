import { ArrowRight, CheckCircle2, Clock, MapPin, Star } from 'lucide-react'
import { images } from '../../data/images'

const GUARANTEES = [
  'Devis gratuit',
  'Garantie 30 jours',
  'Pas de frais cachés',
  'Diagnostic sous 24 h',
]

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid min-h-[92vh] items-center gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-stretch">

          {/* Left — content */}
          <div className="flex flex-col justify-center pb-16 pt-32 lg:py-0 lg:pt-0">
            {/* Social proof */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-sm text-slate-600">
                <strong className="font-semibold text-slate-900">4.9 / 5</strong>
                <span className="mx-2 text-slate-300">·</span>
                200+ clients satisfaits
              </span>
            </div>

            <h1 className="mt-7 font-display text-5xl font-bold leading-[1.04] tracking-tight text-slate-900 sm:text-6xl lg:text-7xl">
              Réparation
              <br />
              Informatique
              <span className="block text-blue-600">Experte &amp; Fiable</span>
            </h1>

            <p className="mt-7 max-w-lg text-lg leading-relaxed text-slate-600">
              Pannes matérielles, virus, réseaux — nos techniciens certifiés diagnostiquent et réparent
              vos appareils rapidement, avec un devis clair avant toute intervention.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
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

          {/* Right — full-height image with overlay, desktop only */}
          <div className="relative hidden lg:block">
            <div className="absolute inset-0 overflow-hidden">
              <img
                src={images.heroWorkstation}
                alt="Technicien certifié RéparTech effectuant un diagnostic sur un ordinateur portable"
                className="h-full w-full object-cover"
              />
              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/15 to-transparent" />
              {/* Info chips at the bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-10">
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
      <div className="overflow-hidden lg:hidden">
        <img
          src={images.heroWorkstation}
          alt="Technicien certifié RéparTech"
          className="h-64 w-full object-cover"
        />
      </div>
    </section>
  )
}
