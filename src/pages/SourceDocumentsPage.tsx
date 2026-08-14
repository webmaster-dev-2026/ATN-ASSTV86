import { useMemo, useState } from 'react'
import { PageFrame } from '@/components/layout/PageFrame'
import { useToast } from '@/components/ui'
import { SourceDocumentDetail } from '@/features/source-documents/components/SourceDocumentDetail'
import { SourceDocumentFilters } from '@/features/source-documents/components/SourceDocumentFilters'
import { SourceDocumentStatCards } from '@/features/source-documents/components/SourceDocumentStatCards'
import { SourceDocumentTable } from '@/features/source-documents/components/SourceDocumentTable'
import { EMPTY_FILTERS, toDateInput } from '@/features/source-documents/format'
import { getSourceDocumentsData } from '@/features/source-documents/getSourceDocumentsData'
import type { SourceDocFilterState, SourceDocStatus, SourceDocument } from '@/features/source-documents/types'
import { interpolate } from '@/features/dossiers/format'
import { useI18n, type TranslationKey } from '@/i18n'

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
  const [selectedId, setSelectedId] = useState(initialData.items[0]?.id ?? null)
  const [filters, setFilters] = useState<SourceDocFilterState>(EMPTY_FILTERS)
  const [cardFilter, setCardFilter] = useState<CardFilter>('total')

  const sources = useMemo(() => {
    return [...new Set(items.map((item) => item.companyName))].sort((left, right) => left.localeCompare(right))
  }, [items])

  const filtered = useMemo(() => {
    const needle = filters.query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesQuery =
        !needle ||
        item.fileName.toLowerCase().includes(needle) ||
        item.companyName.toLowerCase().includes(needle) ||
        item.uploadedBy.toLowerCase().includes(needle) ||
        item.employeeName.toLowerCase().includes(needle)
      const matchesSource = filters.source === 'all' || item.companyName === filters.source
      const matchesKind = filters.fileKind === 'all' || item.fileKind === filters.fileKind
      const matchesStatus = filters.status === 'all' || item.status === filters.status
      const day = toDateInput(item.uploadedAt)
      const matchesDate = !filters.from || day === filters.from
      const matchesCard =
        cardFilter === 'total' ||
        (cardFilter === 'analysed' && item.status === 'analysed') ||
        (cardFilter === 'reviewing' && item.status === 'reviewing') ||
        (cardFilter === 'error' && item.status === 'error')
      return matchesQuery && matchesSource && matchesKind && matchesStatus && matchesDate && matchesCard
    })
  }, [cardFilter, filters, items])

  const selected = filtered.find((item) => item.id === selectedId) ?? filtered[0] ?? null
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
    <PageFrame className="overflow-auto xl:overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <SourceDocumentStatCards summary={summary} active={cardFilter} onSelect={setCardFilter} />
        <SourceDocumentFilters
          value={filters}
          sources={sources}
          onChange={setFilters}
          onReset={() => {
            setFilters(EMPTY_FILTERS)
            setCardFilter('total')
          }}
        />

        <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(360px,0.9fr)]">
          <SourceDocumentTable
            items={filtered}
            selectedId={selected?.id ?? null}
            onSelect={setSelectedId}
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
          <SourceDocumentDetail
            item={selected}
            onOpen={() => {
              if (selected) {
                notifyNamed('sourceDocuments.toast.opened', selected.fileName)
              }
            }}
            onDownload={() => {
              if (selected) {
                notifyNamed('sourceDocuments.toast.downloaded', selected.fileName, 'success')
              }
            }}
            onReanalyse={() => {
              if (selected) {
                reanalyse(selected.id)
              }
            }}
          />
        </div>
      </div>
    </PageFrame>
  )
}
