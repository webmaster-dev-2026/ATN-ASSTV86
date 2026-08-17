import { cn } from '@/lib/cn'
import type { SettingsCategoryId, TemplateKind } from '../types'

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

export function GearIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <circle cx="12" cy="12" r="2.4" {...stroke} />
      <path
        {...stroke}
        d="M12 4h.25l.35 1.85a6 6 0 0 1 1.45.8l1.75-.6 1.4 2.45-1.4 1.15c.1.35.15.7.15 1.1s-.05.75-.15 1.1l1.4 1.15-1.4 2.45-1.75-.6a6 6 0 0 1-1.45.8L12.25 20H12h-.25l-.35-1.85a6 6 0 0 1-1.45-.8l-1.75.6-1.4-2.45 1.4-1.15A5.5 5.5 0 0 1 8.05 12c0-.4.05-.75.15-1.1L6.8 9.75l1.4-2.45 1.75.6a6 6 0 0 1 1.45-.8L11.75 4H12Z"
      />
    </svg>
  )
}

export function UsersIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <circle cx="9" cy="8.2" r="2.4" {...stroke} />
      <path {...stroke} d="M4.6 18.2c.4-3 2.3-4.6 4.4-4.6s4 1.6 4.4 4.6" />
      <circle cx="16.2" cy="9" r="2" {...stroke} />
      <path {...stroke} d="M15.2 13.8c1.9.2 3.5 1.5 3.9 4.4" />
    </svg>
  )
}

export function CenterIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <path {...stroke} d="M4.8 19.2V8.4L12 4.6l7.2 3.8v10.8" />
      <path {...stroke} d="M9.2 19.2v-5.2h5.6v5.2M4.8 19.2h14.4" />
      <path {...stroke} d="M10.2 10.2h3.6" />
    </svg>
  )
}

export function InboxIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <path {...stroke} d="M4.6 13.2 6.4 5.8A1.5 1.5 0 0 1 7.85 4.7h8.3A1.5 1.5 0 0 1 17.6 5.8l1.8 7.4v4.5A1.6 1.6 0 0 1 17.8 19.3H6.2A1.6 1.6 0 0 1 4.6 17.7Z" />
      <path {...stroke} d="M4.8 13.2h4.1l1.1 2.2h4l1.1-2.2h4.1" />
    </svg>
  )
}

export function ShieldIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <path {...stroke} d="M12 4.4 18.6 6.6v5.3c0 3.7-2.5 6.4-6.6 7.7-4.1-1.3-6.6-4-6.6-7.7V6.6L12 4.4Z" />
      <path {...stroke} d="m9.2 12 1.9 1.9 3.7-3.8" />
    </svg>
  )
}

export function DocumentIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <path {...stroke} d="M7.2 4.4h6L17.2 8.4v10.4A1.4 1.4 0 0 1 15.8 20.2H7.2A1.4 1.4 0 0 1 5.8 18.8V5.8A1.4 1.4 0 0 1 7.2 4.4Z" />
      <path {...stroke} d="M13.1 4.5V8.4h4" />
      <path {...stroke} d="M8.6 12.2h6.4M8.6 15.4h4.6" />
    </svg>
  )
}

export function BellIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <path {...stroke} d="M6.4 9.6a5.6 5.6 0 0 1 11.2 0c0 4 1.3 5.4 1.3 5.4H5.1s1.3-1.4 1.3-5.4Z" />
      <path {...stroke} d="M10.2 18.4a1.8 1.8 0 0 0 3.6 0" />
    </svg>
  )
}

export function MailIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <rect x="4.4" y="6.4" width="15.2" height="11.2" rx="1.6" {...stroke} />
      <path {...stroke} d="m5.2 8.2 6.8 5 6.8-5" />
    </svg>
  )
}

export function LetterIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <rect x="5.2" y="4.6" width="13.6" height="14.8" rx="1.5" {...stroke} />
      <path {...stroke} d="M8.2 8.4h7.6M8.2 11.4h7.6M8.2 14.4h4.8" />
    </svg>
  )
}

export function ClipboardIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-5 shrink-0', className)}>
      <rect x="7" y="5.2" width="10" height="14.4" rx="1.6" {...stroke} />
      <path {...stroke} d="M9.4 5.2V4.4A1.4 1.4 0 0 1 10.8 3h2.4A1.4 1.4 0 0 1 14.6 4.4v.8" />
      <path {...stroke} d="M9.6 10.4h4.8M9.6 13.4h4.8M9.6 16.2h3.2" />
    </svg>
  )
}

export function PlusIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <path {...stroke} d="M12 6.4v11.2M6.4 12h11.2" />
    </svg>
  )
}

export function EyeIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <path {...stroke} d="M3.6 12s3.2-5.4 8.4-5.4S20.4 12 20.4 12s-3.2 5.4-8.4 5.4S3.6 12 3.6 12Z" />
      <circle cx="12" cy="12" r="2.2" {...stroke} />
    </svg>
  )
}

export function PencilIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <path {...stroke} d="M14.2 5.6 18.4 9.8 9.2 19H5v-4.2L14.2 5.6Z" />
      <path {...stroke} d="m12.6 7.2 4.2 4.2" />
    </svg>
  )
}

export function CopyIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-4 shrink-0', className)}>
      <rect x="8.2" y="8.2" width="10.4" height="10.4" rx="1.4" {...stroke} />
      <path {...stroke} d="M15.6 8.2V6.6A1.4 1.4 0 0 0 14.2 5.2H6.6A1.4 1.4 0 0 0 5.2 6.6v7.6A1.4 1.4 0 0 0 6.6 15.6h1.6" />
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

export function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg {...common} className={cn('size-3.5 shrink-0', className)}>
      <rect x="4.5" y="6" width="15" height="13.5" rx="1.6" {...stroke} />
      <path {...stroke} d="M4.5 10h15M8.5 4.5v3M15.5 4.5v3" />
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

const CATEGORY_ICONS: Record<SettingsCategoryId, typeof GearIcon> = {
  general: GearIcon,
  users: UsersIcon,
  centers: CenterIcon,
  channels: InboxIcon,
  rules: ShieldIcon,
  templates: DocumentIcon,
  notifications: BellIcon,
}

const TEMPLATE_ICONS: Record<TemplateKind, typeof DocumentIcon> = {
  invite: DocumentIcon,
  email: MailIcon,
  letter: LetterIcon,
  summary: ClipboardIcon,
  custom: DocumentIcon,
}

export function CategoryIcon({
  id,
  className,
}: {
  id: SettingsCategoryId
  className?: string
}) {
  const Icon = CATEGORY_ICONS[id]
  return <Icon className={className} />
}

export function TemplateKindIcon({
  kind,
  className,
}: {
  kind: TemplateKind
  className?: string
}) {
  const Icon = TEMPLATE_ICONS[kind]
  return <Icon className={className} />
}
