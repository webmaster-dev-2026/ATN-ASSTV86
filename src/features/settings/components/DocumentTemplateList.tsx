import { useEffect, useRef, useState, type ReactNode } from 'react'
import { formatDate, interpolate } from '@/features/dossiers/format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import {
  pageNumbers,
  TEMPLATE_DESCRIPTION,
  TEMPLATE_NAME,
  TEMPLATE_STATUS_LABEL,
  TEMPLATE_STATUS_STYLE,
  TEMPLATE_TONE,
} from '../format'
import type { DocumentTemplate } from '../types'
import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  CopyIcon,
  EyeIcon,
  MoreVerticalIcon,
  PencilIcon,
  PlusIcon,
  TemplateKindIcon,
} from './SettingsIcons'

const PAGE_SIZES = [10, 25, 50] as const

const selectClass =
  'h-9 cursor-pointer appearance-none rounded-lg border border-[#e4ecf6] bg-white py-0 pl-3 pr-8 text-[13px] font-medium text-[#1c2a4e] transition-colors duration-200 hover:border-[#c5d4ea] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 [&::-ms-expand]:hidden'

interface DocumentTemplateListProps {
  items: DocumentTemplate[]
  onAdd: () => void
  onPreview: (item: DocumentTemplate) => void
  onEdit: (item: DocumentTemplate) => void
  onDuplicate: (item: DocumentTemplate) => void
  onArchive: (item: DocumentTemplate) => void
}

export function DocumentTemplateList({
  items,
  onAdd,
  onPreview,
  onEdit,
  onDuplicate,
  onArchive,
}: DocumentTemplateListProps) {
  const { t, locale } = useI18n()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<(typeof PAGE_SIZES)[number]>(10)
  const [menuId, setMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  const pageCount = Math.max(1, Math.ceil(items.length / pageSize))
  const currentPage = Math.min(page, pageCount)
  const start = (currentPage - 1) * pageSize
  const visible = items.slice(start, start + pageSize)

  useEffect(() => {
    setPage(1)
  }, [items, pageSize])

  useEffect(() => {
    if (!menuId) {
      return
    }

    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuId(null)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuId(null)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [menuId])

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(28,42,78,0.04)] sm:p-5">
      <div className="mb-4 flex shrink-0 flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h2 className="font-sans text-[18px] font-bold text-[#1c2a4e]">{t('settings.templates.title')}</h2>
          <p className="mt-1 max-w-[52ch] text-[13px] leading-5 text-[#6d7b93]">
            {t('settings.templates.description')}
          </p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex h-10 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#1d4f9a] px-3.5 text-[13px] font-semibold text-white transition-colors hover:bg-[#17417f] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 active:scale-[0.98]"
        >
          <PlusIcon className="size-3.5" />
          {t('settings.templates.add')}
        </button>
      </div>

      <div className="min-h-0 flex-1 space-y-3 overflow-auto pr-0.5">
        {visible.length === 0 ? (
          <p className="py-12 text-center text-[13px] font-medium text-[#8b95a8]">{t('settings.templates.empty')}</p>
        ) : (
          visible.map((item) => {
            const name = t(TEMPLATE_NAME[item.kind])
            const displayName = item.isCopy
              ? interpolate(t('settings.templates.copyName'), { name })
              : name

            return (
              <article
                key={item.id}
                className="flex items-start gap-3 rounded-2xl border border-[#e8eef6] bg-white p-3.5 transition-colors hover:border-[#d7e3f2] sm:items-center sm:gap-4 sm:p-4"
              >
                <span
                  className={cn(
                    'grid size-12 shrink-0 place-items-center rounded-xl',
                    TEMPLATE_TONE[item.tone],
                  )}
                >
                  <TemplateKindIcon kind={item.kind} className="size-5" />
                </span>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-2">
                    <h3 className="font-sans text-[14px] font-bold text-[#1c2a4e]">{displayName}</h3>
                    <span
                      className={cn(
                        'inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold',
                        TEMPLATE_STATUS_STYLE[item.status],
                      )}
                    >
                      {t(TEMPLATE_STATUS_LABEL[item.status])}
                    </span>
                  </div>
                  <p className="mt-1 text-[13px] leading-5 text-[#6d7b93]">
                    {t(TEMPLATE_DESCRIPTION[item.kind])}
                  </p>
                  <p className="mt-2 flex items-center gap-1.5 text-[12px] text-[#8b95a8]">
                    <CalendarIcon className="text-[#9aa6b8]" />
                    {interpolate(t('settings.templates.updated'), {
                      date: formatDate(item.updatedAt, locale),
                      name: item.updatedBy,
                    })}
                  </p>
                </div>

                <div className="hidden shrink-0 flex-col items-start justify-center gap-1.5 sm:flex">
                  <TemplateAction
                    icon={<EyeIcon />}
                    label={t('settings.templates.preview')}
                    onClick={() => onPreview(item)}
                  />
                  <TemplateAction
                    icon={<PencilIcon />}
                    label={t('settings.templates.edit')}
                    onClick={() => onEdit(item)}
                  />
                  <TemplateAction
                    icon={<CopyIcon />}
                    label={t('settings.templates.duplicate')}
                    onClick={() => onDuplicate(item)}
                  />
                </div>

                <div className="relative shrink-0 self-start sm:self-center" ref={menuId === item.id ? menuRef : undefined}>
                  <button
                    type="button"
                    className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#8b95a8] transition-colors hover:bg-[#eef5fc] hover:text-[#1c2a4e]"
                    aria-label={t('settings.templates.more')}
                    aria-expanded={menuId === item.id}
                    onClick={() => setMenuId((current) => (current === item.id ? null : item.id))}
                  >
                    <MoreVerticalIcon />
                  </button>
                  {menuId === item.id ? (
                    <div className="absolute right-0 top-9 z-10 min-w-[148px] overflow-hidden rounded-xl border border-[#e4ecf6] bg-white py-1 shadow-[0_8px_24px_rgba(28,42,78,0.12)]">
                      <div className="flex flex-col gap-1 px-3 py-1 sm:hidden">
                        <TemplateAction
                          icon={<EyeIcon />}
                          label={t('settings.templates.preview')}
                          onClick={() => {
                            setMenuId(null)
                            onPreview(item)
                          }}
                        />
                        <TemplateAction
                          icon={<PencilIcon />}
                          label={t('settings.templates.edit')}
                          onClick={() => {
                            setMenuId(null)
                            onEdit(item)
                          }}
                        />
                        <TemplateAction
                          icon={<CopyIcon />}
                          label={t('settings.templates.duplicate')}
                          onClick={() => {
                            setMenuId(null)
                            onDuplicate(item)
                          }}
                        />
                      </div>
                      <button
                        type="button"
                        className="flex w-full cursor-pointer px-3 py-2 text-left text-[13px] font-medium text-[#5b6b82] transition-colors hover:bg-[#f7fafc] hover:text-[#1c2a4e]"
                        onClick={() => {
                          setMenuId(null)
                          onArchive(item)
                        }}
                      >
                        {t('settings.templates.archive')}
                      </button>
                    </div>
                  ) : null}
                </div>
              </article>
            )
          })
        )}
      </div>

      <div className="mt-4 flex shrink-0 flex-col gap-2 border-t border-[#eef3f9] pt-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="min-w-0 truncate text-[12px] font-medium text-[#8b95a8]">
          {interpolate(t('settings.templates.range'), {
            from: items.length === 0 ? 0 : start + 1,
            to: start + visible.length,
            total: items.length,
          })}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <nav className="flex flex-wrap items-center gap-1" aria-label={t('settings.templates.listNav')}>
            <button
              type="button"
              className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] transition-colors hover:bg-[#eef5fc] disabled:cursor-not-allowed disabled:opacity-40"
              aria-label={t('settings.templates.prevPage')}
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
              aria-label={t('settings.templates.nextPage')}
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
              aria-label={t('settings.templates.perPageLabel')}
              onChange={(event) => setPageSize(Number(event.target.value) as (typeof PAGE_SIZES)[number])}
            >
              {PAGE_SIZES.map((size) => (
                <option key={size} value={size}>
                  {interpolate(t('settings.templates.perPage'), { count: size })}
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

function TemplateAction({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="inline-flex cursor-pointer items-center gap-1.5 text-[12px] font-semibold text-[#2860B9] transition-colors hover:text-[#1d4f9a]"
    >
      {icon}
      {label}
    </button>
  )
}
