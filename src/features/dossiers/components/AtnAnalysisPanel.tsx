import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { RESTRICTION_KEYS, RESTRICTION_SEVERITY_KEYS, RESTRICTION_STYLES } from '../format'
import type { DossierCase, RestrictionKind } from '../types'
import { BanIcon, PostureIcon, RepeatIcon } from './DossierIcons'
import { FitnessBadge } from './StatusBadge'

const RESTRICTION_ICONS: Record<RestrictionKind, typeof BanIcon> = {
  lifting: BanIcon,
  repetitive: RepeatIcon,
  staticPosture: PostureIcon,
}

interface AtnAnalysisPanelProps {
  dossier: DossierCase
}

export function AtnAnalysisPanel({ dossier }: AtnAnalysisPanelProps) {
  const { t } = useI18n()
  const pending = dossier.status === 'analysing'

  return (
    <section className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-2xl border border-[#d4e4f6] bg-[#eef5fc] p-3">
      <div className="flex items-start justify-between gap-2">
        <h3 className="min-w-0 text-[13px] font-bold leading-4 text-[#1c2a4e]">
          {t('dossiers.analysis.title')}
        </h3>
        <FitnessBadge decision={dossier.fitness} />
      </div>

      <p className="mt-2 text-[11px] font-semibold text-[#8b95a8]">
        {t('dossiers.analysis.restrictions')}
      </p>

      {pending ? (
        <p className="mt-1.5 text-[12px] leading-4 text-[#6d7b93]">{t('dossiers.analysis.pending')}</p>
      ) : dossier.restrictions.length === 0 ? (
        <p className="mt-1.5 text-[12px] leading-4 text-[#6d7b93]">{t('dossiers.analysis.empty')}</p>
      ) : (
        <ul className="mt-1.5 space-y-1.5">
          {dossier.restrictions.map((item) => {
            const Icon = RESTRICTION_ICONS[item.kind]
            return (
              <li
                key={item.id}
                className={cn('flex items-start gap-2 rounded-xl border px-2 py-2', RESTRICTION_STYLES[item.severity])}
              >
                <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-md bg-white text-[#c96512]">
                  <Icon className="size-3.5" />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-semibold leading-4 text-[#1c2a4e]">
                    {t(RESTRICTION_KEYS[item.kind])}
                  </span>
                  <span className="mt-0.5 block text-[11px] font-semibold text-[#9a4a0a]">
                    {t(RESTRICTION_SEVERITY_KEYS[item.severity])}
                  </span>
                </span>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
