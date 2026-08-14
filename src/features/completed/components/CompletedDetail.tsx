import { useEffect, useState, type ReactNode } from 'react'
import { Timeline, TimelineItem } from '@/components/ui'
import { BrandMark } from '@/components/brand/BrandLogo'
import { visitLabel } from '@/features/dashboard/format'
import { DownloadIcon } from '@/features/dossiers/components/DossierIcons'
import { formatStamp, interpolate } from '@/features/dossiers/format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import {
  DOC_TITLE_KEYS,
  formatDateTimeCompact,
  formatFileSize,
  HISTORY_KEYS,
  PROCESS_KEYS,
} from '../format'
import type { CompletedDocument, CompletedItem } from '../types'
import {
  DocxFileIcon,
  EyeIcon,
  MailFileIcon,
  PdfExportIcon,
  PdfFileIcon,
  ShareIcon,
  StepCheckIcon,
  WordExportIcon,
} from './CompletedIcons'

type DetailTab = 'detail' | 'history'

interface CompletedDetailProps {
  item: CompletedItem | null
  onPreview: () => void
  onExportPdf: () => void
  onExportWord: () => void
  onShare: () => void
  onViewDocument: (name: string) => void
  onDownloadDocument: (name: string) => void
}

export function CompletedDetail({
  item,
  onPreview,
  onExportPdf,
  onExportWord,
  onShare,
  onViewDocument,
  onDownloadDocument,
}: CompletedDetailProps) {
  const { t } = useI18n()
  const [tab, setTab] = useState<DetailTab>('detail')

  useEffect(() => {
    setTab('detail')
  }, [item?.id])

  if (!item) {
    return (
      <section className="flex min-h-[280px] flex-1 items-center justify-center rounded-2xl bg-white px-6 text-center text-[14px] font-medium text-[#6d7b93] shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
        {t('completed.emptySelection')}
      </section>
    )
  }

  return (
    <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <header className="flex shrink-0 items-start justify-between gap-3 px-4 pt-4 sm:px-5">
        <h2 className="text-[16px] font-bold text-[#1c2a4e]">{t('completed.detailTitle')}</h2>
        <span className="inline-flex rounded-full bg-[#e7f8ee] px-2.5 py-0.5 text-[11px] font-semibold text-[#15803d]">
          {t('completed.statusCompleted')}
        </span>
      </header>

      <nav className="mt-3 flex shrink-0 gap-1 border-b border-[#eef3f9] px-2 sm:px-3" aria-label={t('completed.detailTitle')}>
        <TabButton selected={tab === 'detail'} onClick={() => setTab('detail')}>
          {t('completed.detailTab')}
        </TabButton>
        <TabButton selected={tab === 'history'} onClick={() => setTab('history')}>
          {t('completed.historyTitle')}
          <span className="ml-1.5 rounded-full bg-[#eef3f9] px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-[#5b6b82]">
            {item.history.length}
          </span>
        </TabButton>
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        {tab === 'detail' ? (
          <DetailPane
            item={item}
            onPreview={onPreview}
            onExportPdf={onExportPdf}
            onExportWord={onExportWord}
            onShare={onShare}
            onViewDocument={onViewDocument}
            onDownloadDocument={onDownloadDocument}
          />
        ) : (
          <HistoryPane item={item} />
        )}
      </div>
    </section>
  )
}

function TabButton({
  selected,
  onClick,
  children,
}: {
  selected: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={selected}
      onClick={onClick}
      className={cn(
        'flex shrink-0 cursor-pointer items-center border-b-2 px-3 py-2.5 text-[13px] font-semibold transition-colors duration-200',
        selected
          ? 'border-[#1d4f9a] text-[#1d4f9a]'
          : 'border-transparent text-[#5b6b82] hover:text-[#1c2a4e]',
      )}
    >
      {children}
    </button>
  )
}

function DetailPane({
  item,
  onPreview,
  onExportPdf,
  onExportWord,
  onShare,
  onViewDocument,
  onDownloadDocument,
}: {
  item: CompletedItem
  onPreview: () => void
  onExportPdf: () => void
  onExportWord: () => void
  onShare: () => void
  onViewDocument: (name: string) => void
  onDownloadDocument: (name: string) => void
}) {
  const { t, locale } = useI18n()
  const created = formatStamp(item.createdAt, locale)

  return (
    <>
      <div className="flex items-center gap-3">
        <BrandMark size="md" />
        <div className="min-w-0">
          <p className="truncate text-[15px] font-bold text-[#1c2a4e]">{item.reference}</p>
          <p className="mt-0.5 truncate text-[12px] text-[#8b95a8]">
            {interpolate(t('completed.createdAt'), { date: created.date, time: created.time })}
          </p>
        </div>
      </div>

      <dl className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <InfoItem label={t('completed.columns.employee')} value={item.employeeName} />
        <InfoItem label={t('completed.columns.company')} value={item.companyName} />
        <InfoItem label={t('completed.columns.visitType')} value={visitLabel(item.visitType, t)} />
        <InfoItem
          label={t('completed.columns.completedAt')}
          value={formatDateTimeCompact(item.completedAt, locale)}
        />
      </dl>

      <section className="mt-5">
        <h3 className="text-[13px] font-bold text-[#1c2a4e]">{t('completed.processTitle')}</h3>
        <ol className="mt-3">
          {item.process.map((step, index) => {
            const last = index === item.process.length - 1
            return (
              <li key={step.key} className="flex gap-3">
                <div className="flex w-5 shrink-0 flex-col items-center">
                  <StepCheckIcon className="size-5" />
                  {last ? null : <span className="mt-1 min-h-4 w-px flex-1 bg-[#bbf7d0]" />}
                </div>
                <div className={cn('flex min-w-0 flex-1 items-start justify-between gap-3', last ? 'pb-0' : 'pb-3')}>
                  <p className="text-[13px] font-semibold text-[#1c2a4e]">{t(PROCESS_KEYS[step.key])}</p>
                  <p className="shrink-0 text-right text-[12px] tabular-nums text-[#8b95a8]">
                    {formatDateTimeCompact(step.at, locale)}
                  </p>
                </div>
              </li>
            )
          })}
        </ol>
      </section>

      <section className="mt-5 rounded-xl border border-[#eef3f9] px-3 py-3">
        <h3 className="text-[13px] font-bold text-[#1c2a4e]">
          {interpolate(t('completed.documentsTitle'), { count: item.documents.length })}
        </h3>
        <ul className="mt-2 divide-y divide-[#eef3f9]">
          {item.documents.map((document) => (
            <li key={document.id} className="flex items-center gap-3 py-2.5 first:pt-1 last:pb-0">
              <FileKindIcon document={document} />
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13px] font-semibold text-[#1c2a4e]">
                  {t(DOC_TITLE_KEYS[document.title])}
                </p>
                <p className="mt-0.5 truncate text-[12px] text-[#6d7b93]" title={document.name}>
                  {document.name}
                </p>
                <p className="mt-0.5 text-[12px] text-[#8b95a8]">
                  {document.kind}
                  <span className="px-1">-</span>
                  {formatFileSize(document.bytes, locale)}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-0.5">
                <button
                  type="button"
                  className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#2860B9] transition-colors hover:bg-[#eef5fc]"
                  aria-label={t('completed.viewDocument')}
                  onClick={() => onViewDocument(document.name)}
                >
                  <EyeIcon />
                </button>
                <button
                  type="button"
                  className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#2860B9] transition-colors hover:bg-[#eef5fc]"
                  aria-label={t('completed.downloadDocument')}
                  onClick={() => onDownloadDocument(document.name)}
                >
                  <DownloadIcon />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-5">
        <h3 className="text-[13px] font-bold text-[#1c2a4e]">{t('completed.actionsTitle')}</h3>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <ActionButton icon={<EyeIcon />} label={t('completed.actions.preview')} onClick={onPreview} />
          <ActionButton icon={<PdfExportIcon />} label={t('completed.actions.exportPdf')} onClick={onExportPdf} />
          <ActionButton icon={<WordExportIcon />} label={t('completed.actions.exportWord')} onClick={onExportWord} />
          <ActionButton icon={<ShareIcon />} label={t('completed.actions.share')} onClick={onShare} />
        </div>
      </section>
    </>
  )
}

function HistoryPane({ item }: { item: CompletedItem }) {
  const { t, locale } = useI18n()

  if (item.history.length === 0) {
    return <p className="py-8 text-center text-[13px] font-medium text-[#8b95a8]">{t('completed.historyEmpty')}</p>
  }

  return (
    <Timeline>
      {item.history.map((event, index) => (
        <TimelineItem key={event.id} last={index === item.history.length - 1}>
          <p className="text-[13px] font-semibold text-[#1c2a4e]">{t(HISTORY_KEYS[event.kind])}</p>
          <p className="mt-0.5 text-[12px] text-[#6d7b93]">{event.actorName}</p>
          <p className="mt-0.5 text-[12px] tabular-nums text-[#8b95a8]">
            {formatDateTimeCompact(event.at, locale)}
          </p>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

function InfoItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="text-[11px] font-semibold text-[#8b95a8]">{label}</dt>
      <dd className="mt-0.5 truncate text-[13px] font-semibold text-[#1c2a4e]" title={value}>
        {value}
      </dd>
    </div>
  )
}

function FileKindIcon({ document }: { document: CompletedDocument }) {
  if (document.title === 'email' || document.kind === 'HTML') {
    return <MailFileIcon />
  }
  if (document.kind === 'DOCX') {
    return <DocxFileIcon />
  }
  return <PdfFileIcon />
}

function ActionButton({
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
      className="inline-flex h-10 cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-[#d9e8fb] bg-white px-2 text-[12px] font-semibold text-[#1d4f9a] transition-colors duration-200 hover:bg-[#eef5fc] active:scale-[0.98]"
    >
      {icon}
      {label}
    </button>
  )
}
