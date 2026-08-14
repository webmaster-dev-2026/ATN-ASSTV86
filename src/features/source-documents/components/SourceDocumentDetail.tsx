import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Timeline, TimelineItem } from '@/components/ui'
import { formatDate, formatStamp, interpolate } from '@/features/dossiers/format'
import { useI18n, type TranslationKey } from '@/i18n'
import { cn } from '@/lib/cn'
import { HISTORY_LABEL, STATUS_BADGE, STATUS_LABEL } from '../format'
import type { SourceDocTab, SourceDocument } from '../types'
import { SourceDocumentPreview } from './SourceDocumentPreview'
import { SourceFileTypeIcon } from './SourceFileTypeIcon'
import {
  ArrowRightIcon,
  DownloadIcon,
  ExternalLinkIcon,
  MoreVerticalIcon,
  RepeatIcon,
} from './SourceDocumentIcons'

const TABS: Array<{ id: SourceDocTab; labelKey: TranslationKey }> = [
  { id: 'preview', labelKey: 'sourceDocuments.tabs.preview' },
  { id: 'history', labelKey: 'sourceDocuments.tabs.history' },
]

interface SourceDocumentDetailProps {
  item: SourceDocument | null
  onOpen: () => void
  onDownload: () => void
  onReanalyse: () => void
}

export function SourceDocumentDetail({ item, onOpen, onDownload, onReanalyse }: SourceDocumentDetailProps) {
  const { t, locale } = useI18n()
  const [tab, setTab] = useState<SourceDocTab>('preview')
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setTab('preview')
    setMenuOpen(false)
  }, [item?.id])

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  if (!item) {
    return (
      <section className="flex min-h-[240px] flex-1 items-center justify-center rounded-2xl bg-white px-6 text-center text-[14px] font-medium text-[#6d7b93] shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
        {t('sourceDocuments.emptySelection')}
      </section>
    )
  }

  const stamp = formatStamp(item.uploadedAt, locale, 'h')

  return (
    <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        <header className="flex items-start gap-3">
          <SourceFileTypeIcon type={item.fileKind} className="size-11 p-2" />
          <div className="min-w-0 flex-1">
            <div className="flex items-start justify-between gap-2">
              <h2 className="truncate text-[15px] font-bold text-[#1c2a4e]" title={item.fileName}>
                {item.fileName}
              </h2>
              <span className={cn('shrink-0 rounded-full px-2 py-0.5 text-[11px] font-semibold', STATUS_BADGE[item.status])}>
                {t(STATUS_LABEL[item.status])}
              </span>
            </div>
            <p className="mt-0.5 truncate text-[12px] text-[#6d7b93]">
              {item.companyName}
              <span className="px-1 text-[#c5d0de]">·</span>
              {item.uploadedBy}
            </p>
            <p className="mt-1 text-[12px] tabular-nums text-[#8b95a8]">
              {interpolate(t('sourceDocuments.uploadedMeta'), {
                date: stamp.date,
                time: stamp.time,
                size: item.fileSizeLabel,
              })}
            </p>
          </div>
        </header>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg bg-[#2860B9] px-3 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-[#1f529e]"
            onClick={onOpen}
          >
            <ExternalLinkIcon className="size-3.5" />
            {t('sourceDocuments.open')}
          </button>
          <button
            type="button"
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[#c5d4ea] bg-white px-3 text-[13px] font-semibold text-[#1c2a4e] transition-colors duration-200 hover:bg-[#eef5fc]"
            onClick={onDownload}
          >
            <DownloadIcon className="size-3.5" />
            {t('sourceDocuments.download')}
          </button>
          <button
            type="button"
            className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[#c5d4ea] bg-white px-3 text-[13px] font-semibold text-[#1c2a4e] transition-colors duration-200 hover:bg-[#eef5fc]"
            onClick={onReanalyse}
          >
            <RepeatIcon className="size-3.5" />
            {t('sourceDocuments.reanalyse')}
          </button>
          <div className="relative ml-auto" ref={menuRef}>
            <button
              type="button"
              className="grid size-9 cursor-pointer place-items-center rounded-lg border border-[#e4ecf6] text-[#5b6b82] transition-colors duration-200 hover:bg-[#f7fafc]"
              aria-label={t('sourceDocuments.columns.actions')}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((current) => !current)}
            >
              <MoreVerticalIcon />
            </button>
            {menuOpen ? (
              <div className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-[#e4ecf6] bg-white py-1 shadow-[0_8px_24px_rgba(28,42,78,0.12)]">
                <Link
                  to="/dossiers"
                  className="flex w-full px-3 py-2 text-left text-[13px] font-medium text-[#1c2a4e] hover:bg-[#f7fafc]"
                  onClick={() => setMenuOpen(false)}
                >
                  {t('sourceDocuments.viewDetails')}
                </Link>
              </div>
            ) : null}
          </div>
        </div>

        <div className="mt-4 flex gap-4 border-b border-[#eef3f9]">
          {TABS.map((entry) => {
            const active = tab === entry.id
            return (
              <button
                key={entry.id}
                type="button"
                className={cn(
                  'cursor-pointer border-b-2 pb-2 text-[13px] font-semibold transition-colors duration-200',
                  active
                    ? 'border-[#2860B9] text-[#2860B9]'
                    : 'border-transparent text-[#6d7b93] hover:text-[#1c2a4e]',
                )}
                onClick={() => setTab(entry.id)}
              >
                {t(entry.labelKey)}
              </button>
            )
          })}
        </div>

        <div className="mt-4">
          {tab === 'preview' ? <SourceDocumentPreview document={item} /> : null}

          {tab === 'history' ? (
            <Timeline>
              {item.history.map((event, index) => (
                <TimelineItem key={event.id} last={index === item.history.length - 1}>
                  <p className="text-[13px] font-semibold text-[#1c2a4e]">{event.actorName}</p>
                  <p className="mt-0.5 text-[12px] tabular-nums text-[#8b95a8]">
                    {formatDate(event.at, locale)} {formatStamp(event.at, locale, 'h').time}
                  </p>
                  <p className="mt-1 text-[12px] leading-5 text-[#5b6b82]">{t(HISTORY_LABEL[event.kind])}</p>
                </TimelineItem>
              ))}
            </Timeline>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 justify-end border-t border-[#eef3f9] px-4 py-3">
        <Link
          to="/dossiers"
          className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#2860B9] transition-colors duration-200 hover:text-[#1f529e]"
        >
          {t('sourceDocuments.viewDetails')}
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>
    </section>
  )
}
