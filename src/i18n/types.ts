import type fr from '@/i18n/locales/fr.json'

export const LOCALES = ['fr', 'en'] as const

export type Locale = (typeof LOCALES)[number]

export type Messages = typeof fr

type Join<K, P> = K extends string
  ? P extends string
    ? `${K}${P extends '' ? '' : '.'}${P}`
    : never
  : never

type Leaves<T> = T extends string
  ? ''
  : {
      [K in keyof T & string]: Join<K, Leaves<T[K]>>
    }[keyof T & string]

export type TranslationKey = Leaves<Messages>
