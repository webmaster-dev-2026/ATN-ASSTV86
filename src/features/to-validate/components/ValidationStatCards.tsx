import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useI18n, type TranslationKey } from '@/i18n'
import type { ValidationSummary } from '../types'
import { FileEditIcon, FolderGearIcon, TrendDownIcon, TrendUpIcon, WarningTriangleIcon } from './ValidationIcons'

const METRICS: {
  valueKey: keyof Pick<ValidationSummary, 'pendingDossiers' | 'fieldsToConfirm' | 'urgentDecisions'>
  changeKey: keyof Pick<ValidationSummary, 'pendingChange' | 'fieldsChange' | 'urgentChange'>
  labelKey: TranslationKey
  icon: ReactNode
  iconClass: string
}[] = [
  {
    valueKey: 'pendingDossiers',
    changeKey: 'pendingChange',
    labelKey: 'toValidate.pendingDossiers',
    icon: <FolderGearIcon className="size-4" />,
    iconClass: 'bg-[#ffe8d2] text-[#ea7a1a]',
  },
  {
    valueKey: 'fieldsToConfirm',
    changeKey: 'fieldsChange',
    labelKey: 'toValidate.fieldsToConfirm',
    icon: <FileEditIcon className="size-4" />,
    iconClass: 'bg-[#d9e8fb] text-[#1d4f9a]',
  },
  {
    valueKey: 'urgentDecisions',
    changeKey: 'urgentChange',
    labelKey: 'toValidate.urgentDecisions',
    icon: <WarningTriangleIcon className="size-4" />,
    iconClass: 'bg-[#fde2e2] text-[#e54848]',
  },
]

interface ValidationStatCardsProps {
  summary: ValidationSummary
}

export function ValidationStatCards({ summary }: ValidationStatCardsProps) {
  const { t } = useI18n()

  return (
    <section
      className="grid shrink-0 grid-cols-1 gap-3 sm:grid-cols-3"
      aria-label={t('nav.toValidate')}
    >
      {METRICS.map((item) => {
        const change = summary[item.changeKey]
        const rising = change > 0

        return (
          <article
            key={item.valueKey}
            className="flex items-center justify-between gap-3 rounded-xl bg-white px-3.5 py-2.5 shadow-[0_1px_2px_rgba(28,42,78,0.04)]"
          >
          <div className="min-w-0">
            <p className="truncate text-[12px] font-semibold text-[#6d7b93]">{t(item.labelKey)}</p>
            <p className="mt-0.5 flex items-baseline gap-1.5">
              <span className="font-sans text-[22px] font-bold leading-none text-[#1c2a4e]">
                {summary[item.valueKey]}
              </span>
              <span className="text-[11px] font-medium text-[#8b95a8]">{t('toValidate.total')}</span>
            </p>
            <p
              className={cn(
                'mt-1 inline-flex items-center gap-1 text-[11px] font-semibold',
                rising ? 'text-[#e54848]' : 'text-[#16a34a]',
              )}
            >
              {rising ? <TrendUpIcon /> : <TrendDownIcon />}
              {Math.abs(change)}% {t('toValidate.vsYesterday')}
            </p>
          </div>
          <div
            className={cn(
              'grid size-9 shrink-0 place-items-center rounded-full',
              item.iconClass,
            )}
          >
            {item.icon}
          </div>
        </article>
        )
      })}
    </section>
  )
}
