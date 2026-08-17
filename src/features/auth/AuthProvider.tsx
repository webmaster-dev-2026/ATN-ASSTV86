import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { clearSession, persistSession, readSession } from '@/features/auth/session'
import type { AuthUser } from '@/models'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (user: AuthUser, remember: boolean) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readSession)

  const login = useCallback((nextUser: AuthUser, remember: boolean) => {
    persistSession(nextUser, remember)
    setUser(nextUser)
  }, [])

  const logout = useCallback(() => {
    clearSession()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      login,
      logout,
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
