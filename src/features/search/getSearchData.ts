import { getAnomaliesData } from '@/features/anomalies/getAnomaliesData'
import { getCompletedData } from '@/features/completed/getCompletedData'
import { getDossiersData } from '@/features/dossiers/getDossiersData'
import type { DossierCaseStatus } from '@/features/dossiers/types'
import { getInProgressData } from '@/features/in-progress/getInProgressData'
import { getSourceDocumentsData } from '@/features/source-documents/getSourceDocumentsData'
import { getToValidateData } from '@/features/to-validate/getToValidateData'
import type { SearchCatalog, SearchDossierState, SearchHit } from './types'

function dossierHref(state: SearchDossierState, dossierId?: string) {
  if (state === 'toProcess') {
    return '/a-valider'
  }
  if (state === 'analysing' || state === 'checking' || state === 'scheduling') {
    return '/traitement-en-cours'
  }
  if (state === 'completed') {
    return '/termines'
  }
  return dossierId ? `/dossiers/${dossierId}` : '/dossiers'
}

function fromCaseStatus(status: DossierCaseStatus): SearchDossierState {
  if (status === 'analysing') {
    return 'analysing'
  }
  if (status === 'toProcess') {
    return 'toProcess'
  }
  if (status === 'readyForAppointment') {
    return 'readyForAppointment'
  }
  if (status === 'blocked') {
    return 'blocked'
  }
  return 'completed'
}

function employeeId(name: string) {
  const slug = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
  return `employee:${slug || 'inconnu'}`
}

export function getSearchData(): SearchCatalog {
  const dossiers = getDossiersData()
  const toValidate = getToValidateData()
  const inProgress = getInProgressData()
  const completed = getCompletedData()
  const documents = getSourceDocumentsData()
  const anomalies = getAnomaliesData()

  const dossierHits = new Map<string, SearchHit>()

  for (const item of completed.items) {
    dossierHits.set(item.reference, {
      id: `dossier:${item.reference}`,
      kind: 'dossier',
      title: item.employeeName,
      subtitle: item.companyName,
      reference: item.reference,
      employeeName: item.employeeName,
      companyName: item.companyName,
      visitType: item.visitType,
      at: item.completedAt,
      href: dossierHref('completed'),
      dossierState: 'completed',
    })
  }

  for (const item of dossiers.cases) {
    const state = fromCaseStatus(item.status)
    dossierHits.set(item.reference, {
      id: `dossier:${item.reference}`,
      kind: 'dossier',
      title: item.employeeName,
      subtitle: item.companyName,
      reference: item.reference,
      employeeName: item.employeeName,
      companyName: item.companyName,
      visitType: item.visitType,
      at: item.receivedAt,
      href: dossierHref(state, item.id),
      dossierState: state,
      source: item.source,
    })
  }

  for (const item of toValidate.items) {
    dossierHits.set(item.reference, {
      id: `dossier:${item.reference}`,
      kind: 'dossier',
      title: item.employeeName,
      subtitle: item.companyName,
      reference: item.reference,
      employeeName: item.employeeName,
      companyName: item.companyName,
      visitType: item.visitType,
      at: item.deadlineAt,
      href: dossierHref('toProcess'),
      dossierState: 'toProcess',
      source: item.sourceFile,
    })
  }

  for (const item of inProgress.items) {
    dossierHits.set(item.reference, {
      id: `dossier:${item.reference}`,
      kind: 'dossier',
      title: item.employeeName,
      subtitle: item.companyName,
      reference: item.reference,
      employeeName: item.employeeName,
      companyName: item.companyName,
      visitType: '',
      at: item.lastActivityAt,
      href: dossierHref(item.status),
      dossierState: item.status,
    })
  }

  const documentHits: SearchHit[] = documents.items.map((item) => ({
    id: `document:${item.id}`,
    kind: 'document',
    title: item.fileName,
    subtitle: item.employeeName,
    reference: item.dossierReference,
    employeeName: item.employeeName,
    companyName: item.companyName,
    visitType: '',
    at: item.uploadedAt,
    href: '/documents-sources',
    documentStatus: item.status,
    fileKind: item.fileKind,
    fileName: item.fileName,
    fileSizeLabel: item.fileSizeLabel,
    source: item.uploadedBy,
  }))

  const anomalyHits: SearchHit[] = anomalies.items.map((item) => ({
    id: `anomaly:${item.id}`,
    kind: 'anomaly',
    title: item.title,
    subtitle: item.employeeName,
    reference: item.reference,
    employeeName: item.employeeName,
    companyName: item.companyName,
    visitType: item.visitType,
    at: item.detectedAt,
    href: '/anomalies',
    anomalySeverity: item.severity,
    anomalyStatus: item.status,
    anomalyMessage: item.message,
  }))

  const relatedByEmployee = new Map<string, { count: number; latest: SearchHit }>()
  for (const hit of [...dossierHits.values(), ...documentHits, ...anomalyHits]) {
    const current = relatedByEmployee.get(hit.employeeName)
    if (!current) {
      relatedByEmployee.set(hit.employeeName, { count: 1, latest: hit })
      continue
    }
    current.count += 1
    if (hit.at > current.latest.at) {
      current.latest = hit
    }
  }

  const employeeHits: SearchHit[] = [...relatedByEmployee.entries()].map(([name, info]) => ({
    id: employeeId(name),
    kind: 'employee',
    title: name,
    subtitle: info.latest.companyName,
    reference: info.latest.reference,
    employeeName: name,
    companyName: info.latest.companyName,
    visitType: info.latest.visitType,
    at: info.latest.at,
    href: '/dossiers',
    relatedCount: info.count,
  }))

  const hits = [...dossierHits.values(), ...documentHits, ...anomalyHits, ...employeeHits]
  const latest = [...hits]
    .filter((hit) => hit.kind !== 'employee')
    .sort((left, right) => right.at.localeCompare(left.at))
    .slice(0, 6)

  return {
    hits,
    latest,
  }
}
