/** POST /api/asstv86/assistant/ask — OpenAPI AssistantAskIn */
export interface AssistantAskIn {
  question: string
  /** When set, answer is scoped to that dossier. */
  dossier_id?: string | null
}

/** POST /api/asstv86/assistant/ask — OpenAPI AssistantAskOut */
export interface AssistantAskOut {
  answer: string
  sources?: string[]
  suggested_next_action?: string | null
}
