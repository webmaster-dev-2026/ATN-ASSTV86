import { toIntlLocale, type Locale, type TranslationKey } from '@/i18n'

const VISIT_KEYS: Record<string, TranslationKey> = {
  VISITE_EMBAUCHE: 'dashboard.visit.embauche',
  VISITE_REPRISE: 'dashboard.visit.reprise',
  VISITE_PERIODIQUE: 'dashboard.visit.periodique',
  VISITE_SPECIALE: 'dashboard.visit.speciale',
}

export function formatReceivedAt(value: string, locale: Locale) {
  const date = new Date(value)
  const datePart = new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
  const timePart = formatTime(value, locale)

  return `${datePart} ${timePart}`
}

export function formatTime(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(value))
}

export function formatLongDate(value: Date, locale: Locale) {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(value)
}

export function interpolate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))
}

export function shortDossierRef(dossierId: string) {
  const digits = dossierId.replace(/\D/g, '').slice(-2).padStart(2, '0')
  return `M${digits}`
}

export function visitLabel(visitType: string, t: (key: TranslationKey) => string) {
  return VISIT_KEYS[visitType] ? t(VISIT_KEYS[visitType]) : visitType
}
