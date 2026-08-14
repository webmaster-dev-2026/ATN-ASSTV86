import type { ChangeEvent, ReactNode } from 'react'
import { useI18n } from '@/i18n'
import type { SourceDocFilterState, SourceDocStatus, SourceFileKind } from '../types'
import { FILE_KIND_LABEL, STATUS_LABEL } from '../format'
import { CalendarIcon, ChevronDownIcon, FunnelIcon, SearchIcon } from './SourceDocumentIcons'

const selectClass =
  'h-9 w-full min-w-[132px] cursor-pointer appearance-none rounded-lg border border-[#e4ecf6] bg-white py-0 pl-3 pr-8 text-[13px] font-medium text-[#1c2a4e] transition-colors duration-200 hover:border-[#c5d4ea] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 [&::-ms-expand]:hidden'

const inputClass =
  'h-9 rounded-lg border border-[#e4ecf6] bg-white px-3 text-[13px] text-[#1c2a4e] transition-[border-color,box-shadow] duration-200 placeholder:text-[#8b95a8] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30'

const FILE_KINDS: SourceFileKind[] = ['PDF', 'PPTX', 'DOCX', 'JPG', 'XLSX']
const STATUSES: SourceDocStatus[] = ['analysed', 'reviewing', 'error', 'uploaded']

interface SourceDocumentFiltersProps {
  value: SourceDocFilterState
  sources: string[]
  onChange: (value: SourceDocFilterState) => void
  onReset: () => void
}

export function SourceDocumentFilters({ value, sources, onChange, onReset }: SourceDocumentFiltersProps) {
  const { t } = useI18n()

  const patch = (partial: Partial<SourceDocFilterState>) => onChange({ ...value, ...partial })

  const onSelect =
    (key: 'source' | 'fileKind' | 'status') => (event: ChangeEvent<HTMLSelectElement>) => {
      patch({ [key]: event.target.value } as Partial<SourceDocFilterState>)
    }

  return (
    <div className="flex shrink-0 flex-col gap-3 rounded-2xl bg-white px-4 py-3 shadow-[0_1px_2px_rgba(28,42,78,0.04)] sm:px-5">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-end">
        <label className="min-w-0 flex-1">
          <span className="mb-1.5 block text-[12px] font-semibold text-[#6d7b93]">
            {t('sourceDocuments.searchLabel')}
          </span>
          <span className="relative block">
            <input
              type="search"
              value={value.query}
              onChange={(event) => patch({ query: event.target.value })}
              placeholder={t('sourceDocuments.searchPlaceholder')}
              className={`${inputClass} w-full bg-[#f7fafc] pr-9 focus:bg-white`}
            />
            <SearchIcon className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-[#8b95a8]" />
          </span>
        </label>

        <LabeledSelect label={t('sourceDocuments.filters.source')}>
          <select className={selectClass} value={value.source} aria-label={t('sourceDocuments.filters.source')} onChange={onSelect('source')}>
            <option value="all">{t('sourceDocuments.filters.all')}</option>
            {sources.map((source) => (
              <option key={source} value={source}>
                {source}
              </option>
            ))}
          </select>
        </LabeledSelect>

        <LabeledSelect label={t('sourceDocuments.filters.fileType')}>
          <select className={selectClass} value={value.fileKind} aria-label={t('sourceDocuments.filters.fileType')} onChange={onSelect('fileKind')}>
            <option value="all">{t('sourceDocuments.filters.all')}</option>
            {FILE_KINDS.map((kind) => (
              <option key={kind} value={kind}>
                {t(FILE_KIND_LABEL[kind])}
              </option>
            ))}
          </select>
        </LabeledSelect>

        <LabeledSelect label={t('sourceDocuments.filters.status')}>
          <select className={selectClass} value={value.status} aria-label={t('sourceDocuments.filters.status')} onChange={onSelect('status')}>
            <option value="all">{t('sourceDocuments.filters.all')}</option>
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {t(STATUS_LABEL[status])}
              </option>
            ))}
          </select>
        </LabeledSelect>

        <label className="min-w-[200px]">
          <span className="mb-1.5 block text-[12px] font-semibold text-[#6d7b93]">
            {t('sourceDocuments.filters.uploadedAt')}
          </span>
          <span className="relative block">
            <CalendarIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#8b95a8]" />
            <input
              type="date"
              value={value.from}
              onChange={(event) => patch({ from: event.target.value })}
              className={`${inputClass} w-full pl-8`}
              aria-label={t('sourceDocuments.filters.uploadedAt')}
            />
          </span>
        </label>

        <div className="flex flex-col justify-end">
          <span className="mb-1.5 hidden text-[12px] xl:block" aria-hidden>
            &nbsp;
          </span>
          <button
            type="button"
            className="inline-flex h-9 shrink-0 cursor-pointer items-center gap-1.5 rounded-lg border border-[#e4ecf6] bg-white px-3 text-[13px] font-semibold text-[#1c2a4e] transition-colors duration-200 hover:bg-[#f7fafc]"
            onClick={onReset}
          >
            <FunnelIcon className="size-3.5" />
            {t('sourceDocuments.filters.more')}
          </button>
        </div>
      </div>
    </div>
  )
}

function LabeledSelect({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="min-w-[148px]">
      <span className="mb-1.5 block text-[12px] font-semibold text-[#6d7b93]">{label}</span>
      <span className="relative block">
        {children}
        <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b95a8]" />
      </span>
    </label>
  )
}
