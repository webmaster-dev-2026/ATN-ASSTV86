import { PageFrame } from '@/components/layout/PageFrame'
import { ActivityChart } from '@/features/dashboard/components/ActivityChart'
import { ProcessingOverview } from '@/features/dashboard/components/ProcessingOverview'
import { RecentFiles } from '@/features/dashboard/components/RecentFiles'
import { StatCards } from '@/features/dashboard/components/StatCards'
import { UpcomingAppointments } from '@/features/dashboard/components/UpcomingAppointments'
import { ValidationQueue } from '@/features/dashboard/components/ValidationQueue'
import { getDashboardData } from '@/features/dashboard/getDashboardData'

const dashboard = getDashboardData()

export function DashboardPage() {
  return (
    <PageFrame className="overflow-auto xl:overflow-hidden">
      <div className="flex min-h-0 flex-1 flex-col gap-4">
        <StatCards summary={dashboard.summary} />

        <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-4 xl:grid-cols-3">
          <RecentFiles files={dashboard.recentFiles} />
          <ValidationQueue items={dashboard.validationQueue} />
        </div>

        <div className="grid grid-cols-1 gap-4 xl:h-[300px] xl:shrink-0 xl:grid-cols-3">
          <ProcessingOverview
            total={dashboard.processingOverview.total}
            segments={dashboard.processingOverview.segments}
          />
          <UpcomingAppointments items={dashboard.appointments} />
          <ActivityChart points={dashboard.activity} />
        </div>
      </div>
    </PageFrame>
  )
}
