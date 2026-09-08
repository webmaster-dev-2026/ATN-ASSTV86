import type { FileKind } from '@/models'

export type DossierCaseStatus =
  | 'toProcess'
  | 'analysing'
  | 'readyForAppointment'
  | 'blocked'
  | 'completed'

export type DossierPriority = 'high' | 'normal' | 'low'

export type FitnessDecision = 'fit' | 'unfit' | 'pending'

export type RestrictionKind = 'lifting' | 'repetitive' | 'staticPosture'

export type RestrictionSeverity = 'high' | 'medium'

export type QueueFilter = 'needsAction' | 'all'

export interface MedicalRestriction {
  id: string
  kind: RestrictionKind
  severity: RestrictionSeverity
}

export interface AppointmentSlot {
  id: string
  doctor: string
  center: string
  at: string
  matchPercent: number
}

export interface DossierDocument {
  id: string
  name: string
  fileType: FileKind
  documentType: string
  receivedAt: string
  fileSizeLabel: string
  pages: number
  uploadedBy: string
}

export interface DossierCase {
  id: string
  reference: string
  employeeName: string
  birthDate: string
  companyName: string
  visitType: string
  status: DossierCaseStatus
  priority: DossierPriority
  receivedAt: string
  source: string
  centerName: string
  practitioner: string
  fitness: FitnessDecision
  documents: DossierDocument[]
  restrictions: MedicalRestriction[]
  proposedSlot: AppointmentSlot | null
  alternativeSlots: AppointmentSlot[]
  doctors: string[]
}

export interface DossiersData {
  cases: DossierCase[]
}
