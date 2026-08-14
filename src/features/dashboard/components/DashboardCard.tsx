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
        'flex min-h-0 flex-col rounded-2xl bg-white p-5 shadow-[0_1px_2px_rgba(28,42,78,0.04)]',
        className,
      )}
    >
      <div className="mb-3 flex shrink-0 items-center justify-between gap-3">
        <h2 className={cn('font-sans text-[16px] font-bold text-[#1c2a4e]', titleClassName)}>
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  )
}
