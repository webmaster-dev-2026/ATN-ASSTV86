import { FolderIcon, UserIcon } from '@/features/dossiers/components/DossierIcons'
import { WarningTriangleIcon } from '@/features/anomalies/components/AnomalyIcons'
import { cn } from '@/lib/cn'
import type { SearchKind } from '../types'

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

export function DocumentIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M7 4.6h6.4L17.6 9v10.4A1.5 1.5 0 0 1 16.1 21H7A1.5 1.5 0 0 1 5.5 19.4V6.1A1.5 1.5 0 0 1 7 4.6Z" />
      <path {...stroke} d="M13.4 4.6V9h4.2" />
    </svg>
  )
}

export function ArrowUpRightIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M8 16 16 8M10 8h6v6" />
    </svg>
  )
}

const KIND_ICONS = {
  dossier: FolderIcon,
  document: DocumentIcon,
  anomaly: WarningTriangleIcon,
  employee: UserIcon,
} as const

export function KindIcon({ kind, className }: { kind: SearchKind; className?: string }) {
  const Icon = KIND_ICONS[kind]
  return <Icon className={cn('size-4', className)} />
}
