import { apiRequest } from '@/api/client'
import { mapUserPublicToAuthUser } from '@/api/auth/mapUser'
import type {
  ChangePasswordIn,
  LoginIn,
  LogoutIn,
  OkOut,
  RefreshIn,
  TokenPairOut,
  UserPublicOut,
  VerifyOut,
} from '@/api/auth/types'
import { tokenStore } from '@/api/tokenStore'
import type { AuthUser } from '@/models'

function applyTokenPair(data: TokenPairOut): AuthUser {
  tokenStore.setTokens({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
  })
  return mapUserPublicToAuthUser(data.user)
}

/**
 * POST /api/auth/login
 * Response body: access_token + refresh_token + user.
 */
export async function loginApi(credentials: LoginIn): Promise<AuthUser> {
  const data = await apiRequest<TokenPairOut>('/api/auth/login', {
    method: 'POST',
    body: {
      email: credentials.email.trim(),
      password: credentials.password,
    } satisfies LoginIn,
    skipAuth: true,
    skipRefresh: true,
  })

  return applyTokenPair(data)
}

/**
 * POST /api/auth/refresh
 * Body: `{ refresh_token }` — old refresh is rotated/revoked.
 */
export async function refreshApi(refreshToken?: string): Promise<AuthUser> {
  const token = refreshToken ?? tokenStore.getRefreshToken()
  if (!token) {
    throw new Error('Missing refresh token')
  }

  const data = await apiRequest<TokenPairOut>('/api/auth/refresh', {
    method: 'POST',
    body: { refresh_token: token } satisfies RefreshIn,
    skipAuth: true,
    skipRefresh: true,
  })

  return applyTokenPair(data)
}

/**
 * GET /api/auth/verify — bootstrap: access token còn hợp lệ?
 */
export async function verifyApi(): Promise<VerifyOut> {
  return apiRequest<VerifyOut>('/api/auth/verify', {
    skipRefresh: true,
  })
}

/**
 * POST /api/auth/logout
 */
export async function logoutApi(): Promise<void> {
  const refreshToken = tokenStore.getRefreshToken()
  try {
    await apiRequest<OkOut>('/api/auth/logout', {
      method: 'POST',
      body: {
        refresh_token: refreshToken,
      } satisfies LogoutIn,
      skipRefresh: true,
    })
  } finally {
    tokenStore.clear()
  }
}

/** GET /api/auth/profile */
export async function getProfileApi(): Promise<UserPublicOut> {
  return apiRequest<UserPublicOut>('/api/auth/profile')
}

/** POST /api/auth/change-password */
export async function changePasswordApi(payload: ChangePasswordIn): Promise<void> {
  await apiRequest<OkOut>('/api/auth/change-password', {
    method: 'POST',
    body: {
      current_password: payload.current_password,
      new_password: payload.new_password,
    } satisfies ChangePasswordIn,
  })
}
