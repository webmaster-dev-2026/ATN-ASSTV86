import { useState } from 'react'
import { PageFrame } from '@/components/layout/PageFrame'
import { useToast } from '@/components/ui'
import { DossiersListTable } from '@/features/dossiers/components/DossiersListTable'
import { NewRequestModal } from '@/features/dossiers/components/NewRequestModal'
import { getDossiersData } from '@/features/dossiers/getDossiersData'
import { useI18n } from '@/i18n'

const dossiers = getDossiersData()

export function DossiersPage() {
  const { t } = useI18n()
  const { notify } = useToast()
  const [createOpen, setCreateOpen] = useState(false)

  return (
    <PageFrame className="overflow-hidden">
      <DossiersListTable cases={dossiers.cases} onNewRequest={() => setCreateOpen(true)} />
      <NewRequestModal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreated={() => notify(t('dossiers.create.created'), 'success')}
      />
    </PageFrame>
  )
}
