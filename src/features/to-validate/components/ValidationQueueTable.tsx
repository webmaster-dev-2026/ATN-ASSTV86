import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { visitLabel } from '@/features/dashboard/format'
import { ChevronDownIcon, SearchIcon } from '@/features/dossiers/components/DossierIcons'
import { formatDate, initials, interpolate } from '@/features/dossiers/format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import {
  PRIORITY_KEYS,
  PRIORITY_PILL,
  REASON_KEYS,
  avatarTone,
  pageNumbers,
  remainingDays,
} from '../format'
import type { PriorityKind, ReasonKind, ValidationItem } from '../types'
import { ChevronLeftIcon, ChevronRightIcon } from './ValidationIcons'

const PAGE_SIZES = [10, 20, 50] as const
const PRIORITIES: PriorityKind[] = ['high', 'medium', 'low']
const REASONS: ReasonKind[] = [
  'returnDate',
  'visitType',
  'workplace',
  'employeeName',
  'jobTitle',
  'companyName',
]
const VISIT_TYPES = ['VISITE_PERIODIQUE', 'VISITE_EMBAUCHE', 'VISITE_REPRISE', 'VISITE_SPECIALE'] as const

const selectClass =
  'h-9 min-w-[120px] cursor-pointer appearance-none rounded-lg border border-[#e4ecf6] bg-white py-0 pl-3 pr-8 text-[13px] font-medium text-[#1c2a4e] transition-colors duration-200 hover:border-[#c5d4ea] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 [&::-ms-expand]:hidden'

interface ValidationQueueTableProps {
  items: ValidationItem[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ValidationQueueTable({ items, selectedId, onSelect }: ValidationQueueTableProps) {
  const { t, locale } = useI18n()
  const [query, setQuery] = useState('')
  const [priority, setPriority] = useState<PriorityKind | 'all'>('all')
  const [reason, setReason] = useState<ReasonKind | 'all'>('all')
  const [visitType, setVisitType] = useState<string>('all')
  const [company, setCompany] = useState('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10)

  const companies = useMemo(
    () => [...new Set(items.map((item) => item.companyName))].sort((a, b) => a.localeCompare(b)),
    [items],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesQuery =
        !needle ||
        item.employeeName.toLowerCase().includes(needle) ||
        item.companyName.toLowerCase().includes(needle) ||
        item.reference.toLowerCase().includes(needle) ||
        item.id.toLowerCase().includes(needle)
      const matchesPriority = priority === 'all' || item.priority === priority
      const matchesReason = reason === 'all' || item.reason === reason
      const matchesVisit = visitType === 'all' || item.visitType === visitType
      const matchesCompany = company === 'all' || item.companyName === company
      return matchesQuery && matchesPriority && matchesReason && matchesVisit && matchesCompany
    })
  }, [company, items, priority, query, reason, visitType])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize
  const visible = filtered.slice(start, start + pageSize)

  useEffect(() => {
    setPage(1)
  }, [query, priority, reason, visitType, company, pageSize, items.length])

  const resetFilters = () => {
    setQuery('')
    setPriority('all')
    setReason('all')
    setVisitType('all')
    setCompany('all')
  }

  const hasFilters =
    query.trim() !== '' ||
    priority !== 'all' ||
    reason !== 'all' ||
    visitType !== 'all' ||
    company !== 'all'

  return (
    <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <div className="flex shrink-0 flex-col gap-3 border-b border-[#eef3f9] px-4 py-3 sm:px-5">
        <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">{t('toValidate.searchPlaceholder')}</span>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8b95a8]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('toValidate.searchPlaceholder')}
              className="h-9 w-full rounded-lg border border-[#e4ecf6] bg-[#f7fafc] py-0 pl-9 pr-3 text-[13px] text-[#1c2a4e] placeholder:text-[#8b95a8] focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              label={t('toValidate.filters.priority')}
              value={priority}
              onChange={(value) => setPriority(value as PriorityKind | 'all')}
            >
              <option value="all">{t('toValidate.filters.priority')}</option>
              {PRIORITIES.map((value) => (
                <option key={value} value={value}>
                  {t(PRIORITY_KEYS[value])}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label={t('toValidate.filters.reason')}
              value={reason}
              onChange={(value) => setReason(value as ReasonKind | 'all')}
            >
              <option value="all">{t('toValidate.filters.reason')}</option>
              {REASONS.map((value) => (
                <option key={value} value={value}>
                  {t(REASON_KEYS[value])}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label={t('toValidate.filters.visitType')}
              value={visitType}
              onChange={setVisitType}
            >
              <option value="all">{t('toValidate.filters.visitType')}</option>
              {VISIT_TYPES.map((value) => (
                <option key={value} value={value}>
                  {visitLabel(value, t)}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label={t('toValidate.filters.company')} value={company} onChange={setCompany}>
              <option value="all">{t('toValidate.filters.company')}</option>
              {companies.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </FilterSelect>
          </div>
        </div>

        {hasFilters ? (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={resetFilters}
              className="cursor-pointer text-[12px] font-semibold text-[#1d4f9a] hover:underline"
            >
              {t('toValidate.resetFilters')}
            </button>
          </div>
        ) : null}
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[20%]" />
            <col className="w-[16%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
            <col className="w-[12%]" />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-y border-[#eef3f9] text-[12px] font-semibold text-[#1d4f9a]">
              <th className="truncate px-3 py-2.5 font-semibold sm:px-4">{t('toValidate.columns.employee')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('toValidate.columns.company')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('toValidate.columns.type')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('toValidate.columns.reason')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('toValidate.columns.priority')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('toValidate.columns.deadline')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-4">{t('toValidate.columns.status')}</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[13px] font-medium text-[#8b95a8]">
                  {t(items.length === 0 ? 'toValidate.empty' : 'toValidate.emptyFilter')}
                </td>
              </tr>
            ) : (
              visible.map((item) => {
                const selected = item.id === selectedId
                const days = remainingDays(item.deadlineAt)
                const remainingLabel =
                  days === 0
                    ? t('toValidate.remainingToday')
                    : days === 1
                      ? t('toValidate.remainingOne')
                      : days === -1
                        ? t('toValidate.overdueOne')
                        : days > 1
                          ? interpolate(t('toValidate.remainingMany'), { count: days })
                          : interpolate(t('toValidate.overdueMany'), { count: Math.abs(days) })
                const typeLabel = visitLabel(item.visitType, t)
                const reasonLabel = t(REASON_KEYS[item.reason])
                const priorityLabel = t(PRIORITY_KEYS[item.priority])

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
                      'group cursor-pointer border-b border-[#f3f6fb] transition-colors duration-200',
                      selected ? 'bg-[#F0F7FF]' : 'hover:bg-[#f7fafc]',
                    )}
                  >
                    <td className="min-w-0 overflow-hidden px-3 py-2.5 sm:px-4">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={cn(
                            'grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-bold',
                            avatarTone(item.employeeName),
                          )}
                        >
                          {initials(item.employeeName)}
                        </span>
                        <span className="min-w-0 overflow-hidden">
                          <span
                            className={cn(
                              'block truncate text-[13px] font-medium text-[#1c2a4e] transition-all',
                              selected
                                ? 'font-bold text-[#1d4f9a]'
                                : 'group-hover:font-bold group-hover:text-[#1d4f9a]',
                            )}
                            title={item.employeeName}
                          >
                            {item.employeeName}
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] tabular-nums text-[#8b95a8]">
                            #{item.reference}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-2.5 sm:px-3">
                      <span className="block truncate text-[13px] text-[#1c2a4e]" title={item.companyName}>
                        {item.companyName}
                      </span>
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-2.5 sm:px-3">
                      <span className="block truncate text-[13px] text-[#1c2a4e]" title={typeLabel}>
                        {typeLabel}
                      </span>
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-2.5 sm:px-3">
                      <span className="block truncate text-[13px] text-[#1c2a4e]" title={reasonLabel}>
                        {reasonLabel}
                      </span>
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-2.5 sm:px-3">
                      <span
                        className={cn(
                          'inline-block max-w-full truncate rounded-full px-2 py-0.5 text-[11px] font-semibold',
                          PRIORITY_PILL[item.priority],
                        )}
                        title={priorityLabel}
                      >
                        {priorityLabel}
                      </span>
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-2.5 sm:px-3">
                      <span className="block truncate text-[12px] font-medium tabular-nums text-[#1c2a4e]">
                        {formatDate(item.deadlineAt, locale)}
                      </span>
                      <span
                        className={cn(
                          'mt-0.5 block truncate text-[11px] font-semibold tabular-nums',
                          days <= 0 ? 'text-[#e54848]' : days <= 2 ? 'text-[#ea7a1a]' : 'text-[#8b95a8]',
                        )}
                      >
                        {remainingLabel}
                      </span>
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-2.5 sm:px-4">
                      <span
                        className="inline-block max-w-full truncate rounded-full bg-[#fff1e4] px-2 py-0.5 text-[11px] font-semibold text-[#ea7a1a]"
                        title={t('toValidate.statusPending')}
                      >
                        {t('toValidate.statusPending')}
                      </span>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-[#eef3f9] px-3 py-2.5 sm:px-4">
        <nav className="flex items-center gap-0.5" aria-label={t('toValidate.listTitle')}>
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('toValidate.prevPage')}
            disabled={currentPage <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            <ChevronLeftIcon />
          </button>
          {pageNumbers(currentPage, pageCount).map((entry, index) =>
            entry === 'ellipsis' ? (
              <span key={`ellipsis-${index}`} className="grid size-8 place-items-center text-[13px] font-semibold text-[#8b95a8]">
                …
              </span>
            ) : (
              <button
                key={entry}
                type="button"
                aria-label={interpolate(t('toValidate.page'), { page: entry })}
                aria-current={entry === currentPage ? 'page' : undefined}
                className={cn(
                  'grid size-8 cursor-pointer place-items-center rounded-lg text-[13px] font-semibold transition-colors',
                  entry === currentPage ? 'bg-[#2860B9] text-white' : 'text-[#5b6b82] hover:bg-[#eef5fc]',
                )}
                onClick={() => setPage(entry)}
              >
                {entry}
              </button>
            ),
          )}
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('toValidate.nextPage')}
            disabled={currentPage >= pageCount}
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
          >
            <ChevronRightIcon />
          </button>
        </nav>
        <div className="relative">
          <select
            className={`${selectClass} min-w-[100px]`}
            value={pageSize}
            aria-label={t('toValidate.perPageLabel')}
            onChange={(event) => setPageSize(Number(event.target.value) as (typeof PAGE_SIZES)[number])}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {interpolate(t('toValidate.perPage'), { count: size })}
              </option>
            ))}
          </select>
          <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#8b95a8]" />
        </div>
      </div>
    </section>
  )
}

function FilterSelect({
  label,
  value,
  onChange,
  children,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  children: ReactNode
}) {
  return (
    <div className="relative">
      <select
        className={selectClass}
        value={value}
        aria-label={label}
        onChange={(event) => onChange(event.target.value)}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#8b95a8]" />
    </div>
  )
}
