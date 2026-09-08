import en from '@/i18n/locales/en.json'
import fr from '@/i18n/locales/fr.json'
import vi from '@/i18n/locales/vi.json'
import type { Locale, Messages } from '@/i18n/types'
import { LOCALES } from '@/i18n/types'

export const DEFAULT_LOCALE: Locale = 'fr'
export const STORAGE_KEY = 'asstv86.locale'

export const INTL_LOCALES: Record<Locale, string> = {
  fr: 'fr-FR',
  en: 'en-GB',
  vi: 'vi-VN',
}

export const messagesByLocale: Record<Locale, Messages> = {
  fr,
  en,
  vi,
}

export function isLocale(value: string | null | undefined): value is Locale {
  return LOCALES.includes(value as Locale)
}

export function toIntlLocale(locale: Locale) {
  return INTL_LOCALES[locale]
}

export function detectLocale(): Locale {
  if (typeof window === 'undefined') {
    return DEFAULT_LOCALE
  }

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (isLocale(stored)) {
    return stored
  }

  const browserLanguage = window.navigator.language.toLowerCase()
  if (browserLanguage.startsWith('vi')) {
    return 'vi'
  }
  if (browserLanguage.startsWith('en')) {
    return 'en'
  }

  return DEFAULT_LOCALE
}
