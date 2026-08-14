import type { Locale } from '@/i18n'

export function formatRelativeTime(iso: string, locale: Locale) {
  const then = new Date(iso).getTime()
  const deltaSeconds = Math.round((then - Date.now()) / 1000)
  const abs = Math.abs(deltaSeconds)
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' })

  if (abs < 60) {
    return formatter.format(deltaSeconds, 'second')
  }
  if (abs < 3600) {
    return formatter.format(Math.round(deltaSeconds / 60), 'minute')
  }
  if (abs < 86400) {
    return formatter.format(Math.round(deltaSeconds / 3600), 'hour')
  }
  if (abs < 86400 * 7) {
    return formatter.format(Math.round(deltaSeconds / 86400), 'day')
  }

  return new Intl.DateTimeFormat(locale, {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(iso))
}
