import type { ReactNode } from 'react'
import type { StatisticsSummary } from '../types'
import { formatChange, formatCount, formatDecimal, formatPercent } from '../format'
import { useI18n, type TranslationKey } from '@/i18n'
import { cn } from '@/lib/cn'
import { ClockIcon, DocumentIcon, ShieldIcon, TrendDownIcon, TrendUpIcon, WarningIcon } from './StatisticsIcons'

interface MetricConfig {
  key: keyof StatisticsSummary
  labelKey: TranslationKey
  periodKey: TranslationKey
  changeKey: TranslationKey
  icon: ReactNode
  iconClass: string
  invertTrend: boolean
  format: 'count' | 'days' | 'percent'
}

const METRICS: MetricConfig[] = [
  {
    key: 'received',
    labelKey: 'statistics.received',
    periodKey: 'statistics.today',
    changeKey: 'statistics.vsYesterday',
    icon: <DocumentIcon />,
    iconClass: 'bg-[#dbeafe] text-[#2563eb]',
    invertTrend: false,
    format: 'count',
  },
  {
    key: 'avgProcessingDays',
    labelKey: 'statistics.avgProcessingTime',
    periodKey: 'statistics.periods.last30Days',
    changeKey: 'statistics.vsPrevious30Days',
    icon: <ClockIcon />,
    iconClass: 'bg-[#dcfce7] text-[#16a34a]',
    invertTrend: true,
    format: 'days',
  },
  {
    key: 'anomalyRate',
    labelKey: 'statistics.anomalyRate',
    periodKey: 'statistics.periods.last30Days',
    changeKey: 'statistics.vsPrevious30Days',
    icon: <WarningIcon />,
    iconClass: 'bg-[#ffedd5] text-[#ea7a1a]',
    invertTrend: true,
    format: 'percent',
  },
  {
    key: 'confirmationRate',
    labelKey: 'statistics.confirmationRate',
    periodKey: 'statistics.periods.last30Days',
    changeKey: 'statistics.vsPrevious30Days',
    icon: <ShieldIcon />,
    iconClass: 'bg-[#f3e8ff] text-[#7c3aed]',
    invertTrend: false,
    format: 'percent',
  },
]

interface StatKpiCardsProps {
  summary: StatisticsSummary
}

export function StatKpiCards({ summary }: StatKpiCardsProps) {
  const { t, locale } = useI18n()

  return (
    <section
      className="grid shrink-0 grid-cols-1 gap-3 min-[480px]:grid-cols-2 sm:gap-4 xl:grid-cols-4"
      aria-label={t('nav.statistics')}
    >
      {METRICS.map((item) => {
        const metric = summary[item.key]
        const good = item.invertTrend ? metric.changePercent <= 0 : metric.changePercent >= 0
        const up = metric.changePercent >= 0
        const value =
          item.format === 'count'
            ? formatCount(metric.value, locale)
            : item.format === 'days'
              ? `${formatDecimal(metric.value, locale)} ${t('statistics.daysUnit')}`
              : formatPercent(metric.value, locale)

        return (
          <article
            key={item.key}
            className="flex min-w-0 flex-col justify-between overflow-hidden rounded-2xl bg-white px-4 py-3.5 shadow-[0_8px_24px_rgba(28,42,78,0.05)] sm:px-5 sm:py-4"
          >
            <div className="flex items-start gap-3">
              <div className={cn('grid size-10 shrink-0 place-items-center rounded-xl sm:size-11', item.iconClass)}>
                {item.icon}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-[#6d7b93]">{t(item.labelKey)}</p>
                <p className="mt-1.5 font-sans text-[24px] font-bold leading-none tabular-nums text-[#1c2a4e] sm:text-[28px]">
                  {value}
                </p>
              </div>
            </div>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-x-2 gap-y-1">
              <p className="text-[12px] font-medium text-[#8b95a8]">{t(item.periodKey)}</p>
              <p
                className={cn(
                  'inline-flex min-w-0 items-center justify-end gap-1 text-right text-[12px] font-semibold leading-tight',
                  good ? 'text-[#16a34a]' : 'text-[#e54848]',
                )}
              >
                {up ? <TrendUpIcon /> : <TrendDownIcon />}
                <span>
                  {formatChange(metric.changePercent, locale)} {t(item.changeKey)}
                </span>
              </p>
            </div>
          </article>
        )
      })}
    </section>
  )
}
