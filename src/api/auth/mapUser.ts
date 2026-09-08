import type { UserPublicOut } from '@/api/auth/types'
import type { AuthUser } from '@/models'

function splitName(fullName: string): { firstName: string; lastName: string } {
  const trimmed = fullName.trim()
  if (!trimmed) {
    return { firstName: '', lastName: '' }
  }

  const parts = trimmed.split(/\s+/)
  if (parts.length === 1) {
    return { firstName: parts[0], lastName: '' }
  }

  return {
    firstName: parts[0],
    lastName: parts.slice(1).join(' '),
  }
}

export function mapUserPublicToAuthUser(user: UserPublicOut): AuthUser {
  const fullName = user.full_name?.trim() || user.email
  const { firstName, lastName } = splitName(fullName)

  return {
    id: user.user_id,
    email: user.email,
    firstName: firstName || user.email,
    lastName,
    fullName,
    jobTitle: user.role,
    roleLabel: user.role,
  }
}
