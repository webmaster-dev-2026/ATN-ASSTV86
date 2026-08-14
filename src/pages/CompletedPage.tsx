import { useMemo, useState } from 'react'
import { PageFrame } from '@/components/layout/PageFrame'
import { useToast } from '@/components/ui'
import { CompletedDetail } from '@/features/completed/components/CompletedDetail'
import { CompletedQueueTable } from '@/features/completed/components/CompletedQueueTable'
import { CompletedStatCards } from '@/features/completed/components/CompletedStatCards'
import { getCompletedData } from '@/features/completed/getCompletedData'
import { interpolate } from '@/features/dossiers/format'
import { useI18n, type TranslationKey } from '@/i18n'

const initialData = getCompletedData()

export function CompletedPage() {
  const { t } = useI18n()
  const { notify } = useToast()
  const [selectedId, setSelectedId] = useState(initialData.items[0]?.id ?? null)

  const selected = useMemo(
    () => initialData.items.find((item) => item.id === selectedId) ?? null,
    [selectedId],
  )

  const notifyNamed = (key: TranslationKey, name: string, variant: 'success' | 'info' = 'info') => {
    notify(interpolate(t(key), { name }), variant)
  }

  return (
    <PageFrame className="overflow-auto xl:overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <CompletedStatCards summary={initialData.summary} />

        <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(320px,0.85fr)]">
          <CompletedQueueTable
            items={initialData.items}
            selectedId={selectedId}
            onSelect={setSelectedId}
          />
          <CompletedDetail
            item={selected}
            onPreview={() => {
              if (selected) {
                notifyNamed('completed.toast.preview', selected.employeeName)
              }
            }}
            onExportPdf={() => {
              if (selected) {
                notifyNamed('completed.toast.exportPdf', selected.employeeName, 'success')
              }
            }}
            onExportWord={() => {
              if (selected) {
                notifyNamed('completed.toast.exportWord', selected.employeeName, 'success')
              }
            }}
            onShare={() => {
              if (selected) {
                notifyNamed('completed.toast.share', selected.employeeName)
              }
            }}
            onViewDocument={(name) => notifyNamed('completed.toast.viewDocument', name)}
            onDownloadDocument={(name) => notifyNamed('completed.toast.downloadDocument', name, 'success')}
          />
        </div>
      </div>
    </PageFrame>
  )
}
