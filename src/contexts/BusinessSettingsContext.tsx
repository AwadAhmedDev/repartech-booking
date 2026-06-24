import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchBusinessSettings } from '../lib/api'
import type { BusinessSettings } from '../types/database'

const BusinessSettingsContext = createContext<{ settings: BusinessSettings | null; loading: boolean }>({
  settings: null,
  loading: true,
})

export function BusinessSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let isMounted = true
    fetchBusinessSettings()
      .then((data) => {
        if (isMounted) setSettings(data)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <BusinessSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </BusinessSettingsContext.Provider>
  )
}

export function useBusinessSettings() {
  return useContext(BusinessSettingsContext)
}
