import { Link } from 'react-router-dom'
import { formatStamp, interpolate } from '@/features/dossiers/format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { ACTIVITY_TITLE, STEP_ICON_WRAP } from '../format'
import type { ActivityEvent, ProcessingStep } from '../types'
import { CalendarSearchIcon, FileLinesIcon, ShieldCheckIcon } from './ProcessingIcons'

function StepGlyph({ step }: { step: ProcessingStep }) {
  if (step === 'check') {
    return <ShieldCheckIcon className="size-4" />
  }
  if (step === 'schedule') {
    return <CalendarSearchIcon className="size-4" />
  }
  return <FileLinesIcon className="size-4" />
}

interface ProcessingActivityFeedProps {
  events: ActivityEvent[]
}

export function ProcessingActivityFeed({ events }: ProcessingActivityFeedProps) {
  const { t, locale } = useI18n()

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#e8eef6] bg-white p-4 shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <h2 className="shrink-0 text-[15px] font-bold text-[#1c2a4e]">{t('inProgress.feedTitle')}</h2>

      <ul className="mt-3 min-h-0 flex-1 space-y-1 overflow-y-auto">
        {events.map((event) => {
          const stamp = formatStamp(event.at, locale)
          return (
            <li key={event.id} className="flex items-start gap-2.5 rounded-xl px-1 py-2">
              <span
                className={cn(
                  'mt-0.5 grid size-8 shrink-0 place-items-center rounded-full',
                  STEP_ICON_WRAP[event.step],
                )}
              >
                <StepGlyph step={event.step} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-semibold leading-4 text-[#1c2a4e]">
                  {interpolate(t(ACTIVITY_TITLE[event.kind]), { reference: event.reference })}
                </span>
                <span className="mt-0.5 block truncate text-[12px] text-[#6d7b93]">
                  {event.employeeName} - {event.companyName}
                </span>
              </span>
              <span className="shrink-0 text-[12px] font-medium tabular-nums text-[#8b95a8]">{stamp.time}</span>
            </li>
          )
        })}
      </ul>

      <Link
        to="/dossiers"
        className="mt-2 shrink-0 text-[12px] font-semibold text-[#2860B9] transition-colors hover:text-[#1d4f9a]"
      >
        {t('inProgress.seeAllActivity')}
      </Link>
    </section>
  )
}
