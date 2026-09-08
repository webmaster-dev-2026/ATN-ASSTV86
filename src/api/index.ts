export { apiRequest, getApiBaseUrl, tryRefreshSession } from '@/api/client'
export { onSessionExpired, resetSessionExpiredState } from '@/api/sessionExpired'
export { ApiError, isApiError } from '@/api/errors'
export { tokenStore } from '@/api/tokenStore'
export {
  changePasswordApi,
  getProfileApi,
  loginApi,
  logoutApi,
  refreshApi,
  verifyApi,
} from '@/api/auth/auth.api'
export { updateUserApi } from '@/api/users/users.api'
export { askAssistantApi } from '@/api/assistant/assistant.api'
export {
  uploadDossierDocumentsApi,
  uploadRequestFilesApi,
} from '@/api/intake/intake.api'
export { mapUserPublicToAuthUser } from '@/api/auth/mapUser'
export type {
  ChangePasswordIn,
  LoginIn,
  LogoutIn,
  OkOut,
  RefreshIn,
  TokenPairOut,
  UserPublicOut,
  VerifyOut,
} from '@/api/auth/types'
export type { UpdateUserIn, UserRole, UserStatus } from '@/api/users/types'
export type { AssistantAskIn, AssistantAskOut } from '@/api/assistant/types'
export type {
  IntakeChannel,
  UploadDossierDocumentsIn,
  UploadDossierDocumentsOut,
  UploadRequestFilesIn,
  UploadRequestFilesOut,
} from '@/api/intake/types'
