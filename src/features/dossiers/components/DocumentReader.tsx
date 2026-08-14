import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { visitLabel } from '@/features/dashboard/format'
import { useI18n, type TranslationKey } from '@/i18n'
import { cn } from '@/lib/cn'
import { useToast } from '@/components/ui'
import {
  formatDate,
  interpolate,
  RESTRICTION_KEYS,
  shiftDays,
} from '../format'
import type { DossierCase, DossierDocument, RestrictionKind } from '../types'
import { CheckIcon } from './DossierIcons'
import { DocumentViewerToolbar } from './DocumentViewerToolbar'
import { createPdfFromPapers, mountPrintSheet, pdfFileName, removePrintSheet } from '../downloadPdf'

const ZOOM_MIN = 50
const ZOOM_MAX = 200
const ZOOM_STEP = 25

interface DocumentReaderProps {
  dossier: DossierCase
  document: DossierDocument
}

function InkField({
  label,
  value,
  wide = false,
}: {
  label: string
  value: string
  wide?: boolean
}) {
  return (
    <div className={wide ? 'sm:col-span-2' : undefined}>
      <p className="text-[10px] font-semibold tracking-wide text-[#8b95a8]">{label}</p>
      <p className="mt-1 border-b border-dotted border-[#c5cedb] pb-1 text-[13px] font-semibold text-[#1c2a4e]">
        {value}
      </p>
    </div>
  )
}

function Choice({ checked, label }: { checked: boolean; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 text-[12px] text-[#1c2a4e]">
      <span
        className={cn(
          'grid size-4 place-items-center rounded-[3px] border',
          checked ? 'border-[#1d4f9a] bg-[#1d4f9a] text-white' : 'border-[#c5cedb] bg-white',
        )}
      >
        {checked ? <CheckIcon className="size-3" /> : null}
      </span>
      {label}
    </span>
  )
}

function Stamp({ tone }: { tone: 'navy' | 'burgundy' }) {
  const { t } = useI18n()
  const color = tone === 'burgundy' ? 'border-[#9b2c3a]/55 text-[#9b2c3a]/80' : 'border-[#1d4f9a]/50 text-[#1d4f9a]/75'

  return (
    <div
      className={cn(
        'grid size-[84px] rotate-[-8deg] place-items-center rounded-full border-[1.5px] px-2 text-center',
        color,
      )}
    >
      <span>
        <span className="block text-[9px] font-bold tracking-wide">{t('dossiers.paper.stampAsstv')}</span>
        <span className="mt-0.5 block text-[8px] font-semibold leading-3">{t('dossiers.paper.stampMedical')}</span>
      </span>
    </div>
  )
}

function Paper({
  children,
  rail,
}: {
  children: ReactNode
  rail?: string
}) {
  return (
    <article className="relative mx-auto w-full overflow-hidden rounded-sm bg-[#fffdf8] shadow-[0_16px_40px_rgba(28,42,78,0.12)] ring-1 ring-[#d5deea] [print-color-adjust:exact]">
      {rail ? <span className={cn('absolute inset-y-0 left-0 w-[3px]', rail)} aria-hidden /> : null}
      <div className={rail ? 'pl-[3px]' : undefined}>{children}</div>
    </article>
  )
}

function PaperLetterhead({ reference }: { reference: string }) {
  return (
    <div className="flex items-start justify-between gap-3 border-b border-[#d7e1ef] pb-3">
      <BrandLogo tone="dark" size="sm" />
      <p className="text-right text-[11px] font-semibold text-[#8b95a8]">{reference}</p>
    </div>
  )
}

function PaperFooter({
  fileName,
  page,
  pages,
}: {
  fileName: string
  page: number
  pages: number
}) {
  const { t } = useI18n()

  return (
    <footer className="mt-6 flex items-center justify-between gap-3 border-t border-[#e8eef6] pt-3 text-[10px] text-[#8b95a8]">
      <span className="truncate">{fileName}</span>
      <span className="shrink-0 tabular-nums">
        {interpolate(t('dossiers.paper.page'), { current: page, total: pages })}
      </span>
    </footer>
  )
}

function HighlightedRestriction({ kind }: { kind: RestrictionKind }) {
  const { t } = useI18n()

  return (
    <mark className="rounded-sm bg-[#ffe08a] px-1 py-0.5 font-semibold text-[#6b3b00] not-italic">
      {t(RESTRICTION_KEYS[kind])}
    </mark>
  )
}

function SickLeavePaper({ dossier, document }: DocumentReaderProps) {
  const { t, locale } = useI18n()
  const from = shiftDays(dossier.receivedAt, -18)
  const to = shiftDays(dossier.receivedAt, -2)

  return (
    <Paper rail="bg-[#9b2c3a]">
      <div className="px-4 pb-5 pt-7 sm:px-5 sm:pb-6 sm:pt-8">
        <div className="flex items-start justify-between gap-4 border-b-2 border-[#9b2c3a] pb-3">
          <div>
            <p className="text-[10px] font-bold tracking-wide text-[#9b2c3a]">{t('dossiers.paper.cerfa')}</p>
            <h4 className="mt-1 text-[18px] font-bold leading-tight text-[#1c2a4e]">
              {t('dossiers.paper.leaveNotice')}
            </h4>
          </div>
          <p className="max-w-[120px] text-right text-[10px] font-semibold leading-4 text-[#8b95a8]">
            {t('dossiers.paper.confidential')}
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <InkField label={t('dossiers.paper.insured')} value={dossier.employeeName} />
          <InkField label={t('dossiers.report.company')} value={dossier.companyName} />
          <InkField label={t('dossiers.paper.ssn')} value={t('dossiers.paper.ssnValue')} />
          <InkField label={t('dossiers.paper.jobTitle')} value={t('dossiers.paper.jobTitleValue')} />
        </div>

        <section className="mt-5 rounded-sm border border-[#ead4d7] bg-[#fdf6f6] px-4 py-3">
          <p className="text-[11px] font-bold text-[#9b2c3a]">{t('dossiers.paper.leavePeriod')}</p>
          <div className="mt-2 grid grid-cols-3 gap-3">
            <InkField label={t('dossiers.paper.from')} value={formatDate(from, locale)} />
            <InkField label={t('dossiers.paper.to')} value={formatDate(to, locale)} />
            <InkField label={t('dossiers.paper.durationLabel')} value={interpolate(t('dossiers.paper.duration'), { days: 16 })} />
          </div>
        </section>

        <div className="mt-5">
          <InkField label={t('dossiers.paper.diagnosis')} value={t('dossiers.paper.diagnosisValue')} wide />
        </div>

        <div className="mt-5 grid gap-2.5">
          <Choice checked label={t('dossiers.paper.outingsYes')} />
          <Choice checked={false} label={`${t('dossiers.paper.partTime')}: ${t('dossiers.paper.partTimeNo')}`} />
          <Choice checked label={t('dossiers.paper.resumeVisit')} />
        </div>

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold text-[#8b95a8]">{t('dossiers.paper.prescriber')}</p>
            <p className="mt-1 text-[13px] font-bold text-[#1c2a4e]">{t('dossiers.paper.gp')}</p>
            <p className="text-[12px] text-[#6d7b93]">{t('dossiers.paper.gpCity')}</p>
            <p className="mt-3 text-[18px] font-semibold italic leading-none text-[#1c2a4e]/80">C. Morel</p>
            <p className="mt-1 text-[10px] text-[#8b95a8]">{t('dossiers.paper.signature')}</p>
          </div>
          <Stamp tone="burgundy" />
        </div>

        <PaperFooter fileName={document.name} page={1} pages={document.pages} />
      </div>
    </Paper>
  )
}

function VisitRequestPaper({ dossier, document }: DocumentReaderProps) {
  const { t, locale } = useI18n()

  return (
    <Paper rail="bg-[#1d4f9a]">
      <div className="px-4 pb-5 pt-7 sm:px-5 sm:pb-6 sm:pt-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold text-[#1d4f9a]">{dossier.companyName}</p>
            <p className="mt-0.5 text-[11px] text-[#6d7b93]">{t('dossiers.paper.hr')}</p>
          </div>
          <p className="text-[11px] font-semibold tabular-nums text-[#8b95a8]">{dossier.reference}</p>
        </div>
        <h4 className="mt-4 border-b border-[#1d4f9a] pb-2 text-[18px] font-bold text-[#1c2a4e]">
          {t('dossiers.report.visitRequestTitle')}
        </h4>

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <InkField label={t('dossiers.report.employee')} value={dossier.employeeName} />
          <InkField label={t('dossiers.paper.jobTitle')} value={t('dossiers.paper.jobTitleValue')} />
          <InkField label={t('dossiers.report.visitType')} value={visitLabel(dossier.visitType, t)} />
          <InkField label={t('dossiers.paper.desiredDate')} value={formatDate(dossier.receivedAt, locale)} />
          <InkField label={t('dossiers.paper.site')} value={dossier.source} wide />
        </div>

        <section className="mt-5">
          <p className="text-[11px] font-bold text-[#1c2a4e]">{t('dossiers.paper.motive')}</p>
          <p className="mt-2 text-[13px] leading-6 text-[#1c2a4e]">
            {t('dossiers.report.visitRequestBody')}
          </p>
        </section>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-[10px] font-semibold text-[#8b95a8]">{t('dossiers.paper.requestedBy')}</p>
            <p className="mt-1 text-[13px] font-bold text-[#1c2a4e]">{document.uploadedBy}</p>
            <p className="mt-3 text-[18px] font-semibold italic leading-none text-[#1c2a4e]/80">
              {document.uploadedBy.split(' ')[0]}
            </p>
          </div>
          <Stamp tone="navy" />
        </div>

        <PaperFooter fileName={document.name} page={1} pages={document.pages} />
      </div>
    </Paper>
  )
}

function JobSheetPaper({ dossier, document }: DocumentReaderProps) {
  const { t } = useI18n()
  const rows: Array<[TranslationKey, TranslationKey]> = [
    ['dossiers.paper.handling', 'dossiers.paper.handlingValue'],
    ['dossiers.paper.posture', 'dossiers.paper.postureValue'],
    ['dossiers.paper.repeat', 'dossiers.paper.repeatValue'],
    ['dossiers.paper.environment', 'dossiers.paper.environmentValue'],
  ]

  return (
    <Paper rail="bg-[#3d5a80]">
      <div className="px-4 pb-5 pt-7 sm:px-5 sm:pb-6 sm:pt-8">
        <p className="text-[11px] font-bold text-[#3d5a80]">{dossier.companyName}</p>
        <h4 className="mt-1 text-[18px] font-bold text-[#1c2a4e]">{t('dossiers.report.jobSheetTitle')}</h4>
        <p className="mt-1 text-[12px] text-[#6d7b93]">{t('dossiers.paper.jobTitleValue')}</p>

        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <InkField label={t('dossiers.report.employee')} value={dossier.employeeName} />
          <InkField label={t('dossiers.paper.site')} value={dossier.source} />
        </div>

        <p className="mt-5 text-[11px] font-bold text-[#1c2a4e]">{t('dossiers.paper.constraints')}</p>
        <table className="mt-2 w-full text-left">
          <tbody>
            {rows.map(([label, value], index) => (
              <tr key={label} className={index === 0 ? 'border-t border-[#e4ecf6]' : undefined}>
                <th className="w-[38%] border-b border-[#e4ecf6] py-2.5 pr-3 align-top text-[12px] font-semibold text-[#6d7b93]">
                  {t(label)}
                </th>
                <td className="border-b border-[#e4ecf6] py-2.5 text-[13px] font-medium text-[#1c2a4e]">
                  {t(value)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <PaperFooter fileName={document.name} page={1} pages={document.pages} />
      </div>
    </Paper>
  )
}

function MedicalReportPaper({ dossier, document }: DocumentReaderProps) {
  const { t, locale } = useI18n()
  const pending = dossier.status === 'analysing'
  const blocked = dossier.status === 'blocked'
  const conclusionKey: TranslationKey = blocked
    ? 'dossiers.report.conclusionBlocked'
    : dossier.restrictions.length > 0
      ? 'dossiers.report.conclusionRestricted'
      : 'dossiers.report.conclusionFit'

  return (
    <Paper>
      <div className="px-4 pb-5 pt-7 sm:px-5 sm:pb-6 sm:pt-8">
        <PaperLetterhead reference={dossier.reference} />

        <h4 className="mt-4 text-[18px] font-bold text-[#1c2a4e]">{t('dossiers.report.title')}</h4>

        <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <InkField label={t('dossiers.report.employee')} value={dossier.employeeName} />
          <InkField label={t('dossiers.report.company')} value={dossier.companyName} />
          <InkField label={t('dossiers.report.visitType')} value={visitLabel(dossier.visitType, t)} />
          <InkField label={t('dossiers.report.examDate')} value={formatDate(dossier.receivedAt, locale)} />
          <InkField label={t('dossiers.report.doctor')} value={dossier.practitioner} wide />
        </div>

        <section className="mt-5">
          <h5 className="text-[12px] font-bold text-[#1c2a4e]">{t('dossiers.report.clinical')}</h5>
          <p className="mt-1.5 text-[13px] leading-6 text-[#1c2a4e]">
            {t(pending ? 'dossiers.report.clinicalPending' : 'dossiers.report.clinicalBody')}
          </p>
          {!pending ? (
            <p className="mt-2 text-[13px] leading-6 text-[#1c2a4e]">{t('dossiers.paper.findingsBody')}</p>
          ) : null}
        </section>

        {!pending ? (
          <section className="mt-4 rounded-sm border border-[#f0d7a8] bg-[#fff8e8] px-3 py-3">
            <h5 className="text-[12px] font-bold text-[#8a5a12]">{t('dossiers.report.restrictions')}</h5>
            {dossier.restrictions.length === 0 ? (
              <p className="mt-2 text-[13px] text-[#6d7b93]">{t('dossiers.report.noRestrictions')}</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {dossier.restrictions.map((item) => (
                  <li key={item.id} className="flex items-start gap-2 text-[13px] leading-5">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#c9891a]" />
                    <HighlightedRestriction kind={item.kind} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        ) : null}

        <section
          className={cn(
            'mt-4 rounded-sm border px-3 py-3',
            blocked ? 'border-[#f0c4c4] bg-[#fff5f5]' : 'border-[#cfe6d6] bg-[#f3faf5]',
          )}
        >
          <h5 className="text-[12px] font-bold text-[#1c2a4e]">{t('dossiers.paper.aptitudeBox')}</h5>
          <p className="mt-1.5 text-[13px] leading-6 text-[#1c2a4e]">{t(conclusionKey)}</p>
        </section>

        <div className="mt-6 flex items-end justify-between">
          <div>
            <p className="text-[13px] font-bold text-[#1c2a4e]">{dossier.practitioner}</p>
            <p className="mt-3 text-[18px] font-semibold italic leading-none text-[#1c2a4e]/80">
              {dossier.practitioner.replace('Dr ', '')}
            </p>
            <p className="mt-1 text-[10px] text-[#8b95a8]">{t('dossiers.paper.signature')}</p>
          </div>
          <Stamp tone="navy" />
        </div>

        <PaperFooter fileName={document.name} page={1} pages={document.pages} />
      </div>
    </Paper>
  )
}

function EmailPaper({ dossier, document }: DocumentReaderProps) {
  const { t } = useI18n()
  const visit = visitLabel(dossier.visitType, t)
  const from = `${document.uploadedBy} <rh@${dossier.companyName.toLowerCase().replace(/[^a-z0-9]+/g, '')}.fr>`

  return (
    <Paper rail="bg-[#5b6b82]">
      <div className="px-4 pb-5 pt-7 sm:px-5 sm:pb-6 sm:pt-8">
        <div className="space-y-2 rounded-sm bg-[#f4f7fb] px-3 py-3 text-[12px]">
          <p>
            <span className="inline-block w-14 font-semibold text-[#8b95a8]">{t('dossiers.paper.emailFrom')}</span>
            <span className="font-medium text-[#1c2a4e]">{from}</span>
          </p>
          <p>
            <span className="inline-block w-14 font-semibold text-[#8b95a8]">{t('dossiers.paper.emailTo')}</span>
            <span className="font-medium text-[#1c2a4e]">dossiers@asstv86.fr</span>
          </p>
          <p>
            <span className="inline-block w-14 font-semibold text-[#8b95a8]">{t('dossiers.paper.emailSubject')}</span>
            <span className="font-semibold text-[#1c2a4e]">
              {interpolate(t('dossiers.paper.emailSubjectValue'), { name: dossier.employeeName })}
            </span>
          </p>
        </div>

        <div className="mt-5 space-y-3 text-[13px] leading-6 text-[#1c2a4e]">
          <p>{t('dossiers.paper.emailGreeting')}</p>
          <p>
            {interpolate(t('dossiers.paper.emailBody1'), {
              name: dossier.employeeName,
              company: dossier.companyName,
              visit,
            })}
          </p>
          <p>{t('dossiers.paper.emailBody2')}</p>
          <p className="pt-2">
            {t('dossiers.paper.emailSignoff')}
            <br />
            <span className="font-semibold">{document.uploadedBy}</span>
            <br />
            <span className="text-[12px] text-[#6d7b93]">{t('dossiers.paper.hr')}</span>
          </p>
        </div>

        <PaperFooter fileName={document.name} page={1} pages={document.pages} />
      </div>
    </Paper>
  )
}

function FormPaper({ dossier, document }: DocumentReaderProps) {
  const { t, locale } = useI18n()

  return (
    <Paper rail="bg-[#1d4f9a]">
      <div className="px-4 pb-5 pt-7 sm:px-5 sm:pb-6 sm:pt-8">
        <h4 className="text-[18px] font-bold text-[#1c2a4e]">{t('dossiers.report.formTitle')}</h4>
        <p className="mt-1 text-[11px] font-semibold text-[#8b95a8]">{dossier.reference}</p>
        <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
          <InkField label={t('dossiers.report.employee')} value={dossier.employeeName} />
          <InkField label={t('dossiers.report.company')} value={dossier.companyName} />
          <InkField label={t('dossiers.report.visitType')} value={visitLabel(dossier.visitType, t)} />
          <InkField label={t('dossiers.report.examDate')} value={formatDate(dossier.receivedAt, locale)} />
          <InkField label={t('dossiers.paper.site')} value={dossier.source} wide />
          <InkField label={t('dossiers.paper.requestedBy')} value={document.uploadedBy} />
          <InkField label={t('dossiers.report.doctor')} value={dossier.practitioner} />
        </div>
        <PaperFooter fileName={document.name} page={1} pages={document.pages} />
      </div>
    </Paper>
  )
}

function AnnexIdentity({ dossier }: { dossier: DossierCase }) {
  const { t, locale } = useI18n()

  return (
    <div className="mt-4 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
      <InkField label={t('dossiers.report.employee')} value={dossier.employeeName} />
      <InkField label={t('dossiers.report.company')} value={dossier.companyName} />
      <InkField label={t('dossiers.paper.jobTitle')} value={t('dossiers.paper.jobTitleValue')} />
      <InkField label={t('dossiers.report.visitType')} value={visitLabel(dossier.visitType, t)} />
      <InkField label={t('dossiers.report.examDate')} value={formatDate(dossier.receivedAt, locale)} />
      <InkField label={t('dossiers.report.doctor')} value={dossier.practitioner} />
    </div>
  )
}

function AnnexPaper({
  dossier,
  document,
  page,
  pages,
}: DocumentReaderProps & { page: number; pages: number }) {
  const { t, locale } = useI18n()
  const recommendations = page < pages
  const reviewDate = formatDate(shiftDays(dossier.receivedAt, 90), locale)
  const measures: Array<[TranslationKey, TranslationKey]> = [
    ['dossiers.paper.annexMeasurePosture', 'dossiers.paper.annexMeasurePostureValue'],
    ['dossiers.paper.annexMeasureLoad', 'dossiers.paper.annexMeasureLoadValue'],
    ['dossiers.paper.annexMeasureBreaks', 'dossiers.paper.annexMeasureBreaksValue'],
    ['dossiers.paper.annexMeasureStation', 'dossiers.paper.annexMeasureStationValue'],
  ]
  const recipients: TranslationKey[] = [
    'dossiers.paper.annexRecipientDoctor',
    'dossiers.paper.annexRecipientHr',
    'dossiers.paper.annexRecipientWorker',
  ]

  return (
    <Paper>
      <div className="px-4 pb-5 pt-7 sm:px-5 sm:pb-6 sm:pt-8">
        <PaperLetterhead reference={dossier.reference} />

        <div className="mt-4 flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold tracking-wide text-[#1d4f9a]">{t('dossiers.paper.annexLabel')}</p>
            <h4 className="mt-1 text-[18px] font-bold leading-tight text-[#1c2a4e]">
              {recommendations ? t('dossiers.paper.annexRecommendations') : t('dossiers.paper.annexAdmin')}
            </h4>
          </div>
          <p className="shrink-0 text-right text-[11px] font-semibold text-[#8b95a8]">
            {interpolate(t('dossiers.paper.annexIssuedOn'), { date: formatDate(dossier.receivedAt, locale) })}
          </p>
        </div>

        <AnnexIdentity dossier={dossier} />

        {recommendations ? (
          <>
            <p className="mt-5 text-[13px] leading-6 text-[#1c2a4e]">{t('dossiers.paper.annexRecommendationsBody')}</p>

            <p className="mt-5 text-[11px] font-bold text-[#1c2a4e]">{t('dossiers.paper.annexRestrictionsApplied')}</p>
            {dossier.restrictions.length === 0 ? (
              <p className="mt-2 text-[13px] leading-6 text-[#6d7b93]">{t('dossiers.paper.annexNoRestrictions')}</p>
            ) : (
              <ul className="mt-2 space-y-2">
                {dossier.restrictions.map((item) => (
                  <li key={item.id} className="flex items-start gap-2 text-[13px] leading-5">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#1d4f9a]" />
                    <HighlightedRestriction kind={item.kind} />
                  </li>
                ))}
              </ul>
            )}

            <p className="mt-5 text-[11px] font-bold text-[#1c2a4e]">{t('dossiers.paper.annexMeasures')}</p>
            <table className="mt-2 w-full text-left">
              <tbody>
                {measures.map(([label, value], index) => (
                  <tr key={label} className={index === 0 ? 'border-t border-[#e4ecf6]' : undefined}>
                    <th className="w-[34%] border-b border-[#e4ecf6] py-2.5 pr-3 align-top text-[12px] font-semibold text-[#6d7b93]">
                      {t(label)}
                    </th>
                    <td className="border-b border-[#e4ecf6] py-2.5 text-[13px] font-medium leading-5 text-[#1c2a4e]">
                      {t(value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <section className="mt-4 rounded-sm border border-[#d7e1ef] bg-[#f7fafc] px-3 py-3">
              <p className="text-[11px] font-bold text-[#1c2a4e]">{t('dossiers.paper.annexFollowUp')}</p>
              <p className="mt-1.5 text-[13px] leading-6 text-[#1c2a4e]">
                {interpolate(t('dossiers.paper.annexFollowUpValue'), { date: reviewDate })}
              </p>
            </section>

            <section className="mt-4">
              <p className="text-[11px] font-bold text-[#1c2a4e]">{t('dossiers.paper.annexEmployerAction')}</p>
              <p className="mt-1.5 text-[13px] leading-6 text-[#1c2a4e]">{t('dossiers.paper.annexEmployerActionBody')}</p>
            </section>
          </>
        ) : (
          <>
            <p className="mt-5 text-[13px] leading-6 text-[#1c2a4e]">{t('dossiers.paper.annexAdminBody')}</p>

            <div className="mt-5 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
              <InkField label={t('dossiers.paper.annexDocumentId')} value={document.name} />
              <InkField label={t('dossiers.paper.annexCenter')} value={dossier.centerName} />
              <InkField label={t('dossiers.paper.annexClassification')} value={t('dossiers.paper.annexClassificationValue')} />
              <InkField label={t('dossiers.paper.site')} value={dossier.source} />
            </div>

            <p className="mt-5 text-[11px] font-bold text-[#1c2a4e]">{t('dossiers.paper.annexRecipients')}</p>
            <ul className="mt-2 space-y-2">
              {recipients.map((item) => (
                <li key={item} className="flex items-start gap-2 text-[13px] leading-5 text-[#1c2a4e]">
                  <span className="mt-2 size-1.5 shrink-0 rounded-full bg-[#1d4f9a]" />
                  {t(item)}
                </li>
              ))}
            </ul>

            <table className="mt-5 w-full text-left">
              <tbody>
                {(
                  [
                    ['dossiers.paper.annexLegalBasis', 'dossiers.paper.annexLegalBasisValue'],
                    ['dossiers.paper.annexRetention', 'dossiers.paper.annexRetentionValue'],
                    ['dossiers.paper.annexCopyRule', 'dossiers.paper.annexCopyRuleValue'],
                    ['dossiers.paper.annexContact', 'dossiers.paper.annexContactValue'],
                  ] as Array<[TranslationKey, TranslationKey]>
                ).map(([label, value], index) => (
                  <tr key={label} className={index === 0 ? 'border-t border-[#e4ecf6]' : undefined}>
                    <th className="w-[34%] border-b border-[#e4ecf6] py-2.5 pr-3 align-top text-[12px] font-semibold text-[#6d7b93]">
                      {t(label)}
                    </th>
                    <td className="border-b border-[#e4ecf6] py-2.5 text-[13px] font-medium leading-5 text-[#1c2a4e]">
                      {t(value)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}

        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-[13px] font-bold text-[#1c2a4e]">{dossier.practitioner}</p>
            <p className="mt-3 text-[18px] font-semibold italic leading-none text-[#1c2a4e]/80">
              {dossier.practitioner.replace('Dr ', '')}
            </p>
            <p className="mt-1 text-[10px] text-[#8b95a8]">{t('dossiers.paper.signature')}</p>
          </div>
          <Stamp tone="navy" />
        </div>

        <PaperFooter fileName={document.name} page={page} pages={pages} />
      </div>
    </Paper>
  )
}

export function DocumentReader({ dossier, document }: DocumentReaderProps) {
  const { t } = useI18n()
  const { notify } = useToast()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [zoom, setZoom] = useState(100)
  const [page, setPage] = useState(1)
  const totalPages = Math.max(1, document.pages)

  useEffect(() => {
    setPage(1)
    setZoom(100)
    scrollRef.current?.scrollTo({ top: 0 })
  }, [document.id])

  useEffect(() => {
    const root = scrollRef.current
    if (!root) {
      return
    }

    const sections = root.querySelectorAll<HTMLElement>('[data-doc-page]')
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((left, right) => right.intersectionRatio - left.intersectionRatio)[0]
        const next = Number(visible?.target.getAttribute('data-doc-page'))
        if (next) {
          setPage(next)
        }
      },
      { root, threshold: 0.45 },
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [document.id, totalPages])

  useEffect(() => {
    const onBeforePrint = () => {
      const source = scrollRef.current?.querySelector('.document-print-area')
      if (source instanceof HTMLElement) {
        mountPrintSheet(source)
      }
    }
    const onAfterPrint = () => {
      removePrintSheet()
    }

    window.addEventListener('beforeprint', onBeforePrint)
    window.addEventListener('afterprint', onAfterPrint)
    const printQuery = window.matchMedia('print')
    const onPrintQuery = (event: MediaQueryListEvent) => {
      if (event.matches) {
        onBeforePrint()
      } else {
        onAfterPrint()
      }
    }
    printQuery.addEventListener('change', onPrintQuery)
    return () => {
      window.removeEventListener('beforeprint', onBeforePrint)
      window.removeEventListener('afterprint', onAfterPrint)
      printQuery.removeEventListener('change', onPrintQuery)
      removePrintSheet()
    }
  }, [document.id, totalPages])

  const goToPage = (next: number) => {
    const clamped = Math.min(totalPages, Math.max(1, next))
    setPage(clamped)
    const target = scrollRef.current?.querySelector(`[data-doc-page="${clamped}"]`)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const handleDownload = async () => {
    const root = scrollRef.current?.querySelector('.document-print-area')
    if (!(root instanceof HTMLElement)) {
      return
    }

    try {
      const fileName = pdfFileName(document.name)
      const blob = await createPdfFromPapers(root)
      const url = URL.createObjectURL(blob)
      const link = window.document.createElement('a')
      link.href = url
      link.download = fileName
      link.click()
      URL.revokeObjectURL(url)
      notify(interpolate(t('dossiers.viewer.downloaded'), { file: fileName }), 'success')
    } catch {
      notify(t('dossiers.viewer.downloadFailed'), 'error')
    }
  }

  const paper =
    document.documentType === 'ARRET_TRAVAIL' ? (
      <SickLeavePaper dossier={dossier} document={document} />
    ) : document.documentType === 'DEMANDE_VISITE' ? (
      <VisitRequestPaper dossier={dossier} document={document} />
    ) : document.documentType === 'FICHE_POSTE' ? (
      <JobSheetPaper dossier={dossier} document={document} />
    ) : document.documentType === 'COMPTE_RENDU' ? (
      <MedicalReportPaper dossier={dossier} document={document} />
    ) : document.documentType === 'EMAIL' ? (
      <EmailPaper dossier={dossier} document={document} />
    ) : (
      <FormPaper dossier={dossier} document={document} />
    )

  return (
    <div className="relative min-h-0 min-w-0 flex-1">
      <div
        ref={scrollRef}
        className="h-full min-h-0 min-w-0 overflow-y-auto bg-[#dfe6ef] px-3 pb-16 pt-5"
      >
        <div
          className="document-print-area mx-auto w-full space-y-4"
          style={{ zoom: zoom / 100 } as CSSProperties}
        >
          <div data-doc-page="1">{paper}</div>
          {Array.from({ length: totalPages - 1 }, (_, index) => {
            const annexPage = index + 2
            return (
              <div key={annexPage} data-doc-page={annexPage}>
                <AnnexPaper
                  dossier={dossier}
                  document={document}
                  page={annexPage}
                  pages={totalPages}
                />
              </div>
            )
          })}
        </div>
      </div>
      <div className="pointer-events-none absolute bottom-0 left-0 z-10">
        <DocumentViewerToolbar
          zoom={zoom}
          page={page}
          pages={totalPages}
          canZoomIn={zoom < ZOOM_MAX}
          canZoomOut={zoom > ZOOM_MIN}
          onZoomIn={() => setZoom((value) => Math.min(ZOOM_MAX, value + ZOOM_STEP))}
          onZoomOut={() => setZoom((value) => Math.max(ZOOM_MIN, value - ZOOM_STEP))}
          onPageChange={goToPage}
          onPrint={() => window.print()}
          onDownload={handleDownload}
        />
      </div>
    </div>
  )
}
