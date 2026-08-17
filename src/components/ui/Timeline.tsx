import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface TimelineProps {
  children: ReactNode
  className?: string
}

interface TimelineItemProps {
  last?: boolean
  children: ReactNode
}

export function Timeline({ children, className }: TimelineProps) {
  return <ol className={className}>{children}</ol>
}

export function TimelineItem({ last = false, children }: TimelineItemProps) {
  return (
    <li className="grid grid-cols-[16px_minmax(0,1fr)] gap-3">
      <div className="relative flex justify-center">
        {last ? null : (
          <span
            aria-hidden
            className="absolute top-2 bottom-0 left-1/2 w-0 -translate-x-1/2 border-l border-dashed border-[#c5d4ea]"
          />
        )}
        <span className="relative z-10 mt-0.5 grid size-4 shrink-0 place-items-center rounded-full border border-[#c5d4ea] bg-white">
          <span className="size-1.5 rounded-full bg-[#2860B9]" />
        </span>
      </div>
      <div className={cn(!last && 'pb-5')}>{children}</div>
    </li>
  )
}
