import { useEffect, useMemo, useRef, useState } from 'react'
import { visitLabel } from '@/features/dashboard/format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { formatDate, initials, interpolate, needsAction } from '../format'
import type { DossierCase, QueueFilter } from '../types'
import { ChevronDownIcon, FilterIcon, MoreVerticalIcon, SearchIcon } from './DossierIcons'
import { StatusBadge } from './StatusBadge'

const PAGE_DOWN = 10
const PAGE_UP = 20
const EDGE_PX = 4
const LOAD_MS = 450

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
  const [moreOpen, setMoreOpen] = useState(false)
  const [range, setRange] = useState({ offset: 0, limit: PAGE_DOWN })
  const [loading, setLoading] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const pagingLockRef = useRef(false)
  const lastScrollTopRef = useRef(0)
  const rangeRef = useRef(range)
  const itemCountRef = useRef(0)
  const loadTimerRef = useRef(0)

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
  const offset = Math.min(range.offset, Math.max(0, filtered.length))
  const visible = filtered.slice(offset, offset + range.limit)

  rangeRef.current = { offset, limit: range.limit }
  itemCountRef.current = filtered.length

  useEffect(() => {
    window.clearTimeout(loadTimerRef.current)
    setLoading(false)
    setRange({ offset: 0, limit: PAGE_DOWN })
  }, [filter, query])

  useEffect(() => {
    if (loading) {
      return
    }
    const el = listRef.current
    if (!el) {
      return
    }
    el.scrollTop = 0
    lastScrollTopRef.current = 0
    pagingLockRef.current = false
  }, [loading, open, range.limit, range.offset])

  useEffect(() => () => window.clearTimeout(loadTimerRef.current), [])

  useEffect(() => {
    const el = listRef.current
    if (!el) {
      return
    }

    const applyRange = (nextOffset: number, nextLimit: number) => {
      if (pagingLockRef.current) {
        return
      }
      const total = itemCountRef.current
      const clampedOffset = Math.min(Math.max(nextOffset, 0), Math.max(0, total))
      const current = rangeRef.current
      if (clampedOffset === current.offset && nextLimit === current.limit) {
        return
      }
      if (clampedOffset >= total) {
        return
      }
      pagingLockRef.current = true
      setLoading(true)
      window.clearTimeout(loadTimerRef.current)
      loadTimerRef.current = window.setTimeout(() => {
        setRange({ offset: clampedOffset, limit: nextLimit })
        setLoading(false)
      }, LOAD_MS)
    }

    const goDown = () => {
      const current = rangeRef.current
      if (current.offset + current.limit >= itemCountRef.current) {
        return
      }
      applyRange(current.offset + current.limit, PAGE_DOWN)
    }

    const goUp = () => {
      const current = rangeRef.current
      if (current.offset <= 0) {
        return
      }
      applyRange(Math.max(0, current.offset - PAGE_DOWN), PAGE_UP)
    }

    const onScroll = () => {
      if (pagingLockRef.current) {
        return
      }
      const delta = el.scrollTop - lastScrollTopRef.current
      lastScrollTopRef.current = el.scrollTop
      const atBottom = el.scrollHeight - el.clientHeight - el.scrollTop <= EDGE_PX
      const atTop = el.scrollTop <= EDGE_PX
      if (delta > 0 && atBottom) {
        goDown()
      } else if (delta < 0 && atTop) {
        goUp()
      }
    }

    const onWheel = (event: WheelEvent) => {
      if (pagingLockRef.current) {
        return
      }
      const atBottom = el.scrollHeight - el.clientHeight - el.scrollTop <= EDGE_PX
      const atTop = el.scrollTop <= EDGE_PX
      if (event.deltaY > 0 && atBottom) {
        const current = rangeRef.current
        if (current.offset + current.limit < itemCountRef.current) {
          event.preventDefault()
          goDown()
        }
      } else if (event.deltaY < 0 && atTop && rangeRef.current.offset > 0) {
        event.preventDefault()
        goUp()
      }
    }

    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => {
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('wheel', onWheel)
    }
  }, [open])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setFilterOpen(false)
        setMoreOpen(false)
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
              setMoreOpen(false)
              setFilterOpen((current) => !current)
            }}
          >
            <FilterIcon className="size-4" />
          </button>
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] transition-colors hover:bg-[#eef5fc]"
            aria-label={t('dossiers.queue.more')}
            aria-expanded={moreOpen}
            onClick={(event) => {
              event.stopPropagation()
              setFilterOpen(false)
              setMoreOpen((current) => !current)
            }}
          >
            <MoreVerticalIcon className="size-4" />
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

          {moreOpen ? (
            <div className="absolute right-0 top-9 z-20 w-56 rounded-xl border border-[#e4ecf6] bg-white p-2 shadow-[0_8px_24px_rgba(28,42,78,0.12)]">
              <label className="relative block">
                <span className="sr-only">{t('dossiers.queue.search')}</span>
                <SearchIcon className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-[#8b95a8]" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder={t('dossiers.queue.search')}
                  className="h-9 w-full rounded-lg border border-[#e4ecf6] bg-[#f7f9fd] py-0 pl-8 pr-2 text-[13px] font-medium text-[#1c2a4e] outline-none placeholder:text-[#8b95a8] focus:border-brand-500 focus:bg-white"
                />
              </label>
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
        <ul
          ref={listRef}
          aria-busy={loading}
          className={cn(
            'min-h-0 flex-1 overflow-y-auto px-2 py-2',
            loading && 'flex flex-col overflow-hidden',
          )}
        >
          {filtered.length === 0 ? (
            <li className="px-3 py-10 text-center text-[13px] font-medium text-[#8b95a8]">
              {t('dossiers.queue.empty')}
            </li>
          ) : loading ? (
            <li className="flex min-h-full flex-1 flex-col items-center justify-center gap-2 text-[12px] font-medium text-[#8b95a8]">
              <span
                className="size-5 animate-spin rounded-full border-2 border-[#d9e8fb] border-t-[#1d4f9a]"
                aria-hidden
              />
              {t('dossiers.queue.loading')}
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
      </div>
    </aside>
  )
}
