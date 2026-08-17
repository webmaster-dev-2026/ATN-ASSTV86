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

export function WarningTriangleIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M12 5.2 20.4 19.4H3.6L12 5.2Z" />
      <path {...stroke} d="M12 10.2v4.2M12 16.8h.01" />
    </svg>
  )
}

export function CheckCircleIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <circle cx="12" cy="12" r="7.2" {...stroke} />
      <path {...stroke} d="m8.8 12.2 2.2 2.2 4.3-4.6" />
    </svg>
  )
}

export function LockIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <rect x="6.2" y="11" width="11.6" height="8.2" rx="1.6" {...stroke} />
      <path {...stroke} d="M8.4 11V8.4a3.6 3.6 0 0 1 7.2 0V11" />
    </svg>
  )
}

export function SearchIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} width={16} height={16} className={cn('size-4 shrink-0', className)}>
      <circle cx="11" cy="11" r="5.5" {...stroke} />
      <path {...stroke} d="m15.4 15.4 3.4 3.4" />
    </svg>
  )
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg {...common} width={14} height={14} className={cn('size-3.5 shrink-0', className)}>
      <path {...stroke} d="m6.5 9.5 5.5 5.5 5.5-5.5" />
    </svg>
  )
}

export function ChevronLeftIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="m14.5 6.5-5.5 5.5 5.5 5.5" />
    </svg>
  )
}

export function ChevronRightIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="m9.5 6.5 5.5 5.5-5.5 5.5" />
    </svg>
  )
}

export function ResetIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M5.2 8.2A7 7 0 1 1 5 13.2" />
      <path {...stroke} d="M5.2 4.6v3.6H8.8" />
    </svg>
  )
}

export function CalendarIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <rect x="4.6" y="6" width="14.8" height="13" rx="2" {...stroke} />
      <path {...stroke} d="M8 4.6v3M16 4.6v3M4.6 10h14.8" />
    </svg>
  )
}

export function PencilIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M13.2 6.4 17.6 10.8M4.8 18.8l.9-4.6L15.4 4.5a1.6 1.6 0 0 1 2.3 0l1.8 1.8a1.6 1.6 0 0 1 0 2.3L10 18l-4.7.8Z" />
    </svg>
  )
}

export function FolderIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M4 8.2A1.6 1.6 0 0 1 5.6 6.6h3.4l1.4 1.7H18a1.6 1.6 0 0 1 1.6 1.6v7.2A1.6 1.6 0 0 1 18 18.7H5.6A1.6 1.6 0 0 1 4 17.1V8.2Z" />
    </svg>
  )
}
