export type ChatRole = 'user' | 'assistant'
export type ChatMode = 'closed' | 'float' | 'docked'

export interface ChatAttachment {
  id: string
  name: string
  size: number
  type: string
}

export interface ChatMessage {
  id: string
  role: ChatRole
  content: string
  createdAt: string
  attachments?: ChatAttachment[]
}

export interface Conversation {
  id: string
  title: string
  updatedAt: string
  messages: ChatMessage[]
}

export interface FabPosition {
  left: number
  top: number
}
