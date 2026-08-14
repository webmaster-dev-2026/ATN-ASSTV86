const common = {
  viewBox: '0 0 24 24',
  fill: 'none',
  'aria-hidden': true as const,
}

const stroke = {
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function ChatBubbleIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path
        {...stroke}
        d="M5.2 18.4 4.5 21l3.2-1.2A8.8 8.8 0 1 0 5.2 18.4Z"
      />
      <path {...stroke} d="M8.4 11h7.2M8.4 14.2h4.6" />
    </svg>
  )
}

export function NewChatIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M12.8 5.2H7.4A1.8 1.8 0 0 0 5.6 7v10.4A1.8 1.8 0 0 0 7.4 19.2h9.2a1.8 1.8 0 0 0 1.8-1.8v-6.2" />
      <path {...stroke} d="M16.2 4.6v4.4M14 6.8h4.4" />
    </svg>
  )
}

export function HistoryIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M5.4 12a6.6 6.6 0 1 0 1.6-4.4" />
      <path {...stroke} d="M5.4 5.6v3.4H8.8" />
      <path {...stroke} d="M12 8.8V12l2.4 1.6" />
    </svg>
  )
}

export function ExpandIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <rect x="3.8" y="5.2" width="16.4" height="13.6" rx="2" {...stroke} />
      <path {...stroke} d="M14.4 5.2v13.6" />
      <path {...stroke} d="m10.2 9.4 2.4 2.6-2.4 2.6" />
    </svg>
  )
}

export function CollapseIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <rect x="3.8" y="5.2" width="16.4" height="13.6" rx="2" {...stroke} />
      <path {...stroke} d="M14.4 5.2v13.6" />
      <path {...stroke} d="m12.6 9.4-2.4 2.6 2.4 2.6" />
    </svg>
  )
}

export function AttachFileIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path
        {...stroke}
        d="M14.4 7.2 8.2 13.4a3.1 3.1 0 0 0 4.4 4.4l7-7a4.6 4.6 0 1 0-6.5-6.5l-7.2 7.2a6 6 0 0 0 8.5 8.5l6.2-6.2"
      />
    </svg>
  )
}

export function SendIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="m5.2 12 13.6-6.4L14.4 19l-2.6-5.4L5.2 12Z" />
    </svg>
  )
}

export function CloseIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M7 7l10 10M17 7 7 17" />
    </svg>
  )
}

export function BackIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M14.6 6.8 9.4 12l5.2 5.2" />
    </svg>
  )
}

export function ChevronRightIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="m9.4 6.8 5.2 5.2-5.2 5.2" />
    </svg>
  )
}

export function WarningIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M12 4.8 20.2 19H3.8L12 4.8Z" />
      <path {...stroke} d="M12 10.2v4.2" />
      <circle cx="12" cy="16.8" r="0.8" fill="currentColor" />
    </svg>
  )
}

export function ClipboardCheckIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <rect x="7" y="4.8" width="10" height="14.7" rx="2" {...stroke} />
      <path {...stroke} d="M9.4 4.8V4a1.6 1.6 0 0 1 1.6-1.5h2A1.6 1.6 0 0 1 16.6 4v.8" />
      <path {...stroke} d="m9.6 13 1.8 1.8 3.4-3.6" />
    </svg>
  )
}

export function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <rect x="4.4" y="6" width="15.2" height="13.4" rx="2" {...stroke} />
      <path {...stroke} d="M8 4.6v3M16 4.6v3M4.4 10h15.2" />
    </svg>
  )
}
