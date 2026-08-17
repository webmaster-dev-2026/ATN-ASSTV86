import { Link } from 'react-router-dom'
import { useI18n } from '@/i18n'
import { WORKFLOW_LABEL } from '../format'
import type { WorkflowStep } from '../types'

interface ProcessingWorkflowProps {
  steps: WorkflowStep[]
}

export function ProcessingWorkflow({ steps }: ProcessingWorkflowProps) {
  const { t } = useI18n()

  return (
    <section className="rounded-2xl border border-[#e8eef6] bg-white p-4 shadow-[0_1px_2px_rgba(28,42,78,0.04)]">
      <div className="flex items-center justify-between gap-3">
        <h2 className="truncate text-[15px] font-bold text-[#1c2a4e]">{t('inProgress.workflowTitle')}</h2>
        <Link
          to="/dossiers"
          className="shrink-0 text-[12px] font-semibold text-[#2860B9] transition-colors hover:text-[#1d4f9a]"
        >
          {t('inProgress.seeDetails')}
        </Link>
      </div>

      <ol className="mt-3 space-y-1">
        {steps.map((step) => (
          <li key={step.id} className="flex items-center gap-2.5 rounded-lg px-1 py-1.5">
            <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: step.tone }} />
            <span className="w-8 shrink-0 text-[11px] font-bold tabular-nums text-[#8b95a8]">{step.code}</span>
            <span className="min-w-0 flex-1 truncate text-[13px] font-medium text-[#1c2a4e]">
              {t(WORKFLOW_LABEL[step.id])}
            </span>
            <span className="shrink-0 text-[13px] font-bold tabular-nums text-[#1c2a4e]">{step.count}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
