import { useEffect, useId, useRef, useState, type ChangeEvent, type DragEvent, type ReactNode } from 'react'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { interpolate } from '../format'
import { ArrowLeftIcon, CloseIcon, PlusIcon } from './DossierIcons'

type Step = 'choose' | 'upload' | 'manual'

interface SelectedFile {
  id: string
  name: string
  sizeLabel: string
}

interface NewRequestModalProps {
  open: boolean
  onClose: () => void
  onCreated: () => void
}

function formatBytes(size: number) {
  if (size < 1024 * 1024) {
    return `${Math.max(1, Math.round(size / 1024))} KB`
  }
  return `${(size / (1024 * 1024)).toFixed(1)} MB`
}

export function NewRequestModal({ open, onClose, onCreated }: NewRequestModalProps) {
  const { t } = useI18n()
  const titleId = useId()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [step, setStep] = useState<Step>('choose')
  const [files, setFiles] = useState<SelectedFile[]>([])
  const [sender, setSender] = useState('')
  const [subject, setSubject] = useState('')
  const [content, setContent] = useState('')
  const [dragging, setDragging] = useState(false)

  useEffect(() => {
    if (!open) return
    setStep('choose')
    setFiles([])
    setSender('')
    setSubject('')
    setContent('')
    setDragging(false)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [onClose, open])

  if (!open) return null

  const addFiles = (list: FileList | null) => {
    if (!list) return
    const next = Array.from(list)
      .slice(0, Math.max(0, 10 - files.length))
      .map((file) => ({
        id: `${file.name}-${file.size}-${file.lastModified}`,
        name: file.name,
        sizeLabel: formatBytes(file.size),
      }))
    setFiles((current) => {
      const seen = new Set(current.map((item) => item.id))
      return [...current, ...next.filter((item) => !seen.has(item.id))].slice(0, 10)
    })
  }

  const submit = () => {
    onCreated()
    onClose()
  }

  const breadcrumb =
    step === 'upload'
      ? t('dossiers.create.breadcrumbUpload')
      : step === 'manual'
        ? t('dossiers.create.breadcrumbManual')
        : t('dossiers.create.title')

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#1c2a4e]/45 p-4" role="presentation">
      <button type="button" className="absolute inset-0 cursor-default" aria-label={t('dossiers.create.close')} onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative z-10 flex max-h-[min(90dvh,720px)] w-full max-w-[720px] flex-col overflow-hidden rounded-2xl bg-white shadow-[0_20px_60px_rgba(28,42,78,0.28)]"
      >
        <div className="flex shrink-0 items-center gap-2 border-b border-[#eef3f9] px-4 py-3 sm:px-5">
          {step !== 'choose' ? (
            <button
              type="button"
              className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] hover:bg-[#eef5fc]"
              aria-label={t('dossiers.create.back')}
              onClick={() => setStep('choose')}
            >
              <ArrowLeftIcon />
            </button>
          ) : null}
          <h2 id={titleId} className="min-w-0 flex-1 truncate text-[16px] font-bold text-[#1c2a4e]">
            {breadcrumb}
          </h2>
          <button
            type="button"
            className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] hover:bg-[#eef5fc]"
            aria-label={t('dossiers.create.close')}
            onClick={onClose}
          >
            <CloseIcon />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 sm:px-5">
          {step === 'choose' ? (
            <div className="space-y-4">
              <p className="text-[14px] font-medium text-[#5b6b82]">{t('dossiers.create.chooseTitle')}</p>
              <div className="grid gap-3 sm:grid-cols-2">
                <MethodCard
                  title={t('dossiers.create.uploadTitle')}
                  description={t('dossiers.create.uploadDesc')}
                  cta={t('dossiers.create.uploadCta')}
                  primary
                  onClick={() => setStep('upload')}
                  icon={
                    <svg viewBox="0 0 24 24" className="size-7 text-[#1d4f9a]" fill="none" aria-hidden>
                      <path d="M12 16V7M8.5 10.5 12 7l3.5 3.5M6 17.5h12" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                />
                <MethodCard
                  title={t('dossiers.create.manualTitle')}
                  description={t('dossiers.create.manualDesc')}
                  cta={t('dossiers.create.manualCta')}
                  onClick={() => setStep('manual')}
                  icon={
                    <svg viewBox="0 0 24 24" className="size-7 text-[#1d4f9a]" fill="none" aria-hidden>
                      <path d="M14.5 5.5 18.5 9.5M5 19l.8-4.2L15.8 4.8a1.8 1.8 0 0 1 2.5 0l1 1a1.8 1.8 0 0 1 0 2.5L9.2 18.2 5 19Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  }
                />
              </div>
            </div>
          ) : null}

          {step === 'upload' ? (
            <div className="space-y-4">
              <div
                className={cn(
                  'rounded-2xl border border-dashed px-4 py-10 text-center transition-colors',
                  dragging ? 'border-[#1d4f9a] bg-[#eef5fc]' : 'border-[#c5d4ea] bg-[#f7fafc]',
                )}
                onDragOver={(event: DragEvent) => {
                  event.preventDefault()
                  setDragging(true)
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={(event: DragEvent) => {
                  event.preventDefault()
                  setDragging(false)
                  addFiles(event.dataTransfer.files)
                }}
              >
                <p className="text-[14px] font-semibold text-[#1c2a4e]">
                  {t('dossiers.create.dropzone')}{' '}
                  <button
                    type="button"
                    className="cursor-pointer text-[#1d4f9a] underline"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    {t('dossiers.create.browse')}
                  </button>
                </p>
                <p className="mt-2 text-[12px] text-[#8b95a8]">{t('dossiers.create.formats')}</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    addFiles(event.target.files)
                    event.target.value = ''
                  }}
                />
              </div>

              {files.length > 0 ? (
                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <p className="text-[13px] font-semibold text-[#1c2a4e]">
                      {interpolate(t('dossiers.create.selectedFiles'), { count: files.length })}
                    </p>
                    <button
                      type="button"
                      className="cursor-pointer text-[12px] font-semibold text-[#1d4f9a] hover:underline"
                      onClick={() => setFiles([])}
                    >
                      {t('dossiers.create.clearAll')}
                    </button>
                  </div>
                  <ul className="space-y-2">
                    {files.map((file) => (
                      <li
                        key={file.id}
                        className="flex items-center justify-between gap-3 rounded-xl border border-[#eef3f9] px-3 py-2.5"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold text-[#1c2a4e]">{file.name}</p>
                          <p className="text-[11px] text-[#8b95a8]">{file.sizeLabel}</p>
                        </div>
                        <button
                          type="button"
                          className="grid size-7 cursor-pointer place-items-center rounded-md text-[#8b95a8] hover:bg-[#f7fafc]"
                          aria-label={t('dossiers.create.removeFile')}
                          onClick={() => setFiles((current) => current.filter((item) => item.id !== file.id))}
                        >
                          <CloseIcon className="size-3.5" />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {step === 'manual' ? (
            <div className="space-y-3">
              <Field label={t('dossiers.create.sender')} required>
                <input
                  value={sender}
                  onChange={(event) => setSender(event.target.value)}
                  className="field-input h-10 w-full rounded-lg border border-[#e4ecf6] px-3 text-[13px] text-[#1c2a4e] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                />
              </Field>
              <Field label={t('dossiers.create.subject')} required>
                <input
                  value={subject}
                  onChange={(event) => setSubject(event.target.value)}
                  className="h-10 w-full rounded-lg border border-[#e4ecf6] px-3 text-[13px] text-[#1c2a4e] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                />
              </Field>
              <Field label={t('dossiers.create.content')} required>
                <textarea
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  rows={6}
                  className="w-full rounded-lg border border-[#e4ecf6] px-3 py-2 text-[13px] text-[#1c2a4e] outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30"
                />
              </Field>
              <div>
                <p className="mb-2 text-[12px] font-semibold text-[#8b95a8]">{t('dossiers.create.attachments')}</p>
                <button
                  type="button"
                  className="inline-flex h-9 cursor-pointer items-center gap-1.5 rounded-lg border border-[#e4ecf6] bg-white px-3 text-[13px] font-semibold text-[#1d4f9a] hover:bg-[#f7fafc]"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <PlusIcon className="size-3.5" />
                  {t('dossiers.create.addFiles')}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  className="hidden"
                  onChange={(event: ChangeEvent<HTMLInputElement>) => {
                    addFiles(event.target.files)
                    event.target.value = ''
                  }}
                />
                {files.length > 0 ? (
                  <ul className="mt-2 space-y-1">
                    {files.map((file) => (
                      <li key={file.id} className="text-[12px] text-[#5b6b82]">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            </div>
          ) : null}
        </div>

        {step !== 'choose' ? (
          <div className="flex shrink-0 justify-end gap-2 border-t border-[#eef3f9] px-4 py-3 sm:px-5">
            <button
              type="button"
              className="h-9 cursor-pointer rounded-lg border border-[#e4ecf6] bg-white px-4 text-[13px] font-semibold text-[#1c2a4e] hover:bg-[#f7fafc]"
              onClick={onClose}
            >
              {t('dossiers.create.cancel')}
            </button>
            <button
              type="button"
              className="h-9 cursor-pointer rounded-lg bg-[#1d4f9a] px-4 text-[13px] font-semibold text-white hover:bg-[#163e7a] disabled:cursor-not-allowed disabled:opacity-50"
              disabled={step === 'upload' ? files.length === 0 : !sender.trim() || !subject.trim() || !content.trim()}
              onClick={submit}
            >
              {t('dossiers.create.submit')}
            </button>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function MethodCard({
  title,
  description,
  cta,
  icon,
  primary,
  onClick,
}: {
  title: string
  description: string
  cta: string
  icon: ReactNode
  primary?: boolean
  onClick: () => void
}) {
  return (
    <div className="flex flex-col rounded-2xl border border-[#e4ecf6] bg-white p-4 shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <div className="mb-3 grid size-12 place-items-center rounded-xl bg-[#eef5fc]">{icon}</div>
      <h3 className="text-[15px] font-bold text-[#1c2a4e]">{title}</h3>
      <p className="mt-1 flex-1 text-[13px] leading-5 text-[#6d7b93]">{description}</p>
      <button
        type="button"
        onClick={onClick}
        className={cn(
          'mt-4 h-9 cursor-pointer rounded-lg px-3 text-[13px] font-semibold transition-colors',
          primary
            ? 'bg-[#1d4f9a] text-white hover:bg-[#163e7a]'
            : 'border border-[#1d4f9a] bg-white text-[#1d4f9a] hover:bg-[#eef5fc]',
        )}
      >
        {cta}
      </button>
    </div>
  )
}

function Field({
  label,
  required,
  children,
}: {
  label: string
  required?: boolean
  children: ReactNode
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[12px] font-semibold text-[#8b95a8]">
        {label}
        {required ? <span className="text-[#e54848]">*</span> : null}
      </span>
      {children}
    </label>
  )
}
