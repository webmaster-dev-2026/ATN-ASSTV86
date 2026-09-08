import { createContext, useContext } from 'react'
import type { ChatAttachment, ChatMode, Conversation, FabPosition } from './types'

export interface ChatbotContextValue {
  mode: ChatMode
  conversations: Conversation[]
  activeId: string | null
  activeConversation: Conversation | null
  historyOpen: boolean
  thinking: boolean
  /** Optional dossier context for assistant ask (e.g. selected file). */
  dossierId: string | null
  fabPosition: FabPosition
  fabSize: number
  openFloat: () => void
  close: () => void
  expand: () => void
  collapse: () => void
  newChat: () => void
  selectConversation: (id: string) => void
  setHistoryOpen: (open: boolean) => void
  setDossierId: (dossierId: string | null) => void
  sendMessage: (content: string, attachments?: ChatAttachment[]) => void
  setFabPosition: (position: FabPosition) => void
}

export const ChatbotContext = createContext<ChatbotContextValue | null>(null)

export function useChatbot() {
  const context = useContext(ChatbotContext)
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider')
  }
  return context
}
