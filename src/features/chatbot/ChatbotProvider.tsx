import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { detectLocale, useI18n } from '@/i18n'
import { ChatbotContext } from './ChatbotContext'
import { FAB_MARGIN, FAB_SIZE, REPLY_DELAY_MS, TITLE_MAX } from './constants'
import { getSeedConversations } from './getChatbotData'
import { createAssistantReply } from './replies'
import { loadChatbotState, saveChatbotState } from './storage'
import type { ChatAttachment, ChatMessage, ChatMode, Conversation, FabPosition } from './types'

function createId() {
  return crypto.randomUUID()
}

function nowIso() {
  return new Date().toISOString()
}

function createConversation(): Conversation {
  const createdAt = nowIso()
  return {
    id: createId(),
    title: '',
    updatedAt: createdAt,
    messages: [],
  }
}

function titleFromMessage(content: string) {
  const compact = content.replace(/\s+/g, ' ').trim()
  if (compact.length <= TITLE_MAX) {
    return compact
  }
  return `${compact.slice(0, TITLE_MAX - 1).trimEnd()}…`
}

function defaultFabPosition(): FabPosition {
  if (typeof window === 'undefined') {
    return { left: 24, top: 24 }
  }
  return {
    left: Math.max(FAB_MARGIN, window.innerWidth - FAB_MARGIN - FAB_SIZE),
    top: Math.max(FAB_MARGIN, window.innerHeight - FAB_MARGIN - FAB_SIZE),
  }
}

function clampFabPosition(position: FabPosition): FabPosition {
  const maxLeft = Math.max(FAB_MARGIN, window.innerWidth - FAB_MARGIN - FAB_SIZE)
  const maxTop = Math.max(FAB_MARGIN, window.innerHeight - FAB_MARGIN - FAB_SIZE)
  return {
    left: Math.min(maxLeft, Math.max(FAB_MARGIN, position.left)),
    top: Math.min(maxTop, Math.max(FAB_MARGIN, position.top)),
  }
}

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const { locale } = useI18n()
  const [mode, setMode] = useState<ChatMode>('closed')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [fabPosition, setFabPositionState] = useState<FabPosition>(defaultFabPosition)
  const [hydrated, setHydrated] = useState(false)
  const replyTimerRef = useRef<number | null>(null)

  useEffect(() => {
    const stored = loadChatbotState()
    if (stored && stored.conversations.length > 0) {
      setConversations(stored.conversations)
      setActiveId(stored.activeId)
      setFabPositionState(stored.fab ? clampFabPosition(stored.fab) : defaultFabPosition())
    } else {
      const seeded = getSeedConversations(detectLocale())
      const draft = createConversation()
      setConversations([draft, ...seeded])
      setActiveId(draft.id)
      setFabPositionState(defaultFabPosition())
    }
    setHydrated(true)
  }, [])

  useEffect(() => {
    if (!hydrated) {
      return
    }
    saveChatbotState({ conversations, activeId, fab: fabPosition })
  }, [hydrated, conversations, activeId, fabPosition])

  useEffect(() => {
    const onResize = () => {
      setFabPositionState((current) => clampFabPosition(current))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    return () => {
      if (replyTimerRef.current) {
        window.clearTimeout(replyTimerRef.current)
      }
    }
  }, [])

  const activeConversation = useMemo(
    () => conversations.find((item) => item.id === activeId) ?? null,
    [conversations, activeId],
  )

  const openFloat = useCallback(() => {
    setMode('float')
    setHistoryOpen(false)
  }, [])

  const close = useCallback(() => {
    setMode('closed')
    setHistoryOpen(false)
  }, [])

  const expand = useCallback(() => {
    setMode('docked')
    setHistoryOpen(false)
  }, [])

  const collapse = useCallback(() => {
    setMode('float')
    setHistoryOpen(false)
  }, [])

  const newChat = useCallback(() => {
    const conversation = createConversation()
    setConversations((current) => [
      conversation,
      ...current.filter((item) => item.messages.length > 0),
    ])
    setActiveId(conversation.id)
    setHistoryOpen(false)
    setMode((current) => (current === 'closed' ? 'float' : current))
  }, [])

  const selectConversation = useCallback((id: string) => {
    setActiveId(id)
    setHistoryOpen(false)
  }, [])

  const sendMessage = useCallback(
    (raw: string, attachments: ChatAttachment[] = []) => {
      const content = raw.trim()
      if ((!content && attachments.length === 0) || thinking) {
        return
      }

      const userMessage: ChatMessage = {
        id: createId(),
        role: 'user',
        content,
        createdAt: nowIso(),
        attachments: attachments.length > 0 ? attachments : undefined,
      }

      const titleSource = content || attachments[0]?.name || ''

      let targetId = activeId
      setConversations((current) => {
        const existing = current.find((item) => item.id === targetId)
        if (!existing) {
          const conversation: Conversation = {
            id: createId(),
            title: titleFromMessage(titleSource),
            updatedAt: userMessage.createdAt,
            messages: [userMessage],
          }
          targetId = conversation.id
          setActiveId(conversation.id)
          return [conversation, ...current]
        }

        return current.map((item) =>
          item.id === existing.id
            ? {
                ...item,
                title: item.title || titleFromMessage(titleSource),
                updatedAt: userMessage.createdAt,
                messages: [...item.messages, userMessage],
              }
            : item,
        )
      })

      setHistoryOpen(false)
      setThinking(true)

      if (replyTimerRef.current) {
        window.clearTimeout(replyTimerRef.current)
      }

      replyTimerRef.current = window.setTimeout(() => {
        const reply: ChatMessage = {
          id: createId(),
          role: 'assistant',
          content: createAssistantReply(content, locale, attachments),
          createdAt: nowIso(),
        }
        setConversations((current) =>
          current.map((item) =>
            item.id === targetId
              ? { ...item, updatedAt: reply.createdAt, messages: [...item.messages, reply] }
              : item,
          ),
        )
        setThinking(false)
        replyTimerRef.current = null
      }, REPLY_DELAY_MS)
    },
    [activeId, locale, thinking],
  )

  const setFabPosition = useCallback((position: FabPosition) => {
    setFabPositionState(clampFabPosition(position))
  }, [])

  const value = useMemo(
    () => ({
      mode,
      conversations,
      activeId,
      activeConversation,
      historyOpen,
      thinking,
      fabPosition,
      fabSize: FAB_SIZE,
      openFloat,
      close,
      expand,
      collapse,
      newChat,
      selectConversation,
      setHistoryOpen,
      sendMessage,
      setFabPosition,
    }),
    [
      mode,
      conversations,
      activeId,
      activeConversation,
      historyOpen,
      thinking,
      fabPosition,
      openFloat,
      close,
      expand,
      collapse,
      newChat,
      selectConversation,
      sendMessage,
      setFabPosition,
    ],
  )

  return <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
}
