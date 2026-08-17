import type { AnomalySeverity, AnomalyStatus } from '@/features/anomalies/types'
import type { SourceDocStatus, SourceFileKind } from '@/features/source-documents/types'

export type SearchKind = 'dossier' | 'document' | 'anomaly' | 'employee'

export type SearchScope = 'all' | SearchKind

export type SearchDossierState =
  | 'toProcess'
  | 'analysing'
  | 'checking'
  | 'scheduling'
  | 'readyForAppointment'
  | 'blocked'
  | 'completed'

export interface SearchHit {
  id: string
  kind: SearchKind
  title: string
  subtitle: string
  reference: string
  employeeName: string
  companyName: string
  visitType: string
  at: string
  href: string
  dossierState?: SearchDossierState
  documentStatus?: SourceDocStatus
  fileKind?: SourceFileKind
  fileName?: string
  fileSizeLabel?: string
  anomalySeverity?: AnomalySeverity
  anomalyStatus?: AnomalyStatus
  anomalyMessage?: string
  relatedCount?: number
  source?: string
}

export interface SearchCounts {
  all: number
  dossier: number
  document: number
  anomaly: number
  employee: number
}

export interface SearchCatalog {
  hits: SearchHit[]
  latest: SearchHit[]
}
