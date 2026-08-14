import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { formatDate, formatDateTime, interpolate } from '../format'
import type { AppointmentSlot, DossierCase } from '../types'
import {
  ArrowLeftIcon,
  BuildingIcon,
  CalendarIcon,
  CheckIcon,
  ClockIcon,
  UserIcon,
} from './DossierIcons'

export type AppointmentView = 'proposal' | 'doctors' | 'dates' | 'slots'

interface AppointmentProposalProps {
  dossier: DossierCase
  slot: AppointmentSlot | null
  accepted: boolean
  view: AppointmentView
  onViewChange: (view: AppointmentView) => void
  onAccept: () => void
  onSelectSlot: (slot: AppointmentSlot, kind: 'doctor' | 'slot') => void
}

function matchClass(percent: number) {
  if (percent >= 90) {
    return 'bg-[#e7f8ee] text-[#16a34a]'
  }
  if (percent >= 80) {
    return 'bg-[#d9e8fb] text-[#1d4f9a]'
  }
  return 'bg-[#fff1e4] text-[#ea7a1a]'
}

function SlotCard({ slot }: { slot: AppointmentSlot }) {
  const { t, locale } = useI18n()

  return (
    <div className="space-y-1.5 rounded-xl bg-white px-2.5 py-2.5">
      <div className="flex items-start justify-between gap-1.5">
        <p className="min-w-0 text-[12px] font-semibold leading-4 text-[#1c2a4e]">
          {formatDateTime(slot.at, locale)}
        </p>
        <span
          className={cn(
            'shrink-0 rounded-full px-1.5 py-0.5 text-[10px] font-bold',
            matchClass(slot.matchPercent),
          )}
        >
          {interpolate(t('dossiers.appointment.match'), { percent: slot.matchPercent })}
        </span>
      </div>
      <p className="flex items-start gap-1.5 text-[11px] leading-4 text-[#5b6b82]">
        <UserIcon className="mt-0.5 size-3.5 shrink-0 text-[#1d4f9a]" />
        <span className="min-w-0 break-words">{slot.doctor}</span>
      </p>
      <p className="flex items-start gap-1.5 text-[11px] leading-4 text-[#5b6b82]">
        <BuildingIcon className="mt-0.5 size-3.5 shrink-0 text-[#1d4f9a]" />
        <span className="min-w-0 break-words">{slot.center}</span>
      </p>
    </div>
  )
}

export function AppointmentProposal({
  dossier,
  slot,
  accepted,
  view,
  onViewChange,
  onAccept,
  onSelectSlot,
}: AppointmentProposalProps) {
  const { t, locale } = useI18n()
  const uniqueDoctors = [
    ...new Set(
      [slot?.doctor, ...dossier.alternativeSlots.map((item) => item.doctor)].filter(
        (name): name is string => Boolean(name),
      ),
    ),
  ]
  const dateSlots = [slot, ...dossier.alternativeSlots].filter((item): item is AppointmentSlot => {
    if (!item || !slot) {
      return false
    }
    return item.doctor === slot.doctor
  })
  const allSlots = slot ? [slot, ...dossier.alternativeSlots.filter((item) => item.id !== slot.id)] : dossier.alternativeSlots

  const title =
    view === 'doctors'
      ? t('dossiers.appointment.selectDoctor')
      : view === 'dates'
        ? t('dossiers.appointment.selectDate')
        : view === 'slots'
          ? t('dossiers.appointment.selectSlot')
          : t('dossiers.appointment.title')

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border border-[#d4e4f6] bg-[#eef5fc] p-3">
      <div className="flex items-center gap-2">
        {view !== 'proposal' ? (
          <button
            type="button"
            onClick={() => onViewChange('proposal')}
            className="grid size-7 shrink-0 cursor-pointer place-items-center rounded-lg text-[#6d7b93] transition-colors hover:bg-[#eef3f9] hover:text-[#1c2a4e]"
            aria-label={t('dossiers.appointment.back')}
          >
            <ArrowLeftIcon className="size-4" />
          </button>
        ) : null}
        <h3 className="min-w-0 text-[13px] font-bold leading-4 text-[#1c2a4e]">{title}</h3>
      </div>

      {!slot ? (
        <p className="mt-2 text-[12px] leading-4 text-[#6d7b93]">
          {t(dossier.status === 'blocked' ? 'dossiers.appointment.blocked' : 'dossiers.appointment.unavailable')}
        </p>
      ) : view === 'proposal' ? (
        <div className="mt-2 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto">
          <SlotCard slot={slot} />

          {accepted ? (
            <p className="flex items-center gap-2 rounded-xl bg-[#e7f8ee] px-2.5 py-2 text-[12px] font-semibold text-[#15803d]">
              <CheckIcon className="size-4 shrink-0" />
              {t('dossiers.appointment.accepted')}
            </p>
          ) : (
            <div className="mt-auto grid gap-1.5">
              <button
                type="button"
                onClick={onAccept}
                className="inline-flex min-h-9 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#16a34a] px-2.5 py-1.5 text-[12px] font-semibold leading-4 text-white transition-colors hover:bg-[#15803d] active:scale-[0.98]"
              >
                <CheckIcon className="size-3.5 shrink-0" />
                {t('dossiers.appointment.accept')}
              </button>
              <button
                type="button"
                onClick={() => onViewChange('doctors')}
                className="inline-flex min-h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#d7e1ef] px-2.5 py-1.5 text-[12px] font-semibold leading-4 text-[#1d4f9a] transition-colors hover:bg-[#f4f8fd] active:scale-[0.98]"
              >
                <UserIcon className="size-3.5 shrink-0" />
                {t('dossiers.appointment.changeDoctor')}
              </button>
              <button
                type="button"
                onClick={() => onViewChange('dates')}
                className="inline-flex min-h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#d7e1ef] px-2.5 py-1.5 text-[12px] font-semibold leading-4 text-[#1d4f9a] transition-colors hover:bg-[#f4f8fd] active:scale-[0.98]"
              >
                <CalendarIcon className="size-3.5 shrink-0" />
                {t('dossiers.appointment.changeDate')}
              </button>
              <button
                type="button"
                onClick={() => onViewChange('slots')}
                className="inline-flex min-h-8 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#d7e1ef] px-2.5 py-1.5 text-[12px] font-semibold leading-4 text-[#1d4f9a] transition-colors hover:bg-[#f4f8fd] active:scale-[0.98]"
              >
                <ClockIcon className="size-3.5 shrink-0" />
                {t('dossiers.appointment.otherSlots')}
              </button>
            </div>
          )}
        </div>
      ) : (
        <ul className="mt-2 min-h-0 flex-1 space-y-2 overflow-y-auto">
          {view === 'doctors'
            ? uniqueDoctors.map((doctor) => {
                const option =
                  [slot, ...dossier.alternativeSlots].find((item) => item?.doctor === doctor) ?? slot
                if (!option) {
                  return null
                }
                return (
                  <li key={doctor}>
                    <button
                      type="button"
                      onClick={() => onSelectSlot(option, 'doctor')}
                      className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl bg-white px-3 py-2.5 text-left text-[#1d4f9a] transition-colors hover:bg-white"
                    >
                      <span>
                        <span className="block text-[13px] font-semibold text-[#1d4f9a]">{doctor}</span>
                        <span className="mt-0.5 block text-[12px] text-[#1d4f9a]">{option.center}</span>
                      </span>
                      <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', matchClass(option.matchPercent))}>
                        {option.matchPercent}%
                      </span>
                    </button>
                  </li>
                )
              })
            : (view === 'dates' ? dateSlots : allSlots).map((option) => (
                <li key={option.id}>
                    <button
                      type="button"
                      onClick={() => onSelectSlot(option, 'slot')}
                      className="flex w-full cursor-pointer items-center justify-between gap-2 rounded-xl bg-white px-3 py-2.5 text-left text-[#1d4f9a] transition-colors hover:bg-white"
                    >
                      <span>
                        <span className="block text-[13px] font-semibold text-[#1d4f9a]">
                          {view === 'dates' ? formatDate(option.at, locale) : formatDateTime(option.at, locale)}
                        </span>
                        <span className="mt-0.5 block text-[12px] text-[#1d4f9a]">
                          {option.doctor}
                        </span>
                      </span>
                    <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-bold', matchClass(option.matchPercent))}>
                      {option.matchPercent}%
                    </span>
                  </button>
                </li>
              ))}
        </ul>
      )}
    </section>
  )
}
