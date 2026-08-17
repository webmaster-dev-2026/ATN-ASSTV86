import { useEffect, useState, type ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Timeline, TimelineItem } from '@/components/ui'
import { visitLabel } from '@/features/dashboard/format'
import { formatDate, formatDateTime, initials, interpolate } from '@/features/dossiers/format'
import { avatarTone } from '@/features/to-validate/format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { HISTORY_LABEL, SEVERITY_BADGE, SEVERITY_LABEL } from '../format'
import type { AnomalyItem, ComparisonSide } from '../types'
import { CheckCircleIcon, FolderIcon, PencilIcon } from './AnomalyIcons'

type DetailTab = 'detail' | 'history'

interface AnomalyDetailProps {
  item: AnomalyItem | null
  onEdit: () => void
  onResolve: () => void
}

export function AnomalyDetail({ item, onEdit, onResolve }: AnomalyDetailProps) {
  const { t } = useI18n()
  const [tab, setTab] = useState<DetailTab>('detail')

  useEffect(() => {
    setTab('detail')
  }, [item?.id])

  if (!item) {
    return (
      <section className="flex min-h-[min(70dvh,560px)] flex-1 items-center justify-center rounded-2xl bg-white px-6 text-center text-[14px] font-medium text-[#6d7b93] shadow-[0_1px_2px_rgba(28,42,78,0.04)] xl:min-h-0">
        {t('anomalies.emptySelection')}
      </section>
    )
  }

  return (
    <section className="flex min-h-[min(70dvh,560px)] min-w-0 flex-col overflow-hidden rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(28,42,78,0.04)] xl:h-full xl:min-h-0">
      <header className="shrink-0">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <h2 className="text-[16px] font-bold text-[#1c2a4e]">{t('anomalies.detailTitle')}</h2>
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-md bg-[#e8f1fc] px-2 py-0.5 text-[11px] font-bold tabular-nums text-[#2860B9]">
              {item.id}
            </span>
            <span className={cn('rounded-full px-2 py-0.5 text-[11px] font-semibold', SEVERITY_BADGE[item.severity])}>
              {t(SEVERITY_LABEL[item.severity])}
            </span>
          </div>
        </div>
      </header>

      <nav className="mt-3 flex shrink-0 gap-1 border-b border-[#eef3f9]" aria-label={t('anomalies.detailTitle')}>
        <TabButton selected={tab === 'detail'} onClick={() => setTab('detail')}>
          {t('anomalies.detailTab')}
        </TabButton>
        <TabButton selected={tab === 'history'} onClick={() => setTab('history')}>
          {t('anomalies.historyTitle')}
          <span className="ml-1.5 rounded-full bg-[#eef3f9] px-1.5 py-0.5 text-[10px] font-bold tabular-nums text-[#5b6b82]">
            {item.history.length}
          </span>
        </TabButton>
      </nav>

      <div className="min-h-0 flex-1 overflow-y-auto pt-4">
        {tab === 'detail' ? (
          <DetailPane item={item} onEdit={onEdit} onResolve={onResolve} />
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
  onEdit,
  onResolve,
}: {
  item: AnomalyItem
  onEdit: () => void
  onResolve: () => void
}) {
  const { t, locale } = useI18n()

  return (
    <>
      <h3 className="text-[15px] font-bold leading-snug text-[#1c2a4e]">{item.title}</h3>
      <p className="mt-1 text-[12px] text-[#8b95a8]">
        {interpolate(t('anomalies.detectedAt'), { time: formatDateTime(item.detectedAt, locale) })}
      </p>

      <section className="mt-5">
        <h4 className="text-[13px] font-bold text-[#1c2a4e]">{t('anomalies.relatedDossier')}</h4>
        <div className="mt-3 flex items-center gap-3 rounded-xl bg-[#f7fafc] px-3 py-3">
          <span className={cn('grid size-10 shrink-0 place-items-center rounded-full text-[12px] font-bold', avatarTone(item.employeeName))}>
            {initials(item.employeeName)}
          </span>
          <div className="min-w-0">
            <p className="truncate text-[13px] font-bold text-[#1c2a4e]">{item.employeeName}</p>
            <p className="truncate text-[12px] text-[#6d7b93]">{item.reference}</p>
          </div>
        </div>
        <dl className="mt-3 grid grid-cols-1 gap-2 text-[12px] sm:grid-cols-2">
          <div>
            <dt className="font-semibold text-[#8b95a8]">{t('anomalies.visitType')}</dt>
            <dd className="mt-0.5 font-medium text-[#1c2a4e]">{visitLabel(item.visitType, t)}</dd>
          </div>
          <div>
            <dt className="font-semibold text-[#8b95a8]">{t('anomalies.examDate')}</dt>
            <dd className="mt-0.5 font-medium tabular-nums text-[#1c2a4e]">{formatDate(item.detectedAt, locale)}</dd>
          </div>
          <div className="sm:col-span-2">
            <dt className="font-semibold text-[#8b95a8]">{t('anomalies.doctor')}</dt>
            <dd className="mt-0.5 font-medium text-[#1c2a4e]">{item.doctor}</dd>
          </div>
        </dl>
      </section>

      {item.comparison ? (
        <section className="mt-5">
          <h4 className="text-[13px] font-bold text-[#1c2a4e]">{t('anomalies.comparison')}</h4>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
            <CompareBox side={item.comparison.left} sourceLabel={t('anomalies.sourceLeft')} />
            <span className="mx-auto grid size-9 place-items-center rounded-full bg-[#eef3f9] text-[11px] font-bold text-[#5b6b82]">
              {t('anomalies.vs')}
            </span>
            <CompareBox side={item.comparison.right} sourceLabel={t('anomalies.sourceRight')} />
          </div>
        </section>
      ) : null}

      <section className="mt-5 rounded-xl bg-[#fff7ed] px-3 py-3">
        <h4 className="text-[13px] font-bold text-[#c96512]">{t('anomalies.suggestionTitle')}</h4>
        <p className="mt-1 text-[13px] leading-5 text-[#7c4a1e]">{item.message}</p>
      </section>

      <section className="mt-5">
        <h4 className="text-[13px] font-bold text-[#1c2a4e]">{t('anomalies.actions')}</h4>
        <div className="mt-3 flex flex-col gap-2">
          <button
            type="button"
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#2860B9] px-3 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-[#1f529e]"
            onClick={onEdit}
          >
            <PencilIcon className="size-4" />
            {t('anomalies.editValue')}
          </button>
          <button
            type="button"
            disabled={item.status === 'resolved'}
            className="inline-flex h-10 cursor-pointer items-center justify-center gap-2 rounded-lg border border-[#86efac] bg-white px-3 text-[13px] font-semibold text-[#15803d] transition-colors duration-200 hover:bg-[#e7f8ee] disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onResolve}
          >
            <CheckCircleIcon className="size-4" />
            {t('anomalies.markResolved')}
          </button>
          <Link
            to="/dossiers"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-[#c5d4ea] bg-white px-3 text-[13px] font-semibold text-[#2860B9] transition-colors duration-200 hover:bg-[#eef5fc]"
          >
            <FolderIcon className="size-4" />
            {t('anomalies.openDossier')}
          </Link>
        </div>
      </section>
    </>
  )
}

function HistoryPane({ item }: { item: AnomalyItem }) {
  const { t, locale } = useI18n()

  if (item.history.length === 0) {
    return <p className="py-8 text-center text-[13px] font-medium text-[#8b95a8]">{t('anomalies.historyEmpty')}</p>
  }

  return (
    <Timeline>
      {item.history.map((event, index) => (
        <TimelineItem key={event.id} last={index === item.history.length - 1}>
          <p className="text-[13px] font-semibold text-[#1c2a4e]">{event.actorName}</p>
          <p className="mt-0.5 text-[12px] tabular-nums text-[#8b95a8]">{formatDateTime(event.at, locale)}</p>
          <p className="mt-1 text-[12px] leading-5 text-[#5b6b82]">{t(HISTORY_LABEL[event.kind])}</p>
        </TimelineItem>
      ))}
    </Timeline>
  )
}

function CompareBox({ side, sourceLabel }: { side: ComparisonSide; sourceLabel: string }) {
  return (
    <div className="rounded-xl border border-[#eef3f9] p-3">
      <p className="text-[11px] font-semibold text-[#8b95a8]">{sourceLabel}</p>
      <p className="mt-1 truncate text-[12px] font-medium text-[#6d7b93]" title={side.fileName}>
        {side.fileName}
      </p>
      <p
        className={cn(
          'mt-2 rounded-lg px-2.5 py-2 text-[12px] font-semibold',
          side.tone === 'danger' && 'bg-[#fde2e2] text-[#c93434]',
          side.tone === 'success' && 'bg-[#e7f8ee] text-[#15803d]',
          side.tone === 'neutral' && 'bg-[#f7fafc] text-[#1c2a4e]',
        )}
      >
        <span className="block text-[11px] font-medium opacity-80">{side.fieldLabel}</span>
        <span className="mt-0.5 block text-[14px] font-bold">{side.value}</span>
      </p>
    </div>
  )
}
