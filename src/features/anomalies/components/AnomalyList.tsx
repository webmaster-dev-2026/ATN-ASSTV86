import { useEffect, useState } from 'react'
import { formatDate, initials, interpolate } from '@/features/dossiers/format'
import { avatarTone } from '@/features/to-validate/format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import {
  SEVERITY_ICON,
  STATUS_BADGE,
  STATUS_LABEL,
  pageNumbers,
} from '../format'
import type { AnomalyItem } from '../types'
import { ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, WarningTriangleIcon } from './AnomalyIcons'

const PAGE_SIZES = [10, 25, 50] as const

const selectClass =
  'h-9 cursor-pointer appearance-none rounded-lg border border-[#e4ecf6] bg-white py-0 pl-3 pr-8 text-[13px] font-medium text-[#1c2a4e] transition-colors duration-200 hover:border-[#c5d4ea] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 [&::-ms-expand]:hidden'

interface AnomalyListProps {
  items: AnomalyItem[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function AnomalyList({ items, selectedId, onSelect }: AnomalyListProps) {
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

  return (
    <section className="flex min-h-[min(70dvh,560px)] min-w-0 flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(28,42,78,0.04)] xl:h-full xl:min-h-0">
      <div className="mb-3 flex shrink-0 items-center gap-2">
        <h2 className="truncate text-[16px] font-bold text-[#1c2a4e]">{t('anomalies.listTitle')}</h2>
        <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#fde2e2] px-2 py-0.5 text-[12px] font-bold text-[#c93434]">
          {items.length}
        </span>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="border-y border-[#eef3f9] text-[12px] font-semibold text-[#8b95a8]">
              <th className="w-[46%] px-0 py-2.5 pr-3 font-semibold lg:w-[30%]">{t('anomalies.columns.anomaly')}</th>
              <th className="w-[32%] px-2 py-2.5 font-semibold lg:w-[18%]">{t('anomalies.columns.dossier')}</th>
              <th className="hidden px-2 py-2.5 font-semibold lg:table-cell lg:w-[22%]">{t('anomalies.columns.assignee')}</th>
              <th className="w-[22%] px-2 py-2.5 font-semibold lg:w-[14%]">{t('anomalies.columns.status')}</th>
              <th className="hidden px-2 py-2.5 font-semibold lg:table-cell lg:w-[16%]">{t('anomalies.columns.detected')}</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-0 py-12 text-center text-[13px] font-medium text-[#8b95a8]">
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
                      selected ? 'bg-[#eef5fc] shadow-[inset_3px_0_0_#2860B9]' : 'hover:bg-[#f7fafc]',
                    )}
                  >
                    <td className="max-w-0 px-0 py-3 pr-3">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className={cn('grid size-6 shrink-0 place-items-center rounded-full', SEVERITY_ICON[item.severity])}>
                          <WarningTriangleIcon className="size-3.5" />
                        </span>
                        <span className="min-w-0">
                          <span className="block truncate text-[13px] font-semibold text-[#1c2a4e]" title={item.title}>
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
                    <td className="max-w-0 px-2 py-3">
                      <span className="block truncate text-[13px] font-semibold text-[#1c2a4e]" title={item.reference}>
                        {item.reference}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-[#6d7b93]" title={item.employeeName}>
                        {item.employeeName}
                      </span>
                    </td>
                    <td className="hidden max-w-0 px-2 py-3 lg:table-cell">
                      <span className="flex min-w-0 items-center gap-2">
                        <span className={cn('grid size-7 shrink-0 place-items-center rounded-full text-[10px] font-bold', avatarTone(item.assigneeName))}>
                          {initials(item.assigneeName)}
                        </span>
                        <span className="truncate text-[13px] text-[#1c2a4e]" title={item.assigneeName}>
                          {item.assigneeName}
                        </span>
                      </span>
                    </td>
                    <td className="overflow-hidden px-2 py-3">
                      <span className={cn('inline-flex max-w-full truncate rounded-full px-2 py-0.5 text-[11px] font-semibold', STATUS_BADGE[item.status])}>
                        {t(STATUS_LABEL[item.status])}
                      </span>
                    </td>
                    <td className="hidden overflow-hidden px-2 py-3 lg:table-cell">
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

      <div className="mt-3 flex shrink-0 flex-col gap-3 border-t border-[#eef3f9] pt-3 lg:flex-row lg:items-center lg:justify-between">
        <p className="min-w-0 truncate text-[12px] font-medium text-[#8b95a8]">
          {interpolate(t('anomalies.range'), {
            from: items.length === 0 ? 0 : start + 1,
            to: start + visible.length,
            total: items.length,
          })}
        </p>
        <nav className="flex flex-wrap items-center justify-center gap-1" aria-label={t('anomalies.listTitle')}>
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] transition-colors duration-200 hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('anomalies.prevPage')}
            disabled={currentPage <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            <ChevronLeftIcon />
          </button>
          {pageNumbers(currentPage, pageCount).map((item, index) =>
            item === 'ellipsis' ? (
              <span key={`e-${index}`} className="grid size-8 place-items-center text-[13px] text-[#8b95a8]">
                ...
              </span>
            ) : (
              <button
                key={item}
                type="button"
                aria-current={item === currentPage ? 'page' : undefined}
                className={cn(
                  'grid size-8 cursor-pointer place-items-center rounded-lg text-[13px] font-semibold transition-colors duration-200',
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
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] transition-colors duration-200 hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
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
    </section>
  )
}
