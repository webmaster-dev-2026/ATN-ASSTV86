import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { logoutApi, refreshApi, tokenStore } from '@/api'
import { onSessionExpired, resetSessionExpiredState } from '@/api/sessionExpired'
import { clearSession, persistSession, readSession } from '@/features/auth/session'
import type { AuthUser } from '@/models'

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isBootstrapping: boolean
  login: (user: AuthUser, remember: boolean) => void
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

/** Only block UI when access is gone and we must await refresh. */
function needsRefreshBootstrap() {
  return !tokenStore.getAccessToken() && Boolean(tokenStore.getRefreshToken())
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readSession)
  const [isBootstrapping, setIsBootstrapping] = useState(needsRefreshBootstrap)

  const login = useCallback((nextUser: AuthUser, remember: boolean) => {
    resetSessionExpiredState()
    persistSession(nextUser, remember)
    setUser(nextUser)
  }, [])

  const endSessionLocally = useCallback(() => {
    tokenStore.clear()
    clearSession()
    setUser(null)
  }, [])

  const logout = useCallback(async () => {
    try {
      await logoutApi()
    } catch {
      // Always clear local session even if BE logout fails.
    } finally {
      endSessionLocally()
    }
  }, [endSessionLocally])

  useEffect(() => {
    return onSessionExpired(() => {
      // Tokens already cleared by api client; drop UI session → ProtectedRoute → /login.
      clearSession()
      setUser(null)
    })
  }, [])

  useEffect(() => {
    let cancelled = false

    async function bootstrap() {
      const hasAccess = Boolean(tokenStore.getAccessToken())
      const hasRefresh = Boolean(tokenStore.getRefreshToken())

      if (!hasAccess && !hasRefresh) {
        if (!cancelled) {
          clearSession()
          setUser(null)
          setIsBootstrapping(false)
        }
        return
      }

      // Access token present → trust local session. 401s refresh via api client.
      if (hasAccess) {
        if (!cancelled) setIsBootstrapping(false)
        return
      }

      try {
        const nextUser = await refreshApi()
        if (cancelled) return
        resetSessionExpiredState()
        persistSession(nextUser, true)
        setUser(nextUser)
      } catch {
        if (!cancelled) {
          tokenStore.clear()
          clearSession()
          setUser(null)
        }
      } finally {
        if (!cancelled) setIsBootstrapping(false)
      }
    }

    void bootstrap()
    return () => {
      cancelled = true
    }
  }, [])

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isBootstrapping,
      login,
      logout,
    }),
    [user, isBootstrapping, login, logout],
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
