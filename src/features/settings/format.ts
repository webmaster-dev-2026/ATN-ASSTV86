import type { TranslationKey } from '@/i18n'
import type {
  SettingsCategoryId,
  TemplateKind,
  TemplateStatus,
  TemplateTone,
} from './types'

export const CATEGORY_LABEL: Record<SettingsCategoryId, TranslationKey> = {
  general: 'settings.categories.general',
  users: 'settings.categories.users',
  centers: 'settings.categories.centers',
  channels: 'settings.categories.channels',
  rules: 'settings.categories.rules',
  templates: 'settings.categories.templates',
  notifications: 'settings.categories.notifications',
}

export const CATEGORY_TITLE: Record<SettingsCategoryId, TranslationKey> = {
  general: 'settings.sections.general.title',
  users: 'settings.sections.users.title',
  centers: 'settings.sections.centers.title',
  channels: 'settings.sections.channels.title',
  rules: 'settings.sections.rules.title',
  templates: 'settings.templates.title',
  notifications: 'settings.sections.notifications.title',
}

export const CATEGORY_DESCRIPTION: Record<SettingsCategoryId, TranslationKey> = {
  general: 'settings.sections.general.description',
  users: 'settings.sections.users.description',
  centers: 'settings.sections.centers.description',
  channels: 'settings.sections.channels.description',
  rules: 'settings.sections.rules.description',
  templates: 'settings.templates.description',
  notifications: 'settings.sections.notifications.description',
}

export const TEMPLATE_NAME: Record<TemplateKind, TranslationKey> = {
  invite: 'settings.templates.items.invite.name',
  email: 'settings.templates.items.email.name',
  letter: 'settings.templates.items.letter.name',
  summary: 'settings.templates.items.summary.name',
  custom: 'settings.templates.items.custom.name',
}

export const TEMPLATE_DESCRIPTION: Record<TemplateKind, TranslationKey> = {
  invite: 'settings.templates.items.invite.description',
  email: 'settings.templates.items.email.description',
  letter: 'settings.templates.items.letter.description',
  summary: 'settings.templates.items.summary.description',
  custom: 'settings.templates.items.custom.description',
}

export const TEMPLATE_STATUS_LABEL: Record<TemplateStatus, TranslationKey> = {
  active: 'settings.templates.status.active',
  draft: 'settings.templates.status.draft',
}

export const TEMPLATE_STATUS_STYLE: Record<TemplateStatus, string> = {
  active: 'bg-[#e7f8ee] text-[#15803d]',
  draft: 'bg-[#fff1e4] text-[#c96512]',
}

export const TEMPLATE_TONE: Record<TemplateTone, string> = {
  blue: 'bg-[#e8f1fc] text-[#2860B9]',
  green: 'bg-[#e7f8ee] text-[#16a34a]',
  orange: 'bg-[#fff1e4] text-[#ea7a1a]',
  purple: 'bg-[#f3e8ff] text-[#7c3aed]',
}

export const CATEGORIES: SettingsCategoryId[] = [
  'general',
  'users',
  'centers',
  'channels',
  'rules',
  'templates',
  'notifications',
]

export function pageNumbers(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis' as const, total]
  }

  if (current >= total - 3) {
    return [1, 'ellipsis' as const, total - 4, total - 3, total - 2, total - 1, total]
  }

  return [1, 'ellipsis' as const, current - 1, current, current + 1, 'ellipsis' as const, total]
}
