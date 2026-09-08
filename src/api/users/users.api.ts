import { apiRequest } from '@/api/client'
import type { UserPublicOut } from '@/api/auth/types'
import type { UpdateUserIn } from '@/api/users/types'

/** PATCH /api/users/{user_id} — partial update (admin). */
export async function updateUserApi(
  userId: string,
  payload: UpdateUserIn,
): Promise<UserPublicOut> {
  return apiRequest<UserPublicOut>(`/api/users/${encodeURIComponent(userId)}`, {
    method: 'PATCH',
    body: payload,
  })
}
