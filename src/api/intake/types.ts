/** OpenAPI Channel for visit request intake. */
export type IntakeChannel = 'EMAIL' | 'CHATBOT' | 'MANUAL'

/** POST /api/asstv86/requests/upload — multipart fields (besides `files`). */
export interface UploadRequestFilesIn {
  files: File[]
  channel?: IntakeChannel
  subject?: string
  sender?: string
  raw_content?: string
  message_id?: string | null
  /** CSV aligned with file order, e.g. demande_visite,fiche_de_poste */
  document_types?: string | null
}

/** Typical upload response (OpenAPI: additionalProperties). */
export interface UploadRequestFilesOut {
  request_id?: string
  dossier_id?: string
  documents?: unknown[]
  [key: string]: unknown
}

/** POST /api/asstv86/dossiers/{dossier_id}/documents/upload */
export interface UploadDossierDocumentsIn {
  files: File[]
  document_types?: string | null
}

export interface UploadDossierDocumentsOut {
  dossier_id?: string
  documents?: unknown[]
  [key: string]: unknown
}
