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

export function SearchDocIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M7 4.6h6.2L17.4 8.8V14" />
      <path {...stroke} d="M7 4.6A1.5 1.5 0 0 0 5.5 6.1v11.8A1.5 1.5 0 0 0 7 19.4h4.2" />
      <path {...stroke} d="M13.2 4.6V8.8h4.2" />
      <circle cx="15.6" cy="16.4" r="3.1" {...stroke} />
      <path {...stroke} d="m17.8 18.6 2 2" />
    </svg>
  )
}

export function ShieldCheckIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M12 3.6 18.6 6v5.2c0 4.1-2.8 7.6-6.6 8.8-3.8-1.2-6.6-4.7-6.6-8.8V6L12 3.6Z" />
      <path {...stroke} d="m9.2 12 2 2 3.8-4" />
    </svg>
  )
}

export function CalendarSearchIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <rect x="4.6" y="5.8" width="14.8" height="13.2" rx="2" {...stroke} />
      <path {...stroke} d="M8 4.4v3M16 4.4v3M4.6 10h14.8M8.4 14.2h3.4M8.4 16.8h2.2" />
    </svg>
  )
}

export function FileLinesIcon({ className = 'size-3.5' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M7 4.6h6.4L17.6 9v9.4A1.5 1.5 0 0 1 16.1 20H7a1.5 1.5 0 0 1-1.5-1.6V6.1A1.5 1.5 0 0 1 7 4.6Z" />
      <path {...stroke} d="M13.4 4.6V9h4.2M8.4 12.5h7.2M8.4 15.8h5" />
    </svg>
  )
}

export function SearchIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <circle cx="11" cy="11" r="6.2" {...stroke} />
      <path {...stroke} d="m15.6 15.6 3.6 3.6" />
    </svg>
  )
}

export function DownloadIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M12 4.6v10.2M8.2 11.4 12 15.2l3.8-3.8M5.2 19.4h13.6" />
    </svg>
  )
}

export function ChevronDownIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-3.5 shrink-0', className)}>
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

export function TrendUpIcon({ className = 'size-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M6 2.2 10.6 9.4H1.4L6 2.2Z" />
    </svg>
  )
}

export function TrendDownIcon({ className = 'size-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M6 9.8 1.4 2.6h9.2L6 9.8Z" />
    </svg>
  )
}
