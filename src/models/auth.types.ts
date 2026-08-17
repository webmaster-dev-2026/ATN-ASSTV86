import type { TranslationKey } from '@/i18n/types'

export interface AuthUser {
  id: string
  email: string
  firstName: string
  lastName: string
  fullName: string
  jobTitle: string
  roleLabel: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginFormErrors {
  email?: TranslationKey
  password?: TranslationKey
  form?: TranslationKey
}

export type LoginStatus = 'idle' | 'submitting' | 'success' | 'error'
