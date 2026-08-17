import { useMemo, useState } from 'react'
import { PageFrame } from '@/components/layout/PageFrame'
import { AnomalyClassification } from '@/features/statistics/components/AnomalyClassification'
import { ReceivedByDayChart } from '@/features/statistics/components/ReceivedByDayChart'
import { StatKpiCards } from '@/features/statistics/components/StatKpiCards'
import { StatusDistribution } from '@/features/statistics/components/StatusDistribution'
import { TopFacilities } from '@/features/statistics/components/TopFacilities'
import { VisitTypeChart } from '@/features/statistics/components/VisitTypeChart'
import {
  anomaliesByPeriod,
  facilitiesByPeriod,
  getStatisticsData,
  receivedByPeriod,
  visitTypesByPeriod,
} from '@/features/statistics/getStatisticsData'
import type { StatisticsPeriod } from '@/features/statistics/types'

const initialData = getStatisticsData()

export function StatisticsPage() {
  const [receivedPeriod, setReceivedPeriod] = useState<StatisticsPeriod>('last30Days')
  const [visitPeriod, setVisitPeriod] = useState<StatisticsPeriod>('last30Days')
  const [updatedAt, setUpdatedAt] = useState(initialData.updatedAt)

  const dailyPoints = useMemo(() => receivedByPeriod(initialData, receivedPeriod), [receivedPeriod])
  const visitTypes = useMemo(() => visitTypesByPeriod(initialData, visitPeriod), [visitPeriod])
  const anomalies = useMemo(() => anomaliesByPeriod(initialData, 'last30Days'), [])
  const facilities = useMemo(() => facilitiesByPeriod(initialData, 'last30Days'), [])

  return (
    <PageFrame>
      <div className="flex min-h-0 flex-1 flex-col gap-3 sm:gap-4">
        <StatKpiCards summary={initialData.summary} />

        <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2">
          <ReceivedByDayChart points={dailyPoints} period={receivedPeriod} onPeriodChange={setReceivedPeriod} />
          <VisitTypeChart items={visitTypes} period={visitPeriod} onPeriodChange={setVisitPeriod} />
        </div>

        <div className="grid w-full min-w-0 grid-cols-1 gap-3 sm:gap-4 lg:grid-cols-2 xl:grid-cols-3">
          <StatusDistribution
            total={initialData.statusDistribution.total}
            segments={initialData.statusDistribution.segments}
            updatedAt={updatedAt}
            onRefresh={() => setUpdatedAt(new Date().toISOString())}
          />
          <AnomalyClassification items={anomalies} period="last30Days" />
          <TopFacilities items={facilities} period="last30Days" />
        </div>
      </div>
    </PageFrame>
  )
}
