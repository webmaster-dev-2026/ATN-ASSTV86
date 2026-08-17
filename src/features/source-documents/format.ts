import type { TranslationKey } from '@/i18n'
import type { SourceDocFilterState, SourceDocStatus, SourceFileKind } from './types'

export const STATUS_LABEL: Record<SourceDocStatus, TranslationKey> = {
  analysed: 'sourceDocuments.status.analysed',
  reviewing: 'sourceDocuments.status.reviewing',
  error: 'sourceDocuments.status.error',
  uploaded: 'sourceDocuments.status.uploaded',
}

export const STATUS_BADGE: Record<SourceDocStatus, string> = {
  analysed: 'bg-[#e7f8ee] text-[#15803d]',
  reviewing: 'bg-[#fff1e4] text-[#c96512]',
  error: 'bg-[#fde2e2] text-[#c93434]',
  uploaded: 'bg-[#e8f1fc] text-[#1d4f9a]',
}

export const FILE_KIND_BADGE: Record<SourceFileKind, string> = {
  PDF: 'bg-[#fde2e2] text-[#e54848]',
  PPTX: 'bg-[#fff1e4] text-[#c96512]',
  DOCX: 'bg-[#dbeafe] text-[#1d4f9a]',
  JPG: 'bg-[#f3e8ff] text-[#7c3aed]',
  XLSX: 'bg-[#dcfce7] text-[#15803d]',
}

export const FILE_KIND_LABEL: Record<SourceFileKind, TranslationKey> = {
  PDF: 'sourceDocuments.fileType.PDF',
  PPTX: 'sourceDocuments.fileType.PPTX',
  DOCX: 'sourceDocuments.fileType.DOCX',
  JPG: 'sourceDocuments.fileType.JPG',
  XLSX: 'sourceDocuments.fileType.XLSX',
}

type SourceDocHistoryEventKind = 'uploaded' | 'analysed' | 'reviewStarted' | 'errorDetected' | 'reanalysed'

export const HISTORY_LABEL: Record<SourceDocHistoryEventKind, TranslationKey> = {
  uploaded: 'sourceDocuments.history.uploaded',
  analysed: 'sourceDocuments.history.analysed',
  reviewStarted: 'sourceDocuments.history.reviewStarted',
  errorDetected: 'sourceDocuments.history.errorDetected',
  reanalysed: 'sourceDocuments.history.reanalysed',
}

export const EMPTY_FILTERS: SourceDocFilterState = {
  query: '',
  source: 'all',
  fileKind: 'all',
  status: 'all',
  from: '',
  to: '',
}

export function toDateInput(value: string) {
  return value.slice(0, 10)
}

export function pageNumbers(current: number, total: number) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, index) => index + 1)
  }

  if (current <= 4) {
    return [1, 2, 3, 4, 5, 'ellipsis' as const, total]
  }

  if (current >= total - 3) {
    return [1, 'ellipsis' as const, total - 4, total - 3, total - 2, total - 1, total]
  }

  return [1, 'ellipsis' as const, current - 1, current, current + 1, 'ellipsis' as const, total]
}
