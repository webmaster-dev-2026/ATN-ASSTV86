import { useEffect, useState, type CSSProperties } from 'react'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { formatDate, interpolate } from '@/features/dossiers/format'
import { useI18n, type Locale } from '@/i18n'
import type { SourceDocument } from '../types'
import { ChevronLeftIcon, ChevronRightIcon, MaximizeIcon, MinusIcon, PlusIcon } from './SourceDocumentIcons'

const ZOOM_MIN = 75
const ZOOM_MAX = 150
const ZOOM_STEP = 25

interface SourceDocumentPreviewProps {
  document: SourceDocument
}

export function SourceDocumentPreview({ document }: SourceDocumentPreviewProps) {
  const { t, locale } = useI18n()
  const [zoom, setZoom] = useState(100)
  const [page, setPage] = useState(1)
  const [expanded, setExpanded] = useState(false)
  const totalPages = Math.max(1, document.pages)

  useEffect(() => {
    setPage(1)
    setZoom(100)
    setExpanded(false)
  }, [document.id])

  useEffect(() => {
    if (!expanded) {
      return
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setExpanded(false)
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [expanded])

  const viewer = (
    <div className="flex h-full min-h-0 flex-col overflow-hidden rounded-xl border border-[#e4ecf6] bg-[#eef3f9]">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#e4ecf6] bg-white px-2 py-1.5">
        <div className="flex items-center gap-1 text-[12px] font-semibold tabular-nums text-[#1c2a4e]">
          <button
            type="button"
            className="grid size-7 cursor-pointer place-items-center rounded-md text-[#5b6b82] hover:bg-[#eef3f9] disabled:opacity-40"
            aria-label={t('sourceDocuments.prevPage')}
            disabled={page <= 1}
            onClick={() => setPage((value) => Math.max(1, value - 1))}
          >
            <ChevronLeftIcon className="size-3.5" />
          </button>
          <span>
            {interpolate(t('sourceDocuments.viewer.page'), { current: page, total: totalPages })}
          </span>
          <button
            type="button"
            className="grid size-7 cursor-pointer place-items-center rounded-md text-[#5b6b82] hover:bg-[#eef3f9] disabled:opacity-40"
            aria-label={t('sourceDocuments.nextPage')}
            disabled={page >= totalPages}
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
          >
            <ChevronRightIcon className="size-3.5" />
          </button>
        </div>
        <div className="flex items-center gap-0.5">
          <button
            type="button"
            className="grid size-7 cursor-pointer place-items-center rounded-md text-[#5b6b82] hover:bg-[#eef3f9] disabled:opacity-40"
            aria-label={t('sourceDocuments.viewer.zoomOut')}
            disabled={zoom <= ZOOM_MIN}
            onClick={() => setZoom((value) => Math.max(ZOOM_MIN, value - ZOOM_STEP))}
          >
            <MinusIcon className="size-3.5" />
          </button>
          <span className="min-w-[3rem] text-center text-[12px] font-semibold tabular-nums text-[#1c2a4e]">
            {interpolate(t('sourceDocuments.viewer.zoom'), { value: zoom })}
          </span>
          <button
            type="button"
            className="grid size-7 cursor-pointer place-items-center rounded-md text-[#5b6b82] hover:bg-[#eef3f9] disabled:opacity-40"
            aria-label={t('sourceDocuments.viewer.zoomIn')}
            disabled={zoom >= ZOOM_MAX}
            onClick={() => setZoom((value) => Math.min(ZOOM_MAX, value + ZOOM_STEP))}
          >
            <PlusIcon className="size-3.5" />
          </button>
          <button
            type="button"
            className="grid size-7 cursor-pointer place-items-center rounded-md text-[#5b6b82] hover:bg-[#eef3f9]"
            aria-label={t('sourceDocuments.viewer.fullscreen')}
            aria-pressed={expanded}
            onClick={() => setExpanded((current) => !current)}
          >
            <MaximizeIcon className="size-3.5" />
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto px-2 py-2">
        <div className="mx-auto w-full max-w-[420px]" style={{ zoom: zoom / 100 } as CSSProperties}>
          <PreviewPaper document={document} page={page} locale={locale} />
        </div>
      </div>
    </div>
  )

  if (!expanded) {
    return viewer
  }

  return (
    <div className="fixed inset-3 z-50 flex flex-col rounded-2xl bg-white p-3 shadow-[0_16px_48px_rgba(28,42,78,0.18)]">
      {viewer}
    </div>
  )
}

function PreviewPaper({
  document,
  page,
  locale,
}: {
  document: SourceDocument
  page: number
  locale: Locale
}) {
  const { t } = useI18n()

  return (
    <article className="overflow-hidden rounded-sm bg-[#fffdf8] px-3 py-3 shadow-[0_12px_28px_rgba(28,42,78,0.12)] ring-1 ring-[#d5deea]">
      <div className="flex items-start justify-between gap-3 border-b border-[#d7e1ef] pb-2">
        <BrandLogo tone="dark" size="sm" />
        <p className="text-right text-[10px] font-semibold text-[#8b95a8]">{document.dossierReference}</p>
      </div>

      <p className="mt-2 text-[10px] font-bold tracking-wide text-[#1d4f9a]">{t('sourceDocuments.paper.center')}</p>
      <h4 className="mt-0.5 text-[15px] font-bold leading-tight text-[#1c2a4e]">
        {t('sourceDocuments.paper.title')}
      </h4>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-2 text-[11px]">
        <div>
          <dt className="font-semibold text-[#8b95a8]">{t('sourceDocuments.paper.employee')}</dt>
          <dd className="mt-0.5 border-b border-dotted border-[#c5cedb] pb-1 font-semibold text-[#1c2a4e]">
            {document.employeeName}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-[#8b95a8]">{t('sourceDocuments.paper.company')}</dt>
          <dd className="mt-0.5 border-b border-dotted border-[#c5cedb] pb-1 font-semibold text-[#1c2a4e]">
            {document.companyName}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-[#8b95a8]">{t('sourceDocuments.paper.date')}</dt>
          <dd className="mt-0.5 border-b border-dotted border-[#c5cedb] pb-1 font-semibold tabular-nums text-[#1c2a4e]">
            {formatDate(document.uploadedAt, locale)}
          </dd>
        </div>
        <div>
          <dt className="font-semibold text-[#8b95a8]">{t('sourceDocuments.paper.doctor')}</dt>
          <dd className="mt-0.5 border-b border-dotted border-[#c5cedb] pb-1 font-semibold text-[#1c2a4e]">
            {t('sourceDocuments.paper.doctorName')}
          </dd>
        </div>
      </dl>

      <section className="mt-3 rounded-sm border border-[#cfe6d6] bg-[#f3faf5] px-2.5 py-2">
        <p className="text-[11px] font-bold text-[#15803d]">{t('sourceDocuments.paper.conclusion')}</p>
        <p className="mt-1 text-[11px] leading-5 text-[#1c2a4e]">
          {page === 1 ? t('sourceDocuments.paper.conclusionBody') : t('sourceDocuments.paper.annex')}
        </p>
      </section>
    </article>
  )
}
