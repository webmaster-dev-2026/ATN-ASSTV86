const ACCESS_COOKIE = 'access_token'
const REFRESH_COOKIE = 'refresh_token'

/** Access ~1 day; refresh ~30 days (BE may also set HttpOnly cookies). */
const ACCESS_MAX_AGE_SEC = 60 * 60 * 24
const REFRESH_MAX_AGE_SEC = 60 * 60 * 24 * 30

let accessTokenMemory: string | null = null

function isSecureContext() {
  return typeof window !== 'undefined' && window.location.protocol === 'https:'
}

function setCookie(name: string, value: string, maxAgeSec: number) {
  if (typeof document === 'undefined') return

  const parts = [
    `${encodeURIComponent(name)}=${encodeURIComponent(value)}`,
    'Path=/',
    `Max-Age=${maxAgeSec}`,
    'SameSite=Lax',
  ]

  if (isSecureContext()) {
    parts.push('Secure')
  }

  document.cookie = parts.join('; ')
}

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null

  const prefix = `${encodeURIComponent(name)}=`
  const match = document.cookie
    .split('; ')
    .find((part) => part.startsWith(prefix))

  if (!match) return null

  try {
    return decodeURIComponent(match.slice(prefix.length))
  } catch {
    return match.slice(prefix.length)
  }
}

function deleteCookie(name: string) {
  if (typeof document === 'undefined') return

  const parts = [
    `${encodeURIComponent(name)}=`,
    'Path=/',
    'Max-Age=0',
    'SameSite=Lax',
  ]

  if (isSecureContext()) {
    parts.push('Secure')
  }

  document.cookie = parts.join('; ')
}

export const tokenStore = {
  getAccessToken(): string | null {
    if (accessTokenMemory) return accessTokenMemory
    accessTokenMemory = getCookie(ACCESS_COOKIE)
    return accessTokenMemory
  },

  getRefreshToken(): string | null {
    return getCookie(REFRESH_COOKIE)
  },

  setTokens(tokens: { accessToken: string; refreshToken: string }) {
    accessTokenMemory = tokens.accessToken
    setCookie(ACCESS_COOKIE, tokens.accessToken, ACCESS_MAX_AGE_SEC)
    setCookie(REFRESH_COOKIE, tokens.refreshToken, REFRESH_MAX_AGE_SEC)
  },

  setAccessToken(token: string | null) {
    accessTokenMemory = token
    if (token) {
      setCookie(ACCESS_COOKIE, token, ACCESS_MAX_AGE_SEC)
    } else {
      deleteCookie(ACCESS_COOKIE)
    }
  },

  clear() {
    accessTokenMemory = null
    deleteCookie(ACCESS_COOKIE)
    deleteCookie(REFRESH_COOKIE)

    // Clean up previous storage keys if still present.
    if (typeof window !== 'undefined') {
      window.sessionStorage.removeItem('asstv86.access_token')
      window.localStorage.removeItem('asstv86.refresh_token')
    }
  },
}
