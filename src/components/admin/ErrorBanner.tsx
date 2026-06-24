import { AlertTriangle, RotateCw, X } from 'lucide-react'

export function ErrorBanner({
  message,
  onDismiss,
  onRetry,
}: {
  message: string
  onDismiss?: () => void
  onRetry?: () => void
}) {
  return (
    <div className="mb-6 flex items-start gap-3 rounded-xl border border-danger-500/30 bg-danger-500/10 px-4 py-3 text-sm text-danger-500">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <p className="flex-1">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex shrink-0 items-center gap-1.5 rounded px-2 py-0.5 text-xs font-semibold hover:bg-danger-500/10"
        >
          <RotateCw className="h-3.5 w-3.5" />
          Réessayer
        </button>
      )}
      {onDismiss && (
        <button type="button" onClick={onDismiss} className="shrink-0 rounded p-0.5 hover:bg-danger-500/10">
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  )
}
