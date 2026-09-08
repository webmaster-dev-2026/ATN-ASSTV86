import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import {
  askAssistantApi,
  isApiError,
  uploadDossierDocumentsApi,
  uploadRequestFilesApi,
  type AssistantAskOut,
} from '@/api'
import { detectLocale, useI18n } from '@/i18n'
import { ChatbotContext } from './ChatbotContext'
import { FAB_MARGIN, FAB_SIZE, TITLE_MAX } from './constants'
import { getSeedConversations } from './getChatbotData'
import { loadChatbotState, saveChatbotState } from './storage'
import type { ChatAttachment, ChatMessage, ChatMode, Conversation, FabPosition } from './types'

const DOS_ID_RE = /\bDOS-[A-Za-z0-9-]+\b/i

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

/** Prefer ID mentioned in the question; else page context. */
function resolveDossierId(question: string, contextId: string | null): string | null {
  const match = question.match(DOS_ID_RE)
  if (match) {
    return match[0]
  }
  return contextId
}

function formatAssistantContent(response: AssistantAskOut): string {
  const parts = [response.answer.trim()]

  const next = response.suggested_next_action?.trim()
  if (next) {
    parts.push(next)
  }

  const sources = response.sources?.map((item) => item.trim()).filter(Boolean) ?? []
  if (sources.length > 0) {
    parts.push(sources.join(' · '))
  }

  return parts.filter(Boolean).join('\n\n')
}

/** Persist only serializable attachment metadata (drop File blobs). */
function toStoredAttachments(attachments: ChatAttachment[]): ChatAttachment[] {
  return attachments.map(({ id, name, size, type }) => ({ id, name, size, type }))
}

function collectUploadFiles(attachments: ChatAttachment[]): File[] {
  return attachments.map((item) => item.file).filter((file): file is File => Boolean(file))
}

export function ChatbotProvider({ children }: { children: ReactNode }) {
  const { t } = useI18n()
  const [mode, setMode] = useState<ChatMode>('closed')
  const [historyOpen, setHistoryOpen] = useState(false)
  const [thinking, setThinking] = useState(false)
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [activeId, setActiveId] = useState<string | null>(null)
  const [dossierId, setDossierId] = useState<string | null>(null)
  const [fabPosition, setFabPositionState] = useState<FabPosition>(defaultFabPosition)
  const [hydrated, setHydrated] = useState(false)
  const abortRef = useRef<AbortController | null>(null)
  const dossierIdRef = useRef<string | null>(null)

  useEffect(() => {
    dossierIdRef.current = dossierId
  }, [dossierId])

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
      abortRef.current?.abort()
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

  const appendAssistantMessage = useCallback((targetId: string, content: string) => {
    const reply: ChatMessage = {
      id: createId(),
      role: 'assistant',
      content,
      createdAt: nowIso(),
    }
    setConversations((current) =>
      current.map((item) =>
        item.id === targetId
          ? { ...item, updatedAt: reply.createdAt, messages: [...item.messages, reply] }
          : item,
      ),
    )
  }, [])

  const sendMessage = useCallback(
    (raw: string, attachments: ChatAttachment[] = []) => {
      const content = raw.trim()
      if ((!content && attachments.length === 0) || thinking) {
        return
      }

      const storedAttachments =
        attachments.length > 0 ? toStoredAttachments(attachments) : undefined

      const userMessage: ChatMessage = {
        id: createId(),
        role: 'user',
        content,
        createdAt: nowIso(),
        attachments: storedAttachments,
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

      const uploadFiles = collectUploadFiles(attachments)
      const question =
        content ||
        (uploadFiles.length > 0 ? t('chatbot.analyzeAttachmentsQuestion') : '')

      if (!question) {
        appendAssistantMessage(targetId!, t('chatbot.questionRequired'))
        return
      }

      abortRef.current?.abort()
      const controller = new AbortController()
      abortRef.current = controller
      setThinking(true)

      void (async () => {
        try {
          let resolvedDossierId = resolveDossierId(question, dossierIdRef.current)

          if (uploadFiles.length > 0) {
            if (resolvedDossierId) {
              await uploadDossierDocumentsApi(
                resolvedDossierId,
                { files: uploadFiles },
                { signal: controller.signal },
              )
            } else {
              const uploaded = await uploadRequestFilesApi(
                {
                  files: uploadFiles,
                  channel: 'CHATBOT',
                  subject: question,
                  raw_content: question,
                },
                { signal: controller.signal },
              )
              if (typeof uploaded.dossier_id === 'string' && uploaded.dossier_id) {
                resolvedDossierId = uploaded.dossier_id
                setDossierId(uploaded.dossier_id)
              }
            }
          }

          if (controller.signal.aborted) {
            return
          }

          const response = await askAssistantApi(
            {
              question,
              dossier_id: resolvedDossierId,
            },
            { signal: controller.signal },
          )
          if (controller.signal.aborted) {
            return
          }
          appendAssistantMessage(targetId!, formatAssistantContent(response))
        } catch (err) {
          if (controller.signal.aborted) {
            return
          }
          // Session expired → AuthProvider logs out; don't flash the BE message.
          if (isApiError(err) && err.status === 401) {
            return
          }
          const message = isApiError(err) ? err.message : t('chatbot.error')
          appendAssistantMessage(targetId!, message || t('chatbot.error'))
        } finally {
          if (abortRef.current === controller) {
            abortRef.current = null
            setThinking(false)
          }
        }
      })()
    },
    [activeId, appendAssistantMessage, t, thinking],
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
      dossierId,
      fabPosition,
      fabSize: FAB_SIZE,
      openFloat,
      close,
      expand,
      collapse,
      newChat,
      selectConversation,
      setHistoryOpen,
      setDossierId,
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
      dossierId,
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
