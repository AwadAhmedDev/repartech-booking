import type { ReactNode } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { ErrorBoundary } from './components/ErrorBoundary'
import { ScrollToTop } from './components/ScrollToTop'
import { PublicLayout } from './components/layout/PublicLayout'
import { HomePage } from './pages/HomePage'
import { ServicePage } from './pages/ServicePage'
import { FaqPage } from './pages/FaqPage'
import { MentionsLegalesPage } from './pages/legal/MentionsLegalesPage'
import { PolitiqueConfidentialitePage } from './pages/legal/PolitiqueConfidentialitePage'
import { CGUPage } from './pages/legal/CGUPage'
import { CGVPage } from './pages/legal/CGVPage'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminLayout } from './components/admin/AdminLayout'
import { OverviewPage } from './pages/admin/OverviewPage'
import { AppointmentsPage } from './pages/admin/AppointmentsPage'
import { ServicesPage } from './pages/admin/ServicesPage'
import { BusinessHoursPage } from './pages/admin/BusinessHoursPage'
import { BlockedDatesPage } from './pages/admin/BlockedDatesPage'
import { BusinessSettingsPage } from './pages/admin/BusinessSettingsPage'

const withPublicLayout = (page: ReactNode) => (
  <PublicLayout>{page}</PublicLayout>
)

function App() {
  return (
    <ErrorBoundary>
      <AdminAuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={withPublicLayout(<HomePage />)} />

          <Route path="/services/:slug" element={withPublicLayout(<ServicePage />)} />
          <Route path="/faq" element={withPublicLayout(<FaqPage />)} />

          {/* Legal pages */}
          <Route path="/mentions-legales" element={withPublicLayout(<MentionsLegalesPage />)} />
          <Route path="/confidentialite" element={withPublicLayout(<PolitiqueConfidentialitePage />)} />
          <Route path="/cgu" element={withPublicLayout(<CGUPage />)} />
          <Route path="/cgv" element={withPublicLayout(<CGVPage />)} />

          <Route path="/admin/login" element={<AdminLoginPage />} />

          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<OverviewPage />} />
            <Route path="appointments" element={<AppointmentsPage />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="business-hours" element={<BusinessHoursPage />} />
            <Route path="blocked-dates" element={<BlockedDatesPage />} />
            <Route path="settings" element={<BusinessSettingsPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AdminAuthProvider>
    </ErrorBoundary>
  )
}

export default App
