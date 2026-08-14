import { Link } from 'react-router-dom'
import type { ActivityPoint } from '@/models'
import { toIntlLocale, useI18n } from '@/i18n'
import { DashboardCard } from './DashboardCard'

const LINE = '#1d4f9a'
const GRID = '#e8eef6'
const BASELINE = '#d7e1ef'
const AXIS = '#8b95a8'

interface ActivityChartProps {
  points: ActivityPoint[]
}

function niceMax(value: number, step = 50) {
  return Math.max(step, Math.ceil(value / step) * step)
}

function LegendItem({
  label,
  dashed,
}: {
  label: string
  dashed?: boolean
}) {
  return (
    <span className="flex items-center gap-2 text-[12px] font-medium text-[#6d7b93]">
      <svg width="28" height="12" viewBox="0 0 28 12" aria-hidden className="shrink-0">
        <line
          x1="1"
          y1="6"
          x2="27"
          y2="6"
          stroke={LINE}
          strokeWidth="2"
          strokeDasharray={dashed ? '3.5 3' : undefined}
          strokeLinecap="round"
        />
        <circle
          cx="14"
          cy="6"
          r="3.2"
          fill={dashed ? '#fff' : LINE}
          stroke={LINE}
          strokeWidth="1.7"
        />
      </svg>
      {label}
    </span>
  )
}

export function ActivityChart({ points }: ActivityChartProps) {
  const { t, locale } = useI18n()
  const width = 420
  const height = 188
  const pad = { top: 8, right: 12, bottom: 24, left: 32 }
  const innerWidth = width - pad.left - pad.right
  const innerHeight = height - pad.top - pad.bottom
  const maxValue = niceMax(Math.max(...points.flatMap((point) => [point.received, point.processed]), 1))
  const ticks = [0, 1, 2, 3, 4].map((index) => (maxValue / 4) * index)

  const x = (index: number) =>
    pad.left + (points.length === 1 ? innerWidth / 2 : (index / (points.length - 1)) * innerWidth)
  const y = (value: number) => pad.top + innerHeight - (value / maxValue) * innerHeight

  const toPath = (key: 'received' | 'processed') =>
    points
      .map(
        (point, index) =>
          `${index === 0 ? 'M' : 'L'}${x(index).toFixed(1)},${y(point[key]).toFixed(1)}`,
      )
      .join(' ')

  const dateLabel = (value: string) => {
    const date = new Date(`${value}T00:00:00`)
    return new Intl.DateTimeFormat(toIntlLocale(locale), {
      day: '2-digit',
      month: '2-digit',
    }).format(date)
  }

  return (
    <DashboardCard
      title={t('dashboard.atnActivity')}
      titleClassName="font-display text-[18px] font-semibold"
      className="h-full min-h-0 overflow-hidden"
      action={
        <Link
          to="/statistiques"
          className="shrink-0 text-[13px] font-medium text-[#2860B9] hover:underline"
        >
          {t('dashboard.viewReport')}
        </Link>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="mb-2 flex items-center gap-4">
          <LegendItem label={t('dashboard.receivedShort')} />
          <LegendItem label={t('dashboard.processedShort')} dashed />
        </div>

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="min-h-0 w-full flex-1"
          role="img"
          aria-labelledby="atn-activity-title"
        >
          <title id="atn-activity-title">{t('dashboard.atnActivity')}</title>
          {ticks.map((tick) => (
            <g key={tick}>
              <line
                x1={pad.left}
                y1={y(tick)}
                x2={width - pad.right}
                y2={y(tick)}
                stroke={tick === 0 ? BASELINE : GRID}
                strokeWidth="1"
              />
              <text
                x={pad.left - 8}
                y={y(tick)}
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

          <path
            d={toPath('received')}
            fill="none"
            stroke={LINE}
            strokeWidth="2.2"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d={toPath('processed')}
            fill="none"
            stroke={LINE}
            strokeWidth="2.2"
            strokeDasharray="5 4"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {points.map((point, index) => (
            <g key={point.date}>
              <circle cx={x(index)} cy={y(point.received)} r="3.4" fill={LINE} />
              <circle
                cx={x(index)}
                cy={y(point.processed)}
                r="3.4"
                fill="#fff"
                stroke={LINE}
                strokeWidth="1.7"
              />
              <text
                x={x(index)}
                y={height - 4}
                textAnchor="middle"
                fill={AXIS}
                fontSize="10"
                fontFamily="Source Sans 3, sans-serif"
              >
                {dateLabel(point.date)}
              </text>
            </g>
          ))}
        </svg>

        <table className="sr-only">
          <caption>{t('dashboard.atnActivity')}</caption>
          <thead>
            <tr>
              <th>{t('dashboard.columns.receivedOn')}</th>
              <th>{t('dashboard.receivedShort')}</th>
              <th>{t('dashboard.processedShort')}</th>
            </tr>
          </thead>
          <tbody>
            {points.map((point) => (
              <tr key={point.date}>
                <td>{dateLabel(point.date)}</td>
                <td>{point.received}</td>
                <td>{point.processed}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="mt-1 text-[11px] font-medium text-[#8b95a8]">{t('dashboard.last7Days')}</p>
      </div>
    </DashboardCard>
  )
}
