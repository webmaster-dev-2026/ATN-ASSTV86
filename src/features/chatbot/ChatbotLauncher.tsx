import { useEffect, useLayoutEffect, useState } from 'react'
import { ChatbotFab } from './ChatbotFab'
import { ChatPanel } from './ChatPanel'
import { PANEL_GAP, PANEL_HEIGHT, PANEL_WIDTH, VIEWPORT_MARGIN } from './constants'
import { useChatbot } from './ChatbotContext'

export function ChatbotLauncher() {
  const { mode, fabPosition, fabSize, close } = useChatbot()
  const [coords, setCoords] = useState({ left: 0, top: 0, width: PANEL_WIDTH, height: PANEL_HEIGHT })

  useLayoutEffect(() => {
    if (mode !== 'float') {
      return
    }

    const place = () => {
      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight
      const width = Math.min(PANEL_WIDTH, viewportWidth - VIEWPORT_MARGIN * 2)
      const fabLeft = fabPosition.left
      const fabTop = fabPosition.top
      const fabBottom = fabTop + fabSize
      const fabRight = fabLeft + fabSize

      const spaceAbove = fabTop - VIEWPORT_MARGIN - PANEL_GAP
      const spaceBelow = viewportHeight - fabBottom - VIEWPORT_MARGIN - PANEL_GAP
      const openAbove = spaceAbove >= Math.min(320, spaceBelow) || spaceAbove >= spaceBelow

      const height = Math.min(
        PANEL_HEIGHT,
        Math.max(280, openAbove ? spaceAbove : spaceBelow),
      )

      let left = fabRight - width
      if (left < VIEWPORT_MARGIN) {
        left = VIEWPORT_MARGIN
      }
      if (left + width > viewportWidth - VIEWPORT_MARGIN) {
        left = viewportWidth - VIEWPORT_MARGIN - width
      }

      const top = openAbove
        ? fabTop - PANEL_GAP - height
        : fabBottom + PANEL_GAP

      setCoords({
        left: Math.round(left),
        top: Math.round(Math.max(VIEWPORT_MARGIN, top)),
        width: Math.round(width),
        height: Math.round(height),
      })
    }

    place()
    window.addEventListener('resize', place)
    return () => window.removeEventListener('resize', place)
  }, [mode, fabPosition, fabSize])

  useEffect(() => {
    if (mode !== 'float') {
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

  return (
    <>
      <ChatbotFab />
      {mode === 'float' ? (
        <div
          className="chat-panel-enter fixed z-40 print:hidden"
          style={{
            left: coords.left,
            top: coords.top,
            width: coords.width,
            height: coords.height,
          }}
        >
          <ChatPanel variant="float" />
        </div>
      ) : null}
    </>
  )
}
