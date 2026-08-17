import anomalyData from '../../../mock/api/anomalies.json'
import documentData from '../../../mock/api/documents.json'
import extractionData from '../../../mock/api/document_extractions.json'
import dossierData from '../../../mock/api/dossiers.json'
import userData from '../../../mock/api/users.json'
import type {
  AnomaliesData,
  AnomalyItem,
  AnomalySeverity,
  AnomalyStatus,
  AnomalyType,
  ComparisonSide,
  HistoryEvent,
} from './types'

interface MockAnomaly {
  id: string
  dossier_id: string
  type: string
  field_name: string | null
  title: string
  message: string
  severity: string
  status: string
  assigned_to: string
  resolved_by?: string
}

interface MockDossier {
  id: string
  reference: string
  professional_id: string
  employee_name: string
  company_name: string
  visit_type: string
  status: string
  created_at: string
  updated_at: string
}

interface MockUser {
  id: string
  full_name: string
}

interface MockDocument {
  id: string
  dossier_id: string
  file_name: string
  document_type: string
}

interface MockExtraction {
  dossier_id: string
  document_id: string
  field_name: string
  field_label: string
  field_value: string
}

const TYPE_MAP: Record<string, AnomalyType> = {
  INCONSISTENT_DATA: 'inconsistent',
  LOW_CONFIDENCE: 'lowConfidence',
  MISSING_DOCUMENT: 'missingDocument',
  MISSING_INFORMATION: 'missingInformation',
}

const SEVERITY_MAP: Record<string, AnomalySeverity> = {
  CRITICAL: 'critical',
  WARNING: 'warning',
  INFO: 'info',
}

const FIELD_FROM_DOSSIER: Record<string, keyof Pick<MockDossier, 'employee_name' | 'company_name' | 'visit_type'>> = {
  employee_name: 'employee_name',
  company_name: 'company_name',
  visit_type: 'visit_type',
}

function displayStatus(anomaly: MockAnomaly, dossier: MockDossier | undefined): AnomalyStatus {
  if (anomaly.status === 'RESOLVED') {
    return 'resolved'
  }
  if (dossier?.status === 'BLOCKED') {
    return 'blocked'
  }
  if (dossier?.status === 'ANALYSING') {
    return 'inProgress'
  }
  return 'open'
}

function dossierValue(dossier: MockDossier, fieldName: string | null) {
  if (!fieldName) {
    return '—'
  }
  const key = FIELD_FROM_DOSSIER[fieldName]
  return key ? dossier[key] : '—'
}

function comparisonFor(
  anomaly: MockAnomaly,
  dossier: MockDossier,
  extraction: MockExtraction | undefined,
  documents: MockDocument[],
): AnomalyItem['comparison'] {
  const docs = documents.filter((item) => item.dossier_id === dossier.id)
  const leftDoc = docs.find((item) => item.id === extraction?.document_id) ?? docs[0]
  const rightDoc = docs.find((item) => item.id !== leftDoc?.id) ?? leftDoc
  const fieldLabel = extraction?.field_label ?? anomaly.field_name ?? anomaly.title
  const leftValue = extraction?.field_value ?? '—'
  const rightValue = dossierValue(dossier, anomaly.field_name)
  const missing = anomaly.type === 'MISSING_DOCUMENT' || anomaly.type === 'MISSING_INFORMATION'

  const left: ComparisonSide = {
    fileName: leftDoc?.file_name ?? '—',
    documentType: leftDoc?.document_type ?? '—',
    fieldLabel,
    value: missing && leftValue === '—' ? '—' : leftValue,
    tone: missing || anomaly.type === 'INCONSISTENT_DATA' ? 'danger' : 'neutral',
  }
  const right: ComparisonSide = {
    fileName: rightDoc?.file_name ?? dossier.reference,
    documentType: rightDoc?.document_type ?? 'DOSSIER',
    fieldLabel,
    value: rightValue,
    tone: missing ? 'neutral' : rightValue !== '—' && rightValue !== leftValue ? 'success' : 'neutral',
  }

  return { left, right }
}

function historyFor(
  anomaly: MockAnomaly,
  dossier: MockDossier,
  assigneeName: string,
  resolverName: string | null,
): HistoryEvent[] {
  const events: HistoryEvent[] = [
    {
      id: `${anomaly.id}-detected`,
      at: dossier.created_at,
      actorName: 'ATN',
      kind: 'detected',
    },
    {
      id: `${anomaly.id}-assigned`,
      at: dossier.updated_at,
      actorName: assigneeName,
      kind: 'assigned',
    },
  ]

  if (anomaly.status === 'RESOLVED' && resolverName) {
    events.push({
      id: `${anomaly.id}-resolved`,
      at: dossier.updated_at,
      actorName: resolverName,
      kind: 'resolved',
    })
  }

  return events
}

export function getAnomaliesData(): AnomaliesData {
  const anomalies = anomalyData.anomalies as MockAnomaly[]
  const dossiers = new Map((dossierData.dossiers as MockDossier[]).map((item) => [item.id, item]))
  const users = new Map((userData.users as MockUser[]).map((item) => [item.id, item]))
  const documents = documentData.documents as MockDocument[]
  const extractions = extractionData.document_extractions as MockExtraction[]

  const items = anomalies.flatMap((anomaly) => {
    const dossier = dossiers.get(anomaly.dossier_id)
    if (!dossier) {
      return []
    }

    const extraction = anomaly.field_name
      ? extractions.find((item) => item.dossier_id === dossier.id && item.field_name === anomaly.field_name)
      : extractions.find((item) => item.dossier_id === dossier.id)
    const assignee = users.get(anomaly.assigned_to)
    const doctor = users.get(dossier.professional_id)
    const resolver = anomaly.resolved_by ? users.get(anomaly.resolved_by) : undefined
    const status = displayStatus(anomaly, dossier)

    const item: AnomalyItem = {
      id: anomaly.id,
      title: anomaly.title,
      message: anomaly.message,
      type: TYPE_MAP[anomaly.type] ?? 'inconsistent',
      severity: SEVERITY_MAP[anomaly.severity] ?? 'warning',
      status,
      fieldName: anomaly.field_name,
      fieldLabel: extraction?.field_label ?? anomaly.field_name ?? '—',
      detectedAt: dossier.updated_at,
      reference: dossier.reference,
      employeeName: dossier.employee_name,
      companyName: dossier.company_name,
      visitType: dossier.visit_type,
      doctor: doctor?.full_name ?? '—',
      assigneeId: anomaly.assigned_to,
      assigneeName: assignee?.full_name ?? '—',
      dossierId: dossier.id,
      comparison: comparisonFor(anomaly, dossier, extraction, documents),
      history: historyFor(anomaly, dossier, assignee?.full_name ?? '—', resolver?.full_name ?? null),
    }
    return [item]
  })

  return {
    items,
    summary: {
      critical: items.filter((item) => item.severity === 'critical' && item.status !== 'resolved').length,
      warning: items.filter((item) => item.severity === 'warning' && item.status !== 'resolved').length,
      resolved: items.filter((item) => item.status === 'resolved').length,
      blocked: items.filter((item) => item.status === 'blocked').length,
    },
  }
}
