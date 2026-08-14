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

export function FolderGearIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path
        {...stroke}
        d="M3.8 8.4A1.6 1.6 0 0 1 5.4 6.8h3.6l1.4 1.7H18a1.6 1.6 0 0 1 1.6 1.6v2.2"
      />
      <path {...stroke} d="M3.8 8.8v8.4A1.6 1.6 0 0 0 5.4 18.8h5.2" />
      <circle cx="16.4" cy="16.2" r="2.3" {...stroke} />
      <path {...stroke} d="M16.4 12.8v1.1M16.4 18.5v1.1M13 16.2h1.1M18.7 16.2h1.1M14 13.8l.8.8M18 17.8l.8.8M14 18.6l.8-.8M18 14.6l.8-.8" />
    </svg>
  )
}

export function FileEditIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M7 4.6h6.4L17.6 9v3.2" />
      <path {...stroke} d="M7 4.6A1.5 1.5 0 0 0 5.5 6.1v11.4A1.5 1.5 0 0 0 7 19h4.2" />
      <path {...stroke} d="M13.4 4.6V9h4.2" />
      <path {...stroke} d="M13.6 18.4 18.8 13.2l1.5 1.5-5.2 5.2H13.6v-1.5Z" />
    </svg>
  )
}

export function WarningTriangleIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M12 5.2 20.4 19.4H3.6L12 5.2Z" />
      <path {...stroke} d="M12 10.2v4.2" />
      <path {...stroke} d="M12 16.8h.01" />
    </svg>
  )
}

export function FileTextIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M7 4.6h6.4L17.6 9v9.4A1.5 1.5 0 0 1 16.1 20H7a1.5 1.5 0 0 1-1.5-1.6V6.1A1.5 1.5 0 0 1 7 4.6Z" />
      <path {...stroke} d="M13.4 4.6V9h4.2M8.4 12.5h7.2M8.4 15.8h5" />
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

export function ChatIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M5.2 6.2h13.6A1.6 1.6 0 0 1 20.4 7.8v7.2A1.6 1.6 0 0 1 18.8 16.6H9.4L5.2 19.6V6.2Z" />
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
