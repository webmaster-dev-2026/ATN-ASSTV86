import type { DocumentTemplate, RelatedSettingsState } from './types'

export function getSettingsData(): {
  templates: DocumentTemplate[]
  related: RelatedSettingsState
} {
  return {
    templates: [
      {
        id: 'tpl-invite',
        kind: 'invite',
        status: 'active',
        tone: 'blue',
        updatedAt: '2026-08-13T09:20:00',
        updatedBy: 'Sophie Martin',
      },
      {
        id: 'tpl-email',
        kind: 'email',
        status: 'active',
        tone: 'green',
        updatedAt: '2026-08-12T14:10:00',
        updatedBy: 'Pierre Dubois',
      },
      {
        id: 'tpl-letter',
        kind: 'letter',
        status: 'draft',
        tone: 'orange',
        updatedAt: '2026-08-10T11:35:00',
        updatedBy: 'Sophie Martin',
      },
      {
        id: 'tpl-summary',
        kind: 'summary',
        status: 'active',
        tone: 'purple',
        updatedAt: '2026-08-08T16:45:00',
        updatedBy: 'Marie Lefèvre',
      },
    ],
    related: {
      ruleAutomation: true,
      auditLog: true,
      systemNotifications: true,
      periodicReports: false,
      retentionYears: 10,
    },
  }
}
