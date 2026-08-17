import { CATEGORY_DESCRIPTION, CATEGORY_TITLE } from '../format'
import type { SettingsCategoryId } from '../types'
import { useI18n } from '@/i18n'

interface SettingsSectionPlaceholderProps {
  category: SettingsCategoryId
}

export function SettingsSectionPlaceholder({ category }: SettingsSectionPlaceholderProps) {
  const { t } = useI18n()

  return (
    <section className="flex h-full min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(28,42,78,0.04)] sm:p-5">
      <h2 className="font-sans text-[18px] font-bold text-[#1c2a4e]">{t(CATEGORY_TITLE[category])}</h2>
      <p className="mt-1 max-w-[52ch] text-[13px] leading-5 text-[#6d7b93]">
        {t(CATEGORY_DESCRIPTION[category])}
      </p>
      <p className="mt-8 text-[14px] font-medium text-[#8b95a8]">{t('settings.comingSoon')}</p>
    </section>
  )
}
