import { toIntlLocale, type Locale, type TranslationKey } from '@/i18n'
import type { AnomalyClassKey, StatisticsPeriod, StatusSliceKey, VisitTypeKey } from './types'

export const PERIOD_KEYS: Record<StatisticsPeriod, TranslationKey> = {
  last7Days: 'statistics.periods.last7Days',
  last30Days: 'statistics.periods.last30Days',
  last90Days: 'statistics.periods.last90Days',
}

export const VISIT_TYPE_KEYS: Record<VisitTypeKey, TranslationKey> = {
  periodique: 'dashboard.visit.periodique',
  speciale: 'dashboard.visit.speciale',
  embauche: 'dashboard.visit.embauche',
  reprise: 'dashboard.visit.reprise',
  other: 'statistics.visit.other',
}

export const STATUS_KEYS: Record<StatusSliceKey, TranslationKey> = {
  toProcess: 'statistics.status.toProcess',
  processing: 'statistics.status.processing',
  waitingAppointment: 'statistics.status.waitingAppointment',
  completed: 'statistics.status.completed',
  blocked: 'statistics.status.blocked',
}

export const ANOMALY_CLASS_KEYS: Record<AnomalyClassKey, TranslationKey> = {
  prolongedRestriction: 'statistics.anomalies.prolongedRestriction',
  missingInfo: 'statistics.anomalies.missingInfo',
  inconsistent: 'statistics.anomalies.inconsistent',
  lowConfidence: 'statistics.anomalies.lowConfidence',
  missingDocument: 'statistics.anomalies.missingDocument',
}

export const PERIOD_DAYS: Record<StatisticsPeriod, number> = {
  last7Days: 7,
  last30Days: 30,
  last90Days: 90,
}

export function interpolate(template: string, values: Record<string, string | number>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))
}

export function formatCount(value: number, locale: Locale) {
  return new Intl.NumberFormat(toIntlLocale(locale), { maximumFractionDigits: 0 }).format(value)
}

export function formatDecimal(value: number, locale: Locale, digits = 1) {
  return new Intl.NumberFormat(toIntlLocale(locale), {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)
}

export function formatPercent(value: number, locale: Locale, digits = 1) {
  return `${formatDecimal(value, locale, digits)}%`
}

export function formatChange(value: number, locale: Locale) {
  const digits = Number.isInteger(value) ? 0 : 1
  return `${new Intl.NumberFormat(toIntlLocale(locale), {
    signDisplay: 'always',
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)}%`
}

export function formatChartDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: '2-digit',
    month: '2-digit',
  }).format(new Date(`${value}T12:00:00`))
}

export function formatFullDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(`${value}T12:00:00`))
}

export function formatDateTime(value: string, locale: Locale) {
  const date = new Date(value)
  const datePart = new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date)
  const timePart = new Intl.DateTimeFormat(toIntlLocale(locale), {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)
  return `${datePart} ${timePart}`
}

export function scaleFactor(period: StatisticsPeriod) {
  return PERIOD_DAYS[period] / PERIOD_DAYS.last30Days
}
