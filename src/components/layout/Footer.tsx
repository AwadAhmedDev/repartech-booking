import { Cpu, Mail, MapPin, Phone } from 'lucide-react'
import { useBusinessSettings } from '../../contexts/BusinessSettingsContext'

export function Footer() {
  const { settings } = useBusinessSettings()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-white/10 bg-navy-900">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-electric-500 to-cyan-400">
                <Cpu className="h-5 w-5 text-white" strokeWidth={2.25} />
              </span>
              <span className="font-display text-lg font-semibold text-white">
                {settings?.business_name ?? 'RéparTech'}
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
              Réparation informatique professionnelle et support IT pour entreprises — diagnostics,
              réparation matérielle, suppression de logiciels malveillants, récupération de données et
              services réseau gérés, livrés avec transparence et expertise technique.
            </p>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/80">
              Liens Rapides
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/55">
              <li><a href="#services" className="hover:text-cyan-300 transition-colors">Services</a></li>
              <li><a href="#why-us" className="hover:text-cyan-300 transition-colors">Pourquoi Nous Choisir</a></li>
              <li><a href="#about" className="hover:text-cyan-300 transition-colors">À Propos</a></li>
              <li><a href="#booking" className="hover:text-cyan-300 transition-colors">Réserver un Rendez-vous</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-white/80">
              Contact
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-white/55">
              {settings?.business_phone && (
                <li className="flex items-start gap-2.5">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  <a href={`tel:${settings.business_phone}`} className="hover:text-cyan-300 transition-colors">
                    {settings.business_phone}
                  </a>
                </li>
              )}
              {settings?.business_email && (
                <li className="flex items-start gap-2.5">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  <a href={`mailto:${settings.business_email}`} className="hover:text-cyan-300 transition-colors">
                    {settings.business_email}
                  </a>
                </li>
              )}
              {settings?.business_address && (
                <li className="flex items-start gap-2.5">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-cyan-400" />
                  <span>{settings.business_address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-white/10 pt-6 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {year} {settings?.business_name ?? 'RéparTech'}. Tous droits réservés.</p>
          <p>Réparation Informatique &amp; Support IT pour Entreprises</p>
        </div>
      </div>
    </footer>
  )
}
