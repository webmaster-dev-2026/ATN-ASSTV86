import { Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { AnomaliesPage } from '@/pages/AnomaliesPage'
import { CompletedPage } from '@/pages/CompletedPage'
import { DashboardPage } from '@/pages/DashboardPage'
import { DossiersPage } from '@/pages/DossiersPage'
import { InProgressPage } from '@/pages/InProgressPage'
import { LoginPage } from '@/pages/LoginPage'
import { SearchPage } from '@/pages/SearchPage'
import { SettingsPage } from '@/pages/SettingsPage'
import { SourceDocumentsPage } from '@/pages/SourceDocumentsPage'
import { StatisticsPage } from '@/pages/StatisticsPage'
import { ToValidatePage } from '@/pages/ToValidatePage'
import { GuestRoute } from '@/routes/GuestRoute'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { RootRedirect } from '@/routes/RootRedirect'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<GuestRoute />}>
        <Route path="/login" element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/dossiers" element={<DossiersPage />} />
          <Route path="/a-valider" element={<ToValidatePage />} />
          <Route path="/anomalies" element={<AnomaliesPage />} />
          <Route path="/traitement-en-cours" element={<InProgressPage />} />
          <Route path="/termines" element={<CompletedPage />} />
          <Route path="/recherche" element={<SearchPage />} />
          <Route path="/documents-sources" element={<SourceDocumentsPage />} />
          <Route path="/statistiques" element={<StatisticsPage />} />
          <Route path="/parametres" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="/" element={<RootRedirect />} />
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}
