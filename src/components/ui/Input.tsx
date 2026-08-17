import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  hasError?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, hasError = false, type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          'h-11 w-full rounded-lg border bg-white px-3.5 text-[15px] leading-normal text-ink shadow-sm',
          'placeholder:text-slate-400',
          'transition-[border-color,box-shadow]',
          'focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-500',
          'disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400',
          hasError
            ? 'border-danger focus:border-danger focus:ring-danger/20'
            : 'border-border',
          className,
        )}
        {...props}
      />
    )
  },
)

Input.displayName = 'Input'
