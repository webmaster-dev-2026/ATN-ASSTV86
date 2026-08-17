import { useEffect, useState } from 'react'
import { HeaderFilter, HeaderMenu } from '@/components/ui'
import { formatDate, initials, interpolate } from '@/features/dossiers/format'
import { avatarTone } from '@/features/to-validate/format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import {
  SEVERITY_BADGE,
  SEVERITY_ICON,
  SEVERITY_LABEL,
  STATUS_BADGE,
  STATUS_LABEL,
  TYPE_LABEL,
  pageNumbers,
} from '../format'
import type { AnomalyFilterState, AnomalyItem, AnomalyStatus, AnomalyType } from '../types'
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, SearchIcon, WarningTriangleIcon } from './AnomalyIcons'

const PAGE_SIZES = [10, 25, 50] as const

const selectClass =
  'h-9 cursor-pointer appearance-none rounded-lg border border-[#e4ecf6] bg-white py-0 pl-3 pr-8 text-[13px] font-medium text-[#1c2a4e] transition-colors duration-200 hover:border-[#c5d4ea] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 [&::-ms-expand]:hidden'

interface AssigneeOption {
  id: string
  name: string
}

interface AnomalyListProps {
  items: AnomalyItem[]
  selectedId: string | null
  onSelect: (id: string) => void
  filters: AnomalyFilterState
  assignees: AssigneeOption[]
  onFiltersChange: (value: AnomalyFilterState) => void
}

const STATUS_OPTIONS: AnomalyStatus[] = ['open', 'inProgress', 'resolved', 'blocked']
const TYPE_OPTIONS: AnomalyType[] = ['inconsistent', 'lowConfidence', 'missingDocument', 'missingInformation']

export function AnomalyList({
  items,
  selectedId,
  onSelect,
  filters,
  assignees,
  onFiltersChange,
}: AnomalyListProps) {
  const { t, locale } = useI18n()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10)

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize
  const visible = items.slice(start, start + pageSize)

  useEffect(() => {
    setPage(1)
  }, [items, pageSize])

  const patch = (partial: Partial<AnomalyFilterState>) => onFiltersChange({ ...filters, ...partial })

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <div className="flex shrink-0 flex-col gap-3 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-[16px] font-bold text-[#1c2a4e]">{t('anomalies.listTitle')}</h2>
          <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#fde2e2] px-2 py-0.5 text-[12px] font-bold text-[#c93434]">
            {items.length}
          </span>
        </div>
        <label className="relative min-w-0">
          <span className="sr-only">{t('anomalies.searchPlaceholder')}</span>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b95a8]" />
          <input
            type="search"
            value={filters.query}
            onChange={(event) => patch({ query: event.target.value })}
            placeholder={t('anomalies.searchPlaceholder')}
            className="h-9 w-full rounded-lg border border-[#e4ecf6] bg-[#f7fafc] py-0 pl-9 pr-3 text-[13px] text-[#1c2a4e] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#8b95a8] focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </label>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead className="sticky top-0 bg-white">
            <tr className="border-y border-[#eef3f9] text-[12px] font-semibold text-[#8b95a8]">
              <th className="px-4 py-2.5 font-semibold">
                <HeaderFilter
                  label={t('anomalies.columns.anomaly')}
                  value={filters.type}
                  onChange={(type) => patch({ type })}
                  options={[
                    { value: 'all', label: t('anomalies.filters.type') },
                    ...TYPE_OPTIONS.map((type) => ({ value: type, label: t(TYPE_LABEL[type]) })),
                  ]}
                />
              </th>
              <th className="px-3 py-2.5 font-semibold">{t('anomalies.columns.dossier')}</th>
              <th className="hidden px-3 py-2.5 font-semibold lg:table-cell">
                <HeaderFilter
                  label={t('anomalies.columns.assignee')}
                  value={filters.assigneeId}
                  onChange={(assigneeId) => patch({ assigneeId })}
                  options={[
                    { value: 'all', label: t('anomalies.filters.assignee') },
                    ...assignees.map((person) => ({ value: person.id, label: person.name })),
                  ]}
                />
              </th>
              <th className="px-3 py-2.5 font-semibold">
                <HeaderFilter
                  label={t('anomalies.columns.status')}
                  value={filters.status}
                  onChange={(status) => patch({ status })}
                  options={[
                    { value: 'all', label: t('anomalies.filters.status') },
                    ...STATUS_OPTIONS.map((status) => ({ value: status, label: t(STATUS_LABEL[status]) })),
                  ]}
                />
              </th>
              <th className="hidden px-4 py-2.5 font-semibold lg:table-cell">
                <HeaderMenu label={t('anomalies.columns.detected')} align="right">
                  {() => (
                    <div className="flex flex-col gap-2 px-3 py-2">
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-semibold text-[#8b95a8]">
                          {t('anomalies.filters.from')}
                        </span>
                        <input
                          type="date"
                          value={filters.from}
                          onChange={(event) => patch({ from: event.target.value })}
                          className="h-8 w-full rounded-lg border border-[#e4ecf6] px-2 text-[12px] text-[#1c2a4e] focus:border-brand-500 focus:outline-none"
                        />
                      </label>
                      <label className="block">
                        <span className="mb-1 block text-[11px] font-semibold text-[#8b95a8]">
                          {t('anomalies.filters.to')}
                        </span>
                        <input
                          type="date"
                          value={filters.to}
                          onChange={(event) => patch({ to: event.target.value })}
                          className="h-8 w-full rounded-lg border border-[#e4ecf6] px-2 text-[12px] text-[#1c2a4e] focus:border-brand-500 focus:outline-none"
                        />
                      </label>
                    </div>
                  )}
                </HeaderMenu>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-[13px] font-medium text-[#8b95a8]">
                  {t('anomalies.emptyFilter')}
                </td>
              </tr>
            ) : (
              visible.map((item) => {
                const selected = item.id === selectedId
                return (
                  <tr
                    key={item.id}
                    aria-selected={selected}
                    tabIndex={0}
                    onClick={() => onSelect(item.id)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        onSelect(item.id)
                      }
                    }}
                    className={cn(
                      'cursor-pointer border-b border-[#f3f6fb] transition-colors duration-200',
                      selected
                        ? 'bg-[#F0F7FF]'
                        : 'hover:bg-[#f7fafc]',
                    )}
                  >
                    <td className="min-w-0 px-4 py-3">
                      <span className="flex min-w-0 items-start gap-2.5">
                        <span className={cn('mt-0.5 grid size-6 shrink-0 place-items-center rounded-full', SEVERITY_ICON[item.severity])}>
                          <WarningTriangleIcon className="size-3.5" />
                        </span>
                        <span className="min-w-0">
                          <span className={cn('inline-flex max-w-full truncate rounded-full px-2 py-0.5 text-[11px] font-semibold', SEVERITY_BADGE[item.severity])}>
                            {t(SEVERITY_LABEL[item.severity])}
                          </span>
                          <span className="mt-0.5 block truncate text-[13px] font-semibold text-[#1c2a4e]" title={item.title}>
                            {item.title}
                          </span>
                          <span className="mt-0.5 block truncate text-[12px] text-[#8b95a8] lg:hidden">
                            {item.assigneeName}
                            <span className="px-1 text-[#c3ccd8]">·</span>
                            {formatDate(item.detectedAt, locale)}
                          </span>
                        </span>
                      </span>
                    </td>
                    <td className="min-w-0 px-3 py-3">
                      <span className="block truncate text-[13px] font-bold text-[#2860B9]" title={item.reference}>
                        {item.reference}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-[#6d7b93]" title={item.employeeName}>
                        {item.employeeName}
                      </span>
                    </td>
                    <td className="hidden min-w-0 px-3 py-3 lg:table-cell">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className={cn('grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-bold', avatarTone(item.assigneeName))}>
                          {initials(item.assigneeName)}
                        </span>
                        <span className="truncate text-[13px] text-[#1c2a4e]" title={item.assigneeName}>
                          {item.assigneeName}
                        </span>
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn('inline-flex max-w-full truncate rounded-full px-2 py-0.5 text-[11px] font-semibold', STATUS_BADGE[item.status])}>
                        {t(STATUS_LABEL[item.status])}
                      </span>
                    </td>
                    <td className="hidden px-4 py-3 lg:table-cell">
                      <span className="block truncate text-[13px] tabular-nums text-[#1c2a4e]">
                        {formatDate(item.detectedAt, locale)}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex shrink-0 flex-col gap-2 border-t border-[#eef3f9] px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <p className="min-w-0 truncate text-[12px] font-medium text-[#8b95a8]">
          {interpolate(t('anomalies.range'), {
            from: items.length === 0 ? 0 : start + 1,
            to: start + visible.length,
            total: items.length,
          })}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex flex-wrap items-center gap-1" aria-label={t('anomalies.listTitle')}>
            <button
              type="button"
              className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] transition-colors hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={t('anomalies.prevPage')}
              disabled={currentPage <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeftIcon />
            </button>
            {pageNumbers(currentPage, pageCount).map((item, index) =>
              item === 'ellipsis' ? (
                <span key={`ellipsis-${index}`} className="grid size-8 place-items-center text-[13px] font-semibold text-[#8b95a8]">
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  aria-current={item === currentPage ? 'page' : undefined}
                  className={cn(
                    'grid size-8 cursor-pointer place-items-center rounded-lg text-[13px] font-semibold transition-colors',
                    item === currentPage ? 'bg-[#2860B9] text-white' : 'text-[#5b6b82] hover:bg-[#eef5fc]',
                  )}
                  onClick={() => setPage(item)}
                >
                  {item}
                </button>
              ),
            )}
            <button
              type="button"
              className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] transition-colors hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={t('anomalies.nextPage')}
              disabled={currentPage >= pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            >
              <ChevronRightIcon />
            </button>
          </nav>
          <div className="relative w-fit">
            <select
              className={selectClass}
              value={pageSize}
              aria-label={t('anomalies.perPageLabel')}
              onChange={(event) => setPageSize(Number(event.target.value) as (typeof PAGE_SIZES)[number])}
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {interpolate(t('anomalies.perPage'), { count: size })}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b95a8]" />
          </div>
        </div>
      </div>
    </section>
  )
}
