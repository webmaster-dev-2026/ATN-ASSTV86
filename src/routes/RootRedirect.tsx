import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'

export function RootRedirect() {
  const { isAuthenticated, isBootstrapping } = useAuth()

  if (isBootstrapping) {
    return null
  }

  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}
