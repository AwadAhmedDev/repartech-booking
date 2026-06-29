import { Award, Clock, Star, Wrench } from 'lucide-react'

const STATS = [
  { icon: Wrench, value: '12 000+', label: 'Appareils réparés' },
  { icon: Clock, value: '24 h', label: 'Délai de réparation moyen' },
  { icon: Star, value: '98 %', label: 'Clients satisfaits' },
  { icon: Award, value: '15 ans', label: "D'expérience technique" },
]

export function TrustBar() {
  return (
    <section className="border-y border-slate-200 bg-slate-50 py-10">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center sm:flex-row sm:items-center sm:gap-4 sm:text-left"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100">
                <stat.icon className="h-6 w-6 text-blue-600" />
              </span>
              <div className="mt-3 sm:mt-0">
                <div className="font-display text-2xl font-bold text-slate-900">{stat.value}</div>
                <div className="mt-0.5 text-xs text-slate-500">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
