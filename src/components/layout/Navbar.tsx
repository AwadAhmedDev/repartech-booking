import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cpu, Menu, X } from 'lucide-react'
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
    function onScroll() {
      setScrolled(window.scrollY > 12)
    }
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-navy-950/90 backdrop-blur-lg border-b border-white/10 shadow-lg' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
        <Link to="/" className="flex items-center gap-2.5 group">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-electric-500 to-cyan-400 shadow-glow transition-transform group-hover:scale-105">
            <Cpu className="h-5 w-5 text-white" strokeWidth={2.25} />
          </span>
          <span className="font-display text-lg font-semibold tracking-tight text-white">
            {settings?.business_name ?? 'RéparTech'}
          </span>
        </Link>

        <div className="hidden items-center gap-9 lg:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-4">
          {settings?.business_phone && (
            <a href={`tel:${settings.business_phone}`} className="text-sm font-medium text-white/60 hover:text-white transition-colors">
              {settings.business_phone}
            </a>
          )}
          <a
            href="#booking"
            className="rounded-lg bg-gradient-to-r from-electric-500 to-cyan-400 px-5 py-2.5 text-sm font-semibold text-white shadow-glow transition-all hover:brightness-110 hover:shadow-[0_0_30px_-4px_rgba(34,211,238,0.5)]"
          >
            Réserver un Service
          </a>
        </div>

        <button
          type="button"
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-white lg:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Basculer le menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-white/10 bg-navy-950/98 backdrop-blur-lg px-6 py-6 lg:hidden">
          <div className="flex flex-col gap-4">
            {NAV_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="text-base font-medium text-white/80"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#booking"
              onClick={() => setOpen(false)}
              className="mt-2 rounded-lg bg-gradient-to-r from-electric-500 to-cyan-400 px-5 py-3 text-center text-sm font-semibold text-white shadow-glow"
            >
              Réserver un Service
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
