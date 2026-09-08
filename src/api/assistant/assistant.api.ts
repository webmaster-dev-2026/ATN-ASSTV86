import { apiRequest } from '@/api/client'
import type { AssistantAskIn, AssistantAskOut } from '@/api/assistant/types'

/**
 * POST /api/asstv86/assistant/ask
 * Q&A by optional `dossier_id`, or general POC knowledge/DB.
 */
export async function askAssistantApi(
  payload: AssistantAskIn,
  options?: { signal?: AbortSignal },
): Promise<AssistantAskOut> {
  const body: AssistantAskIn = {
    question: payload.question.trim(),
    dossier_id: payload.dossier_id ?? null,
  }

  return apiRequest<AssistantAskOut>('/api/asstv86/assistant/ask', {
    method: 'POST',
    body,
    signal: options?.signal,
  })
}
