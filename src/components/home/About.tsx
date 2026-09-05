import { ArrowRight } from 'lucide-react'
import { images } from '../../data/images'

const STATS = [
  { value: '15+', label: "ans d'expérience" },
  { value: '300+', label: 'entreprises clientes' },
  { value: '98 %', label: 'clients satisfaits' },
]

const CERTS = [
  'Microsoft Partner',
  'CompTIA Certified',
  'Apple Authorized',
]

export function About() {
  return (
    <section id="about" className="bg-white py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">

          {/* Image — left, wider column */}
          <div className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-2xl">
              <img
                src={images.supportTeam}
                alt="Techniciens de support RepaTek dans un environnement de bureau moderne"
                className="h-[520px] w-full object-cover"
              />
            </div>
            {/* Floating credential badge */}
            <div className="absolute -bottom-5 -right-4 hidden rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-lg lg:block">
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                Certifié &amp; Agréé
              </p>
              <div className="mt-2 flex flex-col gap-1">
                {CERTS.map((c) => (
                  <span key={c} className="text-sm font-medium text-slate-800">{c}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Content — right */}
          <div className="order-1 lg:order-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
              Notre Histoire
            </span>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
              Un Partenaire Technologique, Pas Seulement un Atelier de Réparation
            </h2>
            <p className="mt-5 text-base leading-relaxed text-slate-600">
              RepaTek a été conçu pour offrir aux particuliers et aux entreprises un endroit unique
              et fiable pour la réparation informatique et le support technologique. Nos techniciens
              interviennent sur les appareils grand public, les postes de travail professionnels et les
              environnements réseau complets.
            </p>
            <p className="mt-4 text-base leading-relaxed text-slate-600">
              Qu'il s'agisse d'un écran fissuré, d'une infection par logiciel malveillant, d'un disque
              dur défaillant ou d'un réseau d'entreprise à surveiller, nous traitons chaque
              intervention avec le même niveau de professionnalisme et de transparence.
            </p>

            <div className="mt-10 grid grid-cols-3 gap-4 border-t border-slate-100 pt-8">
              {STATS.map((stat) => (
                <div key={stat.label} className="border-l-2 border-blue-600 pl-4">
                  <p className="font-display text-2xl font-bold text-slate-900">{stat.value}</p>
                  <p className="mt-0.5 text-xs leading-relaxed text-slate-500">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <a
                href="#booking"
                className="group inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
              >
                Réserver une intervention
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
