import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Cpu, Loader2, Lock, Mail } from 'lucide-react'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

export function AdminLoginPage() {
  const { session, loading, signIn } = useAdminAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // If any session exists, send to /admin — AdminLayout handles both
  // the authorised dashboard and the "access restricted" screen.
  if (!loading && session) {
    return <Navigate to="/admin" replace />
  }

  async function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error: signInError } = await signIn(email, password)
    if (signInError) setError(signInError)
    setSubmitting(false)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-950 px-6">
      <div className="absolute -top-24 right-0 -z-10 h-[480px] w-[480px] rounded-full bg-electric-500/15 blur-[120px]" />

      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-electric-500 to-cyan-400 shadow-glow">
            <Cpu className="h-6 w-6 text-white" strokeWidth={2.25} />
          </span>
          <h1 className="mt-4 font-display text-2xl font-bold text-white">Connexion Administrateur</h1>
          <p className="mt-1.5 text-sm text-white/50">Tableau de bord de gestion RepaTek</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 shadow-premium">
          <label className="flex flex-col gap-1.5">
            <span className="text-xs font-medium text-white/60">E-mail</span>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@northbridgeit.com"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-cyan-400/60"
              />
            </div>
          </label>

          <label className="mt-4 flex flex-col gap-1.5">
            <span className="text-xs font-medium text-white/60">Mot de Passe</span>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
              <input
                type="password"
                required
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-lg border border-white/10 bg-white/[0.04] py-2.5 pl-9 pr-3.5 text-sm text-white placeholder:text-white/30 outline-none transition-colors focus:border-cyan-400/60"
              />
            </div>
          </label>

          {error && (
            <p className="mt-4 rounded-lg border border-danger-500/30 bg-danger-500/10 px-3.5 py-2.5 text-xs text-danger-500">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-electric-500 to-cyan-400 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
            Se Connecter
          </button>
        </form>
      </div>
    </div>
  )
}
