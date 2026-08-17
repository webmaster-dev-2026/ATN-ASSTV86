export type FileKind = 'PDF' | 'DOCX' | 'IMAGE' | 'EML'

export type FileStatus = 'toValidate' | 'processing' | 'completed' | 'anomaly'

export type PriorityLevel = 'priority' | 'normal'

export interface DashboardSummaryMetric {
  value: number
  changePercent: number
}

export interface DashboardSummary {
  received: DashboardSummaryMetric
  processed: DashboardSummaryMetric
  toValidate: DashboardSummaryMetric
  anomalies: DashboardSummaryMetric
}

export interface ProcessingSegment {
  key: FileStatus
  count: number
  percent: number
  color: string
}

export interface ActivityPoint {
  date: string
  received: number
  processed: number
}

export interface RecentFileItem {
  id: string
  dossierId: string
  name: string
  fileType: FileKind
  source: string
  visitType: string
  receivedAt: string
  status: FileStatus
}

export interface ValidationQueueItem {
  id: string
  dossierId: string
  name: string
  employeeName: string
  fileType: FileKind
  source: string
  visitType: string
  receivedAt: string
  priority: PriorityLevel
}

export interface UpcomingAppointmentItem {
  id: string
  dossierId: string
  date: string
  time: string
  visitType: string
  companyName: string
  doctor: string
}

export interface DashboardData {
  summary: DashboardSummary
  recentFiles: RecentFileItem[]
  validationQueue: ValidationQueueItem[]
  processingOverview: {
    total: number
    segments: ProcessingSegment[]
  }
  appointments: UpcomingAppointmentItem[]
  activity: ActivityPoint[]
}
