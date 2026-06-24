import type { ReactNode } from 'react'
import { Navbar } from './Navbar'
import { Footer } from './Footer'
import { BusinessSettingsProvider } from '../../contexts/BusinessSettingsContext'

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <BusinessSettingsProvider>
      <div className="flex min-h-screen flex-col bg-navy-950">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </BusinessSettingsProvider>
  )
}
