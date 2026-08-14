import appointmentData from '../../../mock/api/appointment_proposals.json'
import dashboardJson from '../../../mock/api/dashboard.json'
import documentData from '../../../mock/api/documents.json'
import dossierData from '../../../mock/api/dossiers.json'
import type {
  DashboardData,
  FileKind,
  FileStatus,
  PriorityLevel,
  RecentFileItem,
} from '@/models'

interface MockDossier {
  id: string
  center_id: string
  center_name: string
  company_name: string
  employee_name: string
  visit_type: string
  status: string
  priority: string
}

interface MockDocument {
  id: string
  dossier_id: string
  file_name: string
  file_type: string
  received_at: string
}

interface MockAppointment {
  id: string
  dossier_id: string
  professional_name: string
  appointment_date: string
  start_time: string
  is_recommended: boolean
  status: string
}

const STATUS_MAP: Record<string, FileStatus> = {
  TO_VALIDATE: 'toValidate',
  ANALYSING: 'processing',
  READY_FOR_APPOINTMENT: 'processing',
  COMPLETED: 'completed',
  BLOCKED: 'anomaly',
}

const PRIORITY_MAP: Record<string, PriorityLevel> = {
  HIGH: 'priority',
  NORMAL: 'normal',
  LOW: 'normal',
}

function toFileKind(value: string): FileKind {
  if (value === 'DOCX' || value === 'IMAGE' || value === 'EML') {
    return value
  }
  return 'PDF'
}

function sourceLabel(dossier: MockDossier, sources: Record<string, string>) {
  return sources[dossier.center_id] ?? dossier.center_name
}

export function getDashboardData(): DashboardData {
  const dossiers = dossierData.dossiers as MockDossier[]
  const documents = documentData.documents as MockDocument[]
  const appointments = appointmentData.appointment_proposals as MockAppointment[]
  const centerSources = dashboardJson.centerSources as Record<string, string>
  const dossierById = new Map(dossiers.map((item) => [item.id, item]))

  const recentFiles: RecentFileItem[] = [...documents]
    .sort((left, right) => right.received_at.localeCompare(left.received_at))
    .flatMap((document) => {
      const dossier = dossierById.get(document.dossier_id)
      if (!dossier) {
        return []
      }

      return [
        {
          id: document.id,
          dossierId: dossier.id,
          name: document.file_name,
          fileType: toFileKind(document.file_type),
          source: sourceLabel(dossier, centerSources),
          visitType: dossier.visit_type,
          receivedAt: document.received_at,
          status: STATUS_MAP[dossier.status] ?? 'processing',
        },
      ]
    })

  const validationQueue = dossiers
    .filter((dossier) => dossier.status === 'TO_VALIDATE')
    .map((dossier) => {
      const document =
        documents.find((item) => item.dossier_id === dossier.id) ?? documents[0]

      return {
        id: dossier.id,
        dossierId: dossier.id,
        name: document.file_name,
        employeeName: dossier.employee_name,
        fileType: toFileKind(document.file_type),
        source: sourceLabel(dossier, centerSources),
        visitType: dossier.visit_type,
        receivedAt: document.received_at,
        priority: PRIORITY_MAP[dossier.priority] ?? 'normal',
      }
    })
    .sort((left, right) => right.receivedAt.localeCompare(left.receivedAt))

  const upcoming = appointments
    .filter((item) => item.status === 'PROPOSED')
    .sort((left, right) =>
      `${left.appointment_date}${left.start_time}`.localeCompare(
        `${right.appointment_date}${right.start_time}`,
      ),
    )
    .flatMap((item) => {
      const dossier = dossierById.get(item.dossier_id)
      if (!dossier) {
        return []
      }

      return [
        {
          id: item.id,
          dossierId: dossier.id,
          date: item.appointment_date,
          time: item.start_time,
          visitType: dossier.visit_type,
          companyName: dossier.company_name,
          doctor: item.professional_name,
        },
      ]
    })

  return {
    summary: dashboardJson.summary,
    recentFiles,
    validationQueue,
    processingOverview: {
      total: dashboardJson.processingOverview.total,
      segments: dashboardJson.processingOverview.segments.map((segment) => ({
        key: segment.key as FileStatus,
        count: segment.count,
        percent: segment.percent,
        color: segment.color,
      })),
    },
    appointments: upcoming,
    activity: dashboardJson.activity,
  }
}
