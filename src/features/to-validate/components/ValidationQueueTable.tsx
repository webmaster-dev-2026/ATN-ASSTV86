import { useEffect, useMemo, useRef, useState } from 'react'
import { visitLabel } from '@/features/dashboard/format'
import { formatDate, initials, interpolate } from '@/features/dossiers/format'
import { FilterIcon } from '@/features/dossiers/components/DossierIcons'
import { useI18n, type TranslationKey } from '@/i18n'
import { cn } from '@/lib/cn'
import {
  PRIORITY_DOT,
  PRIORITY_KEYS,
  REASON_KEYS,
  avatarTone,
  remainingDays,
} from '../format'
import type { QueueFilter, ValidationItem } from '../types'
import { ChevronLeftIcon, ChevronRightIcon } from './ValidationIcons'

const PAGE_SIZE = 8

const FILTERS: Array<{ value: QueueFilter; labelKey: TranslationKey }> = [
  { value: 'all', labelKey: 'toValidate.filterAll' },
  { value: 'high', labelKey: 'toValidate.priority.high' },
  { value: 'medium', labelKey: 'toValidate.priority.medium' },
  { value: 'low', labelKey: 'toValidate.priority.low' },
]

interface ValidationQueueTableProps {
  items: ValidationItem[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function ValidationQueueTable({ items, selectedId, onSelect }: ValidationQueueTableProps) {
  const { t, locale } = useI18n()
  const [filter, setFilter] = useState<QueueFilter>('all')
  const [page, setPage] = useState(1)
  const [filterOpen, setFilterOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const filtered = useMemo(
    () => (filter === 'all' ? items : items.filter((item) => item.priority === filter)),
    [filter, items],
  )

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = filtered.slice(start, start + PAGE_SIZE)
  const from = filtered.length === 0 ? 0 : start + 1
  const to = start + visible.length

  useEffect(() => {
    setPage(1)
  }, [filter, items.length])

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
    <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <div className="flex shrink-0 items-center justify-between gap-3 px-4 py-3 sm:px-5">
        <div className="flex min-w-0 items-center gap-2">
          <h2 className="truncate text-[16px] font-bold text-[#1c2a4e]">{t('toValidate.listTitle')}</h2>
          <span className="inline-flex min-w-6 items-center justify-center rounded-full bg-[#d9e8fb] px-2 py-0.5 text-[12px] font-bold text-[#1d4f9a]">
            {filtered.length}
          </span>
        </div>

        <div ref={menuRef} className="relative">
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] transition-colors hover:bg-[#eef5fc] hover:text-[#1d4f9a]"
            aria-label={t('toValidate.filter')}
            aria-expanded={filterOpen}
            onClick={() => setFilterOpen((current) => !current)}
          >
            <FilterIcon className="size-4" />
          </button>
          {filterOpen ? (
            <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-[#e4ecf6] bg-white py-1 shadow-[0_8px_24px_rgba(28,42,78,0.12)]">
              {FILTERS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  className={cn(
                    'flex w-full cursor-pointer px-3 py-2 text-left text-[13px] font-medium',
                    filter === option.value
                      ? 'bg-[#eef5fc] text-[#1d4f9a]'
                      : 'text-[#1c2a4e] hover:bg-[#f7fafc]',
                  )}
                  onClick={() => {
                    setFilter(option.value)
                    setFilterOpen(false)
                  }}
                >
                  {t(option.labelKey)}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <table className="w-full table-fixed border-collapse text-left">
          <thead className="sticky top-0 bg-white">
            <tr className="border-y border-[#eef3f9] text-[12px] font-semibold text-[#8b95a8]">
              <th className="w-[42%] px-3 py-2.5 font-semibold sm:w-[28%] sm:px-4">
                {t('toValidate.columns.dossier')}
              </th>
              <th className="hidden w-[16%] px-2 py-2.5 font-semibold sm:table-cell">
                {t('toValidate.columns.type')}
              </th>
              <th className="hidden w-[18%] px-2 py-2.5 font-semibold md:table-cell">
                {t('toValidate.columns.reason')}
              </th>
              <th className="w-[16%] px-2 py-2.5 font-semibold sm:w-[12%]">
                {t('toValidate.columns.priority')}
              </th>
              <th className="w-[22%] px-2 py-2.5 font-semibold sm:w-[14%]">
                {t('toValidate.columns.deadline')}
              </th>
              <th className="hidden w-[14%] px-3 py-2.5 font-semibold lg:table-cell">
                {t('toValidate.columns.status')}
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-[13px] font-medium text-[#8b95a8]">
                  {t(items.length === 0 ? 'toValidate.empty' : 'toValidate.emptyFilter')}
                </td>
              </tr>
            ) : (
              visible.map((item) => {
                const selected = item.id === selectedId
                const days = remainingDays(item.deadlineAt)
                const remainingLabel =
                  days === 1
                    ? t('toValidate.remainingOne')
                    : interpolate(t('toValidate.remainingMany'), { count: days })
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
                      'cursor-pointer border-b border-[#f3f6fb] transition-colors',
                      selected
                        ? 'bg-[#eef5fc] shadow-[inset_3px_0_0_#2860B9]'
                        : 'hover:bg-[#f7fafc]',
                    )}
                  >
                    <td className="min-w-0 px-3 py-3 sm:px-4">
                      <div className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={cn(
                            'grid size-8 shrink-0 place-items-center rounded-full text-[11px] font-bold sm:size-9 sm:text-[12px]',
                            avatarTone(item.employeeName),
                          )}
                        >
                          {initials(item.employeeName)}
                        </span>
                        <span className="min-w-0">
                          <span
                            className="block truncate text-[13px] font-semibold text-[#1c2a4e]"
                            title={item.employeeName}
                          >
                            {item.employeeName}
                          </span>
                          <span
                            className="mt-0.5 block truncate text-[12px] text-[#6d7b93]"
                            title={item.companyName}
                          >
                            {item.companyName}
                          </span>
                          <span
                            className="mt-0.5 block truncate text-[11px] text-[#8b95a8] sm:hidden"
                            title={`${typeLabel} · ${reasonLabel}`}
                          >
                            {typeLabel}
                            <span className="px-1">·</span>
                            {reasonLabel}
                          </span>
                        </span>
                      </div>
                    </td>
                    <td className="hidden min-w-0 px-2 py-3 sm:table-cell">
                      <span className="block truncate text-[13px] text-[#1c2a4e]" title={typeLabel}>
                        {typeLabel}
                      </span>
                    </td>
                    <td className="hidden min-w-0 px-2 py-3 md:table-cell">
                      <span className="block truncate text-[13px] text-[#1c2a4e]" title={reasonLabel}>
                        {reasonLabel}
                      </span>
                    </td>
                    <td className="min-w-0 px-2 py-3">
                      <span className="inline-flex max-w-full items-center gap-1.5 text-[13px] font-medium text-[#1c2a4e]">
                        <span className={cn('size-2 shrink-0 rounded-full', PRIORITY_DOT[item.priority])} />
                        <span className="truncate" title={priorityLabel}>
                          {priorityLabel}
                        </span>
                      </span>
                    </td>
                    <td className="min-w-0 px-2 py-3">
                      <span className="block truncate text-[13px] font-medium tabular-nums text-[#1c2a4e]">
                        {formatDate(item.deadlineAt, locale)}
                      </span>
                      <span
                        className={cn(
                          'mt-0.5 block truncate text-[12px] font-semibold tabular-nums',
                          days <= 2 ? 'text-[#e54848]' : 'text-[#8b95a8]',
                        )}
                      >
                        {remainingLabel}
                      </span>
                    </td>
                    <td className="hidden min-w-0 px-3 py-3 lg:table-cell">
                      <span className="inline-flex max-w-full truncate rounded-full bg-[#fff1e4] px-2 py-1 text-[11px] font-semibold text-[#ea7a1a]">
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

      <div className="flex shrink-0 flex-col gap-2 border-t border-[#eef3f9] px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
        <p className="min-w-0 truncate text-[12px] font-medium text-[#8b95a8]">
          {interpolate(t('toValidate.range'), { from, to, total: filtered.length })}
        </p>
        <nav className="flex items-center gap-1" aria-label={t('toValidate.listTitle')}>
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] transition-colors hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('toValidate.prevPage')}
            disabled={currentPage <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            <ChevronLeftIcon />
          </button>
          {Array.from({ length: pageCount }, (_, index) => {
            const number = index + 1
            const active = number === currentPage
            return (
              <button
                key={number}
                type="button"
                aria-label={interpolate(t('toValidate.page'), { page: number })}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'grid size-8 cursor-pointer place-items-center rounded-lg text-[13px] font-semibold transition-colors',
                  active
                    ? 'bg-[#2860B9] text-white'
                    : 'text-[#5b6b82] hover:bg-[#eef5fc]',
                )}
                onClick={() => setPage(number)}
              >
                {number}
              </button>
            )
          })}
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] transition-colors hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('toValidate.nextPage')}
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
