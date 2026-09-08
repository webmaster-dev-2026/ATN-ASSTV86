import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageFrame } from '@/components/layout/PageFrame'
import { useToast } from '@/components/ui'
import { interpolate } from '@/features/dossiers/format'
import { DocumentTemplateList } from '@/features/settings/components/DocumentTemplateList'
import { ProfileSettingsPanel } from '@/features/settings/components/ProfileSettingsPanel'
import { RelatedSettingsPanel } from '@/features/settings/components/RelatedSettingsPanel'
import { SettingsCategoryNav } from '@/features/settings/components/SettingsCategoryNav'
import { SettingsSectionPlaceholder } from '@/features/settings/components/SettingsSectionPlaceholder'
import { CATEGORIES, TEMPLATE_NAME } from '@/features/settings/format'
import { getSettingsData } from '@/features/settings/getSettingsData'
import type { DocumentTemplate, SettingsCategoryId } from '@/features/settings/types'
import { useI18n, type TranslationKey } from '@/i18n'

const initialData = getSettingsData()

function templateName(item: DocumentTemplate, t: (key: TranslationKey) => string) {
  const name = t(TEMPLATE_NAME[item.kind])
  return item.isCopy ? interpolate(t('settings.templates.copyName'), { name }) : name
}

function isSettingsCategory(value: string | null): value is SettingsCategoryId {
  return CATEGORIES.includes(value as SettingsCategoryId)
}

export function SettingsPage() {
  const { t } = useI18n()
  const { notify } = useToast()
  const [searchParams, setSearchParams] = useSearchParams()
  const categoryParam = searchParams.get('category')
  const [category, setCategory] = useState<SettingsCategoryId>(() =>
    isSettingsCategory(categoryParam) ? categoryParam : 'templates',
  )
  const [templates, setTemplates] = useState(initialData.templates)
  const [related, setRelated] = useState(initialData.related)

  useEffect(() => {
    if (isSettingsCategory(categoryParam) && categoryParam !== category) {
      setCategory(categoryParam)
    }
  }, [categoryParam, category])

  const selectCategory = (id: SettingsCategoryId) => {
    setCategory(id)
    setSearchParams(id === 'templates' ? {} : { category: id }, { replace: true })
  }

  const notifyNamed = (key: TranslationKey, name: string, variant: 'success' | 'info' = 'info') => {
    notify(interpolate(t(key), { name }), variant)
  }

  const showRelated = category !== 'profile'

  return (
    <PageFrame className="overflow-auto xl:overflow-hidden">
      <div
        className={
          showRelated
            ? 'grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[232px_minmax(0,1fr)] xl:grid-cols-[232px_minmax(0,1fr)_272px]'
            : 'grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[232px_minmax(0,1fr)]'
        }
      >
        <SettingsCategoryNav active={category} onSelect={selectCategory} />

        {category === 'profile' ? (
          <ProfileSettingsPanel />
        ) : category === 'templates' ? (
          <DocumentTemplateList
            items={templates}
            onAdd={() => {
              setTemplates((current) => [
                {
                  id: `tpl-custom-${Date.now()}`,
                  kind: 'custom',
                  status: 'draft',
                  tone: 'blue',
                  updatedAt: new Date().toISOString(),
                  updatedBy: t('header.userName'),
                },
                ...current,
              ])
              notify(t('settings.templates.toast.added'), 'success')
            }}
            onPreview={(item) => notifyNamed('settings.templates.toast.preview', templateName(item, t))}
            onEdit={(item) => notifyNamed('settings.templates.toast.edit', templateName(item, t))}
            onDuplicate={(item) => {
              setTemplates((current) => [
                {
                  ...item,
                  id: `${item.id}-copy-${Date.now()}`,
                  status: 'draft',
                  isCopy: true,
                  updatedAt: new Date().toISOString(),
                  updatedBy: t('header.userName'),
                },
                ...current,
              ])
              notifyNamed('settings.templates.toast.duplicated', templateName(item, t), 'success')
            }}
            onArchive={(item) => {
              setTemplates((current) => current.filter((entry) => entry.id !== item.id))
              notifyNamed('settings.templates.toast.archived', templateName(item, t), 'success')
            }}
          />
        ) : (
          <SettingsSectionPlaceholder category={category} />
        )}

        {showRelated ? (
          <div className="min-h-0 lg:col-span-2 xl:col-span-1 xl:h-full">
            <RelatedSettingsPanel value={related} onChange={setRelated} />
          </div>
        ) : null}
      </div>
    </PageFrame>
  )
}
