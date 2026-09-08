import { useEffect, useState } from 'react'
import { visitLabel } from '@/features/dashboard/format'
import { useI18n, type TranslationKey } from '@/i18n'
import { formatDate } from '../format'
import type { AppointmentSlot, DossierCase } from '../types'
import { AtnAnalysisPanel } from './AtnAnalysisPanel'
import { AppointmentProposal, type AppointmentView } from './AppointmentProposal'
import { DocumentReader } from './DocumentReader'
import { DossierActionPanel } from './DossierActionPanel'
import { DossierDocuments } from './DossierDocuments'
import { DossierHeader, type WorkspaceTab } from './DossierHeader'
import { StatusBadge } from './StatusBadge'

interface DossierWorkspaceProps {
  dossier: DossierCase
  accepted: boolean
  selectedSlot: AppointmentSlot | null
  onAccept: () => void
  onSelectSlot: (slot: AppointmentSlot, kind: 'doctor' | 'slot') => void
}

function defaultDocumentId(dossier: DossierCase) {
  return (
    dossier.documents.find((item) => item.documentType === 'COMPTE_RENDU')?.id ??
    dossier.documents[0]?.id ??
    null
  )
}

export function DossierWorkspace({
  dossier,
  accepted,
  selectedSlot,
  onAccept,
  onSelectSlot,
}: DossierWorkspaceProps) {
  const { t, locale } = useI18n()
  const [documentId, setDocumentId] = useState<string | null>(defaultDocumentId(dossier))
  const [appointmentView, setAppointmentView] = useState<AppointmentView>('proposal')
  const [tab, setTab] = useState<WorkspaceTab>('documents')
  const [actionOpen, setActionOpen] = useState(false)

  useEffect(() => {
    setDocumentId(defaultDocumentId(dossier))
    setAppointmentView('proposal')
    setTab('documents')
    setActionOpen(false)
  }, [dossier])

  const document =
    dossier.documents.find((item) => item.id === documentId) ?? dossier.documents[0] ?? null

  const handleSelectSlot = (slot: AppointmentSlot, kind: 'doctor' | 'slot') => {
    onSelectSlot(slot, kind)
    setAppointmentView('proposal')
  }

  const handleTabChange = (next: WorkspaceTab) => {
    setTab(next)
    setActionOpen(next === 'synthesis' || next === 'proposal')
  }

  const closeActionPanel = () => {
    setActionOpen(false)
    if (tab === 'synthesis' || tab === 'proposal') {
      setTab('documents')
    }
  }

  const showDocuments = tab === 'documents' || tab === 'synthesis' || tab === 'proposal'

  const analysisPanel = <AtnAnalysisPanel dossier={dossier} />
  const appointmentPanel = (
    <AppointmentProposal
      dossier={dossier}
      slot={selectedSlot}
      accepted={accepted}
      view={appointmentView}
      onViewChange={setAppointmentView}
      onAccept={onAccept}
      onSelectSlot={handleSelectSlot}
    />
  )

  const infoFields: Array<{ label: TranslationKey; value: string }> = [
    { label: 'dossiers.header.reference', value: dossier.reference },
    { label: 'dossiers.header.company', value: dossier.companyName },
    { label: 'dossiers.header.visitType', value: visitLabel(dossier.visitType, t) },
    { label: 'dossiers.header.center', value: dossier.centerName },
    { label: 'dossiers.header.practitioner', value: dossier.practitioner },
    { label: 'dossiers.header.source', value: dossier.source },
    { label: 'dossiers.header.receivedAt', value: formatDate(dossier.receivedAt, locale) },
  ]

  return (
    <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-2">
      <DossierHeader
        dossier={dossier}
        proposedSlot={selectedSlot}
        activeTab={tab}
        onTabChange={handleTabChange}
        onAnalyse={() => {
          setActionOpen(true)
          setTab('synthesis')
        }}
        onPropose={() => {
          setActionOpen(true)
          setTab('proposal')
        }}
      />

      <div className="relative flex min-h-0 min-w-0 flex-1 flex-col gap-2 overflow-y-auto lg:flex-row lg:flex-nowrap lg:overflow-hidden">
        {showDocuments ? (
          <div className="flex min-h-[55dvh] min-w-0 flex-1 flex-row gap-2 lg:min-h-0">
            <DossierDocuments
              documents={dossier.documents}
              selectedId={document?.id ?? null}
              onSelect={setDocumentId}
            />
            {document ? (
              <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
                <div className="flex h-full min-h-0 min-w-0 flex-col">
                  <DocumentReader dossier={dossier} document={document} />
                </div>
                <DossierActionPanel open={actionOpen} onClose={closeActionPanel}>
                  {analysisPanel}
                  {appointmentPanel}
                </DossierActionPanel>
              </div>
            ) : null}
          </div>
        ) : null}

        {tab === 'history' ? (
          <EmptyPanel title={t('dossiers.workspace.history')} body={t('dossiers.workspace.historyEmpty')} />
        ) : null}
        {tab === 'agenda' ? (
          <EmptyPanel title={t('dossiers.workspace.agenda')} body={t('dossiers.workspace.agendaEmpty')} />
        ) : null}

        {tab === 'information' ? (
          <section className="min-h-0 flex-1 overflow-y-auto rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
            <div className="mb-4 flex items-center gap-2">
              <h3 className="text-[16px] font-bold text-[#1c2a4e]">{t('dossiers.workspace.information')}</h3>
              <StatusBadge status={dossier.status} />
            </div>
            <dl className="grid gap-3 sm:grid-cols-2">
              {infoFields.map((field) => (
                <div key={field.label} className="rounded-xl border border-[#eef3f9] px-3.5 py-3">
                  <dt className="text-[11px] font-semibold text-[#8b95a8]">{t(field.label)}</dt>
                  <dd className="mt-1 text-[13px] font-semibold text-[#1c2a4e]">{field.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </div>
    </div>
  )
}

function EmptyPanel({ title, body }: { title: string; body: string }) {
  return (
    <section className="flex min-h-[240px] flex-1 items-center justify-center rounded-2xl bg-white px-6 text-center shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <div>
        <p className="text-[15px] font-bold text-[#1c2a4e]">{title}</p>
        <p className="mt-1 max-w-md text-[13px] leading-5 text-[#6d7b93]">{body}</p>
      </div>
    </section>
  )
}
