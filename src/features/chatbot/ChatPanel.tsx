import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from 'react'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { formatReceivedAt } from '@/features/dashboard/format'
import { formatRelativeTime } from '@/features/notifications/formatRelativeTime'
import { useI18n, type Locale } from '@/i18n'
import { cn } from '@/lib/cn'
import {
  AttachFileIcon,
  CalendarIcon,
  ChevronRightIcon,
  ClipboardCheckIcon,
  CloseIcon,
  CollapseIcon,
  ExpandIcon,
  HistoryIcon,
  NewChatIcon,
  SendIcon,
  WarningIcon,
} from './ChatbotIcons'
import { ChatFileTypeIcon } from './ChatFileTypeIcon'
import { useChatbot } from './ChatbotContext'
import type { ChatAttachment, ChatMessage } from './types'

interface ChatPanelProps {
  variant: 'float' | 'dock'
  className?: string
}

const SUGGESTIONS = [
  { key: 'chatbot.suggestions.anomalies', icon: WarningIcon },
  { key: 'chatbot.suggestions.validation', icon: ClipboardCheckIcon },
  { key: 'chatbot.suggestions.appointments', icon: CalendarIcon },
] as const

const EMPTY_MESSAGES: ChatMessage[] = []
const ACCEPTED_FILES = '.pdf,.doc,.docx,.png,.jpg,.jpeg,.eml,.txt,.xlsx'

function formatFileSize(bytes: number, locale: Locale) {
  if (bytes < 1024) {
    return locale === 'fr' ? `${bytes} o` : `${bytes} B`
  }
  if (bytes < 1024 * 1024) {
    return locale === 'fr' ? `${Math.round(bytes / 1024)} Ko` : `${Math.round(bytes / 1024)} KB`
  }
  const mega = (bytes / (1024 * 1024)).toFixed(1)
  return locale === 'fr' ? `${mega} Mo` : `${mega} MB`
}

function IconButton({
  label,
  pressed,
  onClick,
  children,
}: {
  label: string
  pressed?: boolean
  onClick: () => void
  children: ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'grid size-10 shrink-0 place-items-center rounded-[10px] text-white transition-colors',
        'hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/45',
        'active:scale-[0.98]',
        pressed && 'bg-white/20',
      )}
    >
      {children}
    </button>
  )
}

function TypingDots() {
  return (
    <div className="flex items-center gap-1 px-1 py-1" aria-hidden>
      <span className="chat-typing-dot size-1.5 rounded-full bg-[#6d7b93]" />
      <span className="chat-typing-dot size-1.5 rounded-full bg-[#6d7b93]" />
      <span className="chat-typing-dot size-1.5 rounded-full bg-[#6d7b93]" />
    </div>
  )
}

export function ChatPanel({ variant, className }: ChatPanelProps) {
  const { t, locale } = useI18n()
  const {
    mode,
    conversations,
    activeConversation,
    historyOpen,
    thinking,
    close,
    expand,
    collapse,
    newChat,
    selectConversation,
    setHistoryOpen,
    sendMessage,
  } = useChatbot()

  const listRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [draft, setDraft] = useState('')
  const [attachments, setAttachments] = useState<ChatAttachment[]>([])

  const messages = activeConversation?.messages ?? EMPTY_MESSAGES
  const isDocked = mode === 'docked'
  const title = historyOpen
    ? t('chatbot.history')
    : activeConversation?.title || t('chatbot.title')

  useEffect(() => {
    const node = listRef.current
    if (!node || historyOpen) {
      return
    }
    node.scrollTop = node.scrollHeight
  }, [messages, thinking, historyOpen])

  useEffect(() => {
    inputRef.current?.focus()
  }, [mode, activeConversation?.id, historyOpen])

  const resizeInput = () => {
    const node = inputRef.current
    if (!node) {
      return
    }
    node.style.height = 'auto'
    node.style.height = `${Math.min(node.scrollHeight, 120)}px`
  }

  const submit = (event?: FormEvent) => {
    event?.preventDefault()
    const value = draft.trim()
    if (!value && attachments.length === 0) {
      return
    }
    sendMessage(value, attachments)
    setDraft('')
    setAttachments([])
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.style.height = 'auto'
      }
    })
  }

  const addFiles = (fileList: FileList | null) => {
    if (!fileList) {
      return
    }

    const next: ChatAttachment[] = Array.from(fileList).map((file) => ({
      id: crypto.randomUUID(),
      name: file.name,
      size: file.size,
      type: file.type,
    }))

    if (next.length > 0) {
      setAttachments((current) => [...current, ...next])
    }

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const onComposerKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <section
      className={cn(
        'flex h-full min-h-0 w-full flex-col overflow-hidden bg-white',
        variant === 'float' && 'rounded-2xl border border-[#e4ecf6] shadow-[0_16px_40px_rgba(30,64,116,0.18)]',
        className,
      )}
      aria-label={t('chatbot.title')}
    >
      <header className="flex h-14 shrink-0 items-center gap-1 bg-[#2860B9] px-2">
        <div className="shrink-0 pl-1.5 text-white">
          <BrandLogo tone="light" size="xs" iconOnly />
        </div>
        <h2 className="min-w-0 flex-1 truncate px-1 font-sans text-[15px] font-bold text-white">
          {title}
        </h2>
        <IconButton label={t('chatbot.newChat')} onClick={newChat}>
          <NewChatIcon className="size-5" />
        </IconButton>
        <IconButton
          label={t('chatbot.history')}
          pressed={historyOpen}
          onClick={() => setHistoryOpen(!historyOpen)}
        >
          <HistoryIcon className="size-5" />
        </IconButton>
        <IconButton
          label={isDocked ? t('chatbot.collapse') : t('chatbot.expand')}
          onClick={isDocked ? collapse : expand}
        >
          {isDocked ? <CollapseIcon className="size-5" /> : <ExpandIcon className="size-5" />}
        </IconButton>
        <IconButton label={t('chatbot.close')} onClick={close}>
          <CloseIcon className="size-5" />
        </IconButton>
      </header>

      {historyOpen ? (
        <div className="min-h-0 flex-1 overflow-y-auto p-2">
          {conversations.length === 0 ? (
            <p className="px-3 py-8 text-center text-[13px] font-medium text-[#6d7b93]">
              {t('chatbot.emptyHistory')}
            </p>
          ) : (
            <ul className="flex flex-col gap-1">
              {conversations.map((conversation) => {
                const selected = conversation.id === activeConversation?.id
                return (
                  <li key={conversation.id}>
                    <button
                      type="button"
                      onClick={() => selectConversation(conversation.id)}
                      className={cn(
                        'flex w-full flex-col rounded-[10px] px-3 py-2.5 text-left transition-colors',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/35',
                        selected ? 'bg-[#e8f0fb]' : 'hover:bg-[#eef3f9]',
                      )}
                    >
                      <span className="truncate text-[13px] font-semibold text-[#1c2a4e]">
                        {conversation.title || t('chatbot.untitled')}
                      </span>
                      <span className="mt-0.5 text-[11px] font-medium text-[#6d7b93]">
                        {formatRelativeTime(conversation.updatedAt, locale)}
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      ) : (
        <>
          <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto px-3 py-3">
            {messages.length === 0 && !thinking ? (
              <div className="flex h-full min-h-[220px] flex-col justify-center px-1">
                <p className="font-sans text-[18px] font-bold leading-6 text-[#1c2a4e]">
                  {t('chatbot.welcomeTitle')}
                </p>
                <p className="mt-1.5 max-w-[36ch] text-[13px] font-medium leading-5 text-[#6d7b93]">
                  {t('chatbot.welcomeBody')}
                </p>
                <div className="mt-4 flex flex-col gap-2">
                  {SUGGESTIONS.map(({ key, icon: Icon }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => sendMessage(t(key))}
                      className={cn(
                        'group flex cursor-pointer items-center gap-2.5 rounded-[10px] border border-[#e4ecf6] bg-[#f7f9fd] px-2.5 py-2 text-left',
                        'transition-colors duration-200',
                        'hover:border-[#c5d4e8] hover:bg-white',
                        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/35',
                      )}
                    >
                      <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-[#e8f0fb] text-[#2860B9] transition-colors duration-200 group-hover:bg-[#2860B9] group-hover:text-white">
                        <Icon className="size-4" />
                      </span>
                      <span className="min-w-0 flex-1 text-[13px] font-semibold leading-4 text-[#1d4f9a]">
                        {t(key)}
                      </span>
                      <ChevronRightIcon className="size-4 shrink-0 text-[#9aa8bc] transition-colors duration-200 group-hover:text-[#2860B9]" />
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((message) => {
                  const isUser = message.role === 'user'
                  return (
                    <div
                      key={message.id}
                      className={cn('flex', isUser ? 'justify-end' : 'justify-start')}
                    >
                      <div
                        className={cn(
                          'flex max-w-[85%] flex-col gap-1',
                          isUser ? 'items-end' : 'items-start',
                        )}
                      >
                        <div
                          className={cn(
                            'rounded-2xl px-3.5 py-2.5 text-[13px] font-medium leading-5',
                            isUser
                              ? 'rounded-br-md bg-[#2860B9] text-white'
                              : 'rounded-bl-md bg-[#eef3f9] text-[#1c2a4e]',
                          )}
                        >
                          {message.attachments && message.attachments.length > 0 ? (
                            <ul className={cn('flex flex-col gap-1.5', message.content && 'mb-2')}>
                              {message.attachments.map((file) => (
                                <li
                                  key={file.id}
                                  className={cn(
                                    'flex items-center gap-2 rounded-lg px-2 py-1.5',
                                    isUser ? 'bg-white/15' : 'bg-white',
                                  )}
                                >
                                  <ChatFileTypeIcon name={file.name} mime={file.type} />
                                  <span className="min-w-0 truncate">{file.name}</span>
                                  <span className={cn('shrink-0 text-[11px]', isUser ? 'text-white/80' : 'text-[#6d7b93]')}>
                                    {formatFileSize(file.size, locale)}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          ) : null}
                          {message.content}
                        </div>
                        {!isUser ? (
                          <p className="px-1 text-[11px] font-medium text-[#6d7b93]">
                            {formatReceivedAt(message.createdAt, locale)}
                          </p>
                        ) : null}
                      </div>
                    </div>
                  )
                })}
                {thinking ? (
                  <div className="flex justify-start">
                    <div className="rounded-2xl rounded-bl-md bg-[#eef3f9] px-3.5 py-2.5">
                      <span className="sr-only">{t('chatbot.thinking')}</span>
                      <TypingDots />
                    </div>
                  </div>
                ) : null}
              </div>
            )}
          </div>

          <form
            onSubmit={submit}
            className="shrink-0 border-t border-[#e4ecf6] bg-white p-3"
          >
            {attachments.length > 0 ? (
              <ul className="mb-2 flex flex-col gap-1.5">
                {attachments.map((file) => (
                  <li
                    key={file.id}
                    className="flex items-center gap-2 rounded-[10px] border border-[#e4ecf6] bg-[#f7f9fd] px-2.5 py-1.5"
                  >
                    <ChatFileTypeIcon name={file.name} mime={file.type} />
                    <span className="min-w-0 flex-1 truncate text-[12px] font-semibold text-[#1c2a4e]">
                      {file.name}
                    </span>
                    <span className="shrink-0 text-[11px] font-medium text-[#6d7b93]">
                      {formatFileSize(file.size, locale)}
                    </span>
                    <button
                      type="button"
                      className="grid size-7 shrink-0 place-items-center rounded-md text-[#6d7b93] transition-colors hover:bg-white hover:text-[#1d4f9a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/35"
                      aria-label={`${t('chatbot.removeFile')} ${file.name}`}
                      onClick={() =>
                        setAttachments((current) => current.filter((item) => item.id !== file.id))
                      }
                    >
                      <CloseIcon className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : null}
            <div className="flex items-end gap-1 rounded-[10px] border border-[#d7e1ef] bg-[#f7f9fd] px-1.5 py-1.5 focus-within:border-[#2860B9] focus-within:bg-white focus-within:shadow-[0_0_0_4px_rgba(40,96,185,0.14)]">
              <input
                ref={fileInputRef}
                type="file"
                className="sr-only"
                accept={ACCEPTED_FILES}
                multiple
                onChange={(event) => addFiles(event.target.files)}
              />
              <button
                type="button"
                aria-label={t('chatbot.attachFile')}
                disabled={thinking}
                className="grid size-9 shrink-0 place-items-center rounded-[8px] text-[#1d4f9a] transition-colors hover:bg-[#e8f0fb] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/35 disabled:cursor-not-allowed disabled:opacity-40"
                onClick={() => fileInputRef.current?.click()}
              >
                <AttachFileIcon className="size-5" />
              </button>
              <label htmlFor="chatbot-composer" className="sr-only">
                {t('chatbot.placeholder')}
              </label>
              <textarea
                id="chatbot-composer"
                ref={inputRef}
                rows={1}
                value={draft}
                onChange={(event) => {
                  setDraft(event.target.value)
                  resizeInput()
                }}
                onKeyDown={onComposerKeyDown}
                placeholder={t('chatbot.placeholder')}
                className="max-h-[120px] min-h-[36px] min-w-0 flex-1 resize-none bg-transparent py-1.5 text-[14px] font-medium text-[#24314f] outline-none placeholder:font-medium placeholder:text-[#8b95a8]"
              />
              <button
                type="submit"
                disabled={(!draft.trim() && attachments.length === 0) || thinking}
                aria-label={t('chatbot.send')}
                className="grid size-9 shrink-0 place-items-center rounded-[8px] bg-[#2860B9] text-white transition-colors hover:bg-[#1f529e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/35 disabled:cursor-not-allowed disabled:bg-[#2860B9]/40"
              >
                <SendIcon className="size-4" />
              </button>
            </div>
          </form>
        </>
      )}
    </section>
  )
}
