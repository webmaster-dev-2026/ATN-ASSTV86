import { useCallback, useMemo, useState } from 'react'
import { INITIAL_NOTIFICATIONS } from './data'
import type { AppNotification } from './types'

const STORAGE_KEY = 'asstv86.notifications.readIds'

function loadReadIds() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      return new Set<string>()
    }
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) {
      return new Set<string>()
    }
    return new Set(parsed.filter((id): id is string => typeof id === 'string'))
  } catch {
    return new Set<string>()
  }
}

function persistReadIds(notifications: AppNotification[]) {
  const readIds = notifications.filter((item) => item.read).map((item) => item.id)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(readIds))
}

function withPersistedReads(items: AppNotification[]) {
  const readIds = loadReadIds()
  return items.map((item) =>
    readIds.has(item.id) ? { ...item, read: true } : item,
  )
}

function sortByNewest(items: AppNotification[]) {
  return [...items].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(() =>
    withPersistedReads(INITIAL_NOTIFICATIONS),
  )

  const unread = useMemo(
    () => sortByNewest(notifications.filter((item) => !item.read)),
    [notifications],
  )
  const read = useMemo(
    () => sortByNewest(notifications.filter((item) => item.read)),
    [notifications],
  )
  const unreadCount = unread.length

  const markAsRead = useCallback((id: string) => {
    setNotifications((current) => {
      const next = current.map((item) =>
        item.id === id ? { ...item, read: true } : item,
      )
      persistReadIds(next)
      return next
    })
  }, [])

  const markAllAsRead = useCallback(() => {
    setNotifications((current) => {
      const next = current.map((item) => ({ ...item, read: true }))
      persistReadIds(next)
      return next
    })
  }, [])

  return {
    notifications,
    unread,
    read,
    unreadCount,
    markAsRead,
    markAllAsRead,
  }
}
