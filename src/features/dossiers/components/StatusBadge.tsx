import { cn } from '@/lib/cn'
import { useI18n } from '@/i18n'
import { FITNESS_KEYS, FITNESS_STYLES, STATUS_KEYS, STATUS_STYLES } from '../format'
import type { DossierCaseStatus, FitnessDecision } from '../types'

export function StatusBadge({ status }: { status: DossierCaseStatus }) {
  const { t } = useI18n()

  return (
    <span
      className={cn(
        'inline-flex max-w-full truncate rounded-full px-2 py-0.5 text-[10px] font-semibold',
        STATUS_STYLES[status],
      )}
    >
      {t(STATUS_KEYS[status])}
    </span>
  )
}

export function FitnessBadge({ decision }: { decision: FitnessDecision }) {
  const { t } = useI18n()

  return (
    <span
      className={cn(
        'inline-flex shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold tracking-wide',
        FITNESS_STYLES[decision],
      )}
    >
      {t(FITNESS_KEYS[decision])}
    </span>
  )
}
