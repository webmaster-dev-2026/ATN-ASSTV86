import { CATEGORIES, CATEGORY_LABEL } from '../format'
import type { SettingsCategoryId } from '../types'
import { CategoryIcon } from './SettingsIcons'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'

interface SettingsCategoryNavProps {
  active: SettingsCategoryId
  onSelect: (id: SettingsCategoryId) => void
}

export function SettingsCategoryNav({ active, onSelect }: SettingsCategoryNavProps) {
  const { t } = useI18n()

  return (
    <nav
      className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(28,42,78,0.04)] lg:p-5"
      aria-label={t('settings.navTitle')}
    >
      <h2 className="mb-3 shrink-0 font-sans text-[16px] font-bold text-[#1c2a4e]">
        {t('settings.navTitle')}
      </h2>
      <ul className="flex min-h-0 flex-1 flex-col gap-1 overflow-auto">
        {CATEGORIES.map((id) => {
          const isActive = id === active
          return (
            <li key={id}>
              <button
                type="button"
                aria-current={isActive ? 'page' : undefined}
                onClick={() => onSelect(id)}
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2.5 rounded-xl px-3 py-2.5 text-left text-[13px] font-semibold transition-colors',
                  isActive
                    ? 'bg-[#eef5fc] text-[#1d4f9a]'
                    : 'text-[#5b6b82] hover:bg-[#f7fafc] hover:text-[#1c2a4e]',
                )}
              >
                <CategoryIcon id={id} className={cn('size-[18px]', isActive ? 'text-[#2860B9]' : 'text-[#7b8aa3]')} />
                <span className="min-w-0 truncate">{t(CATEGORY_LABEL[id])}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
