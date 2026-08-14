import type { TranslationKey } from '@/i18n'

export type NavIconName =
  | 'home'
  | 'folder'
  | 'clipboard'
  | 'warning'
  | 'clock'
  | 'checkCircle'
  | 'search'
  | 'document'
  | 'chart'
  | 'settings'

export type BadgeTone = 'orange' | 'red' | 'purple' | 'green'

export interface NavItem {
  id: string
  path: string
  labelKey: TranslationKey
  subtitleKey?: TranslationKey
  icon: NavIconName
  badge?: {
    count: number
    tone: BadgeTone
  }
}

export const NAV_ITEMS: NavItem[] = [
  {
    id: 'dashboard',
    path: '/dashboard',
    labelKey: 'nav.dashboard',
    icon: 'home',
  },
  {
    id: 'dossiers',
    path: '/dossiers',
    labelKey: 'nav.dossiers',
    icon: 'folder',
  },
  {
    id: 'toValidate',
    path: '/a-valider',
    labelKey: 'nav.toValidate',
    icon: 'clipboard',
    badge: { count: 3, tone: 'orange' },
  },
  {
    id: 'anomalies',
    path: '/anomalies',
    labelKey: 'nav.anomalies',
    icon: 'warning',
    badge: { count: 1, tone: 'red' },
  },
  {
    id: 'inProgress',
    path: '/traitement-en-cours',
    labelKey: 'nav.inProgress',
    subtitleKey: 'inProgress.subtitle',
    icon: 'clock',
    badge: { count: 79, tone: 'purple' },
  },
  {
    id: 'completed',
    path: '/termines',
    labelKey: 'nav.completed',
    icon: 'checkCircle',
    badge: { count: 19, tone: 'green' },
  },
  {
    id: 'search',
    path: '/recherche',
    labelKey: 'nav.search',
    icon: 'search',
  },
  {
    id: 'sourceDocuments',
    path: '/documents-sources',
    labelKey: 'nav.sourceDocuments',
    icon: 'document',
  },
  {
    id: 'statistics',
    path: '/statistiques',
    labelKey: 'nav.statistics',
    icon: 'chart',
  },
  {
    id: 'settings',
    path: '/parametres',
    labelKey: 'nav.settings',
    icon: 'settings',
  },
]
