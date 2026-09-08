import dashboardJson from '../../../mock/api/dashboard.json'
import documentData from '../../../mock/api/documents.json'
import dossierData from '../../../mock/api/dossiers.json'
import userData from '../../../mock/api/users.json'
import { birthDateFor } from './format'
import type { FileKind } from '@/models'
import type {
  AppointmentSlot,
  DossierCase,
  DossierCaseStatus,
  DossierDocument,
  DossierPriority,
  DossiersData,
  FitnessDecision,
  MedicalRestriction,
  RestrictionKind,
} from './types'

interface MockDossier {
  id: string
  reference: string
  professional_id: string
  center_id: string
  center_name: string
  employee_name: string
  company_name: string
  visit_type: string
  status: string
  priority?: string
  created_at: string
}

interface MockDocument {
  id: string
  dossier_id: string
  uploaded_by: string
  file_name: string
  document_type: string
  file_type: string
  received_at: string
}

interface MockUser {
  id: string
  full_name: string
}

const STATUS_MAP: Record<string, DossierCaseStatus> = {
  TO_VALIDATE: 'toProcess',
  ANALYSING: 'analysing',
  READY_FOR_APPOINTMENT: 'readyForAppointment',
  COMPLETED: 'completed',
  BLOCKED: 'blocked',
}

const PRIORITY_MAP: Record<string, DossierPriority> = {
  HIGH: 'high',
  NORMAL: 'normal',
  LOW: 'low',
}

function priorityFor(value: string | undefined, index = 0): DossierPriority {
  if (value && PRIORITY_MAP[value]) {
    return PRIORITY_MAP[value]
  }
  return (['normal', 'high', 'low'] as const)[index % 3]
}

const FILE_SIZES: Record<FileKind, string> = {
  PDF: '1.24 MB',
  DOCX: '428 KB',
  IMAGE: '2.08 MB',
  EML: '186 KB',
}

const FILE_PAGES: Record<FileKind, number> = {
  PDF: 3,
  DOCX: 2,
  IMAGE: 1,
  EML: 1,
}

const DOCTORS = ['Dr Pierre Martin', 'Dr Camille Rousseau'] as const

const DOCTOR_CENTERS: Record<(typeof DOCTORS)[number], string> = {
  'Dr Pierre Martin': 'Centre de santé au travail de Poitiers',
  'Dr Camille Rousseau': 'Centre de santé au travail de Niort',
}

interface ExtraSeed {
  employee: string
  company: string
  visitType: string
  status: DossierCaseStatus
  priority?: DossierPriority
  source: string
  receivedAt: string
}

const EXTRA_SEEDS: ExtraSeed[] = [
  {
    employee: 'Jean Moreau',
    company: 'ACME Industries',
    visitType: 'VISITE_REPRISE',
    status: 'toProcess',
    source: 'Cabinet Médical Poitiers',
    receivedAt: '2026-08-13T09:18:00+02:00',
  },
  {
    employee: 'Camille Leroux',
    company: 'Groupe Atlantique',
    visitType: 'VISITE_PERIODIQUE',
    status: 'readyForAppointment',
    source: 'Santé au Travail Châtellerault',
    receivedAt: '2026-08-13T08:51:00+02:00',
  },
  {
    employee: 'Hugo Marchand',
    company: 'Meca Ouest',
    visitType: 'VISITE_REPRISE',
    status: 'blocked',
    source: 'Cabinet Médical Niort',
    receivedAt: '2026-08-13T08:12:00+02:00',
  },
  {
    employee: 'Léa Petit',
    company: 'Industrie 86',
    visitType: 'VISITE_EMBAUCHE',
    status: 'analysing',
    source: 'Cabinet Médical Poitiers',
    receivedAt: '2026-08-13T07:44:00+02:00',
  },
  {
    employee: 'Pierre Dupuis',
    company: 'Logistique Deux-Sèvres',
    visitType: 'VISITE_REPRISE',
    status: 'readyForAppointment',
    source: 'Cabinet Médical Niort',
    receivedAt: '2026-08-12T16:20:00+02:00',
  },
  {
    employee: 'Sophie Garnier',
    company: 'Poitiers Tech',
    visitType: 'VISITE_PERIODIQUE',
    status: 'completed',
    source: 'Santé au Travail Châtellerault',
    receivedAt: '2026-08-12T15:02:00+02:00',
  },
  {
    employee: 'Lucas Morel',
    company: 'Banque Régionale Ouest',
    visitType: 'VISITE_EMBAUCHE',
    status: 'toProcess',
    source: 'Cabinet Médical Poitiers',
    receivedAt: '2026-08-12T14:11:00+02:00',
  },
  {
    employee: 'Chloé Renard',
    company: 'Niort Services',
    visitType: 'VISITE_REPRISE',
    status: 'readyForAppointment',
    source: 'Cabinet Médical Niort',
    receivedAt: '2026-08-12T11:36:00+02:00',
  },
  {
    employee: 'Maxime Faure',
    company: 'Agri Deux-Sèvres',
    visitType: 'VISITE_PERIODIQUE',
    status: 'analysing',
    source: 'Santé au Travail Châtellerault',
    receivedAt: '2026-08-12T10:08:00+02:00',
  },
  {
    employee: 'Manon Chevalier',
    company: 'Santé Plus Vienne',
    visitType: 'VISITE_EMBAUCHE',
    status: 'readyForAppointment',
    source: 'Cabinet Médical Poitiers',
    receivedAt: '2026-08-11T17:22:00+02:00',
  },
  {
    employee: 'Enzo Blanc',
    company: 'ACME Industries',
    visitType: 'VISITE_REPRISE',
    status: 'blocked',
    source: 'Cabinet Médical Poitiers',
    receivedAt: '2026-08-11T16:05:00+02:00',
  },
  {
    employee: 'Inès Muller',
    company: 'Groupe Atlantique',
    visitType: 'VISITE_PERIODIQUE',
    status: 'toProcess',
    source: 'Santé au Travail Châtellerault',
    receivedAt: '2026-08-11T09:40:00+02:00',
  },
]

function toFileKind(value: string): FileKind {
  if (value === 'DOCX' || value === 'IMAGE' || value === 'EML') {
    return value
  }
  return 'PDF'
}

function addHours(iso: string, hours: number) {
  return new Date(new Date(iso).getTime() + hours * 3_600_000).toISOString()
}

function addDaysAt(iso: string, days: number, hour: number, minute: number) {
  const date = new Date(iso)
  date.setDate(date.getDate() + days)
  date.setHours(hour, minute, 0, 0)
  return date.toISOString()
}

function fitnessFor(status: DossierCaseStatus): FitnessDecision {
  if (status === 'blocked') {
    return 'unfit'
  }
  if (status === 'analysing') {
    return 'pending'
  }
  return 'fit'
}

function restrictionsFor(visitType: string, status: DossierCaseStatus): MedicalRestriction[] {
  if (status === 'analysing' || status === 'completed') {
    return []
  }

  const kinds: RestrictionKind[] =
    visitType === 'VISITE_REPRISE'
      ? ['lifting', 'repetitive', 'staticPosture']
      : visitType === 'VISITE_EMBAUCHE'
        ? ['lifting']
        : ['staticPosture']

  return kinds.map((kind, index) => ({
    id: `${kind}-${index}`,
    kind,
    severity: kind === 'lifting' ? 'high' : 'medium',
  }))
}

function slotsFor(
  dossierId: string,
  receivedAt: string,
  practitioner: string,
  centerName: string,
): { proposed: AppointmentSlot | null; alternatives: AppointmentSlot[] } {
  const preferred = DOCTORS.includes(practitioner as (typeof DOCTORS)[number])
    ? (practitioner as (typeof DOCTORS)[number])
    : DOCTORS[0]
  const other = preferred === DOCTORS[0] ? DOCTORS[1] : DOCTORS[0]

  const all: AppointmentSlot[] = [
    {
      id: `${dossierId}-s1`,
      doctor: preferred,
      center: centerName,
      at: addDaysAt(receivedAt, 5, 9, 30),
      matchPercent: 94,
    },
    {
      id: `${dossierId}-s2`,
      doctor: preferred,
      center: centerName,
      at: addDaysAt(receivedAt, 6, 14, 15),
      matchPercent: 87,
    },
    {
      id: `${dossierId}-s3`,
      doctor: other,
      center: DOCTOR_CENTERS[other],
      at: addDaysAt(receivedAt, 7, 10, 0),
      matchPercent: 81,
    },
    {
      id: `${dossierId}-s4`,
      doctor: other,
      center: DOCTOR_CENTERS[other],
      at: addDaysAt(receivedAt, 8, 8, 45),
      matchPercent: 73,
    },
  ]

  return { proposed: all[0], alternatives: all.slice(1) }
}

function makeDocument(params: {
  id: string
  name: string
  documentType: string
  fileType: FileKind
  receivedAt: string
  uploadedBy: string
}): DossierDocument {
  return {
    ...params,
    fileSizeLabel: FILE_SIZES[params.fileType],
    pages: FILE_PAGES[params.fileType],
  }
}

function ensureDocuments(
  dossierId: string,
  visitType: string,
  receivedAt: string,
  uploadedBy: string,
  existing: DossierDocument[],
): DossierDocument[] {
  const types = new Set(existing.map((item) => item.documentType))
  const stamp = receivedAt.slice(0, 10).replaceAll('-', '_')
  const extras: DossierDocument[] = []

  const add = (documentType: string, slug: string, hours: number) => {
    if (types.has(documentType)) {
      return
    }
    extras.push(
      makeDocument({
        id: `${dossierId}-${slug}`,
        name: `ATN_${stamp}_${slug}.pdf`,
        documentType,
        fileType: 'PDF',
        receivedAt: addHours(receivedAt, hours),
        uploadedBy,
      }),
    )
  }

  add('DEMANDE_VISITE', 'demande', 0)
  if (visitType === 'VISITE_REPRISE') {
    add('ARRET_TRAVAIL', 'arret', 1)
  } else {
    add('FICHE_POSTE', 'poste', 1)
  }
  add('COMPTE_RENDU', 'cr', 2)

  return [...existing, ...extras].sort((left, right) => left.receivedAt.localeCompare(right.receivedAt))
}

function toCase(params: {
  id: string
  reference: string
  employeeName: string
  companyName: string
  visitType: string
  status: DossierCaseStatus
  priority: DossierPriority
  receivedAt: string
  source: string
  centerName: string
  practitioner: string
  uploadedBy: string
  documents: DossierDocument[]
}): DossierCase {
  const { proposed, alternatives } =
    params.status === 'blocked' || params.status === 'analysing'
      ? { proposed: null, alternatives: [] }
      : slotsFor(params.id, params.receivedAt, params.practitioner, params.centerName)

  return {
    id: params.id,
    reference: params.reference,
    employeeName: params.employeeName,
    birthDate: birthDateFor(params.employeeName),
    companyName: params.companyName,
    visitType: params.visitType,
    status: params.status,
    priority: params.priority,
    receivedAt: params.receivedAt,
    source: params.source,
    centerName: params.centerName,
    practitioner: params.practitioner,
    fitness: fitnessFor(params.status),
    documents: ensureDocuments(
      params.id,
      params.visitType,
      params.receivedAt,
      params.uploadedBy,
      params.documents,
    ),
    restrictions: restrictionsFor(params.visitType, params.status),
    proposedSlot: proposed,
    alternativeSlots: alternatives,
    doctors: [...DOCTORS],
  }
}

export function getDossiersData(): DossiersData {
  const dossiers = dossierData.dossiers as MockDossier[]
  const documents = documentData.documents as MockDocument[]
  const users = userData.users as MockUser[]
  const centerSources = dashboardJson.centerSources as Record<string, string>

  const userById = new Map(users.map((item) => [item.id, item.full_name]))
  const docsByDossier = new Map<string, DossierDocument[]>()

  for (const document of documents) {
    const fileType = toFileKind(document.file_type)
    const list = docsByDossier.get(document.dossier_id) ?? []
    list.push(
      makeDocument({
        id: document.id,
        name: document.file_name,
        documentType: document.document_type,
        fileType,
        receivedAt: document.received_at,
        uploadedBy: userById.get(document.uploaded_by) ?? 'Sophie Martin',
      }),
    )
    docsByDossier.set(document.dossier_id, list)
  }

  const seedCases = dossiers.map((dossier, index) => {
    const practitioner = userById.get(dossier.professional_id) ?? DOCTORS[0]
    const uploadedBy = userById.get(dossier.professional_id) ?? 'Sophie Martin'

    return toCase({
      id: dossier.id,
      reference: dossier.reference,
      employeeName: dossier.employee_name,
      companyName: dossier.company_name,
      visitType: dossier.visit_type,
      status: STATUS_MAP[dossier.status] ?? 'toProcess',
      priority: priorityFor(dossier.priority, index),
      receivedAt: dossier.created_at,
      source: centerSources[dossier.center_id] ?? dossier.center_name,
      centerName: dossier.center_name,
      practitioner,
      uploadedBy,
      documents: docsByDossier.get(dossier.id) ?? [],
    })
  })

  const extraCases = EXTRA_SEEDS.map((seed, index) => {
    const id = `DOS-${String(11 + index).padStart(4, '0')}`
    const practitioner = index % 2 === 0 ? DOCTORS[0] : DOCTORS[1]
    const uploadedBy = index % 3 === 0 ? 'Sophie Martin' : index % 3 === 1 ? 'Claire Bernard' : 'Julien Moreau'

    return toCase({
      id,
      reference: `ASSTV86-2026-${String(11 + index).padStart(4, '0')}`,
      employeeName: seed.employee,
      companyName: seed.company,
      visitType: seed.visitType,
      status: seed.status,
      priority: seed.priority ?? priorityFor(undefined, index + 1),
      receivedAt: seed.receivedAt,
      source: seed.source,
      centerName: DOCTOR_CENTERS[practitioner],
      practitioner,
      uploadedBy,
      documents: [],
    })
  })

  const cases = [...seedCases, ...extraCases].sort((left, right) =>
    right.receivedAt.localeCompare(left.receivedAt),
  )

  return { cases }
}
