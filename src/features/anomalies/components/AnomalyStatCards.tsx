import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useI18n, type TranslationKey } from '@/i18n'
import type { AnomalySummary } from '../types'
import { CheckCircleIcon, LockIcon, WarningTriangleIcon } from './AnomalyIcons'

const METRICS: {
  key: keyof AnomalySummary
  labelKey: TranslationKey
  hintKey: TranslationKey
  icon: ReactNode
  iconClass: string
}[] = [
  {
    key: 'critical',
    labelKey: 'anomalies.severity.critical',
    hintKey: 'anomalies.hints.critical',
    icon: <WarningTriangleIcon className="size-4" />,
    iconClass: 'bg-[#fde2e2] text-[#e54848]',
  },
  {
    key: 'warning',
    labelKey: 'anomalies.severity.warning',
    hintKey: 'anomalies.hints.warning',
    icon: <WarningTriangleIcon className="size-4" />,
    iconClass: 'bg-[#fff1e4] text-[#ea7a1a]',
  },
  {
    key: 'resolved',
    labelKey: 'anomalies.summary.resolved',
    hintKey: 'anomalies.hints.resolved',
    icon: <CheckCircleIcon className="size-4" />,
    iconClass: 'bg-[#e7f8ee] text-[#16a34a]',
  },
  {
    key: 'blocked',
    labelKey: 'anomalies.summary.blocked',
    hintKey: 'anomalies.hints.blocked',
    icon: <LockIcon className="size-4" />,
    iconClass: 'bg-[#ead9fb] text-[#7c3aed]',
  },
]

interface AnomalyStatCardsProps {
  summary: AnomalySummary
  active: keyof AnomalySummary | 'all'
  onSelect: (key: keyof AnomalySummary | 'all') => void
}

export function AnomalyStatCards({ summary, active, onSelect }: AnomalyStatCardsProps) {
  const { t } = useI18n()

  return (
    <section className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label={t('nav.anomalies')}>
      {METRICS.map((item) => {
        const selected = active === item.key

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(selected ? 'all' : item.key)}
            className={cn(
              'flex cursor-pointer items-center justify-between gap-3 rounded-2xl bg-white px-5 py-4 text-left shadow-[0_1px_2px_rgba(28,42,78,0.04)] transition-colors duration-200',
              selected ? 'ring-2 ring-[#2860B9]/30' : 'hover:bg-[#f7fafc]',
            )}
          >
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-[#6d7b93]">{t(item.labelKey)}</p>
              <p className="mt-0.5 font-sans text-[22px] font-bold leading-none tabular-nums text-[#1c2a4e]">
                {summary[item.key]}
              </p>
              <p className="mt-1 text-[11px] font-medium text-[#8b95a8]">{t(item.hintKey)}</p>
            </div>
            <div className={cn('grid size-9 shrink-0 place-items-center rounded-full', item.iconClass)}>
              {item.icon}
            </div>
          </button>
        )
      })}
    </section>
  )
}
