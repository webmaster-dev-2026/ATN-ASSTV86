import type { NavIconName } from './nav-config'

const common = {
  viewBox: '0 0 24 24',
  fill: 'none',
  'aria-hidden': true as const,
}

const stroke = {
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function NavIcon({
  name,
  className = 'size-5',
  strokeWidth = 1.6,
}: {
  name: NavIconName
  className?: string
  strokeWidth?: number
}) {
  const line = { ...stroke, strokeWidth }
  switch (name) {
    case 'home':
      return (
        <svg {...common} className={className}>
          <path {...line} d="m4 10.5 8-7 8 7V20a1.5 1.5 0 0 1-1.5 1.5H5.5A1.5 1.5 0 0 1 4 20V10.5Z" />
          <path {...line} d="M9.5 21.5v-7h5v7" />
        </svg>
      )
    case 'folder':
      return (
        <svg {...common} className={className}>
          <path
            {...line}
            d="M4 7.2A1.7 1.7 0 0 1 5.7 5.5h4.2l1.6 2H18.3A1.7 1.7 0 0 1 20 9.2v8.6a1.7 1.7 0 0 1-1.7 1.7H5.7A1.7 1.7 0 0 1 4 17.8V7.2Z"
          />
        </svg>
      )
    case 'clipboard':
      return (
        <svg {...common} className={className}>
          <rect x="7" y="4.8" width="10" height="14.7" rx="2" {...line} />
          <path {...line} d="M9.4 4.8V4a1.6 1.6 0 0 1 1.6-1.5h2a1.6 1.6 0 0 1 1.6 1.5v.8" />
          <path {...line} d="m9.6 13 1.8 1.8 3.4-3.6" />
        </svg>
      )
    case 'warning':
      return (
        <svg {...common} className={className}>
          <path {...line} d="M12 4.8 20.2 19H3.8L12 4.8Z" />
          <path {...line} d="M12 10.2v4.2" />
          <circle cx="12" cy="16.8" r="0.7" fill="currentColor" />
        </svg>
      )
    case 'clock':
      return (
        <svg {...common} className={className}>
          <circle cx="12" cy="12" r="8" {...line} />
          <path {...line} d="M12 8v4.2l2.8 1.6" />
        </svg>
      )
    case 'checkCircle':
      return (
        <svg {...common} className={className}>
          <circle cx="12" cy="12" r="8" {...line} />
          <path {...line} d="m8.8 12.2 2.2 2.2 4.3-4.6" />
        </svg>
      )
    case 'search':
      return (
        <svg {...common} className={className}>
          <circle cx="11" cy="11" r="6.2" {...line} />
          <path {...line} d="m15.6 15.6 3.6 3.6" />
        </svg>
      )
    case 'document':
      return (
        <svg {...common} className={className}>
          <path {...line} d="M7 3.8h6.2L17.2 8v11.2A1.5 1.5 0 0 1 15.7 20.7H7A1.5 1.5 0 0 1 5.5 19.2V5.3A1.5 1.5 0 0 1 7 3.8Z" />
          <path {...line} d="M13.1 3.9V8h4.1" />
          <path {...line} d="M8.4 12.2h7.2M8.4 15.6h5.2" />
        </svg>
      )
    case 'chart':
      return (
        <svg {...common} className={className}>
          <path {...line} d="M4.5 19.5V6M4.5 19.5H20" />
          <path {...line} d="M8.4 19.5v-5.2M12.6 19.5V8.6M16.8 19.5v-8" />
        </svg>
      )
    case 'settings':
      return (
        <svg {...common} className={className}>
          <circle cx="12" cy="12" r="2.5" {...line} />
          <path
            {...line}
            d="M12 3.8h.3l.4 2.1a6.4 6.4 0 0 1 1.6.9l2-.7 1.6 2.8-1.6 1.3c.1.4.2.8.2 1.2s-.1.8-.2 1.2l1.6 1.3-1.6 2.8-2-.7a6.4 6.4 0 0 1-1.6.9l-.4 2.1H12h-.3l-.4-2.1a6.4 6.4 0 0 1-1.6-.9l-2 .7-1.6-2.8 1.6-1.3A6 6 0 0 1 7.5 12c0-.4.1-.8.2-1.2L6.1 9.5l1.6-2.8 2 .7a6.4 6.4 0 0 1 1.6-.9l.4-2.1H12Z"
          />
        </svg>
      )
  }
}
