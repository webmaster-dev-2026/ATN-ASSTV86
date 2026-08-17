import { useEffect, type ReactNode } from 'react'
import { useI18n } from '@/i18n'
import { CloseIcon } from './DossierIcons'

interface DossierActionPanelProps {
  open: boolean
  onClose: () => void
  children: ReactNode
}

export function DossierActionPanel({ open, onClose, children }: DossierActionPanelProps) {
  const { t } = useI18n()

  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  if (!open) {
    return null
  }

  return (
    <aside
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-action-title"
      className="absolute inset-y-0 right-0 z-20 flex h-full w-[min(100%,300px)] flex-col bg-white shadow-[-12px_0_32px_rgba(28,42,78,0.16)]"
    >
      <div className="flex shrink-0 items-center justify-between gap-2 px-3 py-2">
        <h2 id="dossier-action-title" className="text-[13px] font-bold text-[#1c2a4e]">
          {t('dossiers.workspace.actionTitle')}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="grid size-8 cursor-pointer place-items-center rounded-lg text-[#5b6b82] transition-colors hover:bg-[#eef5fc] hover:text-[#1c2a4e]"
          aria-label={t('dossiers.workspace.closeAction')}
        >
          <CloseIcon className="size-4" />
        </button>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-hidden px-2.5 pb-2.5">{children}</div>
    </aside>
  )
}
