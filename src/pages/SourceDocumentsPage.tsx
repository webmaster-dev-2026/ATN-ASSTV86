import { useMemo, useState } from 'react'
import { PageFrame } from '@/components/layout/PageFrame'
import { useToast } from '@/components/ui'
import { SourceDocumentDetail } from '@/features/source-documents/components/SourceDocumentDetail'
import { SourceDocumentStatCards } from '@/features/source-documents/components/SourceDocumentStatCards'
import { SourceDocumentTable } from '@/features/source-documents/components/SourceDocumentTable'
import { getSourceDocumentsData } from '@/features/source-documents/getSourceDocumentsData'
import type { SourceDocStatus, SourceDocument } from '@/features/source-documents/types'
import { interpolate } from '@/features/dossiers/format'
import { useI18n, type TranslationKey } from '@/i18n'
import { cn } from '@/lib/cn'

const initialData = getSourceDocumentsData()

type CardFilter = 'total' | 'analysed' | 'reviewing' | 'error'

function summaryFrom(items: SourceDocument[]) {
  return {
    total: items.length,
    analysed: items.filter((item) => item.status === 'analysed').length,
    reviewing: items.filter((item) => item.status === 'reviewing').length,
    error: items.filter((item) => item.status === 'error').length,
    totalChange: initialData.summary.totalChange,
    analysedChange: initialData.summary.analysedChange,
    reviewingChange: initialData.summary.reviewingChange,
    errorChange: initialData.summary.errorChange,
  }
}

export function SourceDocumentsPage() {
  const { t } = useI18n()
  const { notify } = useToast()
  const [items, setItems] = useState(initialData.items)
  const [selectedId, setSelectedId] = useState<string | null>(initialData.items[0]?.id ?? null)
  const [cardFilter, setCardFilter] = useState<CardFilter>('total')

  const filtered = useMemo(() => {
    return items.filter((item) => {
      return (
        cardFilter === 'total' ||
        (cardFilter === 'analysed' && item.status === 'analysed') ||
        (cardFilter === 'reviewing' && item.status === 'reviewing') ||
        (cardFilter === 'error' && item.status === 'error')
      )
    })
  }, [cardFilter, items])

  const selected = filtered.find((item) => item.id === selectedId) ?? null
  const summary = useMemo(() => summaryFrom(items), [items])

  const notifyNamed = (key: TranslationKey, name: string, variant: 'success' | 'info' = 'info') => {
    notify(interpolate(t(key), { name }), variant)
  }

  const reanalyse = (id: string) => {
    const target = items.find((item) => item.id === id)
    if (!target) {
      return
    }
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              status: 'reviewing' as SourceDocStatus,
              history: [
                ...item.history,
                {
                  id: `${item.id}-reanalysed-${item.history.length}`,
                  at: new Date().toISOString(),
                  actorName: 'Sophie Martin',
                  kind: 'reanalysed' as const,
                },
              ],
            }
          : item,
      ),
    )
    notifyNamed('sourceDocuments.toast.reanalysed', target.fileName, 'success')
  }

  return (
    <PageFrame className="xl:overflow-hidden">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
        <SourceDocumentStatCards summary={summary} active={cardFilter} onSelect={setCardFilter} />

        <div
          className={cn(
            'grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-4',
            selected && 'xl:grid-cols-[minmax(0,1.55fr)_minmax(0,0.9fr)]',
          )}
        >
          <SourceDocumentTable
            items={filtered}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId((current) => (current === id ? null : id))}
            onOpen={(id) => {
              const target = items.find((item) => item.id === id)
              if (target) {
                notifyNamed('sourceDocuments.toast.opened', target.fileName)
              }
            }}
            onDownload={(id) => {
              const target = items.find((item) => item.id === id)
              if (target) {
                notifyNamed('sourceDocuments.toast.downloaded', target.fileName, 'success')
              }
            }}
            onReanalyse={reanalyse}
          />
          {selected ? (
            <SourceDocumentDetail
              item={selected}
              onOpen={() => {
                notifyNamed('sourceDocuments.toast.opened', selected.fileName)
              }}
              onDownload={() => {
                notifyNamed('sourceDocuments.toast.downloaded', selected.fileName, 'success')
              }}
              onReanalyse={() => {
                reanalyse(selected.id)
              }}
            />
          ) : null}
        </div>
      </div>
    </PageFrame>
  )
}
