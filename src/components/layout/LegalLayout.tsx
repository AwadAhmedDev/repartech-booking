import { usePageMeta } from '../../lib/seo'
import type { ReactNode } from 'react'

interface Props {
  title: string
  subtitle: string
  updated: string
  children: ReactNode
}

export function LegalLayout({ title, subtitle, updated, children }: Props) {
  usePageMeta(title)
  return (
    <div className="bg-white pt-24 pb-28 lg:pt-32">
      <div className="mx-auto max-w-3xl px-6 lg:px-8">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-600">
            {subtitle}
          </span>
          <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-sm text-slate-500">Dernière mise à jour : {updated}</p>
        </div>

        {/* Prose content */}
        <div className="mt-10 space-y-8 text-sm leading-relaxed text-slate-700">
          {children}
        </div>
      </div>
    </div>
  )
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="mb-3 font-display text-base font-semibold text-slate-900">{title}</h2>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

export function P({ children }: { children: ReactNode }) {
  return <p>{children}</p>
}

export function Ul({ items }: { items: string[] }) {
  return (
    <ul className="ml-4 space-y-1.5 list-disc marker:text-blue-400">
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </ul>
  )
}
