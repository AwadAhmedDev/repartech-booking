import { Award, Users, Wrench } from 'lucide-react'
import { images } from '../../data/images'

const HIGHLIGHTS = [
  { icon: Award, label: 'Plus de 15 ans d\'expérience technique cumulée' },
  { icon: Users, label: 'Plus de 300 entreprises locales nous font confiance' },
  { icon: Wrench, label: 'Toutes les grandes marques de matériel prises en charge' },
]

export function About() {
  return (
    <section id="about" className="relative bg-navy-950 py-24 lg:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid gap-16 lg:grid-cols-2 lg:items-center">
          <div className="relative order-2 lg:order-1">
            <div className="overflow-hidden rounded-2xl border border-white/10 shadow-premium">
              <img
                src={images.supportTeam}
                alt="Techniciens de support RéparTech dans un environnement de bureau moderne"
                className="h-[440px] w-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 hidden w-60 rounded-xl glass-panel p-5 shadow-premium sm:block">
              <p className="font-display text-3xl font-bold text-white">98 %</p>
              <p className="mt-1 text-xs text-white/55">des clients notent leur service 5 étoiles</p>
            </div>
          </div>

          <div className="order-1 lg:order-2">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400">
              À Propos de Nous
            </span>
            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Un Partenaire Technologique, Pas Seulement un Atelier de Réparation
            </h2>
            <p className="mt-5 text-base leading-relaxed text-white/55">
              RéparTech a été conçu pour offrir aux particuliers et aux entreprises un endroit
              unique et fiable pour la réparation informatique et le support technologique. Nos
              techniciens interviennent sur les appareils grand public, les postes de travail
              professionnels et les environnements réseau complets — combinant compétence pratique en
              réparation matérielle, diagnostics structurés et communication claire.
            </p>
            <p className="mt-4 text-base leading-relaxed text-white/55">
              Qu'il s'agisse d'un écran d'ordinateur portable fissuré, d'une infection par logiciel
              malveillant, d'un disque dur défaillant ou d'un réseau d'entreprise à surveiller, nous
              traitons chaque intervention avec le même niveau de professionnalisme et de transparence.
            </p>

            <div className="mt-8 flex flex-col gap-4">
              {HIGHLIGHTS.map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-300">
                    <item.icon className="h-4.5 w-4.5" />
                  </span>
                  <span className="text-sm text-white/70">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
