import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface PageFrameProps {
  children: ReactNode
  className?: string
}

export function PageFrame({ children, className }: PageFrameProps) {
  return (
    <div
      className={cn(
        'flex h-full min-h-0 w-full min-w-0 flex-1 flex-col overflow-auto rounded-2xl bg-[#eef3f9] p-3 lg:p-4',
        className,
      )}
    >
      {children}
    </div>
  )
}
