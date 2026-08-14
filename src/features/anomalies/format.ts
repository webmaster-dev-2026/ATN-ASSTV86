import type { TranslationKey } from '@/i18n'
import type { AnomalyFilterState, AnomalySeverity, AnomalyStatus, AnomalyType } from './types'

type HistoryEventKind = 'detected' | 'assigned' | 'resolved'

export const SEVERITY_LABEL: Record<AnomalySeverity, TranslationKey> = {
  critical: 'anomalies.severity.critical',
  warning: 'anomalies.severity.warning',
  info: 'anomalies.severity.info',
}

export const STATUS_LABEL: Record<AnomalyStatus, TranslationKey> = {
  open: 'anomalies.status.open',
  inProgress: 'anomalies.status.inProgress',
  resolved: 'anomalies.status.resolved',
  blocked: 'anomalies.status.blocked',
}

export const TYPE_LABEL: Record<AnomalyType, TranslationKey> = {
  inconsistent: 'anomalies.types.inconsistent',
  lowConfidence: 'anomalies.types.lowConfidence',
  missingDocument: 'anomalies.types.missingDocument',
  missingInformation: 'anomalies.types.missingInformation',
}

export const HISTORY_LABEL: Record<HistoryEventKind, TranslationKey> = {
  detected: 'anomalies.history.detected',
  assigned: 'anomalies.history.assigned',
  resolved: 'anomalies.history.resolved',
}

export const SEVERITY_BADGE: Record<AnomalySeverity, string> = {
  critical: 'bg-[#fde2e2] text-[#c93434]',
  warning: 'bg-[#fff1e4] text-[#c96512]',
  info: 'bg-[#d9e8fb] text-[#1d4f9a]',
}

export const STATUS_BADGE: Record<AnomalyStatus, string> = {
  open: 'bg-[#fde2e2] text-[#c93434]',
  inProgress: 'bg-[#f3e8ff] text-[#7c3aed]',
  resolved: 'bg-[#e7f8ee] text-[#15803d]',
  blocked: 'bg-[#ead9fb] text-[#6d28d9]',
}

export const SEVERITY_ICON: Record<AnomalySeverity, string> = {
  critical: 'bg-[#fde2e2] text-[#e54848]',
  warning: 'bg-[#fff1e4] text-[#ea7a1a]',
  info: 'bg-[#d9e8fb] text-[#2860B9]',
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

export function toDateInput(value: string) {
  return value.slice(0, 10)
}

export const EMPTY_FILTERS: AnomalyFilterState = {
  query: '',
  severity: 'all',
  status: 'all',
  type: 'all',
  assigneeId: 'all',
  from: '',
  to: '',
}
