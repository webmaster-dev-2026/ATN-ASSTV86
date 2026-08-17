import { toIntlLocale, type Locale, type TranslationKey } from '@/i18n'
import type {
  DossierCaseStatus,
  FitnessDecision,
  RestrictionKind,
  RestrictionSeverity,
} from './types'

export const STATUS_KEYS: Record<DossierCaseStatus, TranslationKey> = {
  toProcess: 'dossiers.status.toProcess',
  analysing: 'dossiers.status.analysing',
  readyForAppointment: 'dossiers.status.readyForAppointment',
  blocked: 'dossiers.status.blocked',
  completed: 'dossiers.status.completed',
}

export const STATUS_STYLES: Record<DossierCaseStatus, string> = {
  toProcess: 'bg-[#fff1e4] text-[#ea7a1a]',
  analysing: 'bg-[#f3e8ff] text-[#7c3aed]',
  readyForAppointment: 'bg-[#e7f8ee] text-[#16a34a]',
  blocked: 'bg-[#fde2e2] text-[#e54848]',
  completed: 'bg-[#eef3f9] text-[#5b6b82]',
}

export const FITNESS_KEYS: Record<FitnessDecision, TranslationKey> = {
  fit: 'dossiers.fitness.fit',
  unfit: 'dossiers.fitness.unfit',
  pending: 'dossiers.fitness.pending',
}

export const FITNESS_STYLES: Record<FitnessDecision, string> = {
  fit: 'bg-[#e7f8ee] text-[#16a34a]',
  unfit: 'bg-[#fde2e2] text-[#e54848]',
  pending: 'bg-[#eef3f9] text-[#6d7b93]',
}

export const RESTRICTION_KEYS: Record<RestrictionKind, TranslationKey> = {
  lifting: 'dossiers.analysis.lifting',
  repetitive: 'dossiers.analysis.repetitive',
  staticPosture: 'dossiers.analysis.staticPosture',
}

export const RESTRICTION_SEVERITY_KEYS: Record<RestrictionSeverity, TranslationKey> = {
  high: 'dossiers.analysis.severityHigh',
  medium: 'dossiers.analysis.severityMedium',
}

export const RESTRICTION_STYLES: Record<RestrictionSeverity, string> = {
  high: 'border-[#f5c9b8] bg-[#fff4ef]',
  medium: 'border-[#f3ddb8] bg-[#fff8ea]',
}

const DOCUMENT_TYPE_KEYS: Record<string, TranslationKey> = {
  DEMANDE_VISITE: 'dossiers.documentType.visitRequest',
  FICHE_POSTE: 'dossiers.documentType.jobSheet',
  FORMULAIRE: 'dossiers.documentType.form',
  EMAIL: 'dossiers.documentType.email',
  ARRET_TRAVAIL: 'dossiers.documentType.sickLeave',
  COMPTE_RENDU: 'dossiers.documentType.medicalReport',
}

export function documentTypeLabel(
  documentType: string,
  t: (key: TranslationKey) => string,
) {
  return DOCUMENT_TYPE_KEYS[documentType]
    ? t(DOCUMENT_TYPE_KEYS[documentType])
    : documentType
}

export function needsAction(status: DossierCaseStatus) {
  return status !== 'completed'
}

export function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export function displayEmployeeName(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length < 2) {
    return name
  }
  const last = parts[parts.length - 1]
  return `${parts.slice(0, -1).join(' ')} ${last.toUpperCase()}`
}

export function birthDateFor(name: string) {
  let hash = 0
  for (let index = 0; index < name.length; index += 1) {
    hash = (hash * 33 + name.charCodeAt(index)) >>> 0
  }
  const year = 1965 + (hash % 30)
  const month = String((hash % 12) + 1).padStart(2, '0')
  const day = String((hash % 27) + 1).padStart(2, '0')
  return `${year}-${month}-${day}T00:00:00`
}

export function ageFrom(birthDate: string, now = new Date()) {
  const birth = new Date(birthDate)
  let age = now.getFullYear() - birth.getFullYear()
  const monthDiff = now.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age -= 1
  }
  return age
}

export function formatStamp(value: string, locale: Locale, timeStyle: 'colon' | 'h' = 'colon') {
  const date = new Date(value)
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')

  return {
    date: formatDate(value, locale),
    time: timeStyle === 'h' ? `${hours}h${minutes}` : `${hours}:${minutes}`,
  }
}

export function formatDate(value: string, locale: Locale) {
  return new Intl.DateTimeFormat(toIntlLocale(locale), {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(value))
}

export function formatDateTime(value: string, locale: Locale) {
  const date = new Date(value)
  const datePart = new Intl.DateTimeFormat(toIntlLocale(locale), {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
  const timePart = new Intl.DateTimeFormat(toIntlLocale(locale), {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(date)

  return `${datePart} ${timePart}`
}

export function shiftDays(value: string, days: number) {
  const date = new Date(value)
  date.setDate(date.getDate() + days)
  return date.toISOString()
}

export function interpolate(
  template: string,
  values: Record<string, string | number>,
) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ''))
}
