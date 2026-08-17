import type { AppNotification } from './types'

function minutesAgo(minutes: number) {
  return new Date(Date.now() - minutes * 60_000).toISOString()
}

function hoursAgo(hours: number) {
  return minutesAgo(hours * 60)
}

function daysAgo(days: number) {
  return hoursAgo(days * 24)
}

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n-1842',
    type: 'dossier',
    titleKey: 'notifications.items.receivedMoreau.title',
    bodyKey: 'notifications.items.receivedMoreau.body',
    dossierRef: 'D-2026-1842',
    href: '/dossiers',
    createdAt: minutesAgo(12),
    read: false,
  },
  {
    id: 'n-1790',
    type: 'validation',
    titleKey: 'notifications.items.validateLeroux.title',
    bodyKey: 'notifications.items.validateLeroux.body',
    dossierRef: 'D-2026-1790',
    href: '/a-valider',
    createdAt: hoursAgo(1),
    read: false,
  },
  {
    id: 'n-1764',
    type: 'anomaly',
    titleKey: 'notifications.items.anomalyMarchand.title',
    bodyKey: 'notifications.items.anomalyMarchand.body',
    dossierRef: 'D-2026-1764',
    href: '/anomalies',
    createdAt: hoursAgo(3),
    read: false,
  },
  {
    id: 'n-1701',
    type: 'completed',
    titleKey: 'notifications.items.completedBernard.title',
    bodyKey: 'notifications.items.completedBernard.body',
    dossierRef: 'D-2026-1701',
    href: '/termines',
    createdAt: daysAgo(1),
    read: true,
  },
  {
    id: 'n-1688',
    type: 'dossier',
    titleKey: 'notifications.items.assignedPetit.title',
    bodyKey: 'notifications.items.assignedPetit.body',
    dossierRef: 'D-2026-1688',
    href: '/documents-sources',
    createdAt: daysAgo(2),
    read: true,
  },
  {
    id: 'n-1652',
    type: 'reminder',
    titleKey: 'notifications.items.reminderDupuis.title',
    bodyKey: 'notifications.items.reminderDupuis.body',
    dossierRef: 'D-2026-1652',
    href: '/traitement-en-cours',
    createdAt: daysAgo(3),
    read: true,
  },
]
