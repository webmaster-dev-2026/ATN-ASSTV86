import type { Locale } from '@/i18n'
import {
  getChatbotFallback,
  getChatbotFileReceivedTemplate,
  getChatbotIntents,
} from './getChatbotData'
import type { ChatAttachment } from './types'

function includesAny(text: string, keywords: string[]) {
  return keywords.some((keyword) => text.includes(keyword))
}

function interpolate(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? '')
}

export function createAssistantReply(
  input: string,
  locale: Locale,
  attachments: ChatAttachment[] = [],
): string {
  if (attachments.length > 0) {
    return interpolate(getChatbotFileReceivedTemplate(locale), {
      names: attachments.map((file) => file.name).join(', '),
    })
  }

  const text = input.toLowerCase()
  const match = getChatbotIntents().find((intent) => includesAny(text, intent.keywords))

  if (match) {
    return match.reply[locale]
  }

  return getChatbotFallback(locale)
}
