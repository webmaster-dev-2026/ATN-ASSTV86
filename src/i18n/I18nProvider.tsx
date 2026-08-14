import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { detectLocale, messagesByLocale, STORAGE_KEY } from '@/i18n/config'
import type { Locale, Messages, TranslationKey } from '@/i18n/types'

interface I18nContextValue {
  locale: Locale
  messages: Messages
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function getMessage(messages: Messages, key: TranslationKey): string {
  const value = key.split('.').reduce<unknown>((current, part) => {
    if (current && typeof current === 'object' && part in current) {
      return (current as Record<string, unknown>)[part]
    }
    return undefined
  }, messages)

  return typeof value === 'string' ? value : key
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(detectLocale)

  const setLocale = useCallback((nextLocale: Locale) => {
    setLocaleState(nextLocale)
    window.localStorage.setItem(STORAGE_KEY, nextLocale)
  }, [])

  const messages = messagesByLocale[locale]

  const t = useCallback(
    (key: TranslationKey) => getMessage(messages, key),
    [messages],
  )

  useEffect(() => {
    document.documentElement.lang = locale
    document.title = getMessage(messages, 'meta.title')
  }, [locale, messages])

  const value = useMemo(
    () => ({
      locale,
      messages,
      setLocale,
      t,
    }),
    [locale, messages, setLocale, t],
  )

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within I18nProvider')
  }
  return context
}
