import type {
  ActivityEvent,
  ActivityKind,
  AtnStatus,
  InProgressData,
  ProcessingItem,
  ProcessingStep,
  WorkflowStep,
} from './types'

const PEOPLE: Array<[string, string]> = [
  ['Laura Fontaine', 'Banque Régionale Ouest'],
  ['Marie Dupont', 'ACME Industries'],
  ['Paul Lefèvre', 'Groupe Atlantique'],
  ['Julie Bernard', 'Meca Ouest'],
  ['Camille Roux', 'Santé Plus Vienne'],
  ['Nicolas Petit', 'Niort Services'],
  ['Antoine Girard', 'Poitiers Tech'],
  ['Émilie Moreau', 'Logistique Deux-Sèvres'],
  ['Thomas Robert', 'Industrie 86'],
  ['Hugo Lambert', 'Agri Deux-Sèvres'],
  ['Léa Petit', 'Cabinet Médical Poitiers'],
  ['Jean Moreau', 'Transports Vienne'],
  ['Chloé Renard', 'Niort Habitat'],
  ['Maxime Faure', 'Poitiers Mobilité'],
  ['Sophie Garnier', 'Santé au Travail 86'],
  ['Lucas Morel', 'Banque Régionale Ouest'],
  ['Claire Bernard', 'Groupe Atlantique'],
  ['Pierre Dupuis', 'Meca Ouest'],
  ['Hugo Marchand', 'Industrie 86'],
  ['Camille Leroux', 'Logistique Deux-Sèvres'],
  ['Inès Caron', 'Agri Deux-Sèvres'],
  ['Olivier Blanc', 'Poitiers Tech'],
  ['Manon Chevalier', 'Santé Plus Vienne'],
  ['Antoine Noel', 'Niort Services'],
  ['Léonie Vidal', 'ACME Industries'],
  ['Raphaël Colin', 'Transports Vienne'],
  ['Emma Perrot', 'Cabinet Médical Niort'],
  ['Nathan Muller', 'Groupe Atlantique'],
  ['Jade Roussel', 'Meca Ouest'],
  ['Louis Giraud', 'Banque Régionale Ouest'],
]

const STEP_PLAN: Array<{ step: ProcessingStep; status: AtnStatus; count: number }> = [
  { step: 'analyse', status: 'analysing', count: 32 },
  { step: 'check', status: 'checking', count: 28 },
  { step: 'schedule', status: 'scheduling', count: 19 },
]

const ACTIVITIES: Record<ProcessingStep, ActivityKind[]> = {
  analyse: ['ocr', 'extract', 'classify'],
  check: ['verify', 'extract'],
  schedule: ['slots', 'match'],
}

const NOW = Date.parse('2026-08-13T10:24:00+02:00')

function pad(value: number) {
  return String(value).padStart(4, '0')
}

function isoFrom(offsetMinutes: number) {
  return new Date(NOW + offsetMinutes * 60_000).toISOString()
}

function hash(input: string) {
  let value = 0
  for (let index = 0; index < input.length; index += 1) {
    value = (value * 33 + input.charCodeAt(index)) >>> 0
  }
  return value
}

function buildItems(): ProcessingItem[] {
  const items: ProcessingItem[] = []
  let sequence = 12

  for (const plan of STEP_PLAN) {
    for (let index = 0; index < plan.count; index += 1) {
      const [employeeName, companyName] = PEOPLE[(sequence + index) % PEOPLE.length]
      const id = `PRG-${pad(sequence)}`
      const seed = hash(`${id}-${plan.step}`)
      const activities = ACTIVITIES[plan.step]
      const lastActivity = activities[seed % activities.length]
      const progressBase = plan.step === 'analyse' ? 38 : plan.step === 'check' ? 62 : 82
      const progress = Math.min(96, progressBase + (seed % 14))
      const etaMinutes = 28 + (seed % 96)
      const isHero = index === 0 && plan.step === 'analyse'
      const lastOffset = isHero ? 0 : -((seed % 86) + 2)
      const heroEta = 72

      items.push({
        id,
        reference: `ASSTV86-2026-${pad(sequence)}`,
        employeeName: isHero ? 'Laura Fontaine' : employeeName,
        companyName: isHero ? 'Banque Régionale Ouest' : companyName,
        step: plan.step,
        progress: isHero ? 42 : progress,
        status: plan.status,
        lastActivity: isHero ? 'ocr' : lastActivity,
        lastActivityAt: isoFrom(lastOffset),
        etaMinutes: isHero ? heroEta : etaMinutes,
        etaAt: isoFrom(lastOffset + (isHero ? heroEta : etaMinutes)),
      })
      sequence += 1
    }
  }

  return items
}

function buildWorkflow(total: number, summary: { analysing: number; checking: number; scheduling: number }): WorkflowStep[] {
  return [
    { id: 'intake', code: 'M01', count: total, tone: '#2860B9' },
    { id: 'employee', code: 'M02', count: total, tone: '#0f766e' },
    { id: 'company', code: 'M03', count: total, tone: '#1d4f9a' },
    { id: 'classify', code: 'M04', count: total, tone: '#7c3aed' },
    { id: 'analyse', code: 'M05', count: summary.analysing, tone: '#8b5cf6' },
    { id: 'check', code: 'M06', count: summary.checking, tone: '#16a34a' },
    { id: 'schedule', code: 'M07', count: summary.scheduling, tone: '#ea7a1a' },
    { id: 'propose', code: 'M08', count: 0, tone: '#db2777' },
    { id: 'confirm', code: 'M09', count: 0, tone: '#4f46e5' },
    { id: 'generate', code: 'M10', count: 0, tone: '#1c2a4e' },
  ]
}

export function getInProgressData(): InProgressData {
  const items = buildItems()
  const summary = {
    analysing: items.filter((item) => item.step === 'analyse').length,
    checking: items.filter((item) => item.step === 'check').length,
    scheduling: items.filter((item) => item.step === 'schedule').length,
    analysingChange: 14,
    checkingChange: 8,
    schedulingChange: -5,
  }

  const activity: ActivityEvent[] = [...items]
    .sort((left, right) => right.lastActivityAt.localeCompare(left.lastActivityAt))
    .slice(0, 8)
    .map((item) => ({
      id: `${item.id}-act`,
      reference: item.reference,
      employeeName: item.employeeName,
      companyName: item.companyName,
      kind: item.lastActivity,
      step: item.step,
      at: item.lastActivityAt,
    }))

  return {
    items,
    summary,
    workflow: buildWorkflow(items.length, summary),
    activity,
  }
}
