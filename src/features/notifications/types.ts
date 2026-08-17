import type { TranslationKey } from '@/i18n'

export type NotificationType =
  | 'dossier'
  | 'validation'
  | 'anomaly'
  | 'completed'
  | 'reminder'

export interface AppNotification {
  id: string
  type: NotificationType
  titleKey: TranslationKey
  bodyKey: TranslationKey
  dossierRef: string
  href: string
  createdAt: string
  read: boolean
}
