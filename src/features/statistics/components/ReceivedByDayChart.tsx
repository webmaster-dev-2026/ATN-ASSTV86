import { useMemo, useState, type MouseEvent, type TouchEvent } from 'react'
import type { DayCount, StatisticsPeriod } from '../types'
import { formatChartDate, formatCount, formatFullDate, interpolate, PERIOD_KEYS } from '../format'
import { DashboardCard } from '@/features/dashboard/components/DashboardCard'
import { useI18n } from '@/i18n'
import { PeriodSelect } from './PeriodSelect'

const LINE = '#2860B9'
const GRID = '#e8eef6'
const BASELINE = '#d7e1ef'
const AXIS = '#8b95a8'

interface ReceivedByDayChartProps {
  points: DayCount[]
  period: StatisticsPeriod
  onPeriodChange: (period: StatisticsPeriod) => void
}

function niceMax(value: number) {
  if (value <= 200) {
    return 200
  }
  return Math.max(50, Math.ceil(value / 50) * 50)
}

function smoothPath(points: { x: number; y: number }[]) {
  if (points.length === 0) {
    return ''
  }
  if (points.length === 1) {
    return `M ${points[0].x} ${points[0].y}`
  }

  let path = `M ${points[0].x} ${points[0].y}`
  for (let index = 0; index < points.length - 1; index += 1) {
    const previous = points[index - 1] ?? points[index]
    const current = points[index]
    const next = points[index + 1]
    const after = points[index + 2] ?? next
    const c1x = current.x + (next.x - previous.x) / 6
    const c1y = current.y + (next.y - previous.y) / 6
    const c2x = next.x - (after.x - current.x) / 6
    const c2y = next.y - (after.y - current.y) / 6
    path += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${next.x} ${next.y}`
  }
  return path
}

function labelIndices(length: number) {
  if (length <= 8) {
    return Array.from({ length }, (_, index) => index)
  }
  const steps = 6
  return Array.from({ length: steps + 1 }, (_, index) => Math.round((index * (length - 1)) / steps))
}

export function ReceivedByDayChart({ points, period, onPeriodChange }: ReceivedByDayChartProps) {
  const { t, locale } = useI18n()
  const peakIndex = useMemo(
    () => points.reduce((best, point, index) => (point.count > points[best].count ? index : best), 0),
    [points],
  )
  const [hover, setHover] = useState<number | null>(null)
  const activeIndex = hover !== null && hover < points.length ? hover : peakIndex

  const width = 640
  const height = 260
  const pad = { top: 16, right: 16, bottom: 28, left: 36 }
  const innerWidth = width - pad.left - pad.right
  const innerHeight = height - pad.top - pad.bottom
  const maxValue = niceMax(Math.max(...points.map((point) => point.count), 1))
  const ticks = [0, 1, 2, 3, 4].map((index) => (maxValue / 4) * index)

  const coords = useMemo(
    () =>
      points.map((point, index) => ({
        x: pad.left + (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth),
        y: pad.top + innerHeight - (point.count / maxValue) * innerHeight,
      })),
    [innerHeight, innerWidth, maxValue, pad.left, pad.top, points],
  )

  const line = smoothPath(coords)
  const area =
    coords.length === 0
      ? ''
      : `${line} L ${coords[coords.length - 1].x} ${pad.top + innerHeight} L ${coords[0].x} ${pad.top + innerHeight} Z`
  const labels = new Set(labelIndices(points.length))
  const active = points[activeIndex]
  const activeCoord = coords[activeIndex]
  const title = interpolate(t('statistics.receivedByDay'), { period: t(PERIOD_KEYS[period]) })

  const clientX = (event: MouseEvent<SVGSVGElement> | TouchEvent<SVGSVGElement>) => {
    if ('touches' in event) {
      return event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX
    }
    return event.clientX
  }

  const onMove = (event: MouseEvent<SVGSVGElement> | TouchEvent<SVGSVGElement>) => {
    const x = clientX(event)
    if (x == null) {
      return
    }
    const rect = event.currentTarget.getBoundingClientRect()
    const svgX = ((x - rect.left) / rect.width) * width
    let nearest = 0
    let best = Infinity
    coords.forEach((coord, index) => {
      const distance = Math.abs(coord.x - svgX)
      if (distance < best) {
        best = distance
        nearest = index
      }
    })
    setHover(nearest)
  }

  return (
    <DashboardCard
      title={title}
      className="h-full min-h-[260px] sm:min-h-[320px]"
      titleClassName="min-w-0 leading-snug"
      action={<PeriodSelect value={period} onChange={onPeriodChange} />}
    >
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-full min-h-[200px] w-full max-w-full touch-pan-y sm:min-h-[240px]"
          role="img"
          aria-labelledby="received-by-day-title"
          onMouseMove={onMove}
          onMouseLeave={() => setHover(null)}
          onTouchStart={onMove}
        >
          <title id="received-by-day-title">{title}</title>
          <defs>
            <linearGradient id="received-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={LINE} stopOpacity="0.28" />
              <stop offset="100%" stopColor={LINE} stopOpacity="0.02" />
            </linearGradient>
          </defs>

          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={pad.left}
                y1={pad.top + innerHeight - (tick / maxValue) * innerHeight}
                x2={width - pad.right}
                y2={pad.top + innerHeight - (tick / maxValue) * innerHeight}
                stroke={tick === 0 ? BASELINE : GRID}
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

          <path d={area} fill="url(#received-area)" />
          <path d={line} fill="none" stroke={LINE} strokeWidth="2.4" strokeLinejoin="round" strokeLinecap="round" />

          {coords.map((coord, index) => (
            <circle
              key={points[index].date}
              cx={coord.x}
              cy={coord.y}
              r={activeIndex === index ? 5 : 3.2}
              fill={activeIndex === index ? LINE : '#fff'}
              stroke={LINE}
              strokeWidth="1.8"
            />
          ))}

          {points.map((point, index) =>
            labels.has(index) ? (
              <text
                key={point.date}
                x={coords[index].x}
                y={height - 6}
                textAnchor="middle"
                fill={AXIS}
                fontSize="10"
                fontFamily="Source Sans 3, sans-serif"
              >
                {formatChartDate(point.date, locale)}
              </text>
            ) : null,
          )}

          {activeCoord ? (
            <line
              x1={activeCoord.x}
              y1={pad.top}
              x2={activeCoord.x}
              y2={pad.top + innerHeight}
              stroke={LINE}
              strokeWidth="1"
              strokeDasharray="3 3"
              opacity="0.45"
            />
          ) : null}
        </svg>

        {active && activeCoord ? (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-[calc(100%+10px)] rounded-xl bg-white px-3 py-2 shadow-[0_10px_24px_rgba(28,42,78,0.14)]"
            style={{
              left: `${Math.min(88, Math.max(12, (activeCoord.x / width) * 100))}%`,
              top: `${(activeCoord.y / height) * 100}%`,
            }}
          >
            <p className="text-[11px] font-medium text-[#6d7b93]">{formatFullDate(active.date, locale)}</p>
            <p className="mt-0.5 text-[13px] font-semibold text-[#1c2a4e]">
              {t('statistics.records')}: {formatCount(active.count, locale)}
            </p>
          </div>
        ) : null}
      </div>

      <table className="sr-only">
        <caption>{title}</caption>
        <thead>
          <tr>
            <th>{t('dashboard.columns.receivedOn')}</th>
            <th>{t('statistics.records')}</th>
          </tr>
        </thead>
        <tbody>
          {points.map((point) => (
            <tr key={point.date}>
              <td>{formatFullDate(point.date, locale)}</td>
              <td>{point.count}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </DashboardCard>
  )
}
