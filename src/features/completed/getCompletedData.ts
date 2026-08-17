import dossierData from '../../../mock/api/dossiers.json'
import userData from '../../../mock/api/users.json'
import type {
  CompletedData,
  CompletedDelivery,
  CompletedDocTitle,
  CompletedDocument,
  CompletedHistoryEvent,
  CompletedItem,
  CompletedProcessStep,
  ProcessStepKey,
} from './types'

interface MockDossier {
  id: string
  reference: string
  employee_name: string
  company_name: string
  visit_type: string
  created_at: string
  updated_at: string
}

interface MockUser {
  full_name: string
  role: string
}

const TARGET_COUNT = 214
const TARGET_DOCUMENTS = 428
const PROCESS_KEYS: ProcessStepKey[] = ['created', 'clinical', 'paraclinical', 'conclusion', 'sent']
const VISITS = ['VISITE_PERIODIQUE', 'VISITE_EMBAUCHE', 'VISITE_REPRISE', 'VISITE_SPECIALE'] as const

const EXTRA_EMPLOYEES = [
  ['Claire Morel', 'Banque Régionale Ouest'],
  ['Julien Marchand', 'Groupe Atlantique'],
  ['Manon Lefebvre', 'Meca Ouest'],
  ['Lucas Perrin', 'Industrie 86'],
  ['Chloé Gauthier', 'Logistique Deux-Sèvres'],
  ['Maxime Faure', 'Poitiers Tech'],
  ['Léa Renault', 'Santé Plus Vienne'],
  ['Antoine Vidal', 'Niort Services'],
  ['Sarah Chevalier', 'Agri Deux-Sèvres'],
  ['Nicolas Blanc', 'ACME Industries'],
  ['Camille Fournier', 'Ouest Assurance'],
  ['Hugo Meunier', 'Atelier Vienne'],
  ['Emma Rolland', 'Transports Poitou'],
  ['Louis Carpentier', 'Centre Logistique Niort'],
  ['Inès Giraud', 'Agro Val de Loire'],
  ['Mathis Noel', 'Energie Ouest'],
  ['Jade Lemaire', 'Services Partagés 86'],
  ['Raphaël Colin', 'Banque Populaire Centre'],
  ['Léonie Baron', 'Clinique du Travail'],
  ['Théo Masson', 'Industrie Nouvelle'],
  ['Clara Denis', 'Groupe Santé Vienne'],
  ['Enzo Picard', 'Mécanique Deux-Sèvres'],
  ['Lina Breton', 'Office Régional Ouest'],
  ['Adam Lemoine', 'Filière Agricole 79'],
  ['Zoé Pasquier', 'Tech Campus Poitiers'],
  ['Nathan Boyer', 'Habitat Atlantique'],
  ['Alice Germain', 'Laboratoire Ouest'],
  ['Pauline Charrier', 'Mutualité Vienne'],
  ['Quentin Riviere', 'Chantiers Niortais'],
  ['Margot Benoit', 'Distribution Centre-Ouest'],
] as const

const ACTORS = {
  admin: 'Sophie Martin',
  assistant: 'Claire Bernard',
  doctorA: 'Dr Pierre Martin',
  doctorB: 'Dr Camille Rousseau',
}

function pad(value: number, size = 4) {
  return String(value).padStart(size, '0')
}

function iso(year: number, month: number, day: number, hour: number, minute: number) {
  const mm = pad(month, 2)
  const dd = pad(day, 2)
  const hh = pad(hour, 2)
  const mi = pad(minute, 2)
  return `${year}-${mm}-${dd}T${hh}:${mi}:00+02:00`
}

function addMinutes(value: string, minutes: number) {
  const date = new Date(value)
  date.setMinutes(date.getMinutes() + minutes)
  const offset = '+02:00'
  const local = new Date(date.getTime())
  const y = local.getFullYear()
  const m = pad(local.getMonth() + 1, 2)
  const d = pad(local.getDate(), 2)
  const h = pad(local.getHours(), 2)
  const mi = pad(local.getMinutes(), 2)
  return `${y}-${m}-${d}T${h}:${mi}:00${offset}`
}

function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

function pick<T>(random: () => number, list: readonly T[]) {
  return list[Math.floor(random() * list.length)]
}

function processFor(createdAt: string, completedAt: string): CompletedProcessStep[] {
  const created = new Date(createdAt).getTime()
  const completed = new Date(completedAt).getTime()
  const span = Math.max(completed - created, 60 * 60 * 1000)

  return PROCESS_KEYS.map((key, index) => {
    const ratio = index / (PROCESS_KEYS.length - 1)
    const at = new Date(created + span * ratio)
    return {
      key,
      at: iso(at.getFullYear(), at.getMonth() + 1, at.getDate(), at.getHours(), at.getMinutes()),
    }
  })
}

function historyFor(
  id: string,
  process: CompletedProcessStep[],
  doctor: string,
): CompletedHistoryEvent[] {
  const created = process.find((step) => step.key === 'created')
  const paraclinical = process.find((step) => step.key === 'paraclinical')
  const conclusion = process.find((step) => step.key === 'conclusion')
  const sent = process.find((step) => step.key === 'sent')

  return [
    sent ? { id: `${id}-h-sent`, kind: 'sent' as const, actorName: ACTORS.admin, at: sent.at } : null,
    conclusion
      ? { id: `${id}-h-concluded`, kind: 'concluded' as const, actorName: doctor, at: conclusion.at }
      : null,
    paraclinical
      ? {
          id: `${id}-h-attached`,
          kind: 'attached' as const,
          actorName: ACTORS.assistant,
          at: addMinutes(paraclinical.at, 2),
        }
      : null,
    created
      ? { id: `${id}-h-created`, kind: 'created' as const, actorName: ACTORS.admin, at: created.at }
      : null,
  ].filter((event): event is CompletedHistoryEvent => event !== null)
}

function documentsFor(id: string, reference: string, count: number, random: () => number): CompletedDocument[] {
  const templates: Array<{
    title: CompletedDocTitle
    kind: CompletedDocument['kind']
    suffix: string
    bytes: number
  }> = [
    { title: 'invitation', kind: 'PDF', suffix: 'Invitation', bytes: 128_000 + Math.floor(random() * 40_000) },
    { title: 'email', kind: 'HTML', suffix: 'Email', bytes: 18_000 + Math.floor(random() * 16_000) },
    { title: 'summary', kind: 'PDF', suffix: 'Synthese', bytes: 210_000 + Math.floor(random() * 80_000) },
    { title: 'fitness', kind: 'PDF', suffix: 'Avis', bytes: 320_000 + Math.floor(random() * 120_000) },
  ]

  return templates.slice(0, count).map((template, index) => ({
    id: `${id}-doc-${index + 1}`,
    title: template.title,
    name: `ASSTV86_${template.suffix}_${reference.slice(-4)}.${template.kind === 'HTML' ? 'html' : template.kind.toLowerCase()}`,
    kind: template.kind,
    bytes: template.bytes,
  }))
}

function featuredItem(): CompletedItem {
  const createdAt = '2026-08-01T09:30:00+02:00'
  const completedAt = '2026-08-13T14:36:00+02:00'
  const process: CompletedProcessStep[] = [
    { key: 'created', at: '2026-08-01T09:30:00+02:00' },
    { key: 'clinical', at: '2026-08-05T10:15:00+02:00' },
    { key: 'paraclinical', at: '2026-08-08T14:20:00+02:00' },
    { key: 'conclusion', at: '2026-08-13T11:05:00+02:00' },
    { key: 'sent', at: '2026-08-13T14:36:00+02:00' },
  ]

  return {
    id: 'DOS-0009',
    reference: 'ASSTV86-2026-0009',
    employeeName: 'Laura Fontaine',
    companyName: 'Banque Régionale Ouest',
    visitType: 'VISITE_PERIODIQUE',
    createdAt,
    completedAt,
    delivery: 'sent',
    documents: [
      { id: 'DOS-0009-doc-1', title: 'invitation', name: 'ASSTV86_Invitation.pdf', kind: 'PDF', bytes: 128_000 },
      { id: 'DOS-0009-doc-2', title: 'email', name: 'ASSTV86_Invitation.html', kind: 'HTML', bytes: 24_000 },
      { id: 'DOS-0009-doc-3', title: 'summary', name: 'ASSTV86_Synthese.pdf', kind: 'PDF', bytes: 256_000 },
    ],
    process,
    history: historyFor('DOS-0009', process, ACTORS.doctorA),
  }
}

export function getCompletedData(): CompletedData {
  const dossiers = dossierData.dossiers as MockDossier[]
  const users = userData.users as MockUser[]
  const doctors = users.filter((user) => user.role === 'PROFESSIONAL').map((user) => user.full_name)
  const doctorNames = doctors.length > 0 ? doctors : [ACTORS.doctorA, ACTORS.doctorB]
  const random = mulberry32(86_2026)

  const pool: Array<{ name: string; company: string; visitType: string }> = [
    ...dossiers
      .filter((dossier) => dossier.employee_name !== 'Laura Fontaine')
      .map((dossier) => ({
        name: dossier.employee_name,
        company: dossier.company_name,
        visitType: dossier.visit_type,
      })),
    ...EXTRA_EMPLOYEES.map(([name, company]) => ({
      name,
      company,
      visitType: pick(random, VISITS),
    })),
  ]

  const featured = featuredItem()
  const remainingDocs = TARGET_DOCUMENTS - featured.documents.length
  const remainingCount = TARGET_COUNT - 1
  const base = Math.floor(remainingDocs / remainingCount)
  let leftover = remainingDocs - base * remainingCount

  const items: CompletedItem[] = [featured]
  let sequence = 11

  for (let index = 0; index < remainingCount; index += 1) {
    const person = pool[index % pool.length]
    const extraDoc = leftover > 0 ? 1 : 0
    leftover -= extraDoc
    const docCount = Math.min(4, Math.max(1, base + extraDoc))
    const day = 13 - Math.floor(index / 9)
    const month = day > 0 ? 8 : 7
    const resolvedDay = day > 0 ? day : 31 + day
    const hour = month === 8 && resolvedDay === 13 ? 8 + (index % 6) : 8 + (index % 9)
    const minute = (index * 7) % 60
    const completedAt = iso(2026, month, resolvedDay, hour, minute)
    const createdAt = iso(2026, month === 8 && resolvedDay > 10 ? 8 : 7, Math.max(1, resolvedDay - 8), 9, 10 + (index % 40))
    const process = processFor(createdAt, completedAt)
    const doctor = doctorNames[index % doctorNames.length]
    const id = `DOS-C-${pad(sequence)}`
    const reference = `ASSTV86-2026-${pad(sequence)}`
    const delivery: CompletedDelivery = index % 5 === 0 ? 'archived' : 'sent'

    items.push({
      id,
      reference,
      employeeName: person.name,
      companyName: person.company,
      visitType: person.visitType,
      createdAt,
      completedAt,
      delivery,
      documents: documentsFor(id, reference, docCount, random),
      process,
      history: historyFor(id, process, doctor),
    })
    sequence += 1
  }

  items.sort((left, right) => right.completedAt.localeCompare(left.completedAt))
  const featuredIndex = items.findIndex((item) => item.id === featured.id)
  if (featuredIndex > 0) {
    const [pinned] = items.splice(featuredIndex, 1)
    items.unshift(pinned)
  }

  const documents = items.reduce((sum, item) => sum + item.documents.length, 0)

  return {
    items,
    summary: {
      dossiers: items.length,
      dossiersChange: 18,
      documents,
      documentsChange: 15,
      sent: 312,
      sentChange: 12,
      archived: 198,
      archivedChange: 9,
    },
  }
}
