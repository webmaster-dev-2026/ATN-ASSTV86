export type SourceFileKind = 'PDF' | 'PPTX' | 'DOCX' | 'JPG' | 'XLSX'

export type SourceDocStatus = 'analysed' | 'reviewing' | 'error' | 'uploaded'

export type SourceDocTab = 'preview' | 'history'

export interface SourceDocHistoryEvent {
  id: string
  at: string
  actorName: string
  kind: 'uploaded' | 'analysed' | 'reviewStarted' | 'errorDetected' | 'reanalysed'
}

export interface SourceDocument {
  id: string
  fileName: string
  fileKind: SourceFileKind
  documentType: string
  status: SourceDocStatus
  uploadedAt: string
  fileSizeLabel: string
  pages: number
  companyName: string
  uploadedBy: string
  employeeName: string
  dossierId: string
  dossierReference: string
  summaryKey: 'nightWork' | 'jobSheet' | 'visitRequest' | 'sickLeave' | 'form' | 'planning' | 'email' | 'error'
  history: SourceDocHistoryEvent[]
}

export interface SourceDocSummary {
  total: number
  analysed: number
  reviewing: number
  error: number
  totalChange: number
  analysedChange: number
  reviewingChange: number
  errorChange: number
}

export interface SourceDocumentsData {
  items: SourceDocument[]
  summary: SourceDocSummary
}

export interface SourceDocFilterState {
  query: string
  source: string
  fileKind: SourceFileKind | 'all'
  status: SourceDocStatus | 'all'
  from: string
  to: string
}
