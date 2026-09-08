/** DTOs aligned with ATN ASSTV86 OpenAPI auth schemas. */

export interface LoginIn {
  email: string
  password: string
}

export interface RefreshIn {
  refresh_token?: string
}

export interface LogoutIn {
  refresh_token?: string | null
}

export interface UserPublicOut {
  user_id: string
  email: string
  full_name?: string
  role: string
  status: string
  phone?: string
  created_at?: string | null
  updated_at?: string | null
  last_login_at?: string | null
}

export interface TokenPairOut {
  access_token: string
  refresh_token: string
  token_type?: string
  expires_in: number
  user: UserPublicOut
}

export interface OkOut {
  ok?: boolean
}

export interface ChangePasswordIn {
  current_password: string
  new_password: string
}

export interface VerifyOut {
  ok?: boolean
  user: UserPublicOut
}
