import { FileTypeIcon } from '@/features/dashboard/components/FileTypeIcon'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { documentTypeLabel, formatDate, interpolate } from '../format'
import type { DossierDocument } from '../types'
import { PlusIcon } from './DossierIcons'

interface DossierDocumentsProps {
  documents: DossierDocument[]
  selectedId: string | null
  onSelect: (id: string) => void
  onAdd?: () => void
}

export function DossierDocuments({ documents, selectedId, onSelect, onAdd }: DossierDocumentsProps) {
  const { t, locale } = useI18n()

  return (
    <section className="flex h-full min-h-0 w-[200px] shrink-0 flex-col overflow-hidden rounded-xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)] sm:w-[240px] xl:w-[260px]">
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-[#eef3f9] px-2.5 py-2 sm:px-3">
        <h3 className="truncate text-[13px] font-bold text-[#1c2a4e]">
          {interpolate(t('dossiers.workspace.documents'), { count: documents.length })}
        </h3>
        <button
          type="button"
          onClick={onAdd}
          className="inline-flex shrink-0 cursor-pointer items-center gap-0.5 text-[11px] font-semibold text-[#1d4f9a] hover:underline"
        >
          <PlusIcon className="size-3" />
          {t('dossiers.documents.add')}
        </button>
      </div>
      <ul className="min-h-0 flex-1 space-y-0.5 overflow-y-auto p-1.5">
        {documents.map((document) => {
          const selected = document.id === selectedId
          return (
            <li key={document.id}>
              <button
                type="button"
                onClick={() => onSelect(document.id)}
                className={cn(
                  'flex w-full cursor-pointer items-start gap-2 rounded-lg px-2 py-1.5 text-left transition-colors',
                  selected ? 'bg-[#eef5fc]' : 'hover:bg-[#f7fafc]',
                )}
              >
                <FileTypeIcon type={document.fileType} className="mt-0.5 size-6 shrink-0" />
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-semibold text-[#1c2a4e]">
                    {documentTypeLabel(document.documentType, t)}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] text-[#8b95a8]" title={document.name}>
                    {document.name}
                  </span>
                  <span className="mt-0.5 block text-[10px] text-[#8b95a8]">
                    {interpolate(t('dossiers.documents.pages'), { count: document.pages })}
                    <span className="px-1">·</span>
                    {formatDate(document.receivedAt, locale)}
                  </span>
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </section>
  )
}
