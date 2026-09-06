const TRUST_POINTS = [
  { value: 'Rapide', label: 'Diagnostic sous 24 h' },
  { value: 'Transparent', label: 'Devis gratuit, sans engagement' },
  { value: 'Garanti', label: '30 jours sur toute réparation' },
  { value: 'À domicile', label: 'Intervention directement chez vous' },
]

export function TrustBar() {
  return (
    <section className="bg-slate-900 py-16">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4 sm:divide-x sm:divide-white/[0.08]">
          {TRUST_POINTS.map((point, i) => (
            <div key={point.label} className={`flex flex-col ${i > 0 ? 'sm:pl-10' : ''}`}>
              <span className="mb-5 block h-px w-8 bg-blue-500" />
              <span className="font-display text-3xl font-bold tracking-tight text-white lg:text-4xl">
                {point.value}
              </span>
              <span className="mt-2.5 text-sm leading-relaxed text-white/50">{point.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
