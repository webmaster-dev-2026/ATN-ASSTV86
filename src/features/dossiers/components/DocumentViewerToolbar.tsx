import { useEffect, useState, type ReactNode } from 'react'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { interpolate } from '../format'
import { DownloadIcon, MinusIcon, PlusIcon, PrinterIcon } from './DossierIcons'

interface DocumentViewerToolbarProps {
  zoom: number
  page: number
  pages: number
  canZoomIn: boolean
  canZoomOut: boolean
  onZoomIn: () => void
  onZoomOut: () => void
  onPageChange: (page: number) => void
  onPrint: () => void
  onDownload: () => void
}

function ToolbarButton({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'grid size-7 shrink-0 cursor-pointer place-items-center rounded-md text-[#4a5870] transition-colors duration-200',
        'hover:bg-[#eef3f9] hover:text-[#1c2a4e]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/35',
        'disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-[#4a5870]',
      )}
    >
      {children}
    </button>
  )
}

export function DocumentViewerToolbar({
  zoom,
  page,
  pages,
  canZoomIn,
  canZoomOut,
  onZoomIn,
  onZoomOut,
  onPageChange,
  onPrint,
  onDownload,
}: DocumentViewerToolbarProps) {
  const { t } = useI18n()
  const [pageDraft, setPageDraft] = useState(String(page))

  useEffect(() => {
    setPageDraft(String(page))
  }, [page])

  const commitPage = () => {
    const parsed = Number.parseInt(pageDraft, 10)
    const next = Number.isFinite(parsed) ? Math.min(pages, Math.max(1, parsed)) : page
    setPageDraft(String(next))
    if (next !== page) {
      onPageChange(next)
    }
  }

  return (
    <div
      className="document-toolbar pointer-events-auto inline-flex items-center gap-0.5 rounded-tr-xl bg-white px-1.5 py-1 shadow-[0_-4px_18px_rgba(28,42,78,0.12)] ring-1 ring-[#d5deea] print:hidden"
      role="toolbar"
      aria-label={t('dossiers.viewer.toolbar')}
    >
      <ToolbarButton label={t('dossiers.viewer.zoomOut')} disabled={canZoomOut === false} onClick={onZoomOut}>
        <MinusIcon className="size-3.5" />
      </ToolbarButton>
      <span className="min-w-[2.75rem] px-0.5 text-center text-[12px] font-semibold tabular-nums text-[#1c2a4e]">
        {interpolate(t('dossiers.viewer.zoom'), { value: zoom })}
      </span>
      <ToolbarButton label={t('dossiers.viewer.zoomIn')} disabled={canZoomIn === false} onClick={onZoomIn}>
        <PlusIcon className="size-3.5" />
      </ToolbarButton>

      <span className="mx-1 h-4 w-px bg-[#d5deea]" aria-hidden />

      <div className="flex items-center gap-1 px-1 text-[12px] font-semibold tabular-nums text-[#1c2a4e]">
        <label className="sr-only" htmlFor="document-page-input">
          {t('dossiers.viewer.goToPage')}
        </label>
        <input
          id="document-page-input"
          type="text"
          inputMode="numeric"
          value={pageDraft}
          onChange={(event) => setPageDraft(event.target.value.replace(/[^\d]/g, ''))}
          onBlur={commitPage}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.currentTarget.blur()
            }
            if (event.key === 'ArrowUp') {
              event.preventDefault()
              onPageChange(Math.min(pages, page + 1))
            }
            if (event.key === 'ArrowDown') {
              event.preventDefault()
              onPageChange(Math.max(1, page - 1))
            }
          }}
          className="h-6 w-7 rounded-md border border-transparent bg-transparent text-center text-[12px] font-semibold tabular-nums text-[#1c2a4e] outline-none transition-colors focus:border-[#c5d4e8] focus:bg-white"
          aria-label={t('dossiers.viewer.goToPage')}
        />
        <span className="text-[#8b95a8]">/</span>
        <span>{pages}</span>
      </div>

      <span className="mx-1 h-4 w-px bg-[#d5deea]" aria-hidden />

      <ToolbarButton label={t('dossiers.viewer.print')} onClick={onPrint}>
        <PrinterIcon className="size-3.5" />
      </ToolbarButton>
      <ToolbarButton label={t('dossiers.viewer.download')} onClick={onDownload}>
        <DownloadIcon className="size-3.5" />
      </ToolbarButton>
    </div>
  )
}
