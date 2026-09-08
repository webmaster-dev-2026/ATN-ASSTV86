import anomalyData from '../../../mock/api/anomalies.json'
import appointmentData from '../../../mock/api/appointment_proposals.json'
import dashboardJson from '../../../mock/api/dashboard.json'
import extractionData from '../../../mock/api/document_extractions.json'
import documentData from '../../../mock/api/documents.json'
import resultData from '../../../mock/api/dossier_results.json'
import dossierData from '../../../mock/api/dossiers.json'
import userData from '../../../mock/api/users.json'
import type { ReasonKind, ToValidateData, ValidationItem, ValidationOption } from './types'

interface MockDossier {
  id: string
  reference: string
  professional_id: string
  employee_name: string
  company_name: string
  visit_type: string
  status: string
  priority: string
  created_at: string
}

interface MockDocument {
  dossier_id: string
  file_name: string
  file_type: string
}

interface MockExtraction {
  dossier_id: string
  document_id: string
  field_name: string
  field_label: string
  field_value: string
  confidence: number
  source_text: string
  status: string
}

interface MockAnomaly {
  dossier_id: string
  field_name: string | null
  title: string
  message: string
  status: string
}

interface MockAppointment {
  dossier_id: string
  professional_name: string
  appointment_date: string
  start_time: string
  is_recommended: boolean
}

interface MockUser {
  id: string
  full_name: string
}

interface MockResult {
  dossier_id: string
  summary: string
}

const PENDING_EXTRACTION = new Set(['TO_VALIDATE', 'SUGGESTED'])
const VISIT_ALTERNATIVES = ['VISITE_PERIODIQUE', 'VISITE_EMBAUCHE', 'VISITE_REPRISE']
const PRIORITY_RANK = { HIGH: 0, NORMAL: 1, LOW: 2 } as const

const FIELD_REASON: Record<string, ReasonKind> = {
  return_date: 'returnDate',
  visit_type: 'visitType',
  workplace: 'workplace',
  employee_name: 'employeeName',
  job_title: 'jobTitle',
  company_name: 'companyName',
}

const FILE_PAGES: Record<string, number> = {
  PDF: 3,
  DOCX: 2,
  IMAGE: 1,
  EML: 1,
}

function reasonFromField(fieldName: string | null | undefined): ReasonKind {
  if (!fieldName) {
    return 'employeeName'
  }
  return FIELD_REASON[fieldName] ?? 'employeeName'
}

function deadlineIso(date: string, time = '09:00') {
  return `${date}T${time}:00+02:00`
}

function shiftIsoDate(value: string, days: number) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) {
    return value
  }
  const date = new Date(`${match[1]}-${match[2]}-${match[3]}T12:00:00`)
  date.setDate(date.getDate() + days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function alternativesFor(reason: ReasonKind, value: string, visitType: string): ValidationOption[] {
  if (reason === 'visitType') {
    const selected = VISIT_ALTERNATIVES.includes(value) ? value : visitType
    const ids = [selected, ...VISIT_ALTERNATIVES.filter((item) => item !== selected)]
    return ids.map((id) => ({ id, value: id }))
  }

  if (reason === 'returnDate' && /^\d{4}-\d{2}-\d{2}/.test(value)) {
    const alt = shiftIsoDate(value, 5)
    return [
      { id: value, value },
      { id: alt, value: alt },
    ]
  }

  return [{ id: value, value }]
}

export function getToValidateData(): ToValidateData {
  const dossiers = dossierData.dossiers as MockDossier[]
  const documents = documentData.documents as MockDocument[]
  const extractions = extractionData.document_extractions as MockExtraction[]
  const anomalies = anomalyData.anomalies as MockAnomaly[]
  const appointments = appointmentData.appointment_proposals as MockAppointment[]
  const users = userData.users as MockUser[]
  const results = resultData.dossier_results as MockResult[]

  const userById = new Map(users.map((item) => [item.id, item.full_name]))
  const docsByDossier = new Map<string, MockDocument[]>()
  const extractionsByDossier = new Map<string, MockExtraction[]>()
  const anomaliesByDossier = new Map<string, MockAnomaly[]>()
  const appointmentByDossier = new Map<string, MockAppointment>()
  const resultByDossier = new Map(results.map((item) => [item.dossier_id, item]))

  for (const document of documents) {
    const list = docsByDossier.get(document.dossier_id) ?? []
    list.push(document)
    docsByDossier.set(document.dossier_id, list)
  }

  for (const extraction of extractions) {
    const list = extractionsByDossier.get(extraction.dossier_id) ?? []
    list.push(extraction)
    extractionsByDossier.set(extraction.dossier_id, list)
  }

  for (const anomaly of anomalies) {
    if (anomaly.status !== 'OPEN') {
      continue
    }
    const list = anomaliesByDossier.get(anomaly.dossier_id) ?? []
    list.push(anomaly)
    anomaliesByDossier.set(anomaly.dossier_id, list)
  }

  for (const appointment of appointments) {
    const current = appointmentByDossier.get(appointment.dossier_id)
    if (!current || appointment.is_recommended) {
      appointmentByDossier.set(appointment.dossier_id, appointment)
    }
  }

  const pending = dossiers
    .filter((dossier) => dossier.status === 'TO_VALIDATE')
    .sort((left, right) => {
      const rank =
        (PRIORITY_RANK[left.priority as keyof typeof PRIORITY_RANK] ?? 1) -
        (PRIORITY_RANK[right.priority as keyof typeof PRIORITY_RANK] ?? 1)
      if (rank !== 0) {
        return rank
      }
      return right.created_at.localeCompare(left.created_at)
    })

  const items: ValidationItem[] = pending.map((dossier) => {
    const pendingFields = (extractionsByDossier.get(dossier.id) ?? []).filter((item) =>
      PENDING_EXTRACTION.has(item.status),
    )
    const openAnomalies = anomaliesByDossier.get(dossier.id) ?? []
    const extraction = pendingFields[0]
    const anomaly = openAnomalies[0]
    const document = docsByDossier.get(dossier.id)?.[0]
    const appointment = appointmentByDossier.get(dossier.id)
    const result = resultByDossier.get(dossier.id)

    const reason = reasonFromField(extraction?.field_name ?? anomaly?.field_name)
    const proposalValue = extraction?.field_value ?? dossier.employee_name
    const alternatives = alternativesFor(reason, proposalValue, dossier.visit_type)
    const fieldsToConfirm = Math.max(pendingFields.length + (extraction ? 0 : openAnomalies.length ? 1 : 0), 1)

    return {
      id: dossier.id,
      reference: dossier.reference,
      employeeName: dossier.employee_name,
      companyName: dossier.company_name,
      visitType: dossier.visit_type,
      reason,
      priority: dossier.priority === 'HIGH' ? 'high' : dossier.priority === 'LOW' ? 'low' : 'medium',
      deadlineAt: appointment
        ? deadlineIso(appointment.appointment_date, appointment.start_time)
        : dossier.created_at,
      examDate: dossier.created_at,
      analyzedAt: dossier.created_at,
      doctor: userById.get(dossier.professional_id) ?? appointment?.professional_name ?? dossier.professional_id,
      fieldsToConfirm,
      confidence: extraction ? Math.round(extraction.confidence * 100) : null,
      sourceFile: document?.file_name ?? dossier.reference,
      sourcePage: FILE_PAGES[document?.file_type ?? 'PDF'] ?? 1,
      sourceText: extraction?.source_text ?? anomaly?.message ?? result?.summary ?? '',
      proposalValue,
      proposal: alternatives[0]?.id ?? proposalValue,
      alternatives,
    }
  })

  const toValidateMetric = dashboardJson.summary.toValidate

  return {
    items,
    summary: {
      pendingDossiers: items.length,
      fieldsToConfirm: items.reduce((sum, item) => sum + item.fieldsToConfirm, 0),
      urgentDecisions: items.filter((item) => item.priority === 'high').length,
      pendingChange: toValidateMetric.changePercent,
      fieldsChange: toValidateMetric.changePercent,
      urgentChange: toValidateMetric.changePercent,
    },
  }
}
