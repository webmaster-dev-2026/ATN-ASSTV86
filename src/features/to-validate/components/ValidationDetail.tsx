import { useEffect, useState, type ReactNode } from 'react'
import { visitLabel } from '@/features/dashboard/format'
import {
  BuildingIcon,
  CalendarIcon,
  CheckIcon,
  CloseIcon,
  UserIcon,
} from '@/features/dossiers/components/DossierIcons'
import { formatDate, initials, interpolate } from '@/features/dossiers/format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import {
  EXTRA_KEYS,
  REASON_KEYS,
  VISIT_BADGE,
  avatarTone,
  optionLabel,
} from '../format'
import type { ValidationItem, ValidationOption } from '../types'
import { ChatIcon, FileTextIcon, InfoCircleIcon, PencilIcon, PlusIcon } from './ValidationIcons'

const NOTE_LIMIT = 500

type DetailTab = 'details' | 'history'

interface ValidationDetailProps {
  item: ValidationItem | null
  selectedOption: string | null
  note: string
  onSelectOption: (option: string) => void
  onNoteChange: (value: string) => void
  onAddOption: (option: ValidationOption) => void
  onConfirm: () => void
  onEdit: () => void
  onRequestMore: () => void
  onSkip: () => void
}

export function ValidationDetail({
  item,
  selectedOption,
  note,
  onSelectOption,
  onNoteChange,
  onAddOption,
  onConfirm,
  onEdit,
  onRequestMore,
  onSkip,
}: ValidationDetailProps) {
  const { t, locale } = useI18n()
  const [tab, setTab] = useState<DetailTab>('details')
  const [adding, setAdding] = useState(false)
  const [draftValue, setDraftValue] = useState('')

  useEffect(() => {
    setTab('details')
    setAdding(false)
    setDraftValue('')
  }, [item?.id])

  if (!item) {
    return (
      <section className="flex min-h-[min(70dvh,560px)] flex-1 items-center justify-center rounded-2xl bg-white px-6 text-center text-[14px] font-medium text-[#6d7b93] shadow-[0_1px_2px_rgba(28,42,78,0.04)] xl:min-h-0">
        {t('toValidate.emptySelection')}
      </section>
    )
  }

  const option = selectedOption ?? item.proposal
  const selectedChoice = item.alternatives.find((choice) => choice.id === option)
  const confidence =
    item.confidence === null
      ? null
      : interpolate(t('toValidate.confidence'), { percent: item.confidence })
  const isDateReason = item.reason === 'returnDate'

  const commitCustomOption = () => {
    const value = draftValue.trim()
    if (!value) {
      return
    }
    const id = `custom-${crypto.randomUUID()}`
    onAddOption({ id, value })
    onSelectOption(id)
    setDraftValue('')
    setAdding(false)
  }

  return (
    <section className="flex min-h-[min(70dvh,560px)] min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)] xl:h-full xl:min-h-0">
      <header className="flex shrink-0 items-start justify-between gap-3 px-4 pt-4 sm:px-5">
        <div className="flex min-w-0 items-center gap-3">
          <span
            className={cn(
              'grid size-11 shrink-0 place-items-center rounded-full text-[13px] font-bold',
              avatarTone(item.employeeName),
            )}
          >
            {initials(item.employeeName)}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-[17px] font-bold leading-tight text-[#1c2a4e]">
              {item.employeeName}
            </h2>
            <p className="mt-0.5 truncate text-[12px] font-semibold tabular-nums text-[#8b95a8]">
              #{item.reference}
            </p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold',
            VISIT_BADGE[item.visitType] ?? 'bg-[#eef3f9] text-[#5b6b82]',
          )}
        >
          {visitLabel(item.visitType, t)}
        </span>
      </header>

      <nav
        className="mt-3 flex shrink-0 gap-1 border-b border-[#eef3f9] px-4 sm:px-5"
        aria-label={t('toValidate.detailTitle')}
      >
        <TabButton selected={tab === 'details'} onClick={() => setTab('details')}>
          {t('toValidate.tabDetails')}
        </TabButton>
        <TabButton selected={tab === 'history'} onClick={() => setTab('history')}>
          {t('toValidate.tabHistory')}
        </TabButton>
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        {tab === 'history' ? (
          <p className="py-10 text-center text-[13px] font-medium text-[#8b95a8]">
            {t('toValidate.historyEmpty')}
          </p>
        ) : (
          <div className="flex flex-col gap-4">
            <section>
              <h3 className="text-[13px] font-bold text-[#1c2a4e]">{t('toValidate.summary')}</h3>
              <dl className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <SummaryItem
                  icon={<CalendarIcon className="size-4" />}
                  label={t('toValidate.examDate')}
                  value={formatDate(item.examDate, locale)}
                />
                <SummaryItem
                  icon={<UserIcon className="size-4" />}
                  label={t('toValidate.doctor')}
                  value={item.doctor}
                />
                <SummaryItem
                  icon={<FileTextIcon className="size-4" />}
                  label={t('toValidate.visitType')}
                  value={visitLabel(item.visitType, t)}
                />
                <SummaryItem
                  icon={<BuildingIcon className="size-4" />}
                  label={t('toValidate.company')}
                  value={item.companyName}
                />
              </dl>
            </section>

            <section className="rounded-xl bg-[#fff6ee] px-3.5 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#c96512]">{t('toValidate.proposal')}</p>
                  <p className="mt-1 text-[13px] font-bold text-[#1c2a4e]">{t(REASON_KEYS[item.reason])}</p>
                  <p className="mt-0.5 text-[13px] text-[#5b6b82]">
                    {selectedChoice ? optionLabel(selectedChoice, t, locale) : item.proposalValue}
                  </p>
                </div>
                {confidence ? (
                  <span className="shrink-0 rounded-full bg-[#e7f8ee] px-2 py-0.5 text-[11px] font-bold text-[#16a34a]">
                    {confidence}
                  </span>
                ) : null}
              </div>
            </section>

            <section className="rounded-xl bg-[#eef5fc] px-3.5 py-3">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-[#1d4f9a]">{t('toValidate.source')}</p>
                  <p className="mt-1 break-all text-[13px] font-semibold text-[#1c2a4e]">
                    {interpolate(t('toValidate.sourceFile'), {
                      file: item.sourceFile,
                      page: item.sourcePage,
                    })}
                  </p>
                  <p className="mt-1 text-[12px] text-[#5b6b82]">
                    {interpolate(t('toValidate.analyzedOn'), {
                      date: formatDate(item.analyzedAt, locale),
                    })}
                  </p>
                </div>
                {confidence ? (
                  <span className="shrink-0 rounded-full bg-[#d9e8fb] px-2 py-0.5 text-[11px] font-bold text-[#1d4f9a]">
                    {confidence}
                  </span>
                ) : null}
              </div>
            </section>

            <fieldset>
              <legend className="text-[13px] font-bold text-[#1c2a4e]">{t('toValidate.alternatives')}</legend>
              <div className="mt-2 space-y-1">
                {item.alternatives.map((choice) => {
                  const checked = choice.id === option
                  return (
                    <label
                      key={choice.id}
                      className="flex min-h-10 cursor-pointer items-center gap-2.5 rounded-xl px-1 py-1.5 text-[13px] font-medium text-[#1c2a4e] hover:bg-[#f7fafc]"
                    >
                      <input
                        type="radio"
                        name={`option-${item.id}`}
                        className="sr-only"
                        checked={checked}
                        onChange={() => onSelectOption(choice.id)}
                      />
                      <span
                        className={cn(
                          'grid size-4 shrink-0 place-items-center rounded-full border-2',
                          checked ? 'border-[#2860B9]' : 'border-[#c5d3e4]',
                        )}
                      >
                        {checked ? <span className="size-2 rounded-full bg-[#2860B9]" /> : null}
                      </span>
                      {optionLabel(choice, t, locale)}
                    </label>
                  )
                })}

                {adding ? (
                  <div className="flex items-center gap-2 px-1 pt-1">
                    <input
                      type={isDateReason ? 'date' : 'text'}
                      value={draftValue}
                      onChange={(event) => setDraftValue(event.target.value)}
                      placeholder={t('toValidate.addOptionPlaceholder')}
                      className="h-9 min-w-0 flex-1 rounded-lg border border-[#e4ecf6] bg-white px-3 text-[13px] text-[#1c2a4e] outline-none placeholder:text-[#8b95a8] focus:border-brand-500"
                      autoFocus
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault()
                          commitCustomOption()
                        }
                        if (event.key === 'Escape') {
                          setAdding(false)
                          setDraftValue('')
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={commitCustomOption}
                      className="inline-flex h-9 cursor-pointer items-center rounded-lg bg-[#2860B9] px-3 text-[12px] font-semibold text-white hover:bg-[#1d4f9a]"
                    >
                      {t('toValidate.addOptionConfirm')}
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => setAdding(true)}
                    className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl px-1 py-2 text-[13px] font-semibold text-[#2860B9] transition-colors hover:bg-[#eef5fc]"
                  >
                    <PlusIcon className="size-3.5" />
                    {t(isDateReason ? 'toValidate.addDate' : 'toValidate.addOption')}
                  </button>
                )}
              </div>
            </fieldset>

            <aside className="flex gap-2.5 rounded-xl border border-[#cfe0f5] bg-[#eef5fc] px-3.5 py-3">
              <InfoCircleIcon className="mt-0.5 size-4 shrink-0 text-[#1d4f9a]" />
              <div className="min-w-0">
                <p className="text-[12px] font-bold text-[#1d4f9a]">{t('toValidate.extraTitle')}</p>
                <p className="mt-1 text-[12px] leading-5 text-[#3d5a80]">{t(EXTRA_KEYS[item.reason])}</p>
              </div>
            </aside>

            <label className="block">
              <span className="text-[13px] font-bold text-[#1c2a4e]">{t('toValidate.notes')}</span>
              <span className="relative mt-2 block">
                <textarea
                  value={note}
                  maxLength={NOTE_LIMIT}
                  onChange={(event) => onNoteChange(event.target.value)}
                  placeholder={t('toValidate.notesPlaceholder')}
                  className="min-h-[88px] w-full resize-y rounded-xl border border-[#e4ecf6] bg-white px-3 py-2.5 pb-7 text-[13px] leading-5 text-[#1c2a4e] outline-none placeholder:text-[#8b95a8] focus:border-brand-500"
                />
                <span className="pointer-events-none absolute bottom-2.5 right-3 text-[11px] tabular-nums text-[#8b95a8]">
                  {note.length}/{NOTE_LIMIT}
                </span>
              </span>
            </label>
          </div>
        )}
      </div>

      {tab === 'details' ? (
        <div className="flex shrink-0 flex-wrap gap-2 border-t border-[#eef3f9] px-4 py-3 sm:px-5">
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex min-h-10 min-w-[7rem] flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg bg-[#16a34a] px-3 text-[13px] font-semibold text-white transition-colors hover:bg-[#15803d] active:scale-[0.98]"
          >
            <CheckIcon className="size-3.5 shrink-0" />
            {t('toValidate.confirm')}
          </button>
          <button
            type="button"
            onClick={onEdit}
            className="inline-flex min-h-10 min-w-[7rem] flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#2860B9] bg-white px-3 text-[13px] font-semibold text-[#2860B9] transition-colors hover:bg-[#eef5fc] active:scale-[0.98]"
          >
            <PencilIcon className="size-3.5 shrink-0" />
            {t('toValidate.edit')}
          </button>
          <button
            type="button"
            onClick={onRequestMore}
            className="inline-flex min-h-10 min-w-[7rem] flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#ea7a1a] bg-white px-3 text-[13px] font-semibold text-[#ea7a1a] transition-colors hover:bg-[#fff6ee] active:scale-[0.98]"
          >
            <ChatIcon className="size-3.5 shrink-0" />
            {t('toValidate.requestMore')}
          </button>
          <button
            type="button"
            onClick={onSkip}
            className="inline-flex min-h-10 min-w-[7rem] flex-1 cursor-pointer items-center justify-center gap-1.5 whitespace-nowrap rounded-lg border border-[#e54848] bg-white px-3 text-[13px] font-semibold text-[#e54848] transition-colors hover:bg-[#fef2f2] active:scale-[0.98]"
          >
            <CloseIcon className="size-3.5 shrink-0" />
            {t('toValidate.skip')}
          </button>
        </div>
      ) : null}
    </section>
  )
}

function TabButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        'flex shrink-0 cursor-pointer items-center border-b-2 px-3 py-2.5 text-[13px] font-semibold transition-colors duration-200',
        selected
          ? 'border-[#1d4f9a] text-[#1d4f9a]'
          : 'border-transparent text-[#5b6b82] hover:text-[#1c2a4e]',
      )}
    >
      {children}
    </button>
  )
}

function SummaryItem({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex min-w-0 items-start gap-2.5">
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-lg bg-[#eef5fc] text-[#1d4f9a]">
        {icon}
      </span>
      <div className="min-w-0">
        <dt className="text-[11px] font-semibold text-[#8b95a8]">{label}</dt>
        <dd className="mt-0.5 truncate text-[13px] font-semibold text-[#1c2a4e]">{value}</dd>
      </div>
    </div>
  )
}
