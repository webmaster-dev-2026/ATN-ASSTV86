import { Link } from 'react-router-dom'
import { SEVERITY_BADGE, SEVERITY_LABEL } from '@/features/anomalies/format'
import { visitLabel } from '@/features/dashboard/format'
import { formatDate, initials, interpolate } from '@/features/dossiers/format'
import { FILE_KIND_LABEL, STATUS_LABEL as DOCUMENT_STATUS_LABEL } from '@/features/source-documents/format'
import { SourceFileTypeIcon } from '@/features/source-documents/components/SourceFileTypeIcon'
import { avatarTone } from '@/features/to-validate/format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { DOSSIER_STATE_KEYS, KIND_BADGE, KIND_LABEL, KIND_OPEN, hitBadge } from '../format'
import type { SearchHit } from '../types'
import { ArrowUpRightIcon, KindIcon } from './SearchIcons'

interface SearchDetailProps {
  item: SearchHit
}

export function SearchDetail({ item }: SearchDetailProps) {
  const { t, locale } = useI18n()
  const badge = hitBadge(item, t)

  return (
    <section className="flex min-h-[min(70dvh,560px)] min-w-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)] xl:h-full xl:min-h-0">
      <header className="flex shrink-0 items-start justify-between gap-3 px-4 pt-4 sm:px-5">
        <h2 className="text-[16px] font-bold text-[#1c2a4e]">{t('search.detailTitle')}</h2>
        <div className="flex flex-wrap items-center justify-end gap-1.5">
          <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold', KIND_BADGE[item.kind])}>
            {t(KIND_LABEL[item.kind])}
          </span>
          <span className={cn('inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold', badge.className)}>
            {badge.label}
          </span>
        </div>
      </header>

      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
        <div className="flex items-center gap-3 rounded-xl bg-[#f7fafc] px-3 py-3">
          {item.kind === 'document' && item.fileKind ? (
            <SourceFileTypeIcon type={item.fileKind} />
          ) : (
            <span className={cn('grid size-10 shrink-0 place-items-center rounded-full text-[12px] font-bold', avatarTone(item.employeeName))}>
              {item.kind === 'employee' || item.kind === 'dossier' ? initials(item.employeeName) : <KindIcon kind={item.kind} className="size-4" />}
            </span>
          )}
          <div className="min-w-0">
            <p className="truncate text-[14px] font-bold text-[#1c2a4e]" title={item.title}>
              {item.title}
            </p>
            <p className="truncate text-[12px] font-semibold text-[#2860B9]" title={item.reference}>
              {item.reference}
            </p>
          </div>
        </div>

        {item.anomalyMessage ? (
          <p className="mt-4 rounded-xl bg-[#fff7ed] px-3 py-3 text-[13px] leading-5 text-[#7c4a1e]">{item.anomalyMessage}</p>
        ) : null}

        <dl className="mt-4 grid grid-cols-1 gap-3 text-[12px] sm:grid-cols-2">
          <Meta label={t('search.fields.employee')} value={item.employeeName} />
          <Meta label={t('search.fields.company')} value={item.companyName} />
          {item.visitType ? <Meta label={t('search.fields.visitType')} value={visitLabel(item.visitType, t)} /> : null}
          <Meta label={t('search.fields.date')} value={formatDate(item.at, locale)} />
          {item.dossierState ? <Meta label={t('search.fields.status')} value={t(DOSSIER_STATE_KEYS[item.dossierState])} /> : null}
          {item.documentStatus ? <Meta label={t('search.fields.status')} value={t(DOCUMENT_STATUS_LABEL[item.documentStatus])} /> : null}
          {item.fileKind ? <Meta label={t('search.fields.file')} value={t(FILE_KIND_LABEL[item.fileKind])} /> : null}
          {item.fileSizeLabel ? <Meta label={t('search.fields.size')} value={item.fileSizeLabel} /> : null}
          {item.anomalySeverity ? (
            <div>
              <dt className="font-semibold text-[#8b95a8]">{t('search.fields.severity')}</dt>
              <dd className="mt-0.5">
                <span className={cn('inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold', SEVERITY_BADGE[item.anomalySeverity])}>
                  {t(SEVERITY_LABEL[item.anomalySeverity])}
                </span>
              </dd>
            </div>
          ) : null}
          {item.source ? <Meta label={t('search.fields.source')} value={item.source} /> : null}
          {typeof item.relatedCount === 'number' ? (
            <Meta label={t('search.fields.related')} value={interpolate(t('search.related'), { count: item.relatedCount })} />
          ) : null}
        </dl>
      </div>

      <div className="shrink-0 border-t border-[#eef3f9] px-4 py-3 sm:px-5">
        <Link
          to={item.href}
          className="inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-[#2860B9] px-3 text-[13px] font-semibold text-white transition-colors duration-200 hover:bg-[#1f529e]"
        >
          {t(KIND_OPEN[item.kind])}
          <ArrowUpRightIcon className="size-4" />
        </Link>
      </div>
    </section>
  )
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div className="min-w-0">
      <dt className="font-semibold text-[#8b95a8]">{label}</dt>
      <dd className="mt-0.5 truncate font-medium text-[#1c2a4e]" title={value}>
        {value}
      </dd>
    </div>
  )
}
