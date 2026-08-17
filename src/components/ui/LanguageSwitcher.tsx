import { useEffect, useState, type CSSProperties } from 'react'
import { cn } from '@/lib/cn'
import { LOCALES, useI18n, type Locale } from '@/i18n'

const LOCALE_LABEL: Record<Locale, 'common.french' | 'common.english'> = {
  fr: 'common.french',
  en: 'common.english',
}

const LOCALE_CODE: Record<Locale, string> = {
  fr: 'FR',
  en: 'EN',
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

function FlagGraphic({ locale }: { locale: Locale }) {
  if (locale === 'en') {
    return <EnglishFlag />
  }
  return <FrenchFlag />
}

function LocaleFlag({ locale, className }: { locale: Locale; className?: string }) {
  return (
    <span className={cn('relative shrink-0 overflow-hidden rounded-full', className)}>
      <FlagGraphic locale={locale} />
    </span>
  )
}

function nextLocale(current: Locale) {
  const index = LOCALES.indexOf(current)
  return LOCALES[(index + 1) % LOCALES.length]
}

interface LanguageSwitcherProps {
  variant?: 'default' | 'sidebar'
  collapsed?: boolean
}

export function LanguageSwitcher({ variant = 'default', collapsed = false }: LanguageSwitcherProps) {
  const { locale, setLocale, t } = useI18n()
  const [pillReady, setPillReady] = useState(false)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setPillReady(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  if (variant === 'sidebar' && collapsed) {
    const upcoming = nextLocale(locale)

    return (
      <button
        type="button"
        className="group relative grid size-11 cursor-pointer place-items-center rounded-full bg-white/[0.08] ring-1 ring-inset ring-white/15 transition-[background-color,box-shadow] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-white/[0.14] hover:ring-white/25 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50 active:scale-[0.96]"
        aria-label={`${t('common.language')}: ${t(LOCALE_LABEL[locale])}`}
        title={t(LOCALE_LABEL[upcoming])}
        onClick={() => setLocale(upcoming)}
      >
        <span className="relative size-6 overflow-hidden rounded-full">
          {LOCALES.map((item) => (
            <span
              key={item}
              className={cn(
                'absolute inset-0 overflow-hidden rounded-full transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                item === locale ? 'opacity-100' : 'opacity-0',
              )}
            >
              <FlagGraphic locale={item} />
            </span>
          ))}
        </span>
      </button>
    )
  }

  if (variant === 'sidebar') {
    const activeIndex = Math.max(0, LOCALES.indexOf(locale))

    return (
      <div
        className="relative grid grid-cols-2 rounded-full bg-white/[0.08] p-1 shadow-[inset_0_1px_2px_rgba(8,24,56,0.18)] ring-1 ring-inset ring-white/12"
        role="group"
        aria-label={t('common.language')}
      >
        <span
          aria-hidden
          className={cn('lang-switcher-pill', pillReady && 'is-ready')}
          style={
            {
              '--lang-pill-w': `calc((100% - 8px) / ${LOCALES.length})`,
              '--lang-pill-x': `${activeIndex * 100}%`,
            } as CSSProperties
          }
        />

        {LOCALES.map((item) => {
          const isActive = item === locale
          const label = t(LOCALE_LABEL[item])

          return (
            <button
              key={item}
              type="button"
              className={cn(
                'relative z-10 inline-flex cursor-pointer items-center justify-center gap-1 rounded-full py-[7px] text-[11px] font-bold tracking-[0.06em]',
                'transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                isActive ? 'text-[#1d4f9a]' : 'text-white/62 hover:text-white',
              )}
              aria-label={label}
              aria-pressed={isActive}
              onClick={() => setLocale(item)}
            >
              <LocaleFlag
                locale={item}
                className={cn(
                  'size-3.5 ring-1 ring-black/5 transition-opacity duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
                  isActive ? 'opacity-100' : 'opacity-70',
                )}
              />
              {LOCALE_CODE[item]}
            </button>
          )
        })}
      </div>
    )
  }

  return (
    <div
      className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3"
      role="group"
      aria-label={t('common.language')}
    >
      {LOCALES.map((item) => {
        const isActive = item === locale
        const label = t(LOCALE_LABEL[item])

        return (
          <button
            key={item}
            type="button"
            className={cn(
              'inline-flex cursor-pointer items-center gap-2.5',
              'transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
              'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/35',
            )}
            aria-label={label}
            aria-pressed={isActive}
            onClick={() => setLocale(item)}
          >
            <LocaleFlag locale={item} className="size-7 shadow-[0_2px_8px_rgba(30,64,116,0.16)]" />
            <span
              className={cn(
                'text-[13px] font-semibold leading-none',
                isActive ? 'text-[#2860B9]' : 'text-[#5d6880]',
              )}
            >
              {label}
            </span>
          </button>
        )
      })}
    </div>
  )
}
