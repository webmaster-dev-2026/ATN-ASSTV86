import { useMemo, useState } from 'react'
import { PageFrame } from '@/components/layout/PageFrame'
import { useToast } from '@/components/ui'
import { AnomalyDetail } from '@/features/anomalies/components/AnomalyDetail'
import { AnomalyList } from '@/features/anomalies/components/AnomalyList'
import { AnomalyStatCards } from '@/features/anomalies/components/AnomalyStatCards'
import { EMPTY_FILTERS, toDateInput } from '@/features/anomalies/format'
import { getAnomaliesData } from '@/features/anomalies/getAnomaliesData'
import { interpolate } from '@/features/dossiers/format'
import { useI18n, type TranslationKey } from '@/i18n'
import { cn } from '@/lib/cn'
import type { AnomalyFilterState, AnomalyItem, AnomalySummary } from '@/features/anomalies/types'

const initialData = getAnomaliesData()

function summaryFrom(items: AnomalyItem[]): AnomalySummary {
  return {
    critical: items.filter((item) => item.severity === 'critical' && item.status !== 'resolved').length,
    warning: items.filter((item) => item.severity === 'warning' && item.status !== 'resolved').length,
    resolved: items.filter((item) => item.status === 'resolved').length,
    blocked: items.filter((item) => item.status === 'blocked').length,
  }
}

export function AnomaliesPage() {
  const { t } = useI18n()
  const { notify } = useToast()
  const [items, setItems] = useState(initialData.items)
  const [selectedId, setSelectedId] = useState(initialData.items[0]?.id ?? null)
  const [filters, setFilters] = useState<AnomalyFilterState>(EMPTY_FILTERS)
  const [cardFilter, setCardFilter] = useState<keyof AnomalySummary | 'all'>('all')

  const assignees = useMemo(() => {
    const unique = new Map<string, string>()
    for (const item of items) {
      unique.set(item.assigneeId, item.assigneeName)
    }
    return [...unique.entries()].map(([id, name]) => ({ id, name }))
  }, [items])

  const filtered = useMemo(() => {
    const needle = filters.query.trim().toLowerCase()
    return items.filter((item) => {
      const matchesQuery =
        !needle ||
        item.title.toLowerCase().includes(needle) ||
        item.reference.toLowerCase().includes(needle) ||
        item.employeeName.toLowerCase().includes(needle) ||
        item.id.toLowerCase().includes(needle)
      const matchesSeverity = filters.severity === 'all' || item.severity === filters.severity
      const matchesStatus = filters.status === 'all' || item.status === filters.status
      const matchesType = filters.type === 'all' || item.type === filters.type
      const matchesAssignee = filters.assigneeId === 'all' || item.assigneeId === filters.assigneeId
      const day = toDateInput(item.detectedAt)
      const matchesFrom = !filters.from || day >= filters.from
      const matchesTo = !filters.to || day <= filters.to
      const matchesCard =
        cardFilter === 'all' ||
        (cardFilter === 'resolved' && item.status === 'resolved') ||
        (cardFilter === 'blocked' && item.status === 'blocked') ||
        (cardFilter === 'critical' && item.severity === 'critical' && item.status !== 'resolved') ||
        (cardFilter === 'warning' && item.severity === 'warning' && item.status !== 'resolved')
      return (
        matchesQuery &&
        matchesSeverity &&
        matchesStatus &&
        matchesType &&
        matchesAssignee &&
        matchesFrom &&
        matchesTo &&
        matchesCard
      )
    })
  }, [cardFilter, filters, items])

  const selected = filtered.find((item) => item.id === selectedId) ?? null
  const summary = useMemo(() => summaryFrom(items), [items])

  const notifyNamed = (key: TranslationKey, name: string, variant: 'success' | 'info' = 'info') => {
    notify(interpolate(t(key), { name }), variant)
  }

  return (
    <PageFrame className="overflow-auto xl:overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <AnomalyStatCards summary={summary} active={cardFilter} onSelect={setCardFilter} />

        <div
          className={cn(
            'grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-4',
            selected && 'xl:grid-cols-[minmax(0,1.45fr)_minmax(340px,0.9fr)]',
          )}
        >
          <AnomalyList
            items={filtered}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId((current) => (current === id ? null : id))}
            filters={filters}
            assignees={assignees}
            onFiltersChange={setFilters}
          />
          {selected ? (
            <AnomalyDetail
              item={selected}
              onEdit={() => {
                notifyNamed('anomalies.toast.edit', selected.employeeName)
              }}
              onResolve={() => {
                if (selected.status === 'resolved') {
                  return
                }
                setItems((current) =>
                  current.map((item) =>
                    item.id === selected.id
                      ? {
                          ...item,
                          status: 'resolved',
                          history: [
                            ...item.history,
                            {
                              id: `${item.id}-resolved-ui`,
                              at: new Date().toISOString(),
                              actorName: item.assigneeName,
                              kind: 'resolved',
                            },
                          ],
                        }
                      : item,
                  ),
                )
                notifyNamed('anomalies.toast.resolved', selected.employeeName, 'success')
              }}
            />
          ) : null}
        </div>
      </div>
    </PageFrame>
  )
}
