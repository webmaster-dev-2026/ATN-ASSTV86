export type ReasonKind =
  | 'returnDate'
  | 'visitType'
  | 'workplace'
  | 'employeeName'
  | 'jobTitle'
  | 'companyName'

export type PriorityKind = 'high' | 'medium' | 'low'

export type QueueFilter = 'all' | PriorityKind

export interface ValidationOption {
  id: string
  value: string
}

export interface ValidationItem {
  id: string
  reference: string
  employeeName: string
  companyName: string
  visitType: string
  reason: ReasonKind
  priority: PriorityKind
  deadlineAt: string
  examDate: string
  doctor: string
  fieldsToConfirm: number
  confidence: number | null
  sourceFile: string
  sourcePage: number
  sourceText: string
  proposalValue: string
  proposal: string
  alternatives: ValidationOption[]
}

export interface ValidationSummary {
  pendingDossiers: number
  fieldsToConfirm: number
  urgentDecisions: number
  pendingChange: number
  fieldsChange: number
  urgentChange: number
}

export interface ToValidateData {
  items: ValidationItem[]
  summary: ValidationSummary
}
