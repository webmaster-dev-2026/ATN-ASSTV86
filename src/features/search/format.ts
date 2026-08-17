import { STATUS_BADGE as ANOMALY_STATUS_BADGE, STATUS_LABEL as ANOMALY_STATUS_LABEL } from '@/features/anomalies/format'
import { STATUS_BADGE as DOCUMENT_STATUS_BADGE, STATUS_LABEL as DOCUMENT_STATUS_LABEL } from '@/features/source-documents/format'
import type { TranslationKey } from '@/i18n'
import type { SearchCounts, SearchDossierState, SearchHit, SearchKind, SearchScope } from './types'

export const SCOPES: SearchScope[] = ['all', 'dossier', 'document', 'anomaly', 'employee']

export const SCOPE_LABEL: Record<SearchScope, TranslationKey> = {
  all: 'search.scopes.all',
  dossier: 'search.scopes.dossier',
  document: 'search.scopes.document',
  anomaly: 'search.scopes.anomaly',
  employee: 'search.scopes.employee',
}

export const KIND_LABEL: Record<SearchKind, TranslationKey> = {
  dossier: 'search.kind.dossier',
  document: 'search.kind.document',
  anomaly: 'search.kind.anomaly',
  employee: 'search.kind.employee',
}

export const KIND_BADGE: Record<SearchKind, string> = {
  dossier: 'bg-[#d9e8fb] text-[#1d4f9a]',
  document: 'bg-[#ead9fb] text-[#7c3aed]',
  anomaly: 'bg-[#fde2e2] text-[#c93434]',
  employee: 'bg-[#d5f4e0] text-[#15803d]',
}

export const KIND_OPEN: Record<SearchKind, TranslationKey> = {
  dossier: 'search.openDossier',
  document: 'search.openDocument',
  anomaly: 'search.openAnomaly',
  employee: 'search.openEmployee',
}

export const DOSSIER_STATE_KEYS: Record<SearchDossierState, TranslationKey> = {
  toProcess: 'dossiers.status.toProcess',
  analysing: 'inProgress.status.analysing',
  checking: 'inProgress.status.checking',
  scheduling: 'inProgress.status.scheduling',
  readyForAppointment: 'dossiers.status.readyForAppointment',
  blocked: 'dossiers.status.blocked',
  completed: 'dossiers.status.completed',
}

export const DOSSIER_STATE_STYLES: Record<SearchDossierState, string> = {
  toProcess: 'bg-[#fff1e4] text-[#ea7a1a]',
  analysing: 'bg-[#dbeafe] text-[#1d4f9a]',
  checking: 'bg-[#dcfce7] text-[#15803d]',
  scheduling: 'bg-[#ffedd5] text-[#c2410c]',
  readyForAppointment: 'bg-[#e7f8ee] text-[#16a34a]',
  blocked: 'bg-[#fde2e2] text-[#e54848]',
  completed: 'bg-[#eef3f9] text-[#5b6b82]',
}

export function emptyCounts(): SearchCounts {
  return { all: 0, dossier: 0, document: 0, anomaly: 0, employee: 0 }
}

export function countHits(hits: SearchHit[]): SearchCounts {
  const counts = emptyCounts()
  for (const hit of hits) {
    counts[hit.kind] += 1
    counts.all += 1
  }
  return counts
}

export function matchesQuery(hit: SearchHit, query: string) {
  const needle = query.trim().toLowerCase()
  if (!needle) {
    return true
  }

  return [
    hit.title,
    hit.subtitle,
    hit.reference,
    hit.employeeName,
    hit.companyName,
    hit.fileName,
    hit.anomalyMessage,
    hit.source,
  ]
    .filter(Boolean)
    .some((value) => value!.toLowerCase().includes(needle))
}

export function queryForHit(hit: SearchHit) {
  if (hit.kind === 'document') {
    return hit.fileName || hit.title
  }
  if (hit.kind === 'employee' || hit.kind === 'anomaly') {
    return hit.employeeName || hit.title
  }
  return hit.reference || hit.employeeName
}

export function hitBadge(hit: SearchHit, t: (key: TranslationKey) => string) {
  if (hit.kind === 'document' && hit.documentStatus) {
    return { className: DOCUMENT_STATUS_BADGE[hit.documentStatus], label: t(DOCUMENT_STATUS_LABEL[hit.documentStatus]) }
  }
  if (hit.kind === 'anomaly' && hit.anomalyStatus) {
    return { className: ANOMALY_STATUS_BADGE[hit.anomalyStatus], label: t(ANOMALY_STATUS_LABEL[hit.anomalyStatus]) }
  }
  if (hit.kind === 'dossier' && hit.dossierState) {
    return { className: DOSSIER_STATE_STYLES[hit.dossierState], label: t(DOSSIER_STATE_KEYS[hit.dossierState]) }
  }
  if (hit.kind === 'employee') {
    return { className: KIND_BADGE.employee, label: t(KIND_LABEL.employee) }
  }
  return { className: KIND_BADGE[hit.kind], label: t(KIND_LABEL[hit.kind]) }
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
