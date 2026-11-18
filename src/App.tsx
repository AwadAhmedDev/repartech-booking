import { lazy, Suspense, type ReactNode } from 'react'
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

// Espace admin chargé à part : les visiteurs ne téléchargent pas son code.
const AdminLoginPage = lazy(() => import('./pages/admin/AdminLoginPage').then((m) => ({ default: m.AdminLoginPage })))
const AdminLayout = lazy(() => import('./components/admin/AdminLayout').then((m) => ({ default: m.AdminLayout })))
const OverviewPage = lazy(() => import('./pages/admin/OverviewPage').then((m) => ({ default: m.OverviewPage })))
const AppointmentsPage = lazy(() => import('./pages/admin/AppointmentsPage').then((m) => ({ default: m.AppointmentsPage })))
const ServicesPage = lazy(() => import('./pages/admin/ServicesPage').then((m) => ({ default: m.ServicesPage })))
const BusinessHoursPage = lazy(() => import('./pages/admin/BusinessHoursPage').then((m) => ({ default: m.BusinessHoursPage })))
const BlockedDatesPage = lazy(() => import('./pages/admin/BlockedDatesPage').then((m) => ({ default: m.BlockedDatesPage })))
const BusinessSettingsPage = lazy(() => import('./pages/admin/BusinessSettingsPage').then((m) => ({ default: m.BusinessSettingsPage })))

const withPublicLayout = (page: ReactNode) => (
  <PublicLayout>{page}</PublicLayout>
)

function App() {
  return (
    <ErrorBoundary>
      <AdminAuthProvider>
        <ScrollToTop />
        <Suspense fallback={null}>
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
        </Suspense>
      </AdminAuthProvider>
    </ErrorBoundary>
  )
}

export default App
