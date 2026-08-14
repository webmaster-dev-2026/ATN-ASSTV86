import { useEffect, useRef, useState } from 'react'
import { formatDate, interpolate } from '@/features/dossiers/format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { FILE_KIND_BADGE, FILE_KIND_LABEL, STATUS_BADGE, STATUS_LABEL, pageNumbers } from '../format'
import type { SourceDocument } from '../types'
import { SourceFileTypeIcon } from './SourceFileTypeIcon'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreVerticalIcon,
  SortDownIcon,
} from './SourceDocumentIcons'

const PAGE_SIZE = 8

interface SourceDocumentTableProps {
  items: SourceDocument[]
  selectedId: string | null
  onSelect: (id: string) => void
  onOpen: (id: string) => void
  onDownload: (id: string) => void
  onReanalyse: (id: string) => void
}

export function SourceDocumentTable({
  items,
  selectedId,
  onSelect,
  onOpen,
  onDownload,
  onReanalyse,
}: SourceDocumentTableProps) {
  const { t, locale } = useI18n()
  const [page, setPage] = useState(1)
  const [menuId, setMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const pageCount = Math.max(1, Math.ceil(items.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * PAGE_SIZE
  const visible = items.slice(start, start + PAGE_SIZE)

  useEffect(() => {
    setPage(1)
  }, [items])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuId(null)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return (
    <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <div className="flex shrink-0 items-center px-4 py-3 sm:px-5">
        <h2 className="truncate text-[16px] font-bold text-[#1c2a4e]">
          {interpolate(t('sourceDocuments.listTitle'), { count: items.length })}
        </h2>
      </div>

      <div className="min-h-0 min-w-0 flex-1 overflow-auto">
        <table className="w-full min-w-[860px] border-collapse text-left">
          <thead className="sticky top-0 bg-white">
            <tr className="border-y border-[#eef3f9] text-[12px] font-semibold text-[#8b95a8]">
              <th className="w-10 px-3 py-2.5">
                <span className="sr-only">{t('sourceDocuments.columns.select')}</span>
              </th>
              <th className="px-3 py-2.5 font-semibold">{t('sourceDocuments.columns.name')}</th>
              <th className="px-3 py-2.5 font-semibold">{t('sourceDocuments.columns.source')}</th>
              <th className="px-3 py-2.5 font-semibold">{t('sourceDocuments.columns.fileType')}</th>
              <th className="px-3 py-2.5 font-semibold">
                <span className="inline-flex items-center gap-1">
                  {t('sourceDocuments.columns.uploadedAt')}
                  <SortDownIcon className="text-[#8b95a8]" />
                </span>
              </th>
              <th className="px-3 py-2.5 font-semibold">{t('sourceDocuments.columns.status')}</th>
              <th className="w-10 px-3 py-2.5">
                <span className="sr-only">{t('sourceDocuments.columns.actions')}</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {visible.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-12 text-center text-[13px] font-medium text-[#8b95a8]">
                  {t('sourceDocuments.emptyFilter')}
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
                      selected ? 'bg-[#e8f1fc]' : 'hover:bg-[#f7fafc]',
                    )}
                  >
                    <td className="px-3 py-3">
                      <input
                        type="checkbox"
                        checked={selected}
                        onChange={() => onSelect(item.id)}
                        onClick={(event) => event.stopPropagation()}
                        className="size-4 cursor-pointer accent-[#2860B9]"
                        aria-label={item.fileName}
                      />
                    </td>
                    <td className="min-w-0 px-3 py-3">
                      <span className="flex min-w-0 items-center gap-2.5">
                        <SourceFileTypeIcon type={item.fileKind} />
                        <span className="min-w-0 truncate text-[13px] font-semibold text-[#1c2a4e]" title={item.fileName}>
                          {item.fileName}
                        </span>
                      </span>
                    </td>
                    <td className="min-w-0 px-3 py-3">
                      <span className="block truncate text-[13px] font-semibold text-[#1c2a4e]">{item.companyName}</span>
                      <span className="mt-0.5 block truncate text-[12px] text-[#6d7b93]">{item.uploadedBy}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn('inline-flex rounded-md px-2 py-0.5 text-[11px] font-bold', FILE_KIND_BADGE[item.fileKind])}>
                        {t(FILE_KIND_LABEL[item.fileKind])}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <span className="text-[13px] tabular-nums text-[#1c2a4e]">{formatDate(item.uploadedAt, locale)}</span>
                    </td>
                    <td className="px-3 py-3">
                      <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold', STATUS_BADGE[item.status])}>
                        {t(STATUS_LABEL[item.status])}
                      </span>
                    </td>
                    <td className="px-2 py-3">
                      <div className="relative" ref={menuId === item.id ? menuRef : undefined}>
                        <button
                          type="button"
                          className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] transition-colors duration-200 hover:bg-white hover:text-[#1d4f9a]"
                          aria-label={t('sourceDocuments.columns.actions')}
                          aria-expanded={menuId === item.id}
                          onClick={(event) => {
                            event.stopPropagation()
                            setMenuId((current) => (current === item.id ? null : item.id))
                          }}
                        >
                          <MoreVerticalIcon />
                        </button>
                        {menuId === item.id ? (
                          <div className="absolute right-0 top-9 z-20 w-44 rounded-xl border border-[#e4ecf6] bg-white py-1 shadow-[0_8px_24px_rgba(28,42,78,0.12)]">
                            <MenuButton
                              label={t('sourceDocuments.open')}
                              onClick={() => {
                                onOpen(item.id)
                                setMenuId(null)
                              }}
                            />
                            <MenuButton
                              label={t('sourceDocuments.download')}
                              onClick={() => {
                                onDownload(item.id)
                                setMenuId(null)
                              }}
                            />
                            <MenuButton
                              label={t('sourceDocuments.reanalyse')}
                              onClick={() => {
                                onReanalyse(item.id)
                                setMenuId(null)
                              }}
                            />
                          </div>
                        ) : null}
                      </div>
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
          {interpolate(t('sourceDocuments.range'), {
            from: items.length === 0 ? 0 : start + 1,
            to: start + visible.length,
            total: items.length,
          })}
        </p>
        <nav className="flex flex-wrap items-center gap-1" aria-label={t('sourceDocuments.listNav')}>
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] transition-colors duration-200 hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={t('sourceDocuments.prevPage')}
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
            aria-label={t('sourceDocuments.nextPage')}
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

function MenuButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      className="flex w-full cursor-pointer px-3 py-2 text-left text-[13px] font-medium text-[#1c2a4e] hover:bg-[#f7fafc]"
      onClick={onClick}
    >
      {label}
    </button>
  )
}
