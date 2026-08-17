import { useMemo, useState } from 'react'
import { PageFrame } from '@/components/layout/PageFrame'
import { useToast } from '@/components/ui'
import { DossierWorkspace } from '@/features/dossiers/components/DossierWorkspace'
import { WorkerQueue } from '@/features/dossiers/components/WorkerQueue'
import { getDossiersData } from '@/features/dossiers/getDossiersData'
import { needsAction } from '@/features/dossiers/format'
import { useI18n, type TranslationKey } from '@/i18n'
import type { AppointmentSlot } from '@/features/dossiers/types'

const dossiers = getDossiersData()

const TOAST_KEYS = {
  accepted: 'dossiers.toast.accepted',
  doctorChanged: 'dossiers.toast.doctorChanged',
  slotChanged: 'dossiers.toast.slotChanged',
} as const satisfies Record<string, TranslationKey>

const initialId = dossiers.cases.find((item) => needsAction(item.status))?.id ?? dossiers.cases[0]?.id ?? null

export function DossiersPage() {
  const { t } = useI18n()
  const { notify } = useToast()
  const [selectedId, setSelectedId] = useState<string | null>(initialId)
  const [acceptedIds, setAcceptedIds] = useState<Record<string, true>>({})
  const [slotOverrides, setSlotOverrides] = useState<Record<string, AppointmentSlot>>({})

  const selected = useMemo(
    () => dossiers.cases.find((item) => item.id === selectedId) ?? null,
    [selectedId],
  )

  const selectedSlot = selected
    ? (slotOverrides[selected.id] ?? selected.proposedSlot)
    : null

  return (
    <PageFrame className="overflow-auto xl:overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col gap-3 xl:flex-row">
        <WorkerQueue cases={dossiers.cases} selectedId={selectedId} onSelect={setSelectedId} />

        {selected ? (
          <DossierWorkspace
            dossier={selected}
            accepted={Boolean(acceptedIds[selected.id])}
            selectedSlot={selectedSlot}
            onAccept={() => {
              setAcceptedIds((current) => ({ ...current, [selected.id]: true }))
              notify(`${t(TOAST_KEYS.accepted)} ${selected.employeeName}`, 'success')
            }}
            onSelectSlot={(slot, kind) => {
              setAcceptedIds((current) => {
                const next = { ...current }
                delete next[selected.id]
                return next
              })
              setSlotOverrides((current) => ({ ...current, [selected.id]: slot }))
              notify(
                `${t(kind === 'doctor' ? TOAST_KEYS.doctorChanged : TOAST_KEYS.slotChanged)} ${selected.employeeName}`,
                'info',
              )
            }}
          />
        ) : (
          <p className="flex min-h-[240px] flex-1 items-center justify-center rounded-2xl bg-white text-[14px] font-medium text-[#6d7b93] shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
            {t('dossiers.emptySelection')}
          </p>
        )}
      </div>
    </PageFrame>
  )
}
