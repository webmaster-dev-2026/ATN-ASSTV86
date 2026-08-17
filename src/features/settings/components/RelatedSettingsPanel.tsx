import { useEffect, useRef, useState } from 'react'
import { interpolate } from '@/features/dossiers/format'
import { LOCALES, useI18n, type Locale } from '@/i18n'
import { cn } from '@/lib/cn'
import type { RelatedSettingsState, RetentionYears } from '../types'
import { ChevronDownIcon } from './SettingsIcons'

const RETENTION_OPTIONS: RetentionYears[] = [1, 5, 10, 15]

const LOCALE_LABEL: Record<Locale, 'common.french' | 'common.english'> = {
  fr: 'common.french',
  en: 'common.english',
}

interface RelatedSettingsPanelProps {
  value: RelatedSettingsState
  onChange: (next: RelatedSettingsState) => void
}

export function RelatedSettingsPanel({ value, onChange }: RelatedSettingsPanelProps) {
  const { t, locale, setLocale } = useI18n()

  return (
    <aside className="flex h-full min-h-0 flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(28,42,78,0.04)] lg:p-5">
      <h2 className="mb-4 shrink-0 font-sans text-[16px] font-bold text-[#1c2a4e]">
        {t('settings.relatedTitle')}
      </h2>
      <div className="flex min-h-0 flex-1 flex-col gap-5 overflow-auto">
        <ToggleRow
          title={t('settings.related.ruleAutomation.title')}
          description={t('settings.related.ruleAutomation.description')}
          checked={value.ruleAutomation}
          onChange={(checked) => onChange({ ...value, ruleAutomation: checked })}
        />
        <ToggleRow
          title={t('settings.related.auditLog.title')}
          description={t('settings.related.auditLog.description')}
          checked={value.auditLog}
          onChange={(checked) => onChange({ ...value, auditLog: checked })}
        />
        <div>
          <p className="text-[13px] font-bold text-[#1c2a4e]">{t('settings.related.defaultLanguage.title')}</p>
          <p className="mt-0.5 text-[12px] leading-4 text-[#8b95a8]">
            {t('settings.related.defaultLanguage.description')}
          </p>
          <LocaleSelect
            value={locale}
            label={t('settings.related.defaultLanguage.title')}
            onChange={setLocale}
          />
        </div>
        <ToggleRow
          title={t('settings.related.systemNotifications.title')}
          description={t('settings.related.systemNotifications.description')}
          checked={value.systemNotifications}
          onChange={(checked) => onChange({ ...value, systemNotifications: checked })}
        />
        <ToggleRow
          title={t('settings.related.periodicReports.title')}
          description={t('settings.related.periodicReports.description')}
          checked={value.periodicReports}
          onChange={(checked) => onChange({ ...value, periodicReports: checked })}
        />
        <div>
          <p className="text-[13px] font-bold text-[#1c2a4e]">{t('settings.related.retention.title')}</p>
          <p className="mt-0.5 text-[12px] leading-4 text-[#8b95a8]">{t('settings.related.retention.description')}</p>
          <div className="relative mt-2">
            <select
              className="h-10 w-full cursor-pointer appearance-none rounded-lg border border-[#e4ecf6] bg-white py-0 pl-3 pr-8 text-[13px] font-semibold text-[#1c2a4e] transition-colors hover:border-[#c5d4ea] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30 [&::-ms-expand]:hidden"
              value={value.retentionYears}
              aria-label={t('settings.related.retention.title')}
              onChange={(event) =>
                onChange({
                  ...value,
                  retentionYears: Number(event.target.value) as RetentionYears,
                })
              }
            >
              {RETENTION_OPTIONS.map((years) => (
                <option key={years} value={years}>
                  {interpolate(t('settings.related.retention.years'), { count: years })}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 text-[#8b95a8]" />
          </div>
        </div>
      </div>
    </aside>
  )
}

function LocaleSelect({
  value,
  label,
  onChange,
}: {
  value: Locale
  label: string
  onChange: (locale: Locale) => void
}) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) {
      return
    }

    const onPointerDown = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div className="relative mt-2" ref={rootRef}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-10 w-full cursor-pointer items-center gap-2 rounded-lg border border-[#e4ecf6] bg-white px-3 text-left text-[13px] font-semibold text-[#1c2a4e] transition-colors hover:border-[#c5d4ea] focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
      >
        <LocaleFlag locale={value} />
        <span className="min-w-0 flex-1 truncate">{t(LOCALE_LABEL[value])}</span>
        <ChevronDownIcon className={cn('text-[#8b95a8] transition-transform', open && 'rotate-180')} />
      </button>
      {open ? (
        <ul
          role="listbox"
          aria-label={label}
          className="absolute inset-x-0 top-[calc(100%+4px)] z-10 overflow-hidden rounded-lg border border-[#e4ecf6] bg-white py-1 shadow-[0_8px_24px_rgba(28,42,78,0.12)]"
        >
          {LOCALES.map((item) => (
            <li key={item} role="option" aria-selected={item === value}>
              <button
                type="button"
                className={cn(
                  'flex w-full cursor-pointer items-center gap-2 px-3 py-2 text-left text-[13px] font-semibold transition-colors',
                  item === value ? 'bg-[#eef5fc] text-[#1d4f9a]' : 'text-[#1c2a4e] hover:bg-[#f7fafc]',
                )}
                onClick={() => {
                  onChange(item)
                  setOpen(false)
                }}
              >
                <LocaleFlag locale={item} />
                {t(LOCALE_LABEL[item])}
              </button>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  )
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="min-w-0">
        <p className="text-[13px] font-bold text-[#1c2a4e]">{title}</p>
        <p className="mt-0.5 text-[12px] leading-4 text-[#8b95a8]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={cn(
          'relative mt-0.5 flex h-[22px] w-10 shrink-0 cursor-pointer items-center rounded-full p-[2px] transition-colors',
          checked ? 'justify-end bg-[#2860B9]' : 'justify-start bg-[#d5deea]',
        )}
      >
        <span className="block size-[18px] rounded-full bg-white shadow-[0_1px_2px_rgba(28,42,78,0.28)]" />
      </button>
    </div>
  )
}

function FrenchFlag() {
  return (
    <svg viewBox="0 0 3 2" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
      <rect width="1" height="2" fill="#002654" />
      <rect x="1" width="1" height="2" fill="#FFFFFF" />
      <rect x="2" width="1" height="2" fill="#ED2939" />
    </svg>
  )
}

function EnglishFlag() {
  return (
    <svg viewBox="0 0 60 30" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 size-full" aria-hidden>
      <path d="M0,0v30h60v-30z" fill="#012169" />
      <path d="M0,0 60,30M60,0 0,30" stroke="#fff" strokeWidth="6" />
      <path d="M0,0 60,30M60,0 0,30" stroke="#C8102E" strokeWidth="4" />
      <path d="M30,0v30M0,15h60" stroke="#fff" strokeWidth="10" />
      <path d="M30,0v30M0,15h60" stroke="#C8102E" strokeWidth="6" />
    </svg>
  )
}

function LocaleFlag({ locale }: { locale: Locale }) {
  return (
    <span className="relative block h-3.5 w-5 shrink-0 overflow-hidden rounded-[3px] ring-1 ring-black/5">
      {locale === 'en' ? <EnglishFlag /> : <FrenchFlag />}
    </span>
  )
}
