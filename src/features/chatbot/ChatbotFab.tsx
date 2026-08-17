import { useRef, useState } from 'react'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { ChatBubbleIcon } from './ChatbotIcons'
import { DRAG_THRESHOLD, FAB_MARGIN } from './constants'
import { useChatbot } from './ChatbotContext'

export function ChatbotFab() {
  const { t } = useI18n()
  const { mode, fabPosition, fabSize, openFloat, setFabPosition } = useChatbot()
  const pointerIdRef = useRef<number | null>(null)
  const originRef = useRef({ x: 0, y: 0, left: 0, top: 0 })
  const draggedRef = useRef(false)
  const skipClickRef = useRef(false)
  const liveRef = useRef(fabPosition)
  const [dragging, setDragging] = useState(false)
  const [livePosition, setLivePosition] = useState<{ left: number; top: number } | null>(null)

  if (mode !== 'closed') {
    return null
  }

  const position = livePosition ?? fabPosition

  return (
    <button
      type="button"
      aria-label={t('chatbot.open')}
      title={t('chatbot.dragHint')}
      className={cn(
        'fixed z-40 grid place-items-center rounded-full bg-[#2860B9] text-white print:hidden',
        'shadow-[0_12px_28px_rgba(30,64,116,0.28)]',
        'transition-[box-shadow,transform] duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]',
        'hover:bg-[#1f529e] hover:shadow-[0_16px_32px_rgba(30,64,116,0.34)]',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/40 focus-visible:ring-offset-2',
        dragging ? 'cursor-grabbing scale-105' : 'cursor-grab active:scale-[0.98]',
      )}
      style={{
        width: fabSize,
        height: fabSize,
        left: position.left,
        top: position.top,
        touchAction: 'none',
      }}
      onPointerDown={(event) => {
        if (event.button !== 0) {
          return
        }
        pointerIdRef.current = event.pointerId
        draggedRef.current = false
        originRef.current = {
          x: event.clientX,
          y: event.clientY,
          left: fabPosition.left,
          top: fabPosition.top,
        }
        event.currentTarget.setPointerCapture(event.pointerId)
      }}
      onPointerMove={(event) => {
        if (pointerIdRef.current !== event.pointerId) {
          return
        }
        const dx = event.clientX - originRef.current.x
        const dy = event.clientY - originRef.current.y
        if (!draggedRef.current && Math.hypot(dx, dy) < DRAG_THRESHOLD) {
          return
        }
        draggedRef.current = true
        setDragging(true)
        const maxLeft = Math.max(FAB_MARGIN, window.innerWidth - FAB_MARGIN - fabSize)
        const maxTop = Math.max(FAB_MARGIN, window.innerHeight - FAB_MARGIN - fabSize)
        const next = {
          left: Math.min(maxLeft, Math.max(FAB_MARGIN, originRef.current.left + dx)),
          top: Math.min(maxTop, Math.max(FAB_MARGIN, originRef.current.top + dy)),
        }
        liveRef.current = next
        setLivePosition(next)
      }}
      onPointerUp={(event) => {
        if (pointerIdRef.current !== event.pointerId) {
          return
        }
        pointerIdRef.current = null
        setDragging(false)
        skipClickRef.current = draggedRef.current
        if (draggedRef.current) {
          setFabPosition(liveRef.current)
        }
        setLivePosition(null)
        draggedRef.current = false
      }}
      onPointerCancel={() => {
        pointerIdRef.current = null
        setDragging(false)
        draggedRef.current = false
        skipClickRef.current = false
      }}
      onClick={() => {
        if (skipClickRef.current) {
          skipClickRef.current = false
          return
        }
        openFloat()
      }}
    >
      <ChatBubbleIcon className="size-6" />
    </button>
  )
}
