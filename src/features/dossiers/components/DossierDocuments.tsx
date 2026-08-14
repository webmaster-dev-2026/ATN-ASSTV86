import { FileTypeIcon } from '@/features/dashboard/components/FileTypeIcon'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { documentTypeLabel, interpolate } from '../format'
import type { DossierDocument } from '../types'

interface DossierDocumentsProps {
  documents: DossierDocument[]
  selectedId: string | null
  onSelect: (id: string) => void
}

export function DossierDocuments({ documents, selectedId, onSelect }: DossierDocumentsProps) {
  const { t } = useI18n()

  return (
    <section className="flex h-full min-h-0 w-[168px] shrink-0 flex-col overflow-hidden rounded-2xl bg-white shadow-[0_1px_2px_rgba(28,42,78,0.04)] sm:w-[200px] xl:w-[220px]">
      <h3 className="shrink-0 px-3 py-3 text-[13px] font-bold leading-4 text-[#1c2a4e] [font-family:var(--font-sans)] sm:px-4 sm:text-[14px]">
        {t('dossiers.documents.title')}
      </h3>
      <ul className="min-h-0 flex-1 space-y-1 overflow-y-auto px-2 pb-3">
        {documents.map((document) => {
          const selected = document.id === selectedId
          return (
            <li key={document.id}>
              <button
                type="button"
                onClick={() => onSelect(document.id)}
                className={cn(
                  'flex w-full cursor-pointer items-start gap-2 rounded-xl px-2 py-2 text-left transition-colors',
                  selected ? 'bg-[#eef5fc]' : 'hover:bg-[#f7fafc]',
                )}
              >
                <FileTypeIcon type={document.fileType} className="mt-0.5 size-7 shrink-0" />
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-semibold text-[#1c2a4e]">
                    {documentTypeLabel(document.documentType, t)}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] text-[#8b95a8]" title={document.name}>
                    {document.name}
                  </span>
                  <span className="mt-0.5 hidden text-[11px] text-[#8b95a8] sm:block">
                    {interpolate(t('dossiers.documents.pages'), { count: document.pages })}
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
