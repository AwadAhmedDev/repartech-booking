import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Clock, MapPin, Menu, Phone, X } from 'lucide-react'
import { useBusinessSettings } from '../../contexts/BusinessSettingsContext'

const NAV_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Pourquoi Nous', href: '#why-us' },
  { label: 'À Propos', href: '#about' },
]

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { settings } = useBusinessSettings()

  useEffect(() => {
    function onScroll() { setScrolled(window.scrollY > 16) }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className="fixed inset-x-0 top-0 z-50">
      {/* Announcement bar — desktop only */}
      <div className="hidden bg-slate-900 lg:block">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-2.5 lg:px-10">
          <div className="flex items-center gap-6 text-xs text-white/55">
            <span className="flex items-center gap-1.5">
              <Clock className="h-3 w-3" />
              Lun – Sam, 9h – 18h
            </span>
            {settings?.business_address && (
              <span className="flex items-center gap-1.5">
                <MapPin className="h-3 w-3" />
                {settings.business_address}
              </span>
            )}
          </div>
          {settings?.business_phone && (
            <a
              href={`tel:${settings.business_phone}`}
              className="flex items-center gap-1.5 text-xs text-white/55 transition-colors hover:text-white"
            >
              <Phone className="h-3 w-3" />
              {settings.business_phone}
            </a>
          )}
        </div>
      </div>

      {/* Main nav */}
      <div
        className={`transition-all duration-200 ${
          scrolled
            ? 'border-b border-slate-200 bg-white/95 shadow-sm backdrop-blur-md'
            : 'bg-white/90 backdrop-blur-sm'
        }`}
      >
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <span className="font-display text-[11px] font-bold tracking-tight text-white">RT</span>
            </span>
            <span className="font-display text-base font-semibold tracking-tight text-slate-900">
              {settings?.business_name ?? 'RéparTech'}
            </span>
          </Link>

          <div className="hidden items-center gap-8 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-slate-600 transition-colors hover:text-slate-900"
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href="#booking"
              className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
            >
              Prendre Rendez-vous
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label="Basculer le menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </nav>

        {open && (
          <div id="mobile-menu" className="border-t border-slate-100 bg-white px-6 pb-6 lg:hidden">
            <div className="flex flex-col gap-1 pt-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-base font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-blue-600"
                >
                  {link.label}
                </a>
              ))}
              {settings?.business_phone && (
                <a
                  href={`tel:${settings.business_phone}`}
                  className="mt-1 flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
                >
                  <Phone className="h-4 w-4" />
                  {settings.business_phone}
                </a>
              )}
              <a
                href="#booking"
                onClick={() => setOpen(false)}
                className="mt-3 rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white hover:bg-blue-700"
              >
                Prendre Rendez-vous
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
