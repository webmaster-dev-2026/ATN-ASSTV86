import { useEffect, useState } from 'react'
import { visitLabel } from '@/features/dashboard/format'
import { interpolate, formatDate } from '@/features/dossiers/format'
import { ChevronLeftIcon, ChevronRightIcon } from '@/features/to-validate/components/ValidationIcons'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { KIND_BADGE, KIND_LABEL, hitBadge, pageNumbers } from '../format'
import type { SearchHit } from '../types'

const PAGE_SIZE = 8

interface SearchResultsProps {
  items: SearchHit[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function SearchResults({ items, selectedId, onSelect }: SearchResultsProps) {
  const { t, locale } = useI18n()
  const [page, setPage] = useState(1)

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = items.slice(start, start + PAGE_SIZE)
  const from = items.length === 0 ? 0 : start + 1
  const to = start + visible.length

  useEffect(() => {
    setPage(1)
  }, [items])

  return (
    <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <div className="flex shrink-0 items-center gap-2 px-4 py-3 sm:px-5">
        <h2 className="truncate text-[16px] font-bold text-[#1c2a4e]">{t('search.resultsTitle')}</h2>
        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#e8f1fc] px-2 py-0.5 text-[12px] font-bold text-[#2860B9]">
          {items.length}
        </span>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[14%]" />
            <col className="w-[28%]" />
            <col className="w-[16%]" />
            <col className="w-[16%]" />
            <col className="w-[12%]" />
            <col className="w-[14%]" />
          </colgroup>
          <thead className="sticky top-0 bg-white">
            <tr className="border-y border-[#eef3f9] text-[12px] font-semibold text-[#8b95a8]">
              <th className="truncate px-3 py-2.5 font-semibold sm:px-4">{t('search.columns.type')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('search.columns.result')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('search.columns.employee')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('search.columns.company')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('search.columns.date')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-4">{t('search.columns.status')}</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[13px] font-medium text-[#8b95a8]">
                  {t('search.empty')}
                </td>
              </tr>
            ) : (
              visible.map((item) => {
                const selected = item.id === selectedId
                const badge = hitBadge(item, t)

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
                      selected ? 'bg-[#F0F7FF]' : 'hover:bg-[#f7fafc]',
                    )}
                  >
                    <td className="min-w-0 overflow-hidden px-3 py-3 sm:px-4">
                      <span className={cn('inline-block max-w-full truncate rounded-full px-2 py-0.5 text-[11px] font-semibold', KIND_BADGE[item.kind])}>
                        {t(KIND_LABEL[item.kind])}
                      </span>
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-3 sm:px-3">
                      <span className="block truncate text-[13px] font-semibold text-[#1c2a4e]" title={item.title}>
                        {item.title}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] font-semibold text-[#2860B9]" title={item.reference}>
                        {item.reference}
                        {item.visitType ? (
                          <span className="ml-1.5 font-medium text-[#8b95a8]">{visitLabel(item.visitType, t)}</span>
                        ) : null}
                      </span>
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-3 sm:px-3">
                      <span className="block truncate text-[13px] text-[#1c2a4e]" title={item.employeeName}>
                        {item.employeeName}
                      </span>
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-3 sm:px-3">
                      <span className="block truncate text-[13px] text-[#1c2a4e]" title={item.companyName}>
                        {item.companyName}
                      </span>
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-3 text-[13px] font-medium tabular-nums text-[#1c2a4e] sm:px-3">
                      <span className="block truncate">{formatDate(item.at, locale)}</span>
                    </td>
                    <td className="min-w-0 overflow-hidden px-2 py-3 sm:px-4">
                      <span className={cn('inline-block max-w-full truncate rounded-full px-2.5 py-1 text-[11px] font-semibold', badge.className)} title={badge.label}>
                        {badge.label}
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
          {interpolate(t('search.range'), { from, to, total: items.length })}
        </p>
        <nav className="flex flex-wrap items-center gap-1" aria-label={t('search.listNav')}>
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] transition-colors hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('search.prevPage')}
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
                aria-label={interpolate(t('search.page'), { page: entry })}
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
            aria-label={t('search.nextPage')}
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
