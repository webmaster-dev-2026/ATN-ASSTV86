import type { StatisticsPeriod } from '../types'
import { PERIOD_KEYS } from '../format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { ChevronDownIcon } from './StatisticsIcons'

const PERIODS: StatisticsPeriod[] = ['last7Days', 'last30Days', 'last90Days']

interface PeriodSelectProps {
  value: StatisticsPeriod
  onChange: (period: StatisticsPeriod) => void
}

export function PeriodSelect({ value, onChange }: PeriodSelectProps) {
  const { t } = useI18n()

  return (
    <label className="relative flex w-full min-w-0 items-center">
      <span className="sr-only">{t('statistics.period')}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as StatisticsPeriod)}
        className={cn(
          'h-8 w-full min-w-0 appearance-none rounded-lg border border-[#e4ecf6] bg-white py-0 pl-2.5 pr-7',
          'text-[12px] font-semibold text-[#5b6b82] outline-none sm:pl-3 sm:pr-8',
          'transition-colors hover:border-[#c5d4e8] focus:border-[#2860B9] focus:ring-2 focus:ring-[#2860B9]/15',
        )}
      >
        {PERIODS.map((period) => (
          <option key={period} value={period}>
            {t(PERIOD_KEYS[period])}
          </option>
        ))}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 text-[#8b95a8]" />
    </label>
  )
}
