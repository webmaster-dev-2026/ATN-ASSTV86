import chatbotJson from '../../../mock/api/chatbot.json'
import type { Locale } from '@/i18n'
import type { ChatAttachment, ChatRole, Conversation } from './types'

type LocalizedText = { fr: string; en: string; vi: string }

interface MockIntent {
  id: string
  keywords: string[]
  reply: LocalizedText
}

interface MockMessage {
  id: string
  role: ChatRole
  createdAt: string
  content: LocalizedText | string
  attachments?: ChatAttachment[]
}

interface MockConversation {
  id: string
  title: LocalizedText
  updatedAt: string
  messages: MockMessage[]
}

interface MockChatbot {
  fileReceived: LocalizedText
  fallback: LocalizedText
  intents: MockIntent[]
  conversations: MockConversation[]
}

const data = chatbotJson as MockChatbot

export function pickLocalized(text: LocalizedText, locale: Locale) {
  return text[locale] ?? text.fr
}

export function getChatbotIntents() {
  return data.intents
}

export function getChatbotFallback(locale: Locale) {
  return pickLocalized(data.fallback, locale)
}

export function getChatbotFileReceivedTemplate(locale: Locale) {
  return pickLocalized(data.fileReceived, locale)
}

export function getSeedConversations(locale: Locale): Conversation[] {
  return data.conversations.map((conversation) => ({
    id: conversation.id,
    title: pickLocalized(conversation.title, locale),
    updatedAt: conversation.updatedAt,
    messages: conversation.messages.map((message) => ({
      id: message.id,
      role: message.role,
      createdAt: message.createdAt,
      content:
        typeof message.content === 'string'
          ? message.content
          : pickLocalized(message.content, locale),
      attachments: message.attachments,
    })),
  }))
}
