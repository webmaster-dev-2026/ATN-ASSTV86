import { visitLabel } from '@/features/dashboard/format'
import { useI18n, type TranslationKey } from '@/i18n'
import { cn } from '@/lib/cn'
import {
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
  TargetIcon,
  UserIcon,
} from './DossierIcons'

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
}

export function DossierHeader({
  dossier,
  proposedSlot,
  activeTab,
  onTabChange,
}: DossierHeaderProps) {
  const { t, locale } = useI18n()
  const received = formatStamp(dossier.receivedAt, locale, 'colon')
  const proposed = proposedSlot
    ? formatStamp(proposedSlot.at, locale, locale === 'fr' ? 'h' : 'colon')
    : null

  return (
    <header className="shrink-0 overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <div className="flex flex-col gap-4 px-4 py-4 sm:px-5 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-12 shrink-0 place-items-center rounded-full bg-[#d9e8fb] text-[14px] font-bold text-[#1d4f9a] sm:size-14 sm:text-[16px]">
            {initials(dossier.employeeName)}
          </span>
          <div className="min-w-0">
            <h2 className="truncate text-[18px] font-bold leading-tight text-[#1c2a4e] sm:text-[20px]">
              {displayEmployeeName(dossier.employeeName)}
            </h2>
            <p className="mt-1 truncate text-[12px] text-[#6d7b93] sm:text-[13px]">
              {interpolate(t('dossiers.header.bornOn'), {
                date: formatDate(dossier.birthDate, locale),
                age: ageFrom(dossier.birthDate),
              })}
              <span className="px-1.5 text-[#c3ccd8]">•</span>
              {dossier.companyName}
            </p>
            <span className="mt-2 inline-flex rounded-full bg-[#d9e8fb] px-2.5 py-0.5 text-[11px] font-semibold text-[#1d4f9a]">
              {visitLabel(dossier.visitType, t)}
            </span>
          </div>
        </div>

        <div className="flex min-w-0 flex-wrap items-stretch gap-2 sm:gap-3">
          <div className="min-w-0 rounded-xl border border-[#e4ecf6] bg-white px-3.5 py-2.5">
            <p className="text-[11px] font-semibold text-[#8b95a8]">{t('dossiers.header.receivedOn')}</p>
            <p className="mt-0.5 text-[13px] font-bold text-[#1c2a4e] sm:text-[14px]">
              {interpolate(t('dossiers.header.atDateTime'), received)}
            </p>
          </div>

          <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[#d4e4f6] bg-white px-3.5 py-2.5">
            <CalendarIcon className="size-5 shrink-0 text-[#1d4f9a]" />
            <div className="min-w-0">
              <p className="text-[11px] font-semibold text-[#8b95a8]">{t('dossiers.header.proposedAt')}</p>
              <p className="mt-0.5 truncate text-[13px] font-bold text-[#1c2a4e] sm:text-[14px]">
                {proposed
                  ? interpolate(t('dossiers.header.atDateTime'), proposed)
                  : t('dossiers.header.noProposal')}
              </p>
            </div>
          </div>
        </div>
      </div>

      <nav
        className="flex gap-1 overflow-x-auto border-t border-[#eef3f9] px-2 sm:px-3"
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
                'flex shrink-0 cursor-pointer items-center gap-1.5 border-b-2 px-3 py-3 text-[12px] font-semibold transition-colors sm:text-[13px]',
                selected
                  ? 'border-[#1d4f9a] text-[#1d4f9a]'
                  : 'border-transparent text-[#5b6b82] hover:text-[#1c2a4e]',
              )}
            >
              <Icon className="size-4" />
              {label}
            </button>
          )
        })}
      </nav>
    </header>
  )
}
