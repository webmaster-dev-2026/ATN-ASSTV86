import { Link } from 'react-router-dom'
import type { FacilityRank, StatisticsPeriod } from '../types'
import { formatCount, formatPercent, interpolate, PERIOD_KEYS } from '../format'
import { DashboardCard } from '@/features/dashboard/components/DashboardCard'
import { useI18n } from '@/i18n'
import { ArrowRightIcon } from './StatisticsIcons'

interface TopFacilitiesProps {
  items: FacilityRank[]
  period: StatisticsPeriod
}

function Sparkline({ values }: { values: number[] }) {
  const width = 56
  const height = 22
  const max = Math.max(...values, 1)
  const min = Math.min(...values, 0)
  const span = Math.max(max - min, 1)
  const points = values.map((value, index) => {
    const x = values.length === 1 ? width / 2 : (index / (values.length - 1)) * width
    const y = 3 + ((max - value) / span) * (height - 6)
    return `${x.toFixed(1)},${y.toFixed(1)}`
  })

  return (
    <svg viewBox={`0 0 ${width} ${height}`} aria-hidden className="h-[22px] w-14 max-w-full">
      <polyline
        points={points.join(' ')}
        fill="none"
        stroke="#16a34a"
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  )
}

export function TopFacilities({ items, period }: TopFacilitiesProps) {
  const { t, locale } = useI18n()
  const title = interpolate(t('statistics.topFacilities'), { period: t(PERIOD_KEYS[period]) })

  return (
    <DashboardCard
      title={title}
      className="h-full min-h-[260px] lg:col-span-2 xl:col-span-1"
    >
      <div className="min-h-0 min-w-0 flex-1">
        <table className="w-full table-fixed text-left">
          <colgroup>
            <col className="w-7" />
            <col />
            <col className="w-[4.25rem]" />
            <col className="w-12" />
            <col className="hidden w-16 @[560px]:table-column" />
          </colgroup>
          <thead>
            <tr className="text-[11px] font-semibold uppercase tracking-wide text-[#8b95a8]">
              <th className="pb-2 pr-1.5 font-semibold">{t('statistics.rank')}</th>
              <th className="pb-2 pr-1.5 font-semibold">{t('statistics.facility')}</th>
              <th className="pb-2 pr-1.5 text-right font-semibold">{t('statistics.receivedCount')}</th>
              <th className="pb-2 text-right font-semibold">{t('statistics.rate')}</th>
              <th className="hidden pb-2 pl-1.5 text-right font-semibold @[560px]:table-cell">{t('statistics.trend')}</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className="border-t border-[#eef3f9]">
                <td className="py-2 pr-1.5 text-[13px] font-semibold tabular-nums text-[#6d7b93]">{index + 1}</td>
                <td className="py-2 pr-1.5">
                  <span className="block truncate text-[13px] font-semibold text-[#1c2a4e]" title={item.name}>
                    {item.name}
                  </span>
                </td>
                <td className="py-2 pr-1.5 text-right text-[13px] font-semibold tabular-nums text-[#1c2a4e]">
                  {formatCount(item.count, locale)}
                </td>
                <td className="py-2 text-right text-[13px] font-semibold tabular-nums text-[#5b6b82]">
                  {formatPercent(item.percent, locale)}
                </td>
                <td className="hidden py-2 pl-1.5 text-right @[560px]:table-cell">
                  <span className="inline-flex justify-end">
                    <Sparkline values={item.trend} />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Link
        to="/dossiers"
        className="mt-3 inline-flex max-w-full items-center gap-1 self-start text-[13px] font-semibold text-[#2860B9] hover:underline"
      >
        <span className="truncate">{t('statistics.viewAllFacilities')}</span>
        <ArrowRightIcon />
      </Link>
    </DashboardCard>
  )
}
