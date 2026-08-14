import type { Conversation, FabPosition } from './types'

const STORAGE_KEY = 'asstv86.chatbot.v2'

export interface ChatbotStoredState {
  conversations: Conversation[]
  activeId: string | null
  fab: FabPosition | null
}

export function loadChatbotState(): ChatbotStoredState | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return null
    }
    const parsed = JSON.parse(raw) as Partial<ChatbotStoredState>
    if (!Array.isArray(parsed.conversations)) {
      return null
    }
    return {
      conversations: parsed.conversations,
      activeId: parsed.activeId ?? parsed.conversations[0]?.id ?? null,
      fab: parsed.fab ?? null,
    }
  } catch {
    return null
  }
}

export function saveChatbotState(state: ChatbotStoredState) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  } catch {
    // Ignore quota / private-mode failures.
  }
}
