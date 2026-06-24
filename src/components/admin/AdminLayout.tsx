import { NavLink, Navigate, Outlet } from 'react-router-dom'
import {
  CalendarOff,
  Clock,
  Cpu,
  Gauge,
  Loader2,
  LogOut,
  Settings,
  ShieldAlert,
  Wrench,
} from 'lucide-react'
import { useAdminAuth } from '../../contexts/AdminAuthContext'

const NAV_ITEMS = [
  { to: '/admin', label: "Vue d'ensemble", icon: Gauge, end: true },
  { to: '/admin/appointments', label: 'Rendez-vous', icon: Cpu, end: false },
  { to: '/admin/services', label: 'Services', icon: Wrench, end: false },
  { to: '/admin/business-hours', label: "Horaires d'Ouverture", icon: Clock, end: false },
  { to: '/admin/blocked-dates', label: 'Dates Bloquées', icon: CalendarOff, end: false },
  { to: '/admin/settings', label: "Paramètres de l'Entreprise", icon: Settings, end: false },
]

export function AdminLayout() {
  const { session, isAdmin, loading, signOut, user } = useAdminAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-navy-950">
        <Loader2 className="h-6 w-6 animate-spin text-cyan-400" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-navy-950 px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-danger-500/15">
          <ShieldAlert className="h-7 w-7 text-danger-500" />
        </span>
        <h1 className="mt-5 font-display text-xl font-bold text-white">Accès Restreint</h1>
        <p className="mt-2 max-w-sm text-sm text-white/55">
          Votre compte ({user?.email}) est connecté mais n'a pas accès à ce tableau de bord
          administrateur. Contactez le propriétaire de l'entreprise pour être ajouté comme
          administrateur.
        </p>
        <button
          type="button"
          onClick={() => signOut()}
          className="mt-6 rounded-lg border border-white/15 bg-white/5 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-white/10"
        >
          Se Déconnecter
        </button>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-navy-950">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-white/10 bg-navy-900 lg:flex">
        <div className="flex items-center gap-2.5 px-6 py-6">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-electric-500 to-cyan-400 shadow-glow">
            <Cpu className="h-5 w-5 text-white" strokeWidth={2.25} />
          </span>
          <span className="font-display text-sm font-semibold text-white">RéparTech Admin</span>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3.5 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-electric-500/15 text-cyan-300'
                    : 'text-white/55 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/10 px-4 py-4">
          <p className="truncate px-2 text-xs text-white/40">{user?.email}</p>
          <button
            type="button"
            onClick={() => signOut()}
            className="mt-2 flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-white/55 transition-colors hover:bg-white/5 hover:text-white"
          >
            <LogOut className="h-4 w-4" />
            Se Déconnecter
          </button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto px-6 py-8 lg:px-10 lg:py-10">
        <Outlet />
      </main>
    </div>
  )
}
