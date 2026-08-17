import { Navigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'

export function RootRedirect() {
  const { isAuthenticated } = useAuth()
  return <Navigate to={isAuthenticated ? '/dashboard' : '/login'} replace />
}
