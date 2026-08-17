import type { AnomalySlice, StatisticsPeriod } from '../types'
import { ANOMALY_CLASS_KEYS, formatCount, formatPercent, interpolate, PERIOD_KEYS } from '../format'
import { DashboardCard } from '@/features/dashboard/components/DashboardCard'
import { useI18n } from '@/i18n'

interface AnomalyClassificationProps {
  items: AnomalySlice[]
  period: StatisticsPeriod
}

export function AnomalyClassification({ items, period }: AnomalyClassificationProps) {
  const { t, locale } = useI18n()
  const title = interpolate(t('statistics.anomalyClassification'), { period: t(PERIOD_KEYS[period]) })
  const maxCount = Math.max(...items.map((item) => item.count), 1)

  return (
    <DashboardCard title={title} className="h-full min-h-[260px] sm:min-h-[280px]">
      <ul className="flex min-h-0 min-w-0 flex-1 flex-col justify-center gap-3">
        {items.map((item) => (
          <li key={item.key} className="flex min-w-0 flex-col gap-1.5">
            <div className="flex min-w-0 items-baseline justify-between gap-2">
              <p className="min-w-0 truncate text-[12px] font-medium text-[#5b6b82]" title={t(ANOMALY_CLASS_KEYS[item.key])}>
                {t(ANOMALY_CLASS_KEYS[item.key])}
              </p>
              <p className="shrink-0 text-[12px] font-semibold tabular-nums text-[#1c2a4e]">
                {formatCount(item.count, locale)}
                <span className="font-medium text-[#8b95a8]"> ({formatPercent(item.percent, locale)})</span>
              </p>
            </div>
            <div className="h-2.5 w-full overflow-hidden rounded-full bg-[#fff1e4]">
              <div
                className="h-full rounded-full bg-[#f97316]"
                style={{ width: `${Math.max((item.count / maxCount) * 100, 6)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>
    </DashboardCard>
  )
}
