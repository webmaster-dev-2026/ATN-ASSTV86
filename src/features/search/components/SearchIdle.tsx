import { visitLabel } from '@/features/dashboard/format'
import { formatDate } from '@/features/dossiers/format'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { KIND_BADGE, KIND_LABEL, hitBadge, queryForHit } from '../format'
import type { SearchHit } from '../types'

interface SearchIdleProps {
  latest: SearchHit[]
  onSelectQuery: (value: string) => void
}

export function SearchIdle({ latest, onSelectQuery }: SearchIdleProps) {
  const { t, locale } = useI18n()

  return (
    <section className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <div className="flex shrink-0 items-center px-4 py-3 sm:px-5">
        <h2 className="text-[16px] font-bold text-[#1c2a4e]">{t('search.latestTitle')}</h2>
      </div>
      <div className="min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <table className="w-full table-fixed border-collapse text-left">
          <colgroup>
            <col className="w-[16%]" />
            <col className="w-[32%]" />
            <col className="w-[22%]" />
            <col className="w-[14%]" />
            <col className="w-[16%]" />
          </colgroup>
          <thead className="sticky top-0 bg-white">
            <tr className="border-y border-[#eef3f9] text-[12px] font-semibold text-[#8b95a8]">
              <th className="truncate px-3 py-2.5 font-semibold sm:px-4">{t('search.columns.type')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('search.columns.result')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('search.columns.employee')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-3">{t('search.columns.date')}</th>
              <th className="truncate px-2 py-2.5 font-semibold sm:px-4">{t('search.columns.status')}</th>
            </tr>
          </thead>
          <tbody>
            {latest.map((item) => {
              const badge = hitBadge(item, t)
              return (
                <tr
                  key={item.id}
                  tabIndex={0}
                  onClick={() => onSelectQuery(queryForHit(item))}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault()
                      onSelectQuery(queryForHit(item))
                    }
                  }}
                  className="cursor-pointer border-b border-[#f3f6fb] transition-colors duration-200 hover:bg-[#f7fafc]"
                >
                  <td className="min-w-0 overflow-hidden px-3 py-3 sm:px-4">
                    <span className={cn('inline-block max-w-full truncate rounded-full px-2 py-0.5 text-[11px] font-semibold', KIND_BADGE[item.kind])}>
                      {t(KIND_LABEL[item.kind])}
                    </span>
                  </td>
                  <td className="min-w-0 overflow-hidden px-2 py-3 sm:px-3">
                    <span className="block truncate text-[13px] font-semibold text-[#1c2a4e]" title={item.title}>
                      {item.title}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] font-semibold text-[#2860B9]" title={item.reference}>
                      {item.reference}
                      {item.visitType ? (
                        <span className="ml-1.5 font-medium text-[#8b95a8]">{visitLabel(item.visitType, t)}</span>
                      ) : null}
                    </span>
                  </td>
                  <td className="min-w-0 overflow-hidden px-2 py-3 sm:px-3">
                    <span className="block truncate text-[13px] text-[#1c2a4e]" title={item.employeeName}>
                      {item.employeeName}
                    </span>
                    <span className="mt-0.5 block truncate text-[12px] text-[#6d7b93]" title={item.companyName}>
                      {item.companyName}
                    </span>
                  </td>
                  <td className="min-w-0 overflow-hidden px-2 py-3 text-[13px] font-medium tabular-nums text-[#1c2a4e] sm:px-3">
                    <span className="block truncate">{formatDate(item.at, locale)}</span>
                  </td>
                  <td className="min-w-0 overflow-hidden px-2 py-3 sm:px-4">
                    <span className={cn('inline-block max-w-full truncate rounded-full px-2.5 py-1 text-[11px] font-semibold', badge.className)} title={badge.label}>
                      {badge.label}
                    </span>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </section>
  )
}
