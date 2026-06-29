const STATS = [
  { value: '12 000+', label: 'Appareils réparés' },
  { value: '24 h', label: 'Délai de réparation moyen' },
  { value: '98 %', label: 'Clients satisfaits' },
  { value: '15 ans', label: "D'expérience technique" },
]

export function TrustBar() {
  return (
    <section className="bg-slate-900 py-14">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-y-10 sm:grid-cols-4 sm:divide-x sm:divide-white/10">
          {STATS.map((stat, i) => (
            <div key={stat.label} className={`flex flex-col ${i > 0 ? 'sm:pl-10' : ''}`}>
              <span className="font-display text-4xl font-bold tracking-tight text-white lg:text-5xl">
                {stat.value}
              </span>
              <span className="mt-2 text-sm text-white/50">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
