import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { formatRelativeTime } from './formatRelativeTime'
import { useNotifications } from './useNotifications'
import type { AppNotification, NotificationType } from './types'

const PANEL_WIDTH = 384
const VIEWPORT_MARGIN = 12
const PANEL_GAP = 8

function keepPanelInViewport(trigger: HTMLElement, panel: HTMLElement) {
  const triggerRect = trigger.getBoundingClientRect()
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const width = Math.min(PANEL_WIDTH, viewportWidth - VIEWPORT_MARGIN * 2)

  let left = triggerRect.left
  if (left + width > viewportWidth - VIEWPORT_MARGIN) {
    left = viewportWidth - VIEWPORT_MARGIN - width
  }
  if (left < VIEWPORT_MARGIN) {
    left = VIEWPORT_MARGIN
  }

  const top = triggerRect.bottom + PANEL_GAP
  const maxHeight = Math.min(448, Math.max(160, viewportHeight - top - VIEWPORT_MARGIN))

  panel.style.left = `${Math.round(left)}px`
  panel.style.top = `${Math.round(top)}px`
  panel.style.width = `${Math.round(width)}px`
  panel.style.maxHeight = `${Math.round(maxHeight)}px`
}

const TYPE_STYLES: Record<NotificationType, string> = {
  dossier: 'bg-[#2860B9]',
  validation: 'bg-[#f08a24]',
  anomaly: 'bg-[#e54848]',
  completed: 'bg-[#2f9e63]',
  reminder: 'bg-[#6b5ca5]',
}

const TYPE_LABEL_KEYS = {
  dossier: 'notifications.types.dossier',
  validation: 'notifications.types.validation',
  anomaly: 'notifications.types.anomaly',
  completed: 'notifications.types.completed',
  reminder: 'notifications.types.reminder',
} as const

function BellIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M6.2 9.4a5.8 5.8 0 0 1 11.6 0c0 4.2 1.4 5.6 1.4 5.6H4.8s1.4-1.4 1.4-5.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <path
        d="M10 18.6a2 2 0 0 0 4 0"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function TypeIcon({ type }: { type: NotificationType }) {
  const common = {
    className: 'size-4',
    viewBox: '0 0 24 24',
    fill: 'none',
    'aria-hidden': true as const,
  }

  switch (type) {
    case 'dossier':
      return (
        <svg {...common}>
          <path
            d="M4 7.2A1.7 1.7 0 0 1 5.7 5.5h4.2l1.6 2H18.3A1.7 1.7 0 0 1 20 9.2v8.6a1.7 1.7 0 0 1-1.7 1.7H5.7A1.7 1.7 0 0 1 4 17.8V7.2Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'validation':
      return (
        <svg {...common}>
          <rect x="7" y="4.8" width="10" height="14.7" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="M9.4 4.8V4a1.6 1.6 0 0 1 1.6-1.5h2a1.6 1.6 0 0 1 1.6 1.5v.8"
            stroke="currentColor"
            strokeWidth="1.8"
          />
        </svg>
      )
    case 'anomaly':
      return (
        <svg {...common}>
          <path
            d="M12 5.4 20.2 19.4H3.8L12 5.4Z"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinejoin="round"
          />
          <path d="M12 10.4v4M12 16.4v.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
    case 'completed':
      return (
        <svg {...common}>
          <path
            d="m6.5 12.2 3.4 3.4 7.6-8"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'reminder':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8" stroke="currentColor" strokeWidth="1.8" />
          <path d="M12 8v4.2l2.8 1.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      )
  }
}

function NotificationItem({
  item,
  onOpen,
  onMarkAsRead,
}: {
  item: AppNotification
  onOpen: (item: AppNotification) => void
  onMarkAsRead: (id: string) => void
}) {
  const { t, locale } = useI18n()

  return (
    <article
      className={cn(
        'border-b border-[#eef3f9] px-4 py-3 last:border-b-0 transition-colors',
        item.read ? 'bg-white hover:bg-[#f7fafc]' : 'bg-[#f5f8fd] hover:bg-[#eaf0f8]',
      )}
    >
      <div className="flex gap-3">
        <div
          className={cn(
            'mt-0.5 grid size-8 shrink-0 place-items-center rounded-full text-white',
            TYPE_STYLES[item.type],
          )}
        >
          <TypeIcon type={item.type} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <button
              type="button"
              className="min-w-0 flex-1 cursor-pointer text-left focus-visible:outline-none"
              onClick={() => onOpen(item)}
            >
              <p className="text-[13px] font-bold leading-snug text-[#1c2a4e]">{t(item.titleKey)}</p>
              <p className="mt-1 text-[12px] font-medium leading-relaxed text-[#4d5b73]">
                {t(item.bodyKey)}
              </p>
            </button>
            {item.read ? null : (
              <span
                className="mt-1.5 size-2 shrink-0 rounded-full bg-[#2860B9]"
                aria-hidden
              />
            )}
          </div>

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[11px] font-medium text-[#6d7b93]">
            <span className="rounded-full bg-white px-2 py-0.5 text-[#1d4f9a] ring-1 ring-[#d7e3f4]">
              {t(TYPE_LABEL_KEYS[item.type])}
            </span>
            <span>
              {t('notifications.dossierRef')} {item.dossierRef}
            </span>
            <time dateTime={item.createdAt}>{formatRelativeTime(item.createdAt, locale)}</time>
          </div>

          {item.read ? null : (
            <button
              type="button"
              className="mt-2 cursor-pointer text-[12px] font-semibold text-[#2860B9] transition-colors hover:text-[#1d4f9a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/35"
              onClick={() => onMarkAsRead(item.id)}
            >
              {t('notifications.markAsRead')}
            </button>
          )}
        </div>
      </div>
    </article>
  )
}

export function NotificationMenu() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { unread, read, unreadCount, markAsRead, markAllAsRead } = useNotifications()
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const titleId = useId()
  const panelId = useId()

  useLayoutEffect(() => {
    if (!open || !rootRef.current || !panelRef.current) {
      return
    }

    const trigger = rootRef.current
    const panel = panelRef.current

    const place = () => keepPanelInViewport(trigger, panel)
    place()
    panel.focus()

    window.addEventListener('resize', place)
    window.addEventListener('scroll', place, true)
    return () => {
      window.removeEventListener('resize', place)
      window.removeEventListener('scroll', place, true)
    }
  }, [open])

  useEffect(() => {
    if (!open) {
      return
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const handleOpenItem = (item: AppNotification) => {
    markAsRead(item.id)
    setOpen(false)
    navigate(item.href)
  }

  const badgeLabel =
    unreadCount > 9 ? '9+' : unreadCount > 0 ? String(unreadCount) : null

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        className="relative grid size-10 cursor-pointer place-items-center rounded-[10px] text-[#1d4f9a] transition-colors hover:bg-[#eef3f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/35"
        aria-label={
          unreadCount > 0
            ? `${t('header.notifications')} (${unreadCount})`
            : t('header.notifications')
        }
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => setOpen((current) => !current)}
      >
        <BellIcon className="size-5" />
        {badgeLabel ? (
          <span className="absolute right-1.5 top-1.5 grid min-w-[16px] place-items-center rounded-full bg-[#e54848] px-1 text-[10px] font-bold leading-[16px] text-white">
            {badgeLabel}
          </span>
        ) : null}
      </button>

      {open ? (
        <div
          ref={panelRef}
          id={panelId}
          role="dialog"
          aria-labelledby={titleId}
          tabIndex={-1}
          className="fixed z-50 flex flex-col overflow-hidden rounded-[10px] border border-[#e4ecf6] bg-white shadow-[0_12px_32px_rgba(30,64,116,0.14)] focus:outline-none"
        >
          <div className="flex shrink-0 items-center justify-between gap-3 border-b border-[#e4ecf6] px-4 py-3">
            <h2 id={titleId} className="text-[15px] font-bold text-[#1c2a4e]">
              {t('notifications.title')}
            </h2>
            <button
              type="button"
              className="cursor-pointer text-[12px] font-semibold text-[#2860B9] transition-colors hover:text-[#1d4f9a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/35 disabled:cursor-not-allowed disabled:text-[#9aa6ba]"
              disabled={unreadCount === 0}
              onClick={markAllAsRead}
            >
              {t('notifications.markAllRead')}
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto">
            {unread.length === 0 && read.length === 0 ? (
              <p className="px-4 py-10 text-center text-[13px] font-medium text-[#6d7b93]">
                {t('notifications.empty')}
              </p>
            ) : (
              <>
                {unread.length > 0 ? (
                  <section aria-label={t('notifications.new')}>
                    <p className="px-4 pb-1 pt-3 text-[12px] font-semibold text-[#6d7b93]">
                      {t('notifications.new')}
                    </p>
                    {unread.map((item) => (
                      <NotificationItem
                        key={item.id}
                        item={item}
                        onOpen={handleOpenItem}
                        onMarkAsRead={markAsRead}
                      />
                    ))}
                  </section>
                ) : null}

                {read.length > 0 ? (
                  <section aria-label={t('notifications.earlier')}>
                    <p className="px-4 pb-1 pt-3 text-[12px] font-semibold text-[#6d7b93]">
                      {t('notifications.earlier')}
                    </p>
                    {read.map((item) => (
                      <NotificationItem
                        key={item.id}
                        item={item}
                        onOpen={handleOpenItem}
                        onMarkAsRead={markAsRead}
                      />
                    ))}
                  </section>
                ) : null}
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
