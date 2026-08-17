import type { AuthUser } from '@/models'

export const SESSION_KEY = 'asstv86.session'

function isAuthUser(value: unknown): value is AuthUser {
  if (!value || typeof value !== 'object') {
    return false
  }

  const user = value as AuthUser
  return (
    typeof user.id === 'string' &&
    typeof user.email === 'string' &&
    typeof user.firstName === 'string' &&
    typeof user.lastName === 'string' &&
    typeof user.fullName === 'string' &&
    typeof user.jobTitle === 'string'
  )
}

export function readSession(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null
  }

  for (const storage of [window.localStorage, window.sessionStorage]) {
    const raw = storage.getItem(SESSION_KEY)
    if (!raw) {
      continue
    }

    try {
      const parsed: unknown = JSON.parse(raw)
      if (isAuthUser(parsed)) {
        return parsed
      }
    } catch {
      storage.removeItem(SESSION_KEY)
    }
  }

  return null
}

export function persistSession(user: AuthUser, remember: boolean) {
  const payload = JSON.stringify(user)
  window.localStorage.removeItem(SESSION_KEY)
  window.sessionStorage.removeItem(SESSION_KEY)

  const storage = remember ? window.localStorage : window.sessionStorage
  storage.setItem(SESSION_KEY, payload)
}

export function clearSession() {
  window.localStorage.removeItem(SESSION_KEY)
  window.sessionStorage.removeItem(SESSION_KEY)
}
