export type ProcessingStep = 'analyse' | 'check' | 'schedule'

export type WorkflowStepId =
  | 'intake'
  | 'employee'
  | 'company'
  | 'classify'
  | 'analyse'
  | 'check'
  | 'schedule'
  | 'propose'
  | 'confirm'
  | 'generate'

export type AtnStatus = 'analysing' | 'checking' | 'scheduling'

export type ActivityKind = 'ocr' | 'extract' | 'classify' | 'verify' | 'slots' | 'match'

export interface ProcessingItem {
  id: string
  reference: string
  employeeName: string
  companyName: string
  step: ProcessingStep
  progress: number
  status: AtnStatus
  lastActivity: ActivityKind
  lastActivityAt: string
  etaMinutes: number
  etaAt: string
}

export interface ProcessingSummary {
  analysing: number
  checking: number
  scheduling: number
  analysingChange: number
  checkingChange: number
  schedulingChange: number
}

export interface WorkflowStep {
  id: WorkflowStepId
  code: string
  count: number
  tone: string
}

export interface ActivityEvent {
  id: string
  reference: string
  employeeName: string
  companyName: string
  kind: ActivityKind
  step: ProcessingStep
  at: string
}

export interface InProgressData {
  items: ProcessingItem[]
  summary: ProcessingSummary
  workflow: WorkflowStep[]
  activity: ActivityEvent[]
}
