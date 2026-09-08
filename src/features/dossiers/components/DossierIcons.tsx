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

export function ClockIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <circle cx="12" cy="12" r="8" {...stroke} />
      <path {...stroke} d="M12 8v4.2l2.8 1.6" />
    </svg>
  )
}

export function SearchIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} width={16} height={16} className={cn('size-4 shrink-0', className)}>
      <circle cx="11" cy="11" r="6.2" {...stroke} />
      <path {...stroke} d="m15.6 15.6 3.6 3.6" />
    </svg>
  )
}

export function CalendarIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <rect x="4.5" y="6" width="15" height="13.5" rx="1.6" {...stroke} />
      <path {...stroke} d="M4.5 10h15M8.5 4.5v3M15.5 4.5v3" />
    </svg>
  )
}

export function BuildingIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M5 19.5V7.2A1.2 1.2 0 0 1 6.2 6h11.6A1.2 1.2 0 0 1 19 7.2V19.5" />
      <path {...stroke} d="M3.8 19.5h16.4M9 10h.01M12 10h.01M15 10h.01M9 13.5h.01M12 13.5h.01M15 13.5h.01M11 19.5v-3h2v3" />
    </svg>
  )
}

export function UserIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <circle cx="12" cy="8.2" r="3.1" {...stroke} />
      <path {...stroke} d="M5.6 18.8c.7-3 3.2-4.6 6.4-4.6s5.7 1.6 6.4 4.6" />
    </svg>
  )
}

export function BanIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <circle cx="12" cy="12" r="8" {...stroke} />
      <path {...stroke} d="m7.2 7.2 9.6 9.6" />
    </svg>
  )
}

export function RepeatIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M16.5 7.2h3v3" />
      <path {...stroke} d="M19.5 7.2A7 7 0 0 0 6.8 9.4" />
      <path {...stroke} d="M7.5 16.8h-3v-3" />
      <path {...stroke} d="M4.5 16.8A7 7 0 0 0 17.2 14.6" />
    </svg>
  )
}

export function PostureIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <circle cx="12" cy="6.2" r="1.8" {...stroke} />
      <path {...stroke} d="M12 8.4v5.2M9 19.2 12 13.6 15 19.2M8.4 11.6h7.2" />
    </svg>
  )
}

export function ArrowLeftIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M15.5 6.5 9 12l6.5 5.5M9 12h9" />
    </svg>
  )
}

export function CheckIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="m6.5 12.2 3.4 3.3 7.6-7.8" />
    </svg>
  )
}

export function ChevronDownIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
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

export function FilterIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M5 7h14M5 12h9.5M5 17h6" />
    </svg>
  )
}

export function MoreVerticalIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <circle cx="12" cy="6" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="12" cy="18" r="1.4" />
    </svg>
  )
}

export function FolderIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path
        {...stroke}
        d="M4.4 8.2A1.6 1.6 0 0 1 6 6.6h3.8l1.5 1.8H18a1.6 1.6 0 0 1 1.6 1.6v7.2A1.6 1.6 0 0 1 18 18.8H6A1.6 1.6 0 0 1 4.4 17.2Z"
      />
    </svg>
  )
}

export function TargetIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M12 4.8v2.4M12 16.8v2.4M4.8 12h2.4M16.8 12h2.4" />
      <circle cx="12" cy="12" r="5.2" {...stroke} />
      <circle cx="12" cy="12" r="1.6" {...stroke} />
    </svg>
  )
}

export function HistoryIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M5.6 12a6.4 6.4 0 1 0 1.7-4.4" />
      <path {...stroke} d="M5.6 5.8v3.2H8.8" />
      <path {...stroke} d="M12 8.8V12l2.2 1.4" />
    </svg>
  )
}

export function InfoCircleIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <circle cx="12" cy="12" r="8" {...stroke} />
      <path {...stroke} d="M12 11.2V16M12 8h.01" />
    </svg>
  )
}

export function CloseIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M7 7l10 10M17 7 7 17" />
    </svg>
  )
}

export function MinusIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M6 12h12" />
    </svg>
  )
}

export function PlusIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M12 6v12M6 12h12" />
    </svg>
  )
}

export function PrinterIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M7.5 8.5V4.8h9v3.7" />
      <path {...stroke} d="M7.5 15.5H6.2A1.7 1.7 0 0 1 4.5 13.8v-3.4A1.7 1.7 0 0 1 6.2 8.7h11.6a1.7 1.7 0 0 1 1.7 1.7v3.4a1.7 1.7 0 0 1-1.7 1.7H16.5" />
      <rect x="7.5" y="13.2" width="9" height="6" rx="0.8" {...stroke} />
      <path {...stroke} d="M16.8 11.2h.01" />
    </svg>
  )
}

export function DownloadIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M12 5v9.2M8.4 10.8 12 14.4l3.6-3.6" />
      <path {...stroke} d="M6 19h12" />
    </svg>
  )
}
