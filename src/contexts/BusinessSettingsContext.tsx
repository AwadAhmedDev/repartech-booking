import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import { fetchBusinessSettings } from '../lib/api'
import type { BusinessSettings } from '../types/database'

interface BusinessSettingsState {
  settings: BusinessSettings | null
  loading: boolean
  error: boolean
}

const BusinessSettingsContext = createContext<BusinessSettingsState>({
  settings: null,
  loading: true,
  error: false,
})

export function BusinessSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<BusinessSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isMounted = true
    fetchBusinessSettings()
      .then((data) => {
        if (isMounted) setSettings(data)
      })
      .catch(() => {
        if (isMounted) setError(true)
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })
    return () => {
      isMounted = false
    }
  }, [])

  return (
    <BusinessSettingsContext.Provider value={{ settings, loading, error }}>
      {children}
    </BusinessSettingsContext.Provider>
  )
}

export function useBusinessSettings() {
  return useContext(BusinessSettingsContext)
}
