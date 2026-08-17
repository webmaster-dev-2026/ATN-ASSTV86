import type { FileStatus, ProcessingSegment } from '@/models'
import { useI18n, type TranslationKey } from '@/i18n'
import { DashboardCard } from './DashboardCard'

const SEGMENT_KEYS: Record<FileStatus, TranslationKey> = {
  completed: 'dashboard.status.completed',
  processing: 'dashboard.status.processing',
  toValidate: 'dashboard.status.toValidate',
  anomaly: 'dashboard.status.anomaly',
}

interface ProcessingOverviewProps {
  total: number
  segments: ProcessingSegment[]
}

export function ProcessingOverview({ total, segments }: ProcessingOverviewProps) {
  const { t } = useI18n()
  const radius = 58
  const circumference = 2 * Math.PI * radius
  let offset = 0

  return (
    <DashboardCard title={t('dashboard.processingOverview')} className="h-full min-h-0 overflow-hidden p-3">
      <div className="flex min-h-0 min-w-0 flex-1 items-start gap-9 overflow-hidden">
        <div className="relative aspect-square h-full max-w-[95%] shrink-0">
          <svg viewBox="0 0 168 168" className="size-full -rotate-90">
            <circle
              cx="84"
              cy="84"
              r={radius}
              fill="none"
              stroke="#eef3f9"
              strokeWidth="18"
            />
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
                  strokeWidth="18"
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
              <p className="font-sans text-[22px] font-bold leading-none text-[#1c2a4e]">
                {total}
              </p>
              <p className="mt-1 text-[11px] font-semibold text-[#8b95a8]">
                {t('dashboard.total')}
              </p>
            </div>
          </div>
        </div>

        <ul className="min-w-0 flex-1 space-y-1.5">
          {segments.map((segment) => (
            <li
              key={segment.key}
              className="flex w-full min-w-0 items-center justify-between gap-6 text-[12px]"
            >
              <span className="flex min-w-0 items-center gap-1.5 font-medium text-[#5b6b82]">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ backgroundColor: segment.color }}
                />
                <span className="truncate">{t(SEGMENT_KEYS[segment.key])}</span>
              </span>
              <span className="shrink-0 text-right font-semibold tabular-nums text-[#1c2a4e]">
                {segment.count}{' '}
                <span className="font-medium text-[#8b95a8]">({segment.percent}%)</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </DashboardCard>
  )
}
