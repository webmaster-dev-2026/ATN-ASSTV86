import type { TranslationKey } from '@/i18n'
import type { ActivityKind, AtnStatus, ProcessingStep, WorkflowStepId } from './types'

export const STEP_LABEL: Record<ProcessingStep, TranslationKey> = {
  analyse: 'inProgress.steps.analyse',
  check: 'inProgress.steps.check',
  schedule: 'inProgress.steps.schedule',
}

export const STATUS_LABEL: Record<AtnStatus, TranslationKey> = {
  analysing: 'inProgress.status.analysing',
  checking: 'inProgress.status.checking',
  scheduling: 'inProgress.status.scheduling',
}

export const ACTIVITY_LABEL: Record<ActivityKind, TranslationKey> = {
  ocr: 'inProgress.activity.ocr',
  extract: 'inProgress.activity.extract',
  classify: 'inProgress.activity.classify',
  verify: 'inProgress.activity.verify',
  slots: 'inProgress.activity.slots',
  match: 'inProgress.activity.match',
}

export const ACTIVITY_TITLE: Record<ActivityKind, TranslationKey> = {
  ocr: 'inProgress.feed.ocr',
  extract: 'inProgress.feed.extract',
  classify: 'inProgress.feed.classify',
  verify: 'inProgress.feed.verify',
  slots: 'inProgress.feed.slots',
  match: 'inProgress.feed.match',
}

export const WORKFLOW_LABEL: Record<WorkflowStepId, TranslationKey> = {
  intake: 'inProgress.workflow.intake',
  employee: 'inProgress.workflow.employee',
  company: 'inProgress.workflow.company',
  classify: 'inProgress.workflow.classify',
  analyse: 'inProgress.workflow.analyse',
  check: 'inProgress.workflow.check',
  schedule: 'inProgress.workflow.schedule',
  propose: 'inProgress.workflow.propose',
  confirm: 'inProgress.workflow.confirm',
  generate: 'inProgress.workflow.generate',
}

export const STEP_BADGE: Record<ProcessingStep, string> = {
  analyse: 'bg-[#f3e8ff] text-[#7c3aed]',
  check: 'bg-[#e7f8ee] text-[#15803d]',
  schedule: 'bg-[#fff1e4] text-[#c96512]',
}

export const STEP_BAR: Record<ProcessingStep, string> = {
  analyse: 'bg-[#8b5cf6]',
  check: 'bg-[#22c55e]',
  schedule: 'bg-[#f59e0b]',
}

export const STATUS_BADGE: Record<AtnStatus, string> = {
  analysing: 'bg-[#dbeafe] text-[#1d4f9a]',
  checking: 'bg-[#dcfce7] text-[#15803d]',
  scheduling: 'bg-[#ffedd5] text-[#c2410c]',
}

export const STEP_ICON_WRAP: Record<ProcessingStep, string> = {
  analyse: 'bg-[#f3e8ff] text-[#7c3aed]',
  check: 'bg-[#e7f8ee] text-[#16a34a]',
  schedule: 'bg-[#fff1e4] text-[#ea7a1a]',
}

export function formatEta(minutes: number) {
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  if (hours === 0) {
    return { hours: 0, minutes: rest }
  }
  return { hours, minutes: rest }
}

export function pageNumbers(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis' as const, total]
  }

  if (current >= total - 3) {
    return [1, 'ellipsis' as const, total - 4, total - 3, total - 2, total - 1, total]
  }

  return [1, 'ellipsis' as const, current - 1, current, current + 1, 'ellipsis' as const, total]
}
