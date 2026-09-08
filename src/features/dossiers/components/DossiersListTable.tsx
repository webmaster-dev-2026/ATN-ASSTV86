import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { visitLabel } from '@/features/dashboard/format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import {
  PRIORITY_KEYS,
  PRIORITY_STYLES,
  ageFrom,
  formatDate,
  formatStamp,
  initials,
  interpolate,
  pageNumbers,
} from '../format'
import type { DossierCase, DossierCaseStatus, DossierPriority } from '../types'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreVerticalIcon,
  SearchIcon,
} from './DossierIcons'
import { StatusBadge } from './StatusBadge'

const PAGE_SIZES = [10, 20, 50] as const
const STATUSES: DossierCaseStatus[] = [
  'toProcess',
  'analysing',
  'readyForAppointment',
  'blocked',
  'completed',
]
const PRIORITIES: DossierPriority[] = ['high', 'normal', 'low']
const VISIT_TYPES = ['VISITE_PERIODIQUE', 'VISITE_EMBAUCHE', 'VISITE_REPRISE', 'VISITE_SPECIALE'] as const

const selectClass =
  'h-9 min-w-[120px] cursor-pointer appearance-none rounded-lg border border-[#e4ecf6] bg-white py-0 pl-3 pr-8 text-[13px] font-medium text-[#1c2a4e] transition-colors duration-200 hover:border-[#c5d4ea] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 [&::-ms-expand]:hidden'

interface DossiersListTableProps {
  cases: DossierCase[]
  onNewRequest: () => void
}

export function DossiersListTable({ cases, onNewRequest }: DossiersListTableProps) {
  const { t, locale } = useI18n()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<DossierCaseStatus | 'all'>('all')
  const [visitType, setVisitType] = useState<string>('all')
  const [priority, setPriority] = useState<DossierPriority | 'all'>('all')
  const [company, setCompany] = useState('all')
  const [receivedDate, setReceivedDate] = useState('')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(20)

  const companies = useMemo(
    () => [...new Set(cases.map((item) => item.companyName))].sort((a, b) => a.localeCompare(b)),
    [cases],
  )

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return cases.filter((item) => {
      const matchesQuery =
        !needle ||
        item.employeeName.toLowerCase().includes(needle) ||
        item.companyName.toLowerCase().includes(needle) ||
        item.reference.toLowerCase().includes(needle)
      const matchesStatus = status === 'all' || item.status === status
      const matchesVisit = visitType === 'all' || item.visitType === visitType
      const matchesPriority = priority === 'all' || item.priority === priority
      const matchesCompany = company === 'all' || item.companyName === company
      const matchesDate = !receivedDate || item.receivedAt.slice(0, 10) === receivedDate
      return matchesQuery && matchesStatus && matchesVisit && matchesPriority && matchesCompany && matchesDate
    })
  }, [cases, company, priority, query, receivedDate, status, visitType])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize
  const visible = filtered.slice(start, start + pageSize)

  useEffect(() => {
    setPage(1)
  }, [query, status, visitType, priority, company, receivedDate, pageSize])

  const resetFilters = () => {
    setQuery('')
    setStatus('all')
    setVisitType('all')
    setPriority('all')
    setCompany('all')
    setReceivedDate('')
  }

  const hasFilters =
    query.trim() !== '' ||
    status !== 'all' ||
    visitType !== 'all' ||
    priority !== 'all' ||
    company !== 'all' ||
    receivedDate !== ''

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <div className="flex shrink-0 flex-col gap-3 border-b border-[#eef3f9] px-4 py-3 sm:px-5">
        <div className="flex flex-wrap items-center justify-end gap-2">
          <button
            type="button"
            onClick={onNewRequest}
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-[#1d4f9a] px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#163e7a]"
          >
            <span aria-hidden>+</span>
            {t('dossiers.newRequest')}
          </button>
        </div>

        <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">{t('dossiers.searchPlaceholder')}</span>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8b95a8]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('dossiers.searchPlaceholder')}
              className="h-9 w-full rounded-lg border border-[#e4ecf6] bg-[#f7fafc] py-0 pl-9 pr-3 text-[13px] text-[#1c2a4e] placeholder:text-[#8b95a8] focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <FilterSelect
              label={t('dossiers.filters.status')}
              value={status}
              onChange={(value) => setStatus(value as DossierCaseStatus | 'all')}
            >
              <option value="all">{t('dossiers.filters.status')}</option>
              {STATUSES.map((value) => (
                <option key={value} value={value}>
                  {t(`dossiers.status.${value}`)}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label={t('dossiers.filters.visitType')}
              value={visitType}
              onChange={setVisitType}
            >
              <option value="all">{t('dossiers.filters.visitType')}</option>
              {VISIT_TYPES.map((value) => (
                <option key={value} value={value}>
                  {visitLabel(value, t)}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect
              label={t('dossiers.filters.priority')}
              value={priority}
              onChange={(value) => setPriority(value as DossierPriority | 'all')}
            >
              <option value="all">{t('dossiers.filters.priority')}</option>
              {PRIORITIES.map((value) => (
                <option key={value} value={value}>
                  {t(PRIORITY_KEYS[value])}
                </option>
              ))}
            </FilterSelect>
            <FilterSelect label={t('dossiers.filters.company')} value={company} onChange={setCompany}>
              <option value="all">{t('dossiers.filters.company')}</option>
              {companies.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </FilterSelect>
            <input
              type="date"
              value={receivedDate}
              aria-label={t('dossiers.filters.receivedDate')}
              onChange={(event) => setReceivedDate(event.target.value)}
              className="h-9 rounded-lg border border-[#e4ecf6] bg-white px-3 text-[13px] font-medium text-[#1c2a4e] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
          </div>
        </div>

        {hasFilters ? (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={resetFilters}
              className="cursor-pointer text-[12px] font-semibold text-[#1d4f9a] hover:underline"
            >
              {t('dossiers.resetFilters')}
            </button>
          </div>
        ) : null}
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[22%]" />
            <col className="w-[16%]" />
            <col className="w-[14%]" />
            <col className="w-[14%]" />
            <col className="w-[10%]" />
            <col className="w-[11%]" />
            <col className="w-[11%]" />
            <col className="w-10" />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-y border-[#eef3f9] text-[12px] font-semibold text-[#1d4f9a]">
              <th className="truncate px-3 py-2.5 font-semibold sm:px-4">{t('dossiers.columns.employee')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('dossiers.columns.company')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('dossiers.columns.visitType')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('dossiers.columns.status')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('dossiers.columns.priority')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('dossiers.columns.receivedOn')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('dossiers.columns.proposedAt')}</th>
              <th className="px-2 py-2.5 sm:px-3" />
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-[13px] font-medium text-[#8b95a8]">
                  {t(cases.length === 0 ? 'dossiers.empty' : 'dossiers.emptyFilter')}
                </td>
              </tr>
            ) : (
              visible.map((item) => {
                const received = formatStamp(item.receivedAt, locale)
                const proposed = item.proposedSlot ? formatStamp(item.proposedSlot.at, locale) : null
                const visit = visitLabel(item.visitType, t)
                const priorityLabel = t(PRIORITY_KEYS[item.priority])
                return (
                  <tr key={item.id} className="group border-b border-[#f3f6fb] transition-colors hover:bg-[#f7fafc]">
                    <td className="min-w-0 overflow-hidden px-3 py-2.5 sm:px-4">
                      <Link
                        to={`/dossiers/${item.id}`}
                        className="flex min-w-0 items-center gap-2.5"
                        aria-label={t('dossiers.openDossier')}
                      >
                        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-[#d9e8fb] text-[11px] font-bold text-[#1d4f9a]">
                          {initials(item.employeeName)}
                        </span>
                        <span className="min-w-0 overflow-hidden">
                          <span
                            className="block truncate text-[13px] font-medium text-[#1c2a4e] transition-all group-hover:font-bold group-hover:text-[#1d4f9a]"
                            title={item.employeeName}
                          >
                            {item.employeeName}
                          </span>
                          <span className="mt-0.5 block truncate text-[11px] text-[#8b95a8]">
                            {formatDate(item.birthDate, locale)} · {ageFrom(item.birthDate)}
                          </span>
                        </span>
                      </Link>
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-2.5 sm:px-3">
                      <span className="block truncate text-[13px] text-[#1c2a4e]" title={item.companyName}>
                        {item.companyName}
                      </span>
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-2.5 sm:px-3">
                      <span className="block truncate text-[13px] text-[#1c2a4e]" title={visit}>
                        {visit}
                      </span>
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-2.5 sm:px-3">
                      <StatusBadge status={item.status} />
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-2.5 sm:px-3">
                      <span
                        className={cn(
                          'inline-block max-w-full truncate rounded-full px-2 py-0.5 text-[11px] font-semibold',
                          PRIORITY_STYLES[item.priority],
                        )}
                        title={priorityLabel}
                      >
                        {priorityLabel}
                      </span>
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-2.5 sm:px-3">
                      <span className="block truncate text-[12px] tabular-nums text-[#1c2a4e]" title={received.date}>
                        {received.date}
                      </span>
                      <span className="block truncate text-[11px] tabular-nums text-[#8b95a8]">{received.time}</span>
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-2.5 sm:px-3">
                      {proposed ? (
                        <>
                          <span className="block truncate text-[12px] tabular-nums text-[#1c2a4e]" title={proposed.date}>
                            {proposed.date}
                          </span>
                          <span className="block truncate text-[11px] tabular-nums text-[#8b95a8]">{proposed.time}</span>
                        </>
                      ) : (
                        <span className="text-[#8b95a8]">—</span>
                      )}
                    </td>
                    <td className="overflow-hidden px-2 py-2.5 sm:px-3">
                      <Link
                        to={`/dossiers/${item.id}`}
                        className="grid size-8 place-items-center rounded-lg text-[#5b6b82] hover:bg-[#eef5fc]"
                        aria-label={t('dossiers.openDossier')}
                      >
                        <MoreVerticalIcon className="size-4" />
                      </Link>
                    </td>
                  </tr>
                )
              })
            )}
          </tbody>
        </table>
      </div>

      <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-[#eef3f9] px-3 py-2.5 sm:px-4">
        <nav className="flex items-center gap-0.5" aria-label={t('dossiers.listNav')}>
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('dossiers.prevPage')}
            disabled={currentPage <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            <ChevronLeftIcon />
          </button>
          {pageNumbers(currentPage, pageCount).map((item, index) =>
            item === 'ellipsis' ? (
              <span key={`e-${index}`} className="grid size-8 place-items-center text-[13px] font-semibold text-[#8b95a8]">
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
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('dossiers.nextPage')}
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
            aria-label={t('dossiers.perPageLabel')}
            onChange={(event) => setPageSize(Number(event.target.value) as (typeof PAGE_SIZES)[number])}
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {interpolate(t('dossiers.perPage'), { count: size })}
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
