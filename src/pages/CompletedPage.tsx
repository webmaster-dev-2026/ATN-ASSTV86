import { useMemo, useState } from 'react'
import { PageFrame } from '@/components/layout/PageFrame'
import { useToast } from '@/components/ui'
import { CompletedDetail } from '@/features/completed/components/CompletedDetail'
import { CompletedQueueTable } from '@/features/completed/components/CompletedQueueTable'
import { CompletedStatCards } from '@/features/completed/components/CompletedStatCards'
import { getCompletedData } from '@/features/completed/getCompletedData'
import { interpolate } from '@/features/dossiers/format'
import { useI18n, type TranslationKey } from '@/i18n'
import { cn } from '@/lib/cn'

const initialData = getCompletedData()

export function CompletedPage() {
  const { t } = useI18n()
  const { notify } = useToast()
  const [selectedId, setSelectedId] = useState<string | null>(initialData.items[0]?.id ?? null)

  const selected = useMemo(
    () => initialData.items.find((item) => item.id === selectedId) ?? null,
    [selectedId],
  )

  const notifyNamed = (key: TranslationKey, name: string, variant: 'success' | 'info' = 'info') => {
    notify(interpolate(t(key), { name }), variant)
  }

  return (
    <PageFrame className="xl:overflow-hidden">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
        <CompletedStatCards summary={initialData.summary} />

        <div
          className={cn(
            'grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-4',
            selected && 'xl:grid-cols-[minmax(0,1.55fr)_minmax(0,0.85fr)]',
          )}
        >
          <CompletedQueueTable
            items={initialData.items}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId((current) => (current === id ? null : id))}
          />
          {selected ? (
            <CompletedDetail
              item={selected}
              onPreview={() => {
                notifyNamed('completed.toast.preview', selected.employeeName)
              }}
              onExportPdf={() => {
                notifyNamed('completed.toast.exportPdf', selected.employeeName, 'success')
              }}
              onExportWord={() => {
                notifyNamed('completed.toast.exportWord', selected.employeeName, 'success')
              }}
              onShare={() => {
                notifyNamed('completed.toast.share', selected.employeeName)
              }}
              onViewDocument={(name) => notifyNamed('completed.toast.viewDocument', name)}
              onDownloadDocument={(name) => notifyNamed('completed.toast.downloadDocument', name, 'success')}
            />
          ) : null}
        </div>
      </div>
    </PageFrame>
  )
}
