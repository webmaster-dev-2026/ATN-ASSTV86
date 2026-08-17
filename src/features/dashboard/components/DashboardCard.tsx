import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

interface DashboardCardProps {
  title: string
  action?: ReactNode
  children: ReactNode
  className?: string
  titleClassName?: string
}

export function DashboardCard({
  title,
  action,
  children,
  className,
  titleClassName,
}: DashboardCardProps) {
  return (
    <section
      className={cn(
        '@container flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white p-4 shadow-[0_1px_2px_rgba(28,42,78,0.04)] sm:p-5',
        className,
      )}
    >
      <div className="mb-3 flex shrink-0 items-start justify-between gap-2 sm:gap-3">
        <h2
          className={cn(
            'min-w-0 flex-1 break-words font-sans text-[15px] font-bold leading-snug text-[#1c2a4e] sm:text-[16px]',
            titleClassName,
          )}
        >
          {title}
        </h2>
        {action ? <div className="max-w-[45%] shrink-0">{action}</div> : null}
      </div>
      {children}
    </section>
  )
}
