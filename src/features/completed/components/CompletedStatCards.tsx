import type { ReactNode } from 'react'
import { TrendUpIcon } from '@/features/to-validate/components/ValidationIcons'
import { cn } from '@/lib/cn'
import { useI18n, type TranslationKey } from '@/i18n'
import type { CompletedSummary } from '../types'
import { ArchiveIcon, FileStackIcon, FolderCheckIcon, SendIcon } from './CompletedIcons'

const METRICS: {
  valueKey: keyof Pick<CompletedSummary, 'dossiers' | 'documents' | 'sent' | 'archived'>
  changeKey: keyof Pick<CompletedSummary, 'dossiersChange' | 'documentsChange' | 'sentChange' | 'archivedChange'>
  labelKey: TranslationKey
  hintKey: TranslationKey
  icon: ReactNode
  iconClass: string
}[] = [
  {
    valueKey: 'dossiers',
    changeKey: 'dossiersChange',
    labelKey: 'completed.stats.dossiers',
    hintKey: 'completed.stats.dossiersHint',
    icon: <FolderCheckIcon className="size-4" />,
    iconClass: 'bg-[#e7f8ee] text-[#16a34a]',
  },
  {
    valueKey: 'documents',
    changeKey: 'documentsChange',
    labelKey: 'completed.stats.documents',
    hintKey: 'completed.stats.documentsHint',
    icon: <FileStackIcon className="size-4" />,
    iconClass: 'bg-[#d9e8fb] text-[#1d4f9a]',
  },
  {
    valueKey: 'sent',
    changeKey: 'sentChange',
    labelKey: 'completed.stats.sent',
    hintKey: 'completed.stats.sentHint',
    icon: <SendIcon className="size-4" />,
    iconClass: 'bg-[#ead9fb] text-[#7c3aed]',
  },
  {
    valueKey: 'archived',
    changeKey: 'archivedChange',
    labelKey: 'completed.stats.archived',
    hintKey: 'completed.stats.archivedHint',
    icon: <ArchiveIcon className="size-4" />,
    iconClass: 'bg-[#fff1e4] text-[#ea7a1a]',
  },
]

interface CompletedStatCardsProps {
  summary: CompletedSummary
}

export function CompletedStatCards({ summary }: CompletedStatCardsProps) {
  const { t } = useI18n()

  return (
    <section
      className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4"
      aria-label={t('nav.completed')}
    >
      {METRICS.map((item) => {
        const change = summary[item.changeKey]

        return (
          <article
            key={item.valueKey}
            className="flex items-start gap-3 rounded-2xl bg-white px-4 py-3.5 shadow-[0_1px_2px_rgba(28,42,78,0.04)]"
          >
            <div className={cn('grid size-10 shrink-0 place-items-center rounded-xl', item.iconClass)}>
              {item.icon}
            </div>
            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-[#6d7b93]">{t(item.labelKey)}</p>
              <p className="mt-0.5 font-sans text-[24px] font-bold leading-none tabular-nums text-[#1c2a4e]">
                {summary[item.valueKey]}
              </p>
              <p className="mt-1 text-[11px] font-medium text-[#8b95a8]">{t(item.hintKey)}</p>
              <p className="mt-1 inline-flex items-center gap-1 text-[11px] font-semibold text-[#16a34a]">
                <TrendUpIcon />
                {change}% {t('completed.vsLastMonth')}
              </p>
            </div>
          </article>
        )
      })}
    </section>
  )
}
