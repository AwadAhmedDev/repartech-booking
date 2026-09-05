import { Mail, MapPin, Phone } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useBusinessSettings } from '../../contexts/BusinessSettingsContext'

const QUICK_LINKS = [
  { label: 'Services', href: '#services' },
  { label: 'Pourquoi Nous Choisir', href: '#why-us' },
  { label: 'À Propos', href: '#about' },
  { label: 'Réserver un Rendez-vous', href: '#booking' },
]

export function Footer() {
  const { settings } = useBusinessSettings()
  const year = new Date().getFullYear()

  return (
    <footer>
      {/* Pre-footer CTA band */}
      <div className="bg-blue-600">
        <div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 px-6 py-12 sm:flex-row sm:items-center lg:px-10">
          <div>
            <p className="font-display text-xl font-bold text-white">
              Un problème informatique ? On est là.
            </p>
            <p className="mt-1 text-sm text-blue-100">
              Diagnostic offert · Réponse sous 24 h · Devis sans engagement
            </p>
          </div>
          <a
            href="#booking"
            className="shrink-0 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-blue-700 transition-colors hover:bg-blue-50"
          >
            Prendre Rendez-vous
          </a>
        </div>
      </div>

      {/* Main footer */}
      <div className="border-t border-white/10 bg-slate-900">
        <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">

            {/* Brand */}
            <div>
              <div className="flex items-center gap-2.5">
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                  <span className="font-display text-[11px] font-bold tracking-tight text-white">RT</span>
                </span>
                <span className="font-display text-lg font-semibold text-white">
                  {settings?.business_name ?? 'RepaTek'}
                </span>
              </div>
              <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
                Réparation informatique professionnelle et support IT pour entreprises — diagnostics,
                réparation matérielle, suppression de logiciels malveillants, récupération de données
                et services réseau gérés.
              </p>
            </div>

            {/* Quick links */}
            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/70">
                Navigation
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-white/50">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="transition-colors hover:text-white">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Hours */}
            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/70">
                Horaires
              </h4>
              <ul className="mt-4 space-y-2.5 text-sm text-white/50">
                <li className="flex justify-between gap-4">
                  <span>Lundi – Vendredi</span>
                  <span className="text-white/70">9h – 18h</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Samedi</span>
                  <span className="text-white/70">10h – 16h</span>
                </li>
                <li className="flex justify-between gap-4">
                  <span>Dimanche</span>
                  <span>Fermé</span>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/70">
                Contact
              </h4>
              <ul className="mt-4 space-y-3 text-sm text-white/50">
                {settings?.business_phone && (
                  <li className="flex items-start gap-2.5">
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                    <a href={`tel:${settings.business_phone}`} className="transition-colors hover:text-white">
                      {settings.business_phone}
                    </a>
                  </li>
                )}
                {settings?.business_email && (
                  <li className="flex items-start gap-2.5">
                    <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                    <a href={`mailto:${settings.business_email}`} className="transition-colors hover:text-white">
                      {settings.business_email}
                    </a>
                  </li>
                )}
                {settings?.business_address && (
                  <li className="flex items-start gap-2.5">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-blue-400" />
                    <span>{settings.business_address}</span>
                  </li>
                )}
              </ul>
            </div>
          </div>

          <div className="mt-12 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-white/35 sm:flex-row sm:items-center sm:justify-between">
            <p>&copy; {year} {settings?.business_name ?? 'RepaTek'}. Tous droits réservés.</p>
            <div className="flex flex-wrap gap-x-5 gap-y-2">
              <Link to="/mentions-legales" className="transition-colors hover:text-white">Mentions Légales</Link>
              <Link to="/confidentialite" className="transition-colors hover:text-white">Politique de Confidentialité</Link>
              <Link to="/cgu" className="transition-colors hover:text-white">CGU</Link>
              <Link to="/cgv" className="transition-colors hover:text-white">CGV</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
