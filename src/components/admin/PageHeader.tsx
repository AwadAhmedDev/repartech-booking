import type { ReactNode } from 'react'

export function PageHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">{title}</h1>
        {description && <p className="mt-1.5 text-sm text-white/50">{description}</p>}
      </div>
      {action}
    </div>
  )
}
