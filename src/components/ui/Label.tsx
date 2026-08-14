import type { LabelHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  requiredMark?: boolean
}

export function Label({
  className,
  children,
  requiredMark = false,
  ...props
}: LabelProps) {
  return (
    <label
      className={cn('mb-1.5 block text-[15px] font-semibold text-ink', className)}
      {...props}
    >
      {children}
      {requiredMark ? <span className="ml-0.5 text-danger">*</span> : null}
    </label>
  )
}
