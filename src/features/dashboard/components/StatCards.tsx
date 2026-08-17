import type { ReactNode } from 'react'
import type { DashboardSummary, DashboardSummaryMetric } from '@/models'
import { cn } from '@/lib/cn'
import { useI18n, type TranslationKey } from '@/i18n'

function FileIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 4.5h7.2L18.5 9v10.5A1.5 1.5 0 0 1 17 21H7a1.5 1.5 0 0 1-1.5-1.5v-14A1.5 1.5 0 0 1 7 4.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path d="M14.2 4.5V9h4.3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="m8.8 12.2 2.2 2.2 4.2-4.6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClipboardIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="6" y="5.5" width="12" height="14" rx="2" stroke="currentColor" strokeWidth="1.7" />
      <path
        d="M9 5.5V5a3 3 0 0 1 6 0v.5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function WarningIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 5.4 20.2 19.4H3.8L12 5.4Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path
        d="M12 10.4v4M12 16.4v.2"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

const METRICS: {
  key: keyof DashboardSummary
  labelKey: TranslationKey
  icon: ReactNode
  iconClass: string
  invertTrend: boolean
}[] = [
  {
    key: 'received',
    labelKey: 'dashboard.received',
    icon: <FileIcon />,
    iconClass: 'bg-[#d9e8fb] text-[#1d4f9a]',
    invertTrend: false,
  },
  {
    key: 'processed',
    labelKey: 'dashboard.processed',
    icon: <CheckCircleIcon />,
    iconClass: 'bg-[#d9e8fb] text-[#1d4f9a]',
    invertTrend: false,
  },
  {
    key: 'toValidate',
    labelKey: 'dashboard.toValidate',
    icon: <ClipboardIcon />,
    iconClass: 'bg-[#ffe8d2] text-[#ea7a1a]',
    invertTrend: true,
  },
  {
    key: 'anomalies',
    labelKey: 'dashboard.anomalies',
    icon: <WarningIcon />,
    iconClass: 'bg-[#fde2e2] text-[#e54848]',
    invertTrend: true,
  },
]

function isTrendGood(metric: DashboardSummaryMetric, invertTrend: boolean) {
  if (invertTrend) {
    return metric.changePercent <= 0
  }
  return metric.changePercent >= 0
}

interface StatCardsProps {
  summary: DashboardSummary
}

export function StatCards({ summary }: StatCardsProps) {
  const { t } = useI18n()

  return (
    <section className="grid shrink-0 grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4" aria-label={t('dashboard.title')}>
      {METRICS.map((item) => {
        const metric = summary[item.key]
        const good = isTrendGood(metric, item.invertTrend)
        const sign = metric.changePercent > 0 ? '+' : ''

        return (
          <article
            key={item.key}
            className="flex items-start gap-3 rounded-2xl bg-white px-5 py-4 shadow-[0_1px_2px_rgba(28,42,78,0.04)]"
          >
            <div
              className={cn(
                'grid size-11 shrink-0 place-items-center rounded-full',
                item.iconClass,
              )}
            >
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-[#6d7b93]">
                {t(item.labelKey)}
              </p>
              <p className="mt-1 font-sans text-[28px] font-bold leading-none text-[#1c2a4e]">
                {metric.value}
              </p>
              <p
                className={cn(
                  'mt-1.5 text-[12px] font-semibold',
                  good ? 'text-[#16a34a]' : 'text-[#ea7a1a]',
                )}
              >
                {sign}
                {metric.changePercent}% {t('dashboard.vsLast7Days')}
              </p>
            </div>
          </article>
        )
      })}
    </section>
  )
}
