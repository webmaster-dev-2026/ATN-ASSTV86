import { visitLabel } from '@/features/dashboard/format'
import { formatDate } from '@/features/dossiers/format'
import type { Locale, TranslationKey } from '@/i18n'
import type { PriorityKind, ReasonKind, ValidationOption } from './types'

export const REASON_KEYS: Record<ReasonKind, TranslationKey> = {
  returnDate: 'toValidate.reason.returnDate',
  visitType: 'toValidate.reason.visitType',
  workplace: 'toValidate.reason.workplace',
  employeeName: 'toValidate.reason.employeeName',
  jobTitle: 'toValidate.reason.jobTitle',
  companyName: 'toValidate.reason.companyName',
}

export const EXTRA_KEYS: Record<ReasonKind, TranslationKey> = {
  returnDate: 'toValidate.extra.returnDate',
  visitType: 'toValidate.extra.visitType',
  workplace: 'toValidate.extra.workplace',
  employeeName: 'toValidate.extra.employeeName',
  jobTitle: 'toValidate.extra.jobTitle',
  companyName: 'toValidate.extra.companyName',
}

export const PRIORITY_KEYS: Record<PriorityKind, TranslationKey> = {
  high: 'toValidate.priority.high',
  medium: 'toValidate.priority.medium',
  low: 'toValidate.priority.low',
}

export const PRIORITY_DOT: Record<PriorityKind, string> = {
  high: 'bg-[#e54848]',
  medium: 'bg-[#ea7a1a]',
  low: 'bg-[#16a34a]',
}

export const AVATAR_TONES = [
  'bg-[#d9e8fb] text-[#1d4f9a]',
  'bg-[#ffe8d2] text-[#c96512]',
  'bg-[#ead9fb] text-[#7c3aed]',
  'bg-[#d5f4e0] text-[#15803d]',
  'bg-[#fde2e2] text-[#c93434]',
  'bg-[#d3eef8] text-[#0e7490]',
  'bg-[#fff1c2] text-[#a16207]',
  'bg-[#fce7f3] text-[#be185d]',
] as const

export const VISIT_BADGE: Record<string, string> = {
  VISITE_PERIODIQUE: 'bg-[#f3e8ff] text-[#7c3aed]',
  VISITE_EMBAUCHE: 'bg-[#d9e8fb] text-[#1d4f9a]',
  VISITE_REPRISE: 'bg-[#d5f4e0] text-[#15803d]',
  VISITE_SPECIALE: 'bg-[#ffe8d2] text-[#c96512]',
}

const VISIT_OPTION_IDS = new Set(['VISITE_PERIODIQUE', 'VISITE_EMBAUCHE', 'VISITE_REPRISE', 'VISITE_SPECIALE'])

export function remainingDays(deadlineAt: string, now = new Date()) {
  const end = new Date(deadlineAt)
  const start = new Date(now)
  start.setHours(0, 0, 0, 0)
  end.setHours(0, 0, 0, 0)
  return Math.round((end.getTime() - start.getTime()) / 86_400_000)
}

export function avatarTone(name: string) {
  let hash = 0
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 33 + name.charCodeAt(index)) >>> 0
  }
  return AVATAR_TONES[hash % AVATAR_TONES.length]
}

export function optionLabel(
  option: ValidationOption,
  t: (key: TranslationKey) => string,
  locale: Locale,
) {
  if (VISIT_OPTION_IDS.has(option.id)) {
    return visitLabel(option.id, t)
  }
  if (/^\d{4}-\d{2}-\d{2}/.test(option.value)) {
    return formatDate(option.value, locale)
  }
  return option.value
}
