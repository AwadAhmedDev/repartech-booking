import { Component, type ErrorInfo, type ReactNode } from 'react'
import { RotateCw } from 'lucide-react'

interface State {
  hasError: boolean
}

export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('Uncaught render error:', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-navy-950 px-6 text-center">
          <h1 className="font-display text-2xl font-bold text-white">
            Une erreur inattendue s'est produite
          </h1>
          <p className="mt-3 max-w-sm text-sm text-white/55">
            Veuillez recharger la page. Si le problème persiste, contactez-nous directement.
          </p>
          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-electric-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110"
          >
            <RotateCw className="h-4 w-4" />
            Recharger la page
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
