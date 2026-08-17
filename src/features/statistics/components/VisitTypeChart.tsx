import type { StatisticsPeriod, VisitTypeSlice } from '../types'
import { formatCount, interpolate, PERIOD_KEYS, VISIT_TYPE_KEYS } from '../format'
import { DashboardCard } from '@/features/dashboard/components/DashboardCard'
import { useI18n } from '@/i18n'
import { PeriodSelect } from './PeriodSelect'

const BAR = '#2860B9'
const GRID = '#e8eef6'
const AXIS = '#8b95a8'

interface VisitTypeChartProps {
  items: VisitTypeSlice[]
  period: StatisticsPeriod
  onPeriodChange: (period: StatisticsPeriod) => void
}

function niceMax(value: number) {
  if (value <= 800) {
    return 800
  }
  return Math.max(100, Math.ceil(value / 100) * 100)
}

function roundedTopBar(x: number, y: number, width: number, height: number, radius = 8) {
  const r = Math.min(radius, width / 2, height)
  return `M ${x} ${y + height} L ${x} ${y + r} Q ${x} ${y} ${x + r} ${y} L ${x + width - r} ${y} Q ${x + width} ${y} ${x + width} ${y + r} L ${x + width} ${y + height} Z`
}

export function VisitTypeChart({ items, period, onPeriodChange }: VisitTypeChartProps) {
  const { t, locale } = useI18n()
  const title = interpolate(t('statistics.byVisitType'), { period: t(PERIOD_KEYS[period]) })
  const maxValue = niceMax(Math.max(...items.map((item) => item.count), 1))
  const ticks = [0, 1, 2, 3, 4].map((index) => (maxValue / 4) * index)
  const width = 640
  const height = 220
  const pad = { top: 28, right: 12, bottom: 8, left: 40 }
  const innerWidth = width - pad.left - pad.right
  const innerHeight = height - pad.top - pad.bottom
  const gap = innerWidth * 0.08
  const barWidth = items.length === 0 ? 0 : (innerWidth - gap * (items.length + 1)) / items.length

  return (
    <DashboardCard
      title={title}
      className="h-full min-h-[280px] sm:min-h-[320px]"
      titleClassName="min-w-0 leading-snug"
      action={<PeriodSelect value={period} onChange={onPeriodChange} />}
    >
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <svg viewBox={`0 0 ${width} ${height}`} className="min-h-[180px] w-full max-w-full flex-1 sm:min-h-[200px]" role="img" aria-labelledby="visit-type-title">
          <title id="visit-type-title">{title}</title>
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={pad.left}
                y1={pad.top + innerHeight - (tick / maxValue) * innerHeight}
                x2={width - pad.right}
                y2={pad.top + innerHeight - (tick / maxValue) * innerHeight}
                stroke={GRID}
                strokeWidth="1"
              />
              <text
                x={pad.left - 8}
                y={pad.top + innerHeight - (tick / maxValue) * innerHeight}
                textAnchor="end"
                dominantBaseline="middle"
                fill={AXIS}
                fontSize="10"
                fontFamily="Source Sans 3, sans-serif"
              >
                {tick}
              </text>
            </g>
          ))}

          {items.map((item, index) => {
            const barHeight = (item.count / maxValue) * innerHeight
            const x = pad.left + gap + index * (barWidth + gap)
            const y = pad.top + innerHeight - barHeight
            return (
              <g key={item.key}>
                <path d={roundedTopBar(x, y, barWidth, Math.max(barHeight, 2))} fill={BAR} />
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  fill="#1c2a4e"
                  fontSize="12"
                  fontWeight="700"
                  fontFamily="Source Sans 3, sans-serif"
                >
                  {formatCount(item.count, locale)}
                </text>
              </g>
            )
          })}
        </svg>

        <div
          className="grid min-w-0 gap-1 pt-1"
          style={{
            paddingLeft: `${(pad.left / width) * 100}%`,
            paddingRight: `${(pad.right / width) * 100}%`,
            gridTemplateColumns: `repeat(${Math.max(items.length, 1)}, minmax(0, 1fr))`,
          }}
        >
          {items.map((item) => (
            <p key={item.key} className="px-0.5 text-center text-[10px] font-medium leading-tight text-[#5b6b82] sm:px-1 sm:text-[11px]">
              {t(VISIT_TYPE_KEYS[item.key])}
            </p>
          ))}
        </div>
      </div>

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th>{t('dashboard.columns.type')}</th>
            <th>{t('statistics.records')}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.key}>
              <td>{t(VISIT_TYPE_KEYS[item.key])}</td>
              <td>{item.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardCard>
  )
}
