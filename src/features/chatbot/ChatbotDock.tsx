import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { ChatPanel } from './ChatPanel'
import { useChatbot } from './ChatbotContext'
import { DOCK_LAYOUT_QUERY } from './constants'

export function useDockAsLayout() {
  const [asLayout, setAsLayout] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(DOCK_LAYOUT_QUERY).matches : true,
  )

  useEffect(() => {
    const media = window.matchMedia(DOCK_LAYOUT_QUERY)
    const onChange = () => setAsLayout(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return asLayout
}

export function ChatbotDock() {
  const { mode, close } = useChatbot()
  const asLayout = useDockAsLayout()

  useEffect(() => {
    if (mode !== 'docked') {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        close()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [mode, close])

  if (mode !== 'docked') {
    return null
  }

  if (asLayout) {
    return (
      <div className="relative z-auto h-full w-[min(380px,36vw)] shrink-0">
        <ChatPanel variant="dock" className="h-full rounded-2xl border border-[#e4ecf6]" />
      </div>
    )
  }

  return createPortal(
    <aside
      role="dialog"
      aria-modal="false"
      className="chat-drawer-enter fixed inset-y-0 right-0 z-50 flex h-full min-h-0 w-[min(380px,100%)] flex-col shadow-[-14px_0_20px_-8px_rgba(30,64,116,0.16)] print:hidden"
    >
      <ChatPanel variant="dock" className="h-full rounded-none border-l border-[#e4ecf6]" />
    </aside>,
    document.body,
  )
}
