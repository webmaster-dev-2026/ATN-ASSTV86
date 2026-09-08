import { ApiError, type ApiErrorCode } from '@/api/errors'
import { notifySessionExpired } from '@/api/sessionExpired'
import { tokenStore } from '@/api/tokenStore'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface ApiRequestOptions {
  method?: HttpMethod
  body?: unknown
  headers?: Record<string, string>
  /** Skip Authorization header (login / refresh). */
  skipAuth?: boolean
  /** Skip automatic refresh+retry on 401. */
  skipRefresh?: boolean
  signal?: AbortSignal
}

/**
 * Dev: same-origin `/api` via Vite proxy.
 * Prod: absolute `VITE_API_BASE_URL`.
 */
export function getApiBaseUrl(): string {
  if (import.meta.env.DEV) {
    return ''
  }

  return (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '')
}

function resolveUrl(path: string): string {
  const base = getApiBaseUrl()
  const normalized = path.startsWith('/') ? path : `/${path}`
  return `${base}${normalized}`
}

function mapStatusToCode(status: number): ApiErrorCode {
  if (status === 401) return 'unauthorized'
  if (status === 403) return 'forbidden'
  if (status === 422) return 'validation'
  return 'unknown'
}

async function parseErrorBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get('content-type') ?? ''
  if (contentType.includes('application/json')) {
    try {
      return await response.json()
    } catch {
      return undefined
    }
  }

  try {
    return await response.text()
  } catch {
    return undefined
  }
}

async function throwApiError(response: Response): Promise<never> {
  const details = await parseErrorBody(response)
  const message =
    typeof details === 'object' &&
    details !== null &&
    'detail' in details &&
    typeof (details as { detail: unknown }).detail === 'string'
      ? (details as { detail: string }).detail
      : `Request failed with status ${response.status}`

  throw new ApiError(message, {
    status: response.status,
    code: mapStatusToCode(response.status),
    details,
  })
}

let refreshPromise: Promise<boolean> | null = null

/** Shared single-flight refresh used by api client on 401. */
export async function tryRefreshSession(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const refreshToken = tokenStore.getRefreshToken()
        if (!refreshToken) {
          tokenStore.clear()
          return false
        }

        const response = await fetch(resolveUrl('/api/auth/refresh'), {
          method: 'POST',
          credentials: 'include',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refresh_token: refreshToken }),
        })

        if (!response.ok) {
          tokenStore.clear()
          return false
        }

        const data: unknown = await response.json().catch(() => null)
        if (
          !data ||
          typeof data !== 'object' ||
          typeof (data as { access_token?: unknown }).access_token !== 'string' ||
          typeof (data as { refresh_token?: unknown }).refresh_token !== 'string'
        ) {
          tokenStore.clear()
          return false
        }

        tokenStore.setTokens({
          accessToken: (data as { access_token: string }).access_token,
          refreshToken: (data as { refresh_token: string }).refresh_token,
        })
        return true
      } catch {
        tokenStore.clear()
        return false
      } finally {
        refreshPromise = null
      }
    })()
  }

  return refreshPromise
}

function handleUnauthorizedSessionEnd() {
  tokenStore.clear()
  notifySessionExpired()
}

export async function apiRequest<T>(
  path: string,
  options: ApiRequestOptions = {},
): Promise<T> {
  const {
    method = 'GET',
    body,
    headers = {},
    skipAuth = false,
    skipRefresh = false,
    signal,
  } = options

  const isFormData = typeof FormData !== 'undefined' && body instanceof FormData

  const requestHeaders: Record<string, string> = {
    Accept: 'application/json',
    ...headers,
  }

  // Let the browser set multipart boundary; never force JSON on FormData.
  if (body !== undefined && !isFormData) {
    requestHeaders['Content-Type'] =
      requestHeaders['Content-Type'] ?? 'application/json'
  }

  if (!skipAuth) {
    const token = tokenStore.getAccessToken()
    if (token) {
      requestHeaders.Authorization = `Bearer ${token}`
    }
  }

  const response = await fetch(resolveUrl(path), {
    method,
    credentials: 'include',
    headers: requestHeaders,
    body:
      body === undefined
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
    signal,
  })

  if (
    response.status === 401 &&
    !skipAuth &&
    !skipRefresh &&
    path !== '/api/auth/refresh' &&
    path !== '/api/auth/login'
  ) {
    const refreshed = await tryRefreshSession()
    if (refreshed) {
      return apiRequest<T>(path, { ...options, skipRefresh: true })
    }
    handleUnauthorizedSessionEnd()
  } else if (response.status === 401 && !skipAuth && path !== '/api/auth/login') {
    // Retry after refresh still unauthorized, or refresh endpoint itself.
    handleUnauthorizedSessionEnd()
  }

  if (!response.ok) {
    await throwApiError(response)
  }

  if (response.status === 204) {
    return undefined as T
  }

  const contentType = response.headers.get('content-type') ?? ''
  if (!contentType.includes('application/json')) {
    return undefined as T
  }

  return (await response.json()) as T
}
