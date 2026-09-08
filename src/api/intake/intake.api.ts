import { apiRequest } from '@/api/client'
import type {
  UploadDossierDocumentsIn,
  UploadDossierDocumentsOut,
  UploadRequestFilesIn,
  UploadRequestFilesOut,
} from '@/api/intake/types'

/**
 * POST /api/asstv86/requests/upload
 * multipart `files` (+ optional channel/subject/raw_content…).
 * Creates request + dossier; use channel `CHATBOT` from the assistant UI.
 */
export async function uploadRequestFilesApi(
  payload: UploadRequestFilesIn,
  options?: { signal?: AbortSignal },
): Promise<UploadRequestFilesOut> {
  if (payload.files.length === 0) {
    throw new Error('At least one file is required')
  }

  const form = new FormData()
  for (const file of payload.files) {
    form.append('files', file)
  }
  form.append('channel', payload.channel ?? 'CHATBOT')
  form.append('subject', payload.subject ?? '')
  form.append('sender', payload.sender ?? '')
  form.append('raw_content', payload.raw_content ?? '')
  if (payload.message_id != null) {
    form.append('message_id', payload.message_id)
  }
  if (payload.document_types) {
    form.append('document_types', payload.document_types)
  }

  return apiRequest<UploadRequestFilesOut>('/api/asstv86/requests/upload', {
    method: 'POST',
    body: form,
    signal: options?.signal,
  })
}

/**
 * POST /api/asstv86/dossiers/{dossier_id}/documents/upload
 * Add files to an existing dossier.
 */
export async function uploadDossierDocumentsApi(
  dossierId: string,
  payload: UploadDossierDocumentsIn,
  options?: { signal?: AbortSignal },
): Promise<UploadDossierDocumentsOut> {
  if (payload.files.length === 0) {
    throw new Error('At least one file is required')
  }

  const form = new FormData()
  for (const file of payload.files) {
    form.append('files', file)
  }
  if (payload.document_types) {
    form.append('document_types', payload.document_types)
  }

  return apiRequest<UploadDossierDocumentsOut>(
    `/api/asstv86/dossiers/${encodeURIComponent(dossierId)}/documents/upload`,
    {
      method: 'POST',
      body: form,
      signal: options?.signal,
    },
  )
}
