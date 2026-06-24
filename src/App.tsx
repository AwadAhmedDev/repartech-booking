import { Route, Routes } from 'react-router-dom'
import { PublicLayout } from './components/layout/PublicLayout'
import { HomePage } from './pages/HomePage'
import { AdminAuthProvider } from './contexts/AdminAuthContext'
import { AdminLoginPage } from './pages/admin/AdminLoginPage'
import { AdminLayout } from './components/admin/AdminLayout'
import { OverviewPage } from './pages/admin/OverviewPage'
import { AppointmentsPage } from './pages/admin/AppointmentsPage'
import { ServicesPage } from './pages/admin/ServicesPage'
import { BusinessHoursPage } from './pages/admin/BusinessHoursPage'
import { BlockedDatesPage } from './pages/admin/BlockedDatesPage'
import { BusinessSettingsPage } from './pages/admin/BusinessSettingsPage'

function App() {
  return (
    <AdminAuthProvider>
      <Routes>
        <Route
          path="/"
          element={
            <PublicLayout>
              <HomePage />
            </PublicLayout>
          }
        />

        <Route path="/admin/login" element={<AdminLoginPage />} />

        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<OverviewPage />} />
          <Route path="appointments" element={<AppointmentsPage />} />
          <Route path="services" element={<ServicesPage />} />
          <Route path="business-hours" element={<BusinessHoursPage />} />
          <Route path="blocked-dates" element={<BlockedDatesPage />} />
          <Route path="settings" element={<BusinessSettingsPage />} />
        </Route>
      </Routes>
    </AdminAuthProvider>
  )
}

export default App
