import { formatStamp } from '@/features/dossiers/format'
import type { Locale, TranslationKey } from '@/i18n'
import type { CompletedDocTitle, HistoryEventKind, ProcessStepKey } from './types'

export const PROCESS_KEYS: Record<ProcessStepKey, TranslationKey> = {
  created: 'completed.process.created',
  clinical: 'completed.process.clinical',
  paraclinical: 'completed.process.paraclinical',
  conclusion: 'completed.process.conclusion',
  sent: 'completed.process.sent',
}

export const HISTORY_KEYS: Record<HistoryEventKind, TranslationKey> = {
  sent: 'completed.history.sent',
  concluded: 'completed.history.concluded',
  attached: 'completed.history.attached',
  created: 'completed.history.created',
}

export const DOC_TITLE_KEYS: Record<CompletedDocTitle, TranslationKey> = {
  invitation: 'completed.docTitles.invitation',
  email: 'completed.docTitles.email',
  summary: 'completed.docTitles.summary',
  report: 'completed.docTitles.report',
  fitness: 'completed.docTitles.fitness',
}

export function formatDateTimeCompact(value: string, locale: Locale) {
  const stamp = formatStamp(value, locale)
  return `${stamp.date} ${stamp.time}`
}

export function formatFileSize(bytes: number, locale: Locale) {
  const french = locale === 'fr'
  if (bytes >= 1_000_000) {
    const value = (bytes / 1_000_000).toFixed(1)
    const number = locale === 'en' ? value : value.replace('.', ',')
    return `${number} ${french ? 'Mo' : 'MB'}`
  }

  const value = Math.max(1, Math.round(bytes / 1000))
  return `${value} ${french ? 'Ko' : 'KB'}`
}

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
