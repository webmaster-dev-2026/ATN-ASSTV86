import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useI18n, type TranslationKey } from '@/i18n'
import type { ProcessingStep, ProcessingSummary } from '../types'
import { CalendarSearchIcon, SearchDocIcon, ShieldCheckIcon, TrendDownIcon, TrendUpIcon } from './ProcessingIcons'

const METRICS: {
  key: ProcessingStep
  valueKey: keyof Pick<ProcessingSummary, 'analysing' | 'checking' | 'scheduling'>
  changeKey: keyof Pick<ProcessingSummary, 'analysingChange' | 'checkingChange' | 'schedulingChange'>
  labelKey: TranslationKey
  icon: ReactNode
  iconClass: string
}[] = [
  {
    key: 'analyse',
    valueKey: 'analysing',
    changeKey: 'analysingChange',
    labelKey: 'inProgress.cards.analysing',
    icon: <SearchDocIcon className="size-5" />,
    iconClass: 'bg-[#f3e8ff] text-[#7c3aed]',
  },
  {
    key: 'check',
    valueKey: 'checking',
    changeKey: 'checkingChange',
    labelKey: 'inProgress.cards.checking',
    icon: <ShieldCheckIcon className="size-5" />,
    iconClass: 'bg-[#e7f8ee] text-[#16a34a]',
  },
  {
    key: 'schedule',
    valueKey: 'scheduling',
    changeKey: 'schedulingChange',
    labelKey: 'inProgress.cards.scheduling',
    icon: <CalendarSearchIcon className="size-5" />,
    iconClass: 'bg-[#fff1e4] text-[#ea7a1a]',
  },
]

interface ProcessingStatCardsProps {
  summary: ProcessingSummary
  active: ProcessingStep | 'all'
  onSelect: (key: ProcessingStep | 'all') => void
}

export function ProcessingStatCards({ summary, active, onSelect }: ProcessingStatCardsProps) {
  const { t } = useI18n()

  return (
    <section className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-3" aria-label={t('nav.inProgress')}>
      {METRICS.map((item) => {
        const change = summary[item.changeKey]
        const rising = change > 0
        const selected = active === item.key

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(selected ? 'all' : item.key)}
            className={cn(
              'flex cursor-pointer items-center justify-between gap-3 rounded-2xl border border-[#e8eef6] bg-white px-4 py-3 text-left shadow-[0_1px_2px_rgba(28,42,78,0.04)] transition-colors duration-200',
              selected ? 'ring-2 ring-[#2860B9]/30' : 'hover:bg-[#f7fafc]',
            )}
          >
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[#6d7b93]">{t(item.labelKey)}</p>
              <p className="mt-1 font-sans text-[28px] font-bold leading-none tabular-nums text-[#1c2a4e]">
                {summary[item.valueKey]}
              </p>
              <p
                className={cn(
                  'mt-1.5 inline-flex items-center gap-1 text-[12px] font-semibold',
                  rising ? 'text-[#16a34a]' : 'text-[#e54848]',
                )}
              >
                {rising ? <TrendUpIcon /> : <TrendDownIcon />}
                {change > 0 ? '+' : ''}
                {change}% {t('inProgress.vsYesterday')}
              </p>
            </div>
            <div className={cn('grid size-11 shrink-0 place-items-center rounded-full', item.iconClass)}>
              {item.icon}
            </div>
          </button>
        )
      })}
    </section>
  )
}
