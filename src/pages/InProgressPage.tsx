import { useMemo, useState } from 'react'
import { PageFrame } from '@/components/layout/PageFrame'
import { useToast } from '@/components/ui'
import { interpolate } from '@/features/dossiers/format'
import { ProcessingActivityFeed } from '@/features/in-progress/components/ProcessingActivityFeed'
import { ProcessingStatCards } from '@/features/in-progress/components/ProcessingStatCards'
import { ProcessingTable } from '@/features/in-progress/components/ProcessingTable'
import { ProcessingWorkflow } from '@/features/in-progress/components/ProcessingWorkflow'
import { getInProgressData } from '@/features/in-progress/getInProgressData'
import { ACTIVITY_LABEL, STATUS_LABEL, STEP_LABEL } from '@/features/in-progress/format'
import type { ProcessingItem, ProcessingStep } from '@/features/in-progress/types'
import { useI18n } from '@/i18n'

const data = getInProgressData()

export function InProgressPage() {
  const { t } = useI18n()
  const { notify } = useToast()
  const [cardFilter, setCardFilter] = useState<ProcessingStep | 'all'>('all')

  const items = useMemo(
    () => (cardFilter === 'all' ? data.items : data.items.filter((item) => item.step === cardFilter)),
    [cardFilter],
  )

  const exportRows = (rows: ProcessingItem[]) => {
    const header = [
      t('inProgress.columns.reference'),
      t('inProgress.columns.employee'),
      t('inProgress.columns.step'),
      t('inProgress.columns.progress'),
      t('inProgress.columns.status'),
      t('inProgress.columns.lastActivity'),
      t('inProgress.columns.eta'),
    ]
    const lines = [
      header.join(';'),
      ...rows.map((item) =>
        [
          item.reference,
          item.employeeName,
          t(STEP_LABEL[item.step]),
          `${item.progress}%`,
          t(STATUS_LABEL[item.status]),
          t(ACTIVITY_LABEL[item.lastActivity]),
          String(item.etaMinutes),
        ].join(';'),
      ),
    ]
    const blob = new Blob([`\uFEFF${lines.join('\n')}`], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'dossiers-en-cours.csv'
    link.click()
    URL.revokeObjectURL(url)
    notify(interpolate(t('inProgress.exported'), { count: rows.length }), 'success')
  }

  return (
    <PageFrame className="xl:overflow-hidden">
      <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,320px)]">
        <div className="flex min-h-0 min-w-0 flex-col gap-4">
          <ProcessingStatCards summary={data.summary} active={cardFilter} onSelect={setCardFilter} />
          <ProcessingTable items={items} onExport={exportRows} />
        </div>

        <aside className="flex min-h-0 min-w-0 flex-col gap-4 xl:overflow-y-auto">
          <ProcessingWorkflow steps={data.workflow} />
          <ProcessingActivityFeed events={data.activity} />
        </aside>
      </div>
    </PageFrame>
  )
}
