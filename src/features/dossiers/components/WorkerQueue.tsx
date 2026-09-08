import { useEffect, useMemo, useRef, useState } from 'react'
import { visitLabel } from '@/features/dashboard/format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { formatDate, initials, interpolate, needsAction, pageNumbers } from '../format'
import type { DossierCase, QueueFilter } from '../types'
import {
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  FilterIcon,
  SearchIcon,
} from './DossierIcons'
import { StatusBadge } from './StatusBadge'

const PAGE_SIZES = [10, 25, 50] as const

const selectClass =
  'h-7 w-[76px] cursor-pointer appearance-none rounded-md border border-[#e4ecf6] bg-white py-0 pl-1.5 pr-5 text-[11px] font-medium text-[#1c2a4e] transition-colors duration-200 hover:border-[#c5d4ea] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 [&::-ms-expand]:hidden'

interface WorkerQueueProps {
  cases: DossierCase[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function WorkerQueue({ cases, selectedId, onSelect }: WorkerQueueProps) {
  const { t, locale } = useI18n()
  const [query, setQuery] = useState('')
  const [filter, setFilter] = useState<QueueFilter>('needsAction')
  const [open, setOpen] = useState(false)
  const [filterOpen, setFilterOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10)
  const menuRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()

    return cases.filter((item) => {
      if (filter === 'needsAction' && !needsAction(item.status)) {
        return false
      }
      if (!needle) {
        return true
      }
      return [item.employeeName, item.companyName, item.reference]
        .join(' ')
        .toLowerCase()
        .includes(needle)
    })
  }, [cases, filter, query])

  const headingKey = filter === 'all' ? 'dossiers.queue.headingAll' : 'dossiers.queue.headingToProcess'
  const heading = interpolate(t(headingKey), { count: filtered.length })
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize
  const visible = filtered.slice(start, start + pageSize)

  useEffect(() => {
    setPage(1)
  }, [filter, query, pageSize])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setFilterOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return (
    <aside className="flex min-h-0 w-full min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)] xl:h-full xl:w-[260px] xl:flex-none">
      <div className="flex shrink-0 items-center justify-between gap-1 border-b border-[#eef3f9] px-3 py-2.5">
        <div className="flex min-w-0 flex-1 items-center gap-1">
          <h2 className="min-w-0 flex-1 truncate text-[14px] font-bold text-[#1c2a4e]">{heading}</h2>
          <button
            type="button"
            className="grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-[#8b95a8] hover:bg-[#eef5fc] xl:hidden"
            aria-expanded={open}
            aria-label={open ? t('dossiers.queue.closeList') : t('dossiers.queue.openList')}
            onClick={() => setOpen((current) => !current)}
          >
            <ChevronDownIcon className={cn('size-4 transition-transform', open && 'rotate-180')} />
          </button>
        </div>

        <div ref={menuRef} className="relative flex shrink-0 items-center">
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#1d4f9a] transition-colors hover:bg-[#eef5fc]"
            aria-label={t('dossiers.queue.filter')}
            aria-expanded={filterOpen}
            onClick={(event) => {
              event.stopPropagation()
              setFilterOpen((current) => !current)
            }}
          >
            <FilterIcon className="size-4" />
          </button>

          {filterOpen ? (
            <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-[#e4ecf6] bg-white py-1 shadow-[0_8px_24px_rgba(28,42,78,0.12)]">
              {(
                [
                  ['needsAction', 'dossiers.queue.title'],
                  ['all', 'dossiers.queue.all'],
                ] as const
              ).map(([value, key]) => (
                <button
                  key={value}
                  type="button"
                  className={cn(
                    'flex w-full cursor-pointer px-3 py-2 text-left text-[13px] font-medium',
                    filter === value ? 'bg-[#eef5fc] text-[#1d4f9a]' : 'text-[#1c2a4e] hover:bg-[#f7fafc]',
                  )}
                  onClick={(event) => {
                    event.stopPropagation()
                    setFilter(value)
                    setFilterOpen(false)
                  }}
                >
                  {t(key)}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div
        className={cn(
          'min-h-0 flex-col xl:flex xl:flex-1',
          open ? 'flex max-h-[min(70dvh,520px)] xl:max-h-none' : 'hidden',
        )}
      >
        <div className="shrink-0 px-2 pb-1 pt-2">
          <label className="relative block">
            <span className="sr-only">{t('dossiers.queue.search')}</span>
            <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#8b95a8]" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={t('dossiers.queue.search')}
              className="h-9 w-full rounded-lg border border-[#e4ecf6] bg-[#f7f9fd] py-0 pl-8 pr-2 text-[13px] font-medium text-[#1c2a4e] outline-none placeholder:text-[#8b95a8] focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-500/30"
            />
          </label>
        </div>

        <ul className="min-h-0 flex-1 overflow-y-auto px-2 py-2">
          {filtered.length === 0 ? (
            <li className="px-3 py-10 text-center text-[13px] font-medium text-[#8b95a8]">
              {t('dossiers.queue.empty')}
            </li>
          ) : (
            visible.map((item) => {
              const isSelected = item.id === selectedId
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(item.id)
                      setOpen(false)
                    }}
                    className={cn(
                      'flex w-full cursor-pointer items-start gap-3 rounded-xl px-3 py-2.5 text-left transition-colors',
                      isSelected ? 'bg-[#eef5fc]' : 'hover:bg-[#f7fafc]',
                    )}
                  >
                    <span
                      className={cn(
                        'mt-0.5 grid size-9 shrink-0 place-items-center rounded-lg text-[12px] font-bold',
                        isSelected ? 'bg-[#1d4f9a] text-white' : 'bg-[#d9e8fb] text-[#1d4f9a]',
                      )}
                    >
                      {initials(item.employeeName)}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-[#1c2a4e]">
                        {item.employeeName}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-[#6d7b93]">
                        {item.companyName}
                      </span>
                      <span className="mt-1.5 flex flex-wrap items-center gap-1.5">
                        <StatusBadge status={item.status} />
                        <span className="text-[11px] text-[#8b95a8]">
                          {visitLabel(item.visitType, t)}
                        </span>
                      </span>
                      <span className="mt-1 block text-[11px] tabular-nums text-[#8b95a8]">
                        {formatDate(item.receivedAt, locale)}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })
          )}
        </ul>

        <div className="flex shrink-0 items-center justify-end gap-1 border-t border-[#eef3f9] px-1.5 py-1.5">
          <nav className="flex shrink-0 items-center" aria-label={t('dossiers.queue.listNav')}>
            <button
              type="button"
              className="grid size-6 cursor-pointer place-items-center rounded-md text-[#5b6b82] transition-colors hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={t('dossiers.queue.prevPage')}
              disabled={currentPage <= 1}
              onClick={() => setPage((value) => Math.max(1, value - 1))}
            >
              <ChevronLeftIcon className="size-3" />
            </button>
            {pageNumbers(currentPage, pageCount).map((item, index) =>
              item === 'ellipsis' ? (
                <span
                  key={`ellipsis-${index}`}
                  className="grid size-6 place-items-center text-[11px] font-semibold text-[#8b95a8]"
                >
                  …
                </span>
              ) : (
                <button
                  key={item}
                  type="button"
                  aria-current={item === currentPage ? 'page' : undefined}
                  className={cn(
                    'grid size-6 cursor-pointer place-items-center rounded-md text-[11px] font-semibold transition-colors',
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
              className="grid size-6 cursor-pointer place-items-center rounded-md text-[#5b6b82] transition-colors hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={t('dossiers.queue.nextPage')}
              disabled={currentPage >= pageCount}
              onClick={() => setPage((value) => Math.min(pageCount, value + 1))}
            >
              <ChevronRightIcon className="size-3" />
            </button>
          </nav>
          <div className="relative shrink-0">
            <select
              className={selectClass}
              value={pageSize}
              aria-label={t('dossiers.queue.perPageLabel')}
              onChange={(event) => setPageSize(Number(event.target.value) as (typeof PAGE_SIZES)[number])}
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {interpolate(t('dossiers.queue.perPage'), { count: size })}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-1 top-1/2 size-3 -translate-y-1/2 text-[#8b95a8]" />
          </div>
        </div>
      </div>
    </aside>
  )
}
