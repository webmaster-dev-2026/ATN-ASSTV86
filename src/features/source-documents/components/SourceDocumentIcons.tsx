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

export function FolderIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <path
        {...stroke}
        d="M4.4 8.2A1.6 1.6 0 0 1 6 6.6h3.8l1.5 1.8H18a1.6 1.6 0 0 1 1.6 1.6v7.2A1.6 1.6 0 0 1 18 18.8H6A1.6 1.6 0 0 1 4.4 17.2Z"
      />
    </svg>
  )
}

export function CheckCircleIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <circle cx="12" cy="12" r="7.2" {...stroke} />
      <path {...stroke} d="m8.8 12.2 2.2 2.2 4.3-4.6" />
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

export function WarningTriangleIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <path {...stroke} d="M12 5.2 20.4 19.4H3.6L12 5.2Z" />
      <path {...stroke} d="M12 10.2v4.2M12 16.8h.01" />
    </svg>
  )
}

export function SearchIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <circle cx="11" cy="11" r="6.2" {...stroke} />
      <path {...stroke} d="m15.6 15.6 3.6 3.6" />
    </svg>
  )
}

export function ChevronDownIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-3.5 shrink-0', className)}>
      <path {...stroke} d="m6.5 9.5 5.5 5.5 5.5-5.5" />
    </svg>
  )
}

export function ChevronLeftIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <path {...stroke} d="m14.5 6.5-5.5 5.5 5.5 5.5" />
    </svg>
  )
}

export function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <path {...stroke} d="m9.5 6.5 5.5 5.5-5.5 5.5" />
    </svg>
  )
}

export function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <rect x="4.5" y="6" width="15" height="13.5" rx="1.6" {...stroke} />
      <path {...stroke} d="M4.5 10h15M8.5 4.5v3M15.5 4.5v3" />
    </svg>
  )
}

export function FunnelIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <path {...stroke} d="M4.5 6.2h15l-5.4 6.4v4.7L9.9 19.2v-6.6L4.5 6.2Z" />
    </svg>
  )
}

export function SortDownIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('size-3 shrink-0', className)} viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M6 9.4 2.2 4.8h7.6L6 9.4Z" />
    </svg>
  )
}

export function TrendUpIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('size-3 shrink-0', className)} viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M6 2.2 10.6 9.4H1.4L6 2.2Z" />
    </svg>
  )
}

export function MoreVerticalIcon({ className }: { className?: string }) {
  return (
    <svg className={cn('size-4 shrink-0', className)} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="6" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="12" cy="18" r="1.4" />
    </svg>
  )
}

export function ExternalLinkIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <path {...stroke} d="M14 6.5h3.5V10M17.5 6.5 10.8 13.2" />
      <path {...stroke} d="M8.2 7.2H6.8A1.3 1.3 0 0 0 5.5 8.5v8.7A1.3 1.3 0 0 0 6.8 18.5h8.7a1.3 1.3 0 0 0 1.3-1.3v-1.4" />
    </svg>
  )
}

export function DownloadIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <path {...stroke} d="M12 5v9.2M8.4 10.8 12 14.4l3.6-3.6" />
      <path {...stroke} d="M6 19h12" />
    </svg>
  )
}

export function RepeatIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <path {...stroke} d="M16.5 7.2h3v3" />
      <path {...stroke} d="M19.5 7.2A7 7 0 0 0 6.8 9.4" />
      <path {...stroke} d="M7.5 16.8h-3v-3" />
      <path {...stroke} d="M4.5 16.8A7 7 0 0 0 17.2 14.6" />
    </svg>
  )
}

export function MinusIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <path {...stroke} d="M6 12h12" />
    </svg>
  )
}

export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <path {...stroke} d="M12 6v12M6 12h12" />
    </svg>
  )
}

export function MaximizeIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <path {...stroke} d="M8.2 6.5H6.5V8.2M15.8 6.5h1.7V8.2M8.2 17.5H6.5V15.8M15.8 17.5h1.7V15.8" />
    </svg>
  )
}

export function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <path {...stroke} d="M8.5 12h9M14.2 8.2 18.5 12l-4.3 3.8" />
    </svg>
  )
}
