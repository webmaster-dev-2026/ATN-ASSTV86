import statisticsJson from '../../../mock/api/statistics.json'
import { PERIOD_DAYS, scaleFactor } from './format'
import type {
  AnomalySlice,
  DayCount,
  FacilityRank,
  StatisticsData,
  StatisticsPeriod,
  StatusSlice,
  VisitTypeKey,
  VisitTypeSlice,
} from './types'

function shiftDate(isoDate: string, days: number) {
  const date = new Date(`${isoDate}T12:00:00`)
  date.setDate(date.getDate() + days)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function extendHistory(points: DayCount[], extraDays: number): DayCount[] {
  if (extraDays <= 0 || points.length === 0) {
    return points
  }

  const first = points[0]
  const extras: DayCount[] = []
  for (let index = extraDays; index >= 1; index -= 1) {
    const wave = 58 + Math.round(26 * Math.sin(index / 5) + 16 * Math.cos(index / 9))
    extras.push({
      date: shiftDate(first.date, -index),
      count: Math.max(22, wave),
    })
  }
  return [...extras, ...points]
}

function sliceDays(points: DayCount[], period: StatisticsPeriod): DayCount[] {
  const needed = PERIOD_DAYS[period]
  const source = needed > points.length ? extendHistory(points, needed - points.length) : points
  return source.slice(-needed)
}

function withPercents<T extends { count: number }>(items: T[]): (T & { percent: number })[] {
  const total = items.reduce((sum, item) => sum + item.count, 0) || 1
  return items.map((item) => ({
    ...item,
    percent: Math.round((item.count / total) * 1000) / 10,
  }))
}

function scaleCounts<T extends { count: number }>(items: T[], period: StatisticsPeriod) {
  const factor = scaleFactor(period)
  return withPercents(
    items.map((item) => ({
      ...item,
      count: Math.max(1, Math.round(item.count * factor)),
    })),
  )
}

export function getStatisticsData(): StatisticsData {
  const raw = statisticsJson

  return {
    updatedAt: raw.updatedAt,
    summary: raw.summary,
    receivedByDay: raw.receivedByDay,
    byVisitType: raw.byVisitType.map((item) => ({
      key: item.key as VisitTypeKey,
      count: item.count,
      percent: item.percent,
    })),
    statusDistribution: {
      total: raw.statusDistribution.total,
      segments: raw.statusDistribution.segments.map((segment) => ({
        key: segment.key as StatusSlice['key'],
        count: segment.count,
        percent: segment.percent,
        color: segment.color,
      })),
    },
    anomalyClassification: raw.anomalyClassification.map((item) => ({
      key: item.key as AnomalySlice['key'],
      count: item.count,
      percent: item.percent,
    })),
    topFacilities: raw.topFacilities,
  }
}

export function receivedByPeriod(data: StatisticsData, period: StatisticsPeriod) {
  return sliceDays(data.receivedByDay, period)
}

export function visitTypesByPeriod(data: StatisticsData, period: StatisticsPeriod): VisitTypeSlice[] {
  return scaleCounts(data.byVisitType, period)
}

export function facilitiesByPeriod(data: StatisticsData, period: StatisticsPeriod): FacilityRank[] {
  return scaleCounts(data.topFacilities, period)
}

export function anomaliesByPeriod(data: StatisticsData, period: StatisticsPeriod): AnomalySlice[] {
  return scaleCounts(data.anomalyClassification, period)
}
