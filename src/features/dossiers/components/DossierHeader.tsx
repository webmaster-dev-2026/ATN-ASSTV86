import { visitLabel } from '@/features/dashboard/format'
import { useI18n, type TranslationKey } from '@/i18n'
import { cn } from '@/lib/cn'
import {
  PRIORITY_KEYS,
  PRIORITY_STYLES,
  ageFrom,
  displayEmployeeName,
  formatDate,
  formatStamp,
  initials,
  interpolate,
} from '../format'
import type { AppointmentSlot, DossierCase } from '../types'
import {
  CalendarIcon,
  FolderIcon,
  HistoryIcon,
  InfoCircleIcon,
  MoreVerticalIcon,
  TargetIcon,
  UserIcon,
} from './DossierIcons'
import { StatusBadge } from './StatusBadge'

export type WorkspaceTab =
  | 'synthesis'
  | 'documents'
  | 'proposal'
  | 'history'
  | 'agenda'
  | 'information'

const TABS: Array<{
  id: WorkspaceTab
  labelKey: TranslationKey
  icon: typeof UserIcon
  withCount?: boolean
}> = [
  { id: 'synthesis', labelKey: 'dossiers.workspace.synthesis', icon: UserIcon },
  { id: 'documents', labelKey: 'dossiers.workspace.documents', icon: FolderIcon, withCount: true },
  { id: 'proposal', labelKey: 'dossiers.workspace.proposal', icon: TargetIcon },
  { id: 'history', labelKey: 'dossiers.workspace.history', icon: HistoryIcon },
  { id: 'agenda', labelKey: 'dossiers.workspace.agenda', icon: CalendarIcon },
  { id: 'information', labelKey: 'dossiers.workspace.information', icon: InfoCircleIcon },
]

interface DossierHeaderProps {
  dossier: DossierCase
  proposedSlot: AppointmentSlot | null
  activeTab: WorkspaceTab
  onTabChange: (tab: WorkspaceTab) => void
  onAnalyse?: () => void
  onPropose?: () => void
}

export function DossierHeader({
  dossier,
  proposedSlot,
  activeTab,
  onTabChange,
  onAnalyse,
  onPropose,
}: DossierHeaderProps) {
  const { t, locale } = useI18n()
  const received = formatStamp(dossier.receivedAt, locale, 'colon')
  const proposed = proposedSlot
    ? formatStamp(proposedSlot.at, locale, locale === 'fr' ? 'h' : 'colon')
    : null

  return (
    <header className="shrink-0 overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <div className="flex flex-col gap-2.5 px-3 py-2.5 sm:px-4 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
        <div className="flex min-w-0 items-start gap-2.5">
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#d9e8fb] text-[13px] font-bold text-[#1d4f9a]">
            {initials(dossier.employeeName)}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-[16px] font-bold leading-tight text-[#1c2a4e]">
              {displayEmployeeName(dossier.employeeName)}
            </h2>
            <p className="mt-0.5 truncate text-[12px] text-[#6d7b93]">
              {interpolate(t('dossiers.header.bornOn'), {
                date: formatDate(dossier.birthDate, locale),
                age: ageFrom(dossier.birthDate),
              })}
              <span className="px-1 text-[#c3ccd8]">•</span>
              {dossier.companyName}
            </p>
            <div className="mt-1.5 flex flex-wrap items-center gap-1">
              <span className="inline-flex rounded-full border border-[#c5d4ea] bg-white px-2 py-0.5 text-[10px] font-semibold text-[#1d4f9a]">
                {visitLabel(dossier.visitType, t)}
              </span>
              <StatusBadge status={dossier.status} />
              <span
                className={cn(
                  'inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold',
                  PRIORITY_STYLES[dossier.priority],
                )}
              >
                {t(PRIORITY_KEYS[dossier.priority])}
              </span>
            </div>
          </div>
        </div>

        <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
          <div className="flex flex-wrap items-center gap-1.5 sm:justify-end">
            <button
              type="button"
              onClick={onAnalyse}
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg bg-[#1d4f9a] px-3 text-[12px] font-semibold text-white hover:bg-[#163e7a]"
            >
              <TargetIcon className="size-3.5" />
              {t('dossiers.actions.analyse')}
            </button>
            <button
              type="button"
              onClick={onPropose}
              className="inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg border border-[#c5d4ea] bg-white px-3 text-[12px] font-semibold text-[#1d4f9a] hover:bg-[#eef5fc]"
            >
              <CalendarIcon className="size-3.5" />
              {t('dossiers.actions.propose')}
            </button>
            <button
              type="button"
              className="grid size-8 cursor-pointer place-items-center rounded-lg border border-[#e4ecf6] text-[#5b6b82] hover:bg-[#f7fafc]"
              aria-label={t('dossiers.actions.more')}
            >
              <MoreVerticalIcon className="size-4" />
            </button>
          </div>

          <div className="flex min-w-0 flex-wrap gap-1.5 sm:justify-end">
            <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-[#e4ecf6] px-2.5 py-1.5">
              <CalendarIcon className="size-3.5 shrink-0 text-[#8b95a8]" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold leading-none text-[#8b95a8]">
                  {t('dossiers.header.receivedOn')}
                </p>
                <p className="mt-0.5 truncate text-[12px] font-bold tabular-nums text-[#1c2a4e]">
                  {interpolate(t('dossiers.header.atDateTime'), received)}
                </p>
              </div>
            </div>
            <div className="flex min-w-0 items-center gap-1.5 rounded-lg border border-[#d4e4f6] px-2.5 py-1.5">
              <CalendarIcon className="size-3.5 shrink-0 text-[#1d4f9a]" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold leading-none text-[#8b95a8]">
                  {t('dossiers.header.proposedAt')}
                </p>
                <p className="mt-0.5 truncate text-[12px] font-bold tabular-nums text-[#1c2a4e]">
                  {proposed
                    ? interpolate(t('dossiers.header.atDateTime'), proposed)
                    : t('dossiers.header.noProposal')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <nav
        className="flex gap-0.5 overflow-x-auto border-t border-[#eef3f9] px-2"
        aria-label={t('dossiers.workspace.nav')}
      >
        {TABS.map((tab) => {
          const Icon = tab.icon
          const selected = activeTab === tab.id
          const label = tab.withCount
            ? interpolate(t(tab.labelKey), { count: dossier.documents.length })
            : t(tab.labelKey)

          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onTabChange(tab.id)}
              className={cn(
                'flex shrink-0 cursor-pointer items-center gap-1 border-b-2 px-2.5 py-2 text-[12px] font-semibold transition-colors',
                selected
                  ? 'border-[#1d4f9a] text-[#1d4f9a]'
                  : 'border-transparent text-[#5b6b82] hover:text-[#1c2a4e]',
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
