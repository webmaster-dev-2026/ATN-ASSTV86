import { Link } from 'react-router-dom'
import type { UpcomingAppointmentItem } from '@/models'
import { toIntlLocale, useI18n } from '@/i18n'
import { DashboardCard } from './DashboardCard'

function CalendarIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4.5"
        y="6"
        width="15"
        height="13.5"
        rx="2"
        stroke="#1c2a4e"
        strokeWidth="1.6"
      />
      <path d="M8 4.5v3M16 4.5v3M4.5 10h15" stroke="#1c2a4e" strokeWidth="1.6" strokeLinecap="round" />
      <path
        d="M8.2 13.2h1.4M12.3 13.2h1.4M16.4 13.2h.2M8.2 16.2h1.4M12.3 16.2h1.4"
        stroke="#1c2a4e"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

function DateBadge({
  day,
  month,
  showIcon,
}: {
  day: string
  month: string
  showIcon: boolean
}) {
  return (
    <div className="flex size-12 shrink-0 flex-col overflow-hidden rounded-[10px] border border-[#e4ecf6]">
      <div className="grid flex-[1.7] place-items-center bg-[#edf2ff]">
        {showIcon ? (
          <CalendarIcon />
        ) : (
          <span className="text-[16px] font-bold leading-none text-[#1c2a4e]">{day}</span>
        )}
      </div>
      <div className="grid flex-1 place-items-center bg-white">
        <span className="text-[9px] font-bold tracking-wide text-[#1c2a4e]">{month}</span>
      </div>
    </div>
  )
}

interface UpcomingAppointmentsProps {
  items: UpcomingAppointmentItem[]
}

export function UpcomingAppointments({ items }: UpcomingAppointmentsProps) {
  const { t, locale } = useI18n()
  const monthFormatter = new Intl.DateTimeFormat(toIntlLocale(locale), {
    month: 'short',
  })

  return (
    <DashboardCard
      title={t('dashboard.upcomingAppointments')}
      className="h-full min-h-0 min-w-0 max-h-[300px] overflow-hidden xl:max-h-none"
      action={
        <Link
          to="/dossiers"
          className="shrink-0 text-[13px] font-semibold text-[#1d4f9a] hover:underline"
        >
          {t('dashboard.viewAll')}
        </Link>
      }
    >
      <ul className="min-h-0 flex-1 overflow-y-auto pr-3">
        {items.map((item, index) => {
          const date = new Date(`${item.date}T${item.time}:00`)
          const day = String(date.getDate()).padStart(2, '0')
          const month = monthFormatter.format(date).replace('.', '').toUpperCase()

          return (
            <li
              key={item.id}
              className="flex min-w-0 items-center gap-3 border-b border-[#eef3f9] py-2.5 last:border-b-0"
            >
              <DateBadge day={day} month={month} showIcon={index === 0} />

              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[#1c2a4e]">
                  {t('dashboard.medicalVisit')} – {item.companyName}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-[#6d7b93]">
                  {t('dashboard.doctorPrefix')} {item.doctor}
                </p>
              </div>

              <div className="flex shrink-0 flex-col items-end gap-1">
                <span className="text-[13px] font-semibold text-[#1c2a4e]">{item.time}</span>
                <span className="rounded-full bg-[#d9e8fb] px-2.5 py-1 text-[11px] font-semibold text-[#1d4f9a]">
                  {t('dashboard.upcoming')}
                </span>
              </div>
            </li>
          )
        })}
      </ul>
    </DashboardCard>
  )
}
