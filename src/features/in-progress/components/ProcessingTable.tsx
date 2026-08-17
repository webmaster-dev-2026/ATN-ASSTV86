import { useEffect, useMemo, useState } from 'react'
import { HeaderFilter } from '@/components/ui'
import { formatStamp, interpolate } from '@/features/dossiers/format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import {
  ACTIVITY_LABEL,
  STATUS_BADGE,
  STATUS_LABEL,
  STEP_BAR,
  STEP_LABEL,
  formatEta,
  pageNumbers,
} from '../format'
import type { AtnStatus, ProcessingItem, ProcessingStep } from '../types'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  DownloadIcon,
  SearchIcon,
} from './ProcessingIcons'

const PAGE_SIZES = [10, 25, 50] as const

const selectClass =
  'h-9 min-w-[108px] cursor-pointer appearance-none rounded-lg border border-[#e4ecf6] bg-white py-0 pl-3 pr-8 text-[13px] font-medium text-[#1c2a4e] transition-colors duration-200 hover:border-[#c5d4ea] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 [&::-ms-expand]:hidden'

const inputClass =
  'h-9 w-full rounded-lg border border-[#e4ecf6] bg-[#f7fafc] py-0 pl-9 pr-3 text-[13px] text-[#1c2a4e] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#8b95a8] focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30'

interface ProcessingTableProps {
  items: ProcessingItem[]
  onExport: (items: ProcessingItem[]) => void
}

export function ProcessingTable({ items, onExport }: ProcessingTableProps) {
  const { t, locale } = useI18n()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<AtnStatus | 'all'>('all')
  const [step, setStep] = useState<ProcessingStep | 'all'>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesQuery =
        !needle ||
        item.reference.toLowerCase().includes(needle) ||
        item.employeeName.toLowerCase().includes(needle) ||
        item.companyName.toLowerCase().includes(needle)
      const matchesStatus = status === 'all' || item.status === status
      const matchesStep = step === 'all' || item.step === step
      return matchesQuery && matchesStatus && matchesStep
    })
  }, [items, query, status, step])

  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize
  const visible = filtered.slice(start, start + pageSize)
  const from = filtered.length === 0 ? 0 : start + 1
  const to = start + visible.length

  useEffect(() => {
    setPage(1)
  }, [query, status, step, items, pageSize])

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <div className="flex shrink-0 flex-col gap-3 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-[16px] font-bold text-[#1c2a4e]">{t('inProgress.listTitle')}</h2>
          <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#f3e8ff] px-2 py-0.5 text-[12px] font-bold text-[#7c3aed]">
            {filtered.length}
          </span>
        </div>

        <div className="flex flex-col gap-2 xl:flex-row xl:items-center">
          <label className="relative min-w-0 flex-1">
            <span className="sr-only">{t('inProgress.searchPlaceholder')}</span>
            <SearchIcon className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8b95a8]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('inProgress.searchPlaceholder')}
              className={inputClass}
            />
          </label>

          <div className="flex flex-wrap items-center gap-2">
            <SelectWrap>
              <select
                className={selectClass}
                value={status}
                aria-label={t('inProgress.filters.status')}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  setStatus(event.target.value as AtnStatus | 'all')
                }
              >
                <option value="all">{t('inProgress.filters.status')}</option>
                <option value="analysing">{t(STATUS_LABEL.analysing)}</option>
                <option value="checking">{t(STATUS_LABEL.checking)}</option>
                <option value="scheduling">{t(STATUS_LABEL.scheduling)}</option>
              </select>
            </SelectWrap>
            <SelectWrap>
              <select
                className={selectClass}
                value={step}
                aria-label={t('inProgress.filters.step')}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  setStep(event.target.value as ProcessingStep | 'all')
                }
              >
                <option value="all">{t('inProgress.filters.step')}</option>
                <option value="analyse">{t(STEP_LABEL.analyse)}</option>
                <option value="check">{t(STEP_LABEL.check)}</option>
                <option value="schedule">{t(STEP_LABEL.schedule)}</option>
              </select>
            </SelectWrap>
            <button
              type="button"
              className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[#e4ecf6] bg-white px-3 text-[13px] font-semibold text-[#1c2a4e] transition-colors duration-200 hover:bg-[#f7fafc] active:scale-[0.98]"
              onClick={() => onExport(filtered)}
            >
              <DownloadIcon className="size-3.5" />
              {t('inProgress.export')}
            </button>
          </div>
        </div>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead className="sticky top-0 bg-white">
            <tr className="border-y border-[#eef3f9] text-[12px] font-semibold text-[#8b95a8]">
              <th className="px-4 py-2.5 font-semibold">{t('inProgress.columns.reference')}</th>
              <th className="px-3 py-2.5 font-semibold">{t('inProgress.columns.employee')}</th>
              <th className="w-[120px] px-3 py-2.5 font-semibold">{t('inProgress.columns.progress')}</th>
              <th className="px-3 py-2.5 font-semibold">{t('inProgress.columns.status')}</th>
              <th className="px-3 py-2.5 font-semibold">{t('inProgress.columns.lastActivity')}</th>
              <th className="px-4 py-2.5 font-semibold">{t('inProgress.columns.eta')}</th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[13px] font-medium text-[#8b95a8]">
                  {t(items.length === 0 ? 'inProgress.empty' : 'inProgress.emptyFilter')}
                </td>
              </tr>
            ) : (
              visible.map((item) => {
                const eta = formatEta(item.etaMinutes)
                const lastStamp = formatStamp(item.lastActivityAt, locale)
                const etaStamp = formatStamp(item.etaAt, locale)
                const etaLabel =
                  eta.hours === 0
                    ? interpolate(t('inProgress.etaMinutes'), { minutes: eta.minutes })
                    : interpolate(t('inProgress.etaHours'), { hours: eta.hours, minutes: eta.minutes })

                return (
                  <tr key={item.id} className="border-b border-[#f3f6fb] transition-colors duration-200 hover:bg-[#f7fafc]">
                    <td className="px-4 py-3">
                      <span className="block truncate text-[13px] font-bold text-[#1c2a4e]" title={item.reference}>
                        {item.reference}
                      </span>
                    </td>
                    <td className="min-w-0 px-3 py-3">
                      <span className="block truncate text-[13px] font-semibold text-[#1c2a4e]" title={item.employeeName}>
                        {item.employeeName}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-[#6d7b93]" title={item.companyName}>
                        {item.companyName}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="block text-[12px] font-semibold tabular-nums text-[#1c2a4e]">
                        {item.progress}%
                      </span>
                      <span className="mt-1 block h-1.5 overflow-hidden rounded-full bg-[#eef3f9]">
                        <span
                          className={cn('block h-full rounded-full', STEP_BAR[item.step])}
                          style={{ width: `${item.progress}%` }}
                        />
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={cn(
                          'inline-flex max-w-full truncate rounded-full px-2 py-1 text-[11px] font-semibold',
                          STATUS_BADGE[item.status],
                        )}
                      >
                        {t(STATUS_LABEL[item.status])}
                      </span>
                    </td>
                    <td className="min-w-0 px-3 py-3">
                      <span className="block truncate text-[13px] text-[#1c2a4e]">
                        {t(ACTIVITY_LABEL[item.lastActivity])}
                      </span>
                      <span className="mt-0.5 block text-[12px] tabular-nums text-[#8b95a8]">{lastStamp.time}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className="block text-[13px] font-bold tabular-nums text-[#1c2a4e]">{etaLabel}</span>
                      <span className="mt-0.5 block text-[12px] tabular-nums text-[#8b95a8]">{etaStamp.time}</span>
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
          {interpolate(t('inProgress.range'), { from, to, total: filtered.length })}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex items-center gap-1" aria-label={t('inProgress.listTitle')}>
            <button
              type="button"
              className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] transition-colors hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={t('inProgress.prevPage')}
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
              aria-label={t('inProgress.nextPage')}
              disabled={currentPage >= pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            >
              <ChevronRightIcon />
            </button>
          </nav>
          <div className="relative w-fit">
            <select
              className={`${selectClass} min-w-[108px]`}
              value={pageSize}
              aria-label={t('inProgress.perPageLabel')}
              onChange={(event) => setPageSize(Number(event.target.value) as (typeof PAGE_SIZES)[number])}
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {interpolate(t('inProgress.perPage'), { count: size })}
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
function SelectWrap({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      {children}
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b95a8]" />
    </div>
  )
}

