import { cn } from '@/lib/cn'

const common = {
  viewBox: '0 0 24 24',
  fill: 'none',
  'aria-hidden': true as const,
}

const stroke = {
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <path {...stroke} d="M7 3.8h7.2L19 8.6V20a1.6 1.6 0 0 1-1.6 1.6H7A1.6 1.6 0 0 1 5.4 20V5.4A1.6 1.6 0 0 1 7 3.8Z" />
      <path {...stroke} d="M14.2 3.8V8.6H19M8.6 12.4h6.8M8.6 16.2h4.6" />
    </svg>
  )
}

export function ClockIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <circle cx="12" cy="12" r="8" {...stroke} />
      <path {...stroke} d="M12 8v4.2l2.8 1.6" />
    </svg>
  )
}

export function WarningIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <path {...stroke} d="M12 4.6 20.4 19.2H3.6L12 4.6Z" />
      <path {...stroke} d="M12 10.2v4M12 16.6v.2" />
    </svg>
  )
}

export function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <path {...stroke} d="M12 3.6 19.2 6.4v5.4c0 4.4-3 7.4-7.2 8.6-4.2-1.2-7.2-4.2-7.2-8.6V6.4L12 3.6Z" />
      <path {...stroke} d="m8.8 12.1 2.2 2.2 4.3-4.6" />
    </svg>
  )
}

export function TrendUpIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-3.5 shrink-0', className)}>
      <path {...stroke} d="M5 16.2 12.2 9l3.2 3.2L19 8.6" />
      <path {...stroke} d="M14.2 8.6H19v4.8" />
    </svg>
  )
}

export function TrendDownIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-3.5 shrink-0', className)}>
      <path {...stroke} d="M5 8.6 12.2 15.8l3.2-3.2L19 16.2" />
      <path {...stroke} d="M14.2 16.2H19V11.4" />
    </svg>
  )
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-3.5 shrink-0', className)}>
      <path {...stroke} d="m6 9 6 6 6-6" />
    </svg>
  )
}

export function RefreshIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <path {...stroke} d="M19.2 12a7.2 7.2 0 1 1-2.1-5.1" />
      <path {...stroke} d="M19.2 4.8V8.4h-3.6" />
    </svg>
  )
}

export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <path {...stroke} d="M5 12h14M13.5 6.5 19 12l-5.5 5.5" />
    </svg>
  )
}
