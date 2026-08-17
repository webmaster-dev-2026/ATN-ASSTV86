import type { ChangeEvent, ReactNode } from 'react'
import { useI18n } from '@/i18n'
import type { AnomalyFilterState } from '../types'
import { SEVERITY_LABEL, STATUS_LABEL, TYPE_LABEL } from '../format'
import { CalendarIcon, ChevronDownIcon, ResetIcon, SearchIcon } from './AnomalyIcons'

const selectClass =
  'h-9 w-full min-w-0 cursor-pointer appearance-none rounded-lg border border-[#e4ecf6] bg-white py-0 pl-3 pr-8 text-[13px] font-medium text-[#1c2a4e] transition-colors duration-200 hover:border-[#c5d4ea] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 lg:w-auto lg:min-w-[132px] [&::-ms-expand]:hidden'

const inputClass =
  'h-9 rounded-lg border border-[#e4ecf6] bg-white px-3 text-[13px] text-[#1c2a4e] transition-[border-color,box-shadow] duration-200 placeholder:text-[#8b95a8] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30'

interface AssigneeOption {
  id: string
  name: string
}

interface AnomalyFiltersProps {
  value: AnomalyFilterState
  assignees: AssigneeOption[]
  onChange: (value: AnomalyFilterState) => void
  onReset: () => void
}

export function AnomalyFilters({ value, assignees, onChange, onReset }: AnomalyFiltersProps) {
  const { t } = useI18n()

  const patch = (partial: Partial<AnomalyFilterState>) => onChange({ ...value, ...partial })

  const onSelect =
    (key: 'severity' | 'status' | 'type' | 'assigneeId') => (event: ChangeEvent<HTMLSelectElement>) => {
      patch({ [key]: event.target.value } as Partial<AnomalyFilterState>)
    }

  return (
    <div className="flex shrink-0 flex-col gap-3 rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center">
        <label className="relative min-w-0 flex-1">
          <span className="sr-only">{t('anomalies.searchPlaceholder')}</span>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b95a8]" />
          <input
            type="search"
            value={value.query}
            onChange={(event) => patch({ query: event.target.value })}
            placeholder={t('anomalies.searchPlaceholder')}
            className={`${inputClass} w-full bg-[#f7fafc] pl-9 focus:bg-white`}
          />
        </label>

        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:flex lg:flex-wrap lg:items-center">
          <SelectWrap>
            <select className={selectClass} value={value.severity} aria-label={t('anomalies.filters.severity')} onChange={onSelect('severity')}>
              <option value="all">{t('anomalies.filters.severity')}</option>
              <option value="critical">{t(SEVERITY_LABEL.critical)}</option>
              <option value="warning">{t(SEVERITY_LABEL.warning)}</option>
              <option value="info">{t(SEVERITY_LABEL.info)}</option>
            </select>
          </SelectWrap>
          <SelectWrap>
            <select className={selectClass} value={value.status} aria-label={t('anomalies.filters.status')} onChange={onSelect('status')}>
              <option value="all">{t('anomalies.filters.status')}</option>
              <option value="open">{t(STATUS_LABEL.open)}</option>
              <option value="inProgress">{t(STATUS_LABEL.inProgress)}</option>
              <option value="resolved">{t(STATUS_LABEL.resolved)}</option>
              <option value="blocked">{t(STATUS_LABEL.blocked)}</option>
            </select>
          </SelectWrap>
          <SelectWrap>
            <select className={selectClass} value={value.type} aria-label={t('anomalies.filters.type')} onChange={onSelect('type')}>
              <option value="all">{t('anomalies.filters.type')}</option>
              <option value="inconsistent">{t(TYPE_LABEL.inconsistent)}</option>
              <option value="lowConfidence">{t(TYPE_LABEL.lowConfidence)}</option>
              <option value="missingDocument">{t(TYPE_LABEL.missingDocument)}</option>
              <option value="missingInformation">{t(TYPE_LABEL.missingInformation)}</option>
            </select>
          </SelectWrap>
          <SelectWrap>
            <select className={selectClass} value={value.assigneeId} aria-label={t('anomalies.filters.assignee')} onChange={onSelect('assigneeId')}>
              <option value="all">{t('anomalies.filters.assignee')}</option>
              {assignees.map((person) => (
                <option key={person.id} value={person.id}>
                  {person.name}
                </option>
              ))}
            </select>
          </SelectWrap>

          <label className="relative">
            <span className="sr-only">{t('anomalies.filters.from')}</span>
            <CalendarIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#8b95a8]" />
            <input
              type="date"
              value={value.from}
              onChange={(event) => patch({ from: event.target.value })}
              className={`${inputClass} w-full pl-8 lg:w-[138px]`}
            />
          </label>
          <label className="relative">
            <span className="sr-only">{t('anomalies.filters.to')}</span>
            <input
              type="date"
              value={value.to}
              onChange={(event) => patch({ to: event.target.value })}
              className={`${inputClass} w-full lg:w-[138px]`}
            />
          </label>

          <button
            type="button"
            className="inline-flex h-9 w-full cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#e4ecf6] bg-white px-3 text-[13px] font-semibold text-[#1c2a4e] transition-colors duration-200 hover:bg-[#f7fafc] sm:col-span-2 lg:w-auto"
            onClick={onReset}
          >
            <ResetIcon className="size-3.5" />
            {t('anomalies.reset')}
          </button>
        </div>
      </div>
    </div>
  )
}

function SelectWrap({ children }: { children: ReactNode }) {
  return (
    <div className="relative w-full lg:w-auto">
      {children}
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b95a8]" />
    </div>
  )
}
