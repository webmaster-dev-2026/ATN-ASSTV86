import type { UserPublicOut } from '@/api/auth/types'

export type UserRole = 'admin'
export type UserStatus = 'active' | 'inactive' | 'pending'

/** PATCH /api/users/{user_id} — OpenAPI UpdateUserIn */
export interface UpdateUserIn {
  full_name?: string | null
  phone?: string | null
  role?: UserRole | null
  status?: UserStatus | null
}

export type { UserPublicOut }
