export type CompletedDocKind = 'PDF' | 'DOCX' | 'HTML'

export type CompletedDocTitle = 'invitation' | 'email' | 'summary' | 'report' | 'fitness'

export type CompletedDelivery = 'sent' | 'archived'

export type CompletedVisitFilter = 'all' | 'VISITE_PERIODIQUE' | 'VISITE_EMBAUCHE' | 'VISITE_REPRISE' | 'VISITE_SPECIALE'

export type ProcessStepKey = 'created' | 'clinical' | 'paraclinical' | 'conclusion' | 'sent'

export type HistoryEventKind = 'sent' | 'concluded' | 'attached' | 'created'

export interface CompletedDocument {
  id: string
  title: CompletedDocTitle
  name: string
  kind: CompletedDocKind
  bytes: number
}

export interface CompletedProcessStep {
  key: ProcessStepKey
  at: string
}

export interface CompletedHistoryEvent {
  id: string
  kind: HistoryEventKind
  actorName: string
  at: string
}

export interface CompletedItem {
  id: string
  reference: string
  employeeName: string
  companyName: string
  visitType: string
  createdAt: string
  completedAt: string
  documents: CompletedDocument[]
  process: CompletedProcessStep[]
  history: CompletedHistoryEvent[]
  delivery: CompletedDelivery
}

export interface CompletedSummary {
  dossiers: number
  dossiersChange: number
  documents: number
  documentsChange: number
  sent: number
  sentChange: number
  archived: number
  archivedChange: number
}

export interface CompletedData {
  items: CompletedItem[]
  summary: CompletedSummary
}
