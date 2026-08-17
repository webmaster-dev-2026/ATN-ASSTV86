import { useMemo, useState } from 'react'
import { PageFrame } from '@/components/layout/PageFrame'
import { useToast } from '@/components/ui'
import { ValidationDetail } from '@/features/to-validate/components/ValidationDetail'
import { ValidationQueueTable } from '@/features/to-validate/components/ValidationQueueTable'
import { ValidationStatCards } from '@/features/to-validate/components/ValidationStatCards'
import { getToValidateData } from '@/features/to-validate/getToValidateData'
import type { ValidationSummary } from '@/features/to-validate/types'
import { interpolate } from '@/features/dossiers/format'
import { useI18n, type TranslationKey } from '@/i18n'
import { cn } from '@/lib/cn'

const initialData = getToValidateData()

function summaryFrom(items: typeof initialData.items, baseline: ValidationSummary): ValidationSummary {
  return {
    pendingDossiers: items.length,
    fieldsToConfirm: items.reduce((sum, item) => sum + item.fieldsToConfirm, 0),
    urgentDecisions: items.filter((item) => item.priority === 'high').length,
    pendingChange: baseline.pendingChange,
    fieldsChange: baseline.fieldsChange,
    urgentChange: baseline.urgentChange,
  }
}

export function ToValidatePage() {
  const { t } = useI18n()
  const { notify } = useToast()
  const [items, setItems] = useState(initialData.items)
  const [selectedId, setSelectedId] = useState(initialData.items[0]?.id ?? null)
  const [options, setOptions] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})

  const selected = useMemo(
    () => items.find((item) => item.id === selectedId) ?? null,
    [items, selectedId],
  )
  const summary = useMemo(
    () => summaryFrom(items, initialData.summary),
    [items],
  )

  const notifyNamed = (key: TranslationKey, name: string, variant: 'success' | 'info' = 'info') => {
    notify(interpolate(t(key), { name }), variant)
  }

  const removeSelected = () => {
    if (!selected) {
      return
    }
    const remaining = items.filter((item) => item.id !== selected.id)
    const currentIndex = items.findIndex((item) => item.id === selected.id)
    const next = remaining[currentIndex] ?? remaining[currentIndex - 1] ?? null
    setItems(remaining)
    setSelectedId(next?.id ?? null)
  }

  return (
    <PageFrame className="overflow-auto xl:overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <ValidationStatCards summary={summary} />

        <div
          className={cn(
            'grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-4',
            selected && 'xl:grid-cols-[minmax(0,1.4fr)_minmax(360px,0.95fr)]',
          )}
        >
          <ValidationQueueTable
            items={items}
            selectedId={selectedId}
            onSelect={(id) => setSelectedId((current) => (current === id ? null : id))}
          />
          {selected ? (
            <ValidationDetail
              item={selected}
              selectedOption={options[selected.id] ?? selected.proposal}
              note={notes[selected.id] ?? ''}
              onSelectOption={(option) => {
                setOptions((current) => ({ ...current, [selected.id]: option }))
              }}
              onNoteChange={(value) => {
                setNotes((current) => ({ ...current, [selected.id]: value }))
              }}
              onConfirm={() => {
                notifyNamed('toValidate.toast.confirmed', selected.employeeName, 'success')
                removeSelected()
              }}
              onEdit={() => {
                notifyNamed('toValidate.toast.edit', selected.employeeName)
              }}
              onRequestMore={() => {
                notifyNamed('toValidate.toast.requestMore', selected.employeeName)
              }}
              onSkip={() => {
                notifyNamed('toValidate.toast.skipped', selected.employeeName)
                removeSelected()
              }}
            />
          ) : null}
        </div>
      </div>
    </PageFrame>
  )
}
