import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useI18n, type TranslationKey } from '@/i18n'
import type { SourceDocSummary } from '../types'
import { CheckCircleIcon, ClockIcon, FolderIcon, TrendUpIcon, WarningTriangleIcon } from './SourceDocumentIcons'

type CardKey = 'total' | 'analysed' | 'reviewing' | 'error'

const METRICS: {
  key: CardKey
  valueKey: keyof Pick<SourceDocSummary, 'total' | 'analysed' | 'reviewing' | 'error'>
  changeKey: keyof Pick<SourceDocSummary, 'totalChange' | 'analysedChange' | 'reviewingChange' | 'errorChange'>
  labelKey: TranslationKey
  icon: ReactNode
  iconClass: string
  invertTrend: boolean
}[] = [
  {
    key: 'total',
    valueKey: 'total',
    changeKey: 'totalChange',
    labelKey: 'sourceDocuments.total',
    icon: <FolderIcon className="size-5" />,
    iconClass: 'bg-[#d9e8fb] text-[#1d4f9a]',
    invertTrend: false,
  },
  {
    key: 'analysed',
    valueKey: 'analysed',
    changeKey: 'analysedChange',
    labelKey: 'sourceDocuments.analysed',
    icon: <CheckCircleIcon className="size-5" />,
    iconClass: 'bg-[#e7f8ee] text-[#16a34a]',
    invertTrend: false,
  },
  {
    key: 'reviewing',
    valueKey: 'reviewing',
    changeKey: 'reviewingChange',
    labelKey: 'sourceDocuments.reviewing',
    icon: <ClockIcon className="size-5" />,
    iconClass: 'bg-[#fff1e4] text-[#ea7a1a]',
    invertTrend: true,
  },
  {
    key: 'error',
    valueKey: 'error',
    changeKey: 'errorChange',
    labelKey: 'sourceDocuments.error',
    icon: <WarningTriangleIcon className="size-5" />,
    iconClass: 'bg-[#fde2e2] text-[#e54848]',
    invertTrend: true,
  },
]

interface SourceDocumentStatCardsProps {
  summary: SourceDocSummary
  active: CardKey
  onSelect: (key: CardKey) => void
}

export function SourceDocumentStatCards({ summary, active, onSelect }: SourceDocumentStatCardsProps) {
  const { t } = useI18n()

  return (
    <section className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label={t('nav.sourceDocuments')}>
      {METRICS.map((item) => {
        const selected = active === item.key
        const change = summary[item.changeKey]
        const good = item.invertTrend ? change <= 0 : change >= 0

        return (
          <button
            key={item.key}
            type="button"
            onClick={() => onSelect(item.key === 'total' || selected ? 'total' : item.key)}
            className={cn(
              'flex cursor-pointer items-start gap-3 rounded-2xl bg-white px-4 py-3.5 text-left shadow-[0_1px_2px_rgba(28,42,78,0.04)] transition-colors duration-200',
              selected ? 'ring-2 ring-[#2860B9]/30' : 'hover:bg-[#f7fafc]',
            )}
          >
            <div className={cn('grid size-11 shrink-0 place-items-center rounded-full', item.iconClass)}>
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[13px] font-semibold text-[#6d7b93]">{t(item.labelKey)}</p>
              <p className="mt-1 font-sans text-[28px] font-bold leading-none tabular-nums text-[#1c2a4e]">
                {summary[item.valueKey]}
              </p>
              <p
                className={cn(
                  'mt-1.5 inline-flex items-center gap-1 text-[12px] font-semibold',
                  good ? 'text-[#16a34a]' : 'text-[#ea7a1a]',
                  item.key === 'error' && change > 0 && 'text-[#e54848]',
                )}
              >
                <TrendUpIcon />
                {change}% {t('sourceDocuments.vsYesterday')}
              </p>
            </div>
          </button>
        )
      })}
    </section>
  )
}
