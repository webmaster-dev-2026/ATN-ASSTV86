export type StatisticsPeriod = 'last7Days' | 'last30Days' | 'last90Days'

export type VisitTypeKey = 'periodique' | 'speciale' | 'embauche' | 'reprise' | 'other'

export type StatusSliceKey =
  | 'toProcess'
  | 'processing'
  | 'waitingAppointment'
  | 'completed'
  | 'blocked'

export type AnomalyClassKey =
  | 'prolongedRestriction'
  | 'missingInfo'
  | 'inconsistent'
  | 'lowConfidence'
  | 'missingDocument'

export interface KpiMetric {
  value: number
  changePercent: number
}

export interface StatisticsSummary {
  received: KpiMetric
  avgProcessingDays: KpiMetric
  anomalyRate: KpiMetric
  confirmationRate: KpiMetric
}

export interface DayCount {
  date: string
  count: number
}

export interface NamedCount {
  key: string
  count: number
  percent: number
}

export interface StatusSlice extends NamedCount {
  key: StatusSliceKey
  color: string
}

export interface VisitTypeSlice extends NamedCount {
  key: VisitTypeKey
}

export interface AnomalySlice extends NamedCount {
  key: AnomalyClassKey
}

export interface FacilityRank {
  id: string
  name: string
  count: number
  percent: number
  trend: number[]
}

export interface StatisticsData {
  updatedAt: string
  summary: StatisticsSummary
  receivedByDay: DayCount[]
  byVisitType: VisitTypeSlice[]
  statusDistribution: {
    total: number
    segments: StatusSlice[]
  }
  anomalyClassification: AnomalySlice[]
  topFacilities: FacilityRank[]
}
