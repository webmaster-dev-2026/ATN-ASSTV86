export type AnomalySeverity = 'critical' | 'warning' | 'info'
export type AnomalyStatus = 'open' | 'inProgress' | 'resolved' | 'blocked'
export type AnomalyType = 'inconsistent' | 'lowConfidence' | 'missingDocument' | 'missingInformation'

export interface ComparisonSide {
  fileName: string
  documentType: string
  fieldLabel: string
  value: string
  tone: 'danger' | 'success' | 'neutral'
}

export interface HistoryEvent {
  id: string
  at: string
  actorName: string
  kind: 'detected' | 'assigned' | 'resolved'
}

export interface AnomalyItem {
  id: string
  title: string
  message: string
  type: AnomalyType
  severity: AnomalySeverity
  status: AnomalyStatus
  fieldName: string | null
  fieldLabel: string
  detectedAt: string
  reference: string
  employeeName: string
  companyName: string
  visitType: string
  doctor: string
  assigneeId: string
  assigneeName: string
  dossierId: string
  comparison: { left: ComparisonSide; right: ComparisonSide } | null
  history: HistoryEvent[]
}

export interface AnomalySummary {
  critical: number
  warning: number
  resolved: number
  blocked: number
}

export interface AnomaliesData {
  items: AnomalyItem[]
  summary: AnomalySummary
}

export interface AnomalyFilterState {
  query: string
  severity: AnomalySeverity | 'all'
  status: AnomalyStatus | 'all'
  type: AnomalyType | 'all'
  assigneeId: string
  from: string
  to: string
}
