import { useEffect, useMemo, useState } from 'react'
import { HeaderFilter } from '@/components/ui'
import { visitLabel } from '@/features/dashboard/format'
import { SearchIcon } from '@/features/dossiers/components/DossierIcons'
import { interpolate } from '@/features/dossiers/format'
import { ChevronLeftIcon, ChevronRightIcon } from '@/features/to-validate/components/ValidationIcons'
import { useI18n, type TranslationKey } from '@/i18n'
import { cn } from '@/lib/cn'
import { formatDateTimeCompact, pageNumbers } from '../format'
import type { CompletedItem, CompletedVisitFilter } from '../types'
import { SortDownIcon } from './CompletedIcons'

const PAGE_SIZE = 8

const FILTERS: Array<{ value: CompletedVisitFilter; labelKey: TranslationKey }> = [
  { value: 'all', labelKey: 'completed.filterAll' },
  { value: 'VISITE_PERIODIQUE', labelKey: 'dashboard.visit.periodique' },
  { value: 'VISITE_EMBAUCHE', labelKey: 'dashboard.visit.embauche' },
  { value: 'VISITE_REPRISE', labelKey: 'dashboard.visit.reprise' },
  { value: 'VISITE_SPECIALE', labelKey: 'dashboard.visit.speciale' },
]

interface CompletedQueueTableProps {
  items: CompletedItem[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function CompletedQueueTable({ items, selectedId, onSelect }: CompletedQueueTableProps) {
  const { t, locale } = useI18n()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<CompletedVisitFilter>('all')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesQuery =
        !needle ||
        item.reference.toLowerCase().includes(needle) ||
        item.employeeName.toLowerCase().includes(needle) ||
        item.companyName.toLowerCase().includes(needle)
      const matchesVisit = filter === 'all' || item.visitType === filter
      return matchesQuery && matchesVisit
    })
  }, [filter, items, query])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)
  const from = filtered.length === 0 ? 0 : start + 1
  const to = start + visible.length

  useEffect(() => {
    setPage(1)
  }, [filter, items.length, query])

  return (
    <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <div className="flex shrink-0 flex-col gap-3 px-4 py-3 sm:px-5">
        <h2 className="truncate text-[16px] font-bold text-[#1c2a4e]">{t('completed.listTitle')}</h2>
        <label className="relative min-w-0">
          <span className="sr-only">{t('completed.searchPlaceholder')}</span>
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#8b95a8]" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t('completed.searchPlaceholder')}
            className="h-9 w-full rounded-lg border border-[#e4ecf6] bg-[#f7fafc] py-0 pl-9 pr-3 text-[13px] text-[#1c2a4e] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#8b95a8] focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
          />
        </label>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead className="sticky top-0 bg-white">
            <tr className="border-y border-[#eef3f9] text-[12px] font-semibold text-[#8b95a8]">
              <th className="px-4 py-2.5 font-semibold">{t('completed.columns.reference')}</th>
              <th className="px-3 py-2.5 font-semibold">{t('completed.columns.employee')}</th>
              <th className="hidden px-3 py-2.5 font-semibold lg:table-cell">{t('completed.columns.company')}</th>
              <th className="px-3 py-2.5 font-semibold">
                <HeaderFilter
                  label={t('completed.columns.visitType')}
                  value={filter}
                  onChange={setFilter}
                  options={FILTERS.map((option) => ({
                    value: option.value,
                    label: t(option.labelKey),
                  }))}
                />
              </th>
              <th className="px-3 py-2.5 font-semibold">
                <span className="inline-flex items-center gap-1 text-[#2860B9]">
                  {t('completed.columns.completedAt')}
                  <SortDownIcon className="size-2.5" />
                </span>
              </th>
              <th className="hidden px-3 py-2.5 text-center font-semibold xl:table-cell">
                {t('completed.columns.documents')}
              </th>
              <th className="px-4 py-2.5 font-semibold">{t('completed.columns.status')}</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[13px] font-medium text-[#8b95a8]">
                  {t(items.length === 0 ? 'completed.empty' : 'completed.emptyFilter')}
                </td>
              </tr>
            ) : (
              visible.map((item) => {
                const selected = item.id === selectedId
                const typeLabel = visitLabel(item.visitType, t)

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
                      <span
                        className="block truncate text-[13px] font-semibold text-[#2860B9]"
                        title={item.reference}
                      >
                        {item.reference}
                      </span>
                    </td>
                    <td className="min-w-0 px-3 py-3">
                      <span className="block truncate text-[13px] font-medium text-[#1c2a4e]" title={item.employeeName}>
                        {item.employeeName}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-[#6d7b93] lg:hidden" title={item.companyName}>
                        {item.companyName}
                      </span>
                    </td>
                    <td className="hidden min-w-0 px-3 py-3 lg:table-cell">
                      <span className="block truncate text-[13px] text-[#1c2a4e]" title={item.companyName}>
                        {item.companyName}
                      </span>
                    </td>
                    <td className="min-w-0 px-3 py-3">
                      <span className="block truncate text-[13px] text-[#1c2a4e]" title={typeLabel}>
                        {typeLabel}
                      </span>
                    </td>
                    <td className="min-w-0 px-3 py-3">
                      <span className="block truncate text-[13px] font-medium tabular-nums text-[#1c2a4e]">
                        {formatDateTimeCompact(item.completedAt, locale)}
                      </span>
                    </td>
                    <td className="hidden px-3 py-3 text-center tabular-nums text-[13px] font-semibold text-[#1c2a4e] xl:table-cell">
                      {item.documents.length}
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-flex rounded-full bg-[#e7f8ee] px-2.5 py-1 text-[11px] font-semibold text-[#15803d]">
                        {t('completed.statusCompleted')}
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
          {interpolate(t('completed.range'), { from, to, total: filtered.length })}
        </p>
        <nav className="flex flex-wrap items-center gap-1" aria-label={t('completed.listTitle')}>
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] transition-colors hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('completed.prevPage')}
            disabled={currentPage <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            <ChevronLeftIcon />
          </button>
          {pageNumbers(currentPage, pageCount).map((entry, index) => {
            if (entry === 'ellipsis') {
              return (
                <span key={`ellipsis-${index}`} className="grid size-8 place-items-center text-[13px] font-semibold text-[#8b95a8]">
                  …
                </span>
              )
            }

            const active = entry === currentPage
            return (
              <button
                key={entry}
                type="button"
                aria-label={interpolate(t('completed.page'), { page: entry })}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'grid size-8 cursor-pointer place-items-center rounded-lg text-[13px] font-semibold transition-colors',
                  active ? 'bg-[#2860B9] text-white' : 'text-[#5b6b82] hover:bg-[#eef5fc]',
                )}
                onClick={() => setPage(entry)}
              >
                {entry}
              </button>
            )
          })}
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] transition-colors hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('completed.nextPage')}
            disabled={currentPage >= pageCount}
            onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
          >
            <ChevronRightIcon />
          </button>
        </nav>
      </div>
    </section>
  )
}
