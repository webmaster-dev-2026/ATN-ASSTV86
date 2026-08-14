import { BrowserRouter } from 'react-router-dom'
import { ToastProvider } from '@/components/ui'
import { AuthProvider } from '@/features/auth/AuthProvider'
import { I18nProvider } from '@/i18n'
import { AppRouter } from '@/routes/AppRouter'

export default function App() {
  return (
    <I18nProvider>
      <BrowserRouter>
        <AuthProvider>
          <ToastProvider>
            <AppRouter />
          </ToastProvider>
        </AuthProvider>
      </BrowserRouter>
    </I18nProvider>
  )
}
