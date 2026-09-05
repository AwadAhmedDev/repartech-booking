import {
  Building2,
  Cpu,
  Database,
  HardDrive,
  Headset,
  Laptop,
  PcCase,
  RefreshCw,
  SearchCheck,
  Settings,
  ShieldAlert,
  Sparkles,
  Wifi,
  Wrench,
  type LucideIcon,
} from 'lucide-react'

const KEYWORD_ICONS: { keywords: string[]; icon: LucideIcon }[] = [
  { keywords: ['diagnostic'], icon: SearchCheck },
  { keywords: ['virus', 'malware', 'security', 'sécurité'], icon: ShieldAlert },
  { keywords: ['nettoyage', 'optimisation'], icon: Sparkles },
  { keywords: ['maintenance', 'préventive'], icon: Settings },
  { keywords: ['réinstallation'], icon: RefreshCw },
  { keywords: ['ssd', 'clonage'], icon: HardDrive },
  { keywords: ['assemblage'], icon: PcCase },
  { keywords: ['distance'], icon: Headset },
  { keywords: ['réseau', 'wifi'], icon: Wifi },
  { keywords: ['laptop', 'portable'], icon: Laptop },
  { keywords: ['desktop', 'bureau'], icon: Cpu },
  { keywords: ['data', 'recovery', 'données', 'récupération'], icon: Database },
  { keywords: ['business', 'entreprise'], icon: Building2 },
]

/**
 * The services table has no "icon" column — the icon is inferred from the
 * service name so the UI stays visual without inventing a schema field.
 */
export function getServiceIcon(serviceName: string): LucideIcon {
  const lower = serviceName.toLowerCase()
  const match = KEYWORD_ICONS.find(({ keywords }) => keywords.some((kw) => lower.includes(kw)))
  return match?.icon ?? Wrench
}
