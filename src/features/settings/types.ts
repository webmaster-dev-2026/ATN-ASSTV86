export type SettingsCategoryId =
  | 'general'
  | 'users'
  | 'centers'
  | 'channels'
  | 'rules'
  | 'templates'
  | 'notifications'

export type TemplateKind = 'invite' | 'email' | 'letter' | 'summary' | 'custom'
export type TemplateStatus = 'active' | 'draft'
export type TemplateTone = 'blue' | 'green' | 'orange' | 'purple'
export type RetentionYears = 1 | 5 | 10 | 15

export interface DocumentTemplate {
  id: string
  kind: TemplateKind
  status: TemplateStatus
  tone: TemplateTone
  updatedAt: string
  updatedBy: string
  isCopy?: boolean
}

export interface RelatedSettingsState {
  ruleAutomation: boolean
  auditLog: boolean
  systemNotifications: boolean
  periodicReports: boolean
  retentionYears: RetentionYears
}
