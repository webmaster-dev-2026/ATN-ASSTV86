import { PageFrame } from '@/components/layout/PageFrame'
import { useI18n } from '@/i18n'

export function StatisticsPage() {
  const { t } = useI18n()

  return (
    <PageFrame>
      <p className="text-[14px] font-medium text-[#6d7b93]">
        {t('placeholder.comingSoon')}
      </p>
    </PageFrame>
  )
}
