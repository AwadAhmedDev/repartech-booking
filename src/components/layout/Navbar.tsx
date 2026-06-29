import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
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
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm'
        : 'bg-white/80 backdrop-blur-md'
    }`}>
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

        <div className="hidden items-center gap-4 lg:flex">
          {settings?.business_phone && (
            <a
              href={`tel:${settings.business_phone}`}
              className="text-sm font-medium text-slate-500 transition-colors hover:text-slate-900"
            >
              {settings.business_phone}
            </a>
          )}
          <a
            href="#booking"
            className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-blue-700"
          >
            Réserver un Service
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
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="mt-3 rounded-lg bg-blue-600 px-5 py-3 text-center text-sm font-semibold text-white shadow-sm hover:bg-blue-700"
            >
              Réserver un Service
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
