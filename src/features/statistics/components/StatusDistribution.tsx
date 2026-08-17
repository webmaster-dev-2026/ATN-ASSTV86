import { useState } from 'react'
import type { StatusSlice } from '../types'
import { formatCount, formatDateTime, formatPercent, interpolate, STATUS_KEYS } from '../format'
import { DashboardCard } from '@/features/dashboard/components/DashboardCard'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { RefreshIcon } from './StatisticsIcons'

interface StatusDistributionProps {
  total: number
  segments: StatusSlice[]
  updatedAt: string
  onRefresh: () => void
}

export function StatusDistribution({ total, segments, updatedAt, onRefresh }: StatusDistributionProps) {
  const { t, locale } = useI18n()
  const [spinning, setSpinning] = useState(false)
  const radius = 58
  const circumference = 2 * Math.PI * radius
  let offset = 0

  const refresh = () => {
    setSpinning(true)
    onRefresh()
    window.setTimeout(() => setSpinning(false), 600)
  }

  return (
    <DashboardCard title={t('statistics.statusDistribution')} className="h-full min-h-[260px] sm:min-h-[280px]">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col items-center gap-4 @[480px]:flex-row @[480px]:items-center">
        <div className="relative aspect-square size-36 shrink-0 @[480px]:size-32 @[640px]:size-40">
          <svg viewBox="0 0 168 168" className="size-full -rotate-90" role="img" aria-labelledby="status-donut-title">
            <title id="status-donut-title">{t('statistics.statusDistribution')}</title>
            <circle cx="84" cy="84" r={radius} fill="none" stroke="#eef3f9" strokeWidth="22" />
            {segments.map((segment) => {
              const length = (segment.count / total) * circumference
              const circle = (
                <circle
                  key={segment.key}
                  cx="84"
                  cy="84"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="22"
                  strokeLinecap="butt"
                  strokeDasharray={`${length} ${circumference - length}`}
                  strokeDashoffset={-offset}
                />
              )
              offset += length
              return circle
            })}
          </svg>
          <div className="absolute inset-0 grid place-items-center">
            <div className="text-center">
              <p className="text-[11px] font-semibold text-[#8b95a8]">{t('statistics.total')}</p>
              <p className="mt-0.5 font-sans text-[20px] font-bold leading-none tabular-nums text-[#1c2a4e]">
                {formatCount(total, locale)}
              </p>
            </div>
          </div>
        </div>

        <ul className="w-full min-w-0 flex-1 space-y-2">
          {segments.map((segment) => (
            <li key={segment.key} className="flex min-w-0 items-center justify-between gap-2 text-[12px]">
              <span className="flex min-w-0 items-center gap-2 font-medium text-[#5b6b82]">
                <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: segment.color }} />
                <span className="truncate">{t(STATUS_KEYS[segment.key])}</span>
              </span>
              <span className="shrink-0 text-right font-semibold tabular-nums text-[#1c2a4e]">
                {formatCount(segment.count, locale)}
                <span className="font-medium text-[#8b95a8]"> ({formatPercent(segment.percent, locale)})</span>
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-3 flex min-w-0 items-center justify-between gap-2 border-t border-[#eef3f9] pt-3">
        <p className="min-w-0 truncate text-[11px] font-medium text-[#8b95a8]">
          {interpolate(t('statistics.updated'), { datetime: formatDateTime(updatedAt, locale) })}
        </p>
        <button
          type="button"
          onClick={refresh}
          className="grid size-7 shrink-0 place-items-center rounded-full text-[#6d7b93] transition-colors hover:bg-[#eef3f9] hover:text-[#2860B9]"
          aria-label={t('statistics.refresh')}
        >
          <RefreshIcon className={cn(spinning && 'animate-spin')} />
        </button>
      </div>
    </DashboardCard>
  )
}
