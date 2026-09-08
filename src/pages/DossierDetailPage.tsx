import { useEffect, useMemo, useState } from 'react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PageFrame } from '@/components/layout/PageFrame'
import { useToast } from '@/components/ui'
import { useChatbot } from '@/features/chatbot'
import { DossierWorkspace } from '@/features/dossiers/components/DossierWorkspace'
import { ArrowLeftIcon } from '@/features/dossiers/components/DossierIcons'
import { getDossiersData } from '@/features/dossiers/getDossiersData'
import type { AppointmentSlot } from '@/features/dossiers/types'
import { useI18n, type TranslationKey } from '@/i18n'

const dossiers = getDossiersData()

const TOAST_KEYS = {
  accepted: 'dossiers.toast.accepted',
  doctorChanged: 'dossiers.toast.doctorChanged',
  slotChanged: 'dossiers.toast.slotChanged',
} as const satisfies Record<string, TranslationKey>

export function DossierDetailPage() {
  const { dossierId } = useParams<{ dossierId: string }>()
  const { t } = useI18n()
  const { notify } = useToast()
  const { setDossierId } = useChatbot()
  const [acceptedIds, setAcceptedIds] = useState<Record<string, true>>({})
  const [slotOverrides, setSlotOverrides] = useState<Record<string, AppointmentSlot>>({})

  const selected = useMemo(
    () => dossiers.cases.find((item) => item.id === dossierId) ?? null,
    [dossierId],
  )

  useEffect(() => {
    setDossierId(selected?.id ?? null)
    return () => setDossierId(null)
  }, [selected?.id, setDossierId])

  if (!selected) {
    return <Navigate to="/dossiers" replace />
  }

  const selectedSlot = slotOverrides[selected.id] ?? selected.proposedSlot

  return (
    <PageFrame className="overflow-auto xl:overflow-hidden">
      <div className="mb-1.5 shrink-0">
        <Link
          to="/dossiers"
          className="inline-flex items-center gap-1 text-[12px] font-semibold text-[#1d4f9a] hover:underline"
        >
          <ArrowLeftIcon className="size-3.5" />
          {t('dossiers.backToList')}
        </Link>
      </div>
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
    </PageFrame>
  )
}
