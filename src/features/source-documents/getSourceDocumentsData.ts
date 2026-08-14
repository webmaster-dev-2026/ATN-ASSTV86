import dossierData from '../../../mock/api/dossiers.json'
import type {
  SourceDocHistoryEvent,
  SourceDocStatus,
  SourceDocument,
  SourceDocumentsData,
  SourceFileKind,
} from './types'

interface MockDossier {
  id: string
  reference: string
  employee_name: string
  company_name: string
}

interface SeedRow {
  fileName: string
  fileKind: SourceFileKind
  documentType: string
  status: SourceDocStatus
  uploadedAt: string
  companyName: string
  uploadedBy: string
  employeeName: string
  summaryKey: SourceDocument['summaryKey']
}

const FILE_META: Record<SourceFileKind, { size: string; pages: number; ext: string }> = {
  PDF: { size: '1.24 MB', pages: 3, ext: 'pdf' },
  PPTX: { size: '3.82 MB', pages: 8, ext: 'pptx' },
  DOCX: { size: '428 KB', pages: 2, ext: 'docx' },
  JPG: { size: '2.08 MB', pages: 1, ext: 'jpg' },
  XLSX: { size: '186 KB', pages: 4, ext: 'xlsx' },
}

const SLUGS = ['poste', 'visite', 'arret', 'formulaire', 'planning', 'demande', 'fiche', 'email'] as const
const KINDS: SourceFileKind[] = ['PDF', 'PPTX', 'DOCX', 'JPG', 'XLSX']
const DOC_TYPES = ['FICHE_POSTE', 'DEMANDE_VISITE', 'ARRET_TRAVAIL', 'FORMULAIRE', 'PLANNING', 'EMAIL'] as const

const PEOPLE = [
  'Laura Fontaine',
  'Thomas Renault',
  'Camille Moreau',
  'Julien Bernard',
  'Élodie Marchand',
  'Nicolas Petit',
  'Sophie Martin',
  'Antoine Lefèvre',
  'Claire Bernard',
  'Marie Dupont',
]

const COMPANIES = [
  'Banque Régionale Ouest',
  'Groupe Industriel Atlantique',
  'Clinique Saint-Hilaire',
  'Hôpital Universitaire',
  'Transports du Centre',
  'Mairie de Poitiers',
  'Agroalimentaire Val de Loire',
  'Cabinet Médical Centre',
  'ACME Industries',
  'Groupe Atlantique',
  'Meca Ouest',
  'Industrie 86',
]

const SEEDS: SeedRow[] = [
  {
    fileName: 'ATN_2026_08_13_poste.pdf',
    fileKind: 'PDF',
    documentType: 'FICHE_POSTE',
    status: 'analysed',
    uploadedAt: '2026-08-13T16:42:00+02:00',
    companyName: 'Banque Régionale Ouest',
    uploadedBy: 'Laura Fontaine',
    employeeName: 'Marie Dupont',
    summaryKey: 'nightWork',
  },
  {
    fileName: 'ATN_2026_08_13_visite.pptx',
    fileKind: 'PPTX',
    documentType: 'DEMANDE_VISITE',
    status: 'reviewing',
    uploadedAt: '2026-08-13T14:18:00+02:00',
    companyName: 'Groupe Industriel Atlantique',
    uploadedBy: 'Thomas Renault',
    employeeName: 'Paul Lefèvre',
    summaryKey: 'visitRequest',
  },
  {
    fileName: 'ATN_2026_08_12_arret.docx',
    fileKind: 'DOCX',
    documentType: 'ARRET_TRAVAIL',
    status: 'analysed',
    uploadedAt: '2026-08-12T11:05:00+02:00',
    companyName: 'Clinique Saint-Hilaire',
    uploadedBy: 'Camille Moreau',
    employeeName: 'Julie Bernard',
    summaryKey: 'sickLeave',
  },
  {
    fileName: 'ATN_2026_08_12_formulaire.jpg',
    fileKind: 'JPG',
    documentType: 'FORMULAIRE',
    status: 'error',
    uploadedAt: '2026-08-12T09:40:00+02:00',
    companyName: 'Hôpital Universitaire',
    uploadedBy: 'Julien Bernard',
    employeeName: 'Thomas Robert',
    summaryKey: 'error',
  },
  {
    fileName: 'ATN_2026_08_11_planning.xlsx',
    fileKind: 'XLSX',
    documentType: 'PLANNING',
    status: 'analysed',
    uploadedAt: '2026-08-11T17:22:00+02:00',
    companyName: 'Transports du Centre',
    uploadedBy: 'Élodie Marchand',
    employeeName: 'Émilie Moreau',
    summaryKey: 'planning',
  },
  {
    fileName: 'ATN_2026_08_11_demande.pdf',
    fileKind: 'PDF',
    documentType: 'DEMANDE_VISITE',
    status: 'reviewing',
    uploadedAt: '2026-08-11T10:14:00+02:00',
    companyName: 'Mairie de Poitiers',
    uploadedBy: 'Nicolas Petit',
    employeeName: 'Léa Petit',
    summaryKey: 'visitRequest',
  },
  {
    fileName: 'ATN_2026_08_10_fiche.pdf',
    fileKind: 'PDF',
    documentType: 'FICHE_POSTE',
    status: 'analysed',
    uploadedAt: '2026-08-10T15:36:00+02:00',
    companyName: 'Agroalimentaire Val de Loire',
    uploadedBy: 'Sophie Martin',
    employeeName: 'Hugo Lambert',
    summaryKey: 'jobSheet',
  },
  {
    fileName: 'ATN_2026_08_10_email.docx',
    fileKind: 'DOCX',
    documentType: 'EMAIL',
    status: 'analysed',
    uploadedAt: '2026-08-10T08:51:00+02:00',
    companyName: 'Cabinet Médical Centre',
    uploadedBy: 'Antoine Lefèvre',
    employeeName: 'Camille Leroux',
    summaryKey: 'email',
  },
]

function pad(value: number, size = 4) {
  return String(value).padStart(size, '0')
}

function shiftHours(iso: string, hours: number) {
  const date = new Date(iso)
  date.setHours(date.getHours() - hours)
  return date.toISOString()
}

function summaryFor(kind: SourceFileKind, slug: string, status: SourceDocStatus): SourceDocument['summaryKey'] {
  if (status === 'error') {
    return 'error'
  }
  if (slug === 'poste' || slug === 'fiche') {
    return kind === 'PDF' ? 'nightWork' : 'jobSheet'
  }
  if (slug === 'visite' || slug === 'demande') {
    return 'visitRequest'
  }
  if (slug === 'arret') {
    return 'sickLeave'
  }
  if (slug === 'planning') {
    return 'planning'
  }
  if (slug === 'email') {
    return 'email'
  }
  return 'form'
}

function historyFor(id: string, status: SourceDocStatus, at: string, actor: string): SourceDocHistoryEvent[] {
  const events: SourceDocHistoryEvent[] = [
    { id: `${id}-uploaded`, at: shiftHours(at, 6), actorName: actor, kind: 'uploaded' },
  ]

  if (status === 'reviewing') {
    events.push({ id: `${id}-review`, at: shiftHours(at, 1), actorName: 'ATN', kind: 'reviewStarted' })
  } else if (status === 'error') {
    events.push({ id: `${id}-error`, at, actorName: 'ATN', kind: 'errorDetected' })
  } else if (status === 'analysed') {
    events.push({ id: `${id}-analysed`, at, actorName: 'ATN', kind: 'analysed' })
  }

  return events
}

function statusAt(index: number): SourceDocStatus {
  if (index < SEEDS.length) {
    return SEEDS[index].status
  }

  const remainingIndex = index - SEEDS.length
  if (remainingIndex < 163) {
    return 'analysed'
  }
  if (remainingIndex < 213) {
    return 'reviewing'
  }
  if (remainingIndex < 224) {
    return 'error'
  }
  return 'uploaded'
}

function buildItem(
  index: number,
  dossiers: MockDossier[],
): SourceDocument {
  const dossier = dossiers[index % dossiers.length]
  const id = `SRC-${pad(index + 1)}`

  if (index < SEEDS.length) {
    const seed = SEEDS[index]
    const meta = FILE_META[seed.fileKind]
    return {
      id,
      fileName: seed.fileName,
      fileKind: seed.fileKind,
      documentType: seed.documentType,
      status: seed.status,
      uploadedAt: seed.uploadedAt,
      fileSizeLabel: meta.size,
      pages: meta.pages,
      companyName: seed.companyName,
      uploadedBy: seed.uploadedBy,
      employeeName: seed.employeeName,
      dossierId: dossier.id,
      dossierReference: dossier.reference,
      summaryKey: seed.summaryKey,
      history: historyFor(id, seed.status, seed.uploadedAt, seed.uploadedBy),
    }
  }

  const status = statusAt(index)
  const kind = KINDS[index % KINDS.length]
  const slug = SLUGS[index % SLUGS.length]
  const meta = FILE_META[kind]
  const uploadedAt = shiftHours('2026-08-10T08:00:00+02:00', index - SEEDS.length)
  const dateStamp = uploadedAt.slice(0, 10).replaceAll('-', '_')
  const companyName = COMPANIES[index % COMPANIES.length]
  const uploadedBy = PEOPLE[index % PEOPLE.length]

  return {
    id,
    fileName: `ATN_${dateStamp}_${slug}_${pad(index + 1, 3)}.${meta.ext}`,
    fileKind: kind,
    documentType: DOC_TYPES[index % DOC_TYPES.length],
    status,
    uploadedAt,
    fileSizeLabel: meta.size,
    pages: meta.pages,
    companyName,
    uploadedBy,
    employeeName: dossier.employee_name,
    dossierId: dossier.id,
    dossierReference: dossier.reference,
    summaryKey: summaryFor(kind, slug, status),
    history: historyFor(id, status, uploadedAt, uploadedBy),
  }
}

export function getSourceDocumentsData(): SourceDocumentsData {
  const dossiers = dossierData.dossiers as MockDossier[]
  const items = Array.from({ length: 256 }, (_, index) => buildItem(index, dossiers))

  return {
    items,
    summary: {
      total: items.length,
      analysed: items.filter((item) => item.status === 'analysed').length,
      reviewing: items.filter((item) => item.status === 'reviewing').length,
      error: items.filter((item) => item.status === 'error').length,
      totalChange: 12,
      analysedChange: 15,
      reviewingChange: 8,
      errorChange: 25,
    },
  }
}
