import { Link } from 'react-router-dom'
import type { PriorityLevel, ValidationQueueItem } from '@/models'
import {
  formatLongDate,
  formatTime,
  interpolate,
  shortDossierRef,
  visitLabel,
} from '@/features/dashboard/format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { DashboardCard } from './DashboardCard'

type TimelineIconKind = 'document' | 'check' | 'person' | 'download' | 'warning'

const ICON_THEME: Record<TimelineIconKind, { wrap: string; color: string }> = {
  document: { wrap: 'bg-[#dceafb] ring-1 ring-[#1d4f9a]/15', color: '#1d4f9a' },
  check: { wrap: 'bg-[#d5f4e0] ring-1 ring-[#16a34a]/15', color: '#16a34a' },
  person: { wrap: 'bg-[#ffe0c2] ring-1 ring-[#ea7a1a]/15', color: '#ea7a1a' },
  download: { wrap: 'bg-[#d3eef8] ring-1 ring-[#0e7490]/15', color: '#0e7490' },
  warning: { wrap: 'bg-[#ead9fb] ring-1 ring-[#7c3aed]/15', color: '#7c3aed' },
}

const NORMAL_ICONS: TimelineIconKind[] = ['document', 'check', 'person', 'download']

function iconKindFor(priority: PriorityLevel, index: number): TimelineIconKind {
  if (priority === 'priority') {
    return 'warning'
  }
  return NORMAL_ICONS[index % NORMAL_ICONS.length]
}

function DocumentIcon({ color }: { color: string }) {
  return (
    <svg className="size-[18px]" viewBox="0 0 24 24" aria-hidden>
      <path
        d="M7 4.5h7.2L18.5 9v10.5A1.5 1.5 0 0 1 17 21H7a1.5 1.5 0 0 1-1.5-1.5v-14A1.5 1.5 0 0 1 7 4.5Z"
        fill={color}
        fillOpacity="0.22"
        stroke={color}
        strokeWidth="1.7"
      />
      <path d="M14.2 4.5V9h4.3" stroke={color} strokeWidth="1.7" fill="none" />
      <path d="M8.5 13h7M8.5 16.5h5" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function CheckIcon({ color }: { color: string }) {
  return (
    <svg className="size-[18px]" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="12" r="8" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="1.7" />
      <path
        d="m8.8 12.2 2.2 2.2 4.2-4.6"
        fill="none"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function PersonIcon({ color }: { color: string }) {
  return (
    <svg className="size-[18px]" viewBox="0 0 24 24" aria-hidden>
      <circle cx="12" cy="8.5" r="3" fill={color} fillOpacity="0.22" stroke={color} strokeWidth="1.7" />
      <path
        d="M6.5 18.5c.8-2.8 2.8-4.2 5.5-4.2s4.7 1.4 5.5 4.2"
        fill={color}
        fillOpacity="0.22"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function DownloadIcon({ color }: { color: string }) {
  return (
    <svg className="size-[18px]" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 4.5v9.2M8.5 10.8 12 14.3l3.5-3.5"
        stroke={color}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M6 19.5h12" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function WarningIcon({ color }: { color: string }) {
  return (
    <svg className="size-[18px]" viewBox="0 0 24 24" aria-hidden>
      <path
        d="m12 4.8 8.2 14.4H3.8L12 4.8Z"
        fill={color}
        fillOpacity="0.22"
        stroke={color}
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M12 10v4.2" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
      <circle cx="12" cy="16.8" r="0.85" fill={color} />
    </svg>
  )
}

function CalendarIcon() {
  return (
    <svg className="size-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4.5" y="6" width="15" height="13.5" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M8 4.5v3M16 4.5v3M4.5 10h15"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

const TIMELINE_ICONS: Record<TimelineIconKind, typeof DocumentIcon> = {
  document: DocumentIcon,
  check: CheckIcon,
  person: PersonIcon,
  download: DownloadIcon,
  warning: WarningIcon,
}

function TimelineDot() {
  return (
    <span className="relative z-[1] grid size-3.5 shrink-0 place-items-center rounded-full bg-white ring-1 ring-[#c5d3e4]">
      <span className="size-2 rounded-full bg-[#1d4f9a]" />
    </span>
  )
}

function TimelineLine({ className }: { className?: string }) {
  return (
    <span
      className={cn('w-[2px] shrink-0', className)}
      style={{
        backgroundImage:
          'repeating-linear-gradient(to bottom, #c5d3e4 0 4px, transparent 4px 8px)',
      }}
    />
  )
}

interface ValidationQueueProps {
  items: ValidationQueueItem[]
}

export function ValidationQueue({ items }: ValidationQueueProps) {
  const { t, locale } = useI18n()
  const todayLabel = `${t('dashboard.today')} - ${formatLongDate(new Date(), locale)}`

  return (
    <DashboardCard
      title={t('dashboard.validationQueue')}
      className="h-full min-h-0 min-w-0 overflow-hidden"
      action={
        <Link
          to="/a-valider"
          className="shrink-0 text-[13px] font-medium text-[#2860B9] transition-colors duration-200 hover:text-[#1f529e]"
        >
          {t('dashboard.goToValidation')}
        </Link>
      }
    >
      {items.length === 0 ? (
        <p className="flex-1 text-[13px] text-[#748196]">{t('dashboard.queueEmpty')}</p>
      ) : (
        <ol className="flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden">
          {items.map((item, index) => {
            const kind = iconKindFor(item.priority, index)
            const theme = ICON_THEME[kind]
            const Icon = TIMELINE_ICONS[kind]
            const isLast = index === items.length - 1
            const title = interpolate(t('dashboard.queueItemAwaiting'), {
              name: item.employeeName,
            })
            const subtitle = `${shortDossierRef(item.dossierId)} - ${visitLabel(item.visitType, t)}`

            return (
              <li
                key={item.id}
                className={cn(
                  'grid grid-cols-[16px_minmax(0,1fr)] gap-x-3.5',
                  isLast && 'min-h-0 flex-1',
                )}
              >
                <div className="flex h-full min-h-0 flex-col items-center">
                  {index === 0 ? (
                    <span className="h-2 w-[2px] shrink-0" />
                  ) : (
                    <TimelineLine className="h-2" />
                  )}
                  <TimelineDot />
                  <TimelineLine className="min-h-3 flex-1" />
                </div>

                <div className={cn('flex min-w-0 items-start gap-3', isLast ? 'pb-2' : 'pb-5')}>
                  <span
                    className={cn(
                      'grid size-9 shrink-0 place-items-center rounded-full',
                      theme.wrap,
                    )}
                  >
                    <Icon color={theme.color} />
                  </span>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <div className="flex items-baseline justify-between gap-3">
                      <p
                        className="min-w-0 truncate text-[13px] font-semibold leading-5 text-[#15243f]"
                        title={title}
                      >
                        {title}
                      </p>
                      <time
                        dateTime={item.receivedAt}
                        className="shrink-0 text-[12px] font-medium tabular-nums leading-5 text-[#8e99ab]"
                      >
                        {formatTime(item.receivedAt, locale)}
                      </time>
                    </div>
                    <p className="mt-0.5 truncate text-[12px] leading-4 text-[#748196]" title={subtitle}>
                      {subtitle}
                    </p>
                  </div>
                </div>
              </li>
            )
          })}
        </ol>
      )}

      <div className="flex min-w-0 shrink-0 items-center gap-2 border-t border-[#eef3f9] pt-3.5 pl-[30px] text-[#2860B9]">
        <CalendarIcon />
        <span className="truncate text-[12px] font-medium text-[#748196]">{todayLabel}</span>
      </div>
    </DashboardCard>
  )
}
