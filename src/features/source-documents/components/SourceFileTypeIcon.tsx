import { cn } from '@/lib/cn'
import type { SourceFileKind } from '../types'

function PdfIcon() {
  return (
    <svg className="size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3.5h7l4.5 4.5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"
        fill="#fde2e2"
        stroke="#e54848"
        strokeWidth="1.5"
      />
      <path d="M14 3.5V8h4.5" stroke="#e54848" strokeWidth="1.5" />
      <path d="M8.5 12.5h7M8.5 15.5h5" stroke="#e54848" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function PptxIcon() {
  return (
    <svg className="size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3.5h7l4.5 4.5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"
        fill="#fff1e4"
        stroke="#c96512"
        strokeWidth="1.5"
      />
      <path d="M14 3.5V8h4.5" stroke="#c96512" strokeWidth="1.5" />
      <rect x="8.2" y="11.4" width="7.6" height="6.2" rx="0.8" stroke="#c96512" strokeWidth="1.3" />
    </svg>
  )
}

function DocIcon() {
  return (
    <svg className="size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3.5h7l4.5 4.5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"
        fill="#dbeafe"
        stroke="#1d4f9a"
        strokeWidth="1.5"
      />
      <path d="M14 3.5V8h4.5" stroke="#1d4f9a" strokeWidth="1.5" />
      <path d="M8.5 12h7M8.5 15h7M8.5 18h4.5" stroke="#1d4f9a" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg className="size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4.5" y="5.5" width="15" height="13" rx="2" fill="#f3e8ff" stroke="#7c3aed" strokeWidth="1.5" />
      <circle cx="9" cy="10" r="1.4" fill="#7c3aed" />
      <path
        d="m6.5 16.5 3.4-3.4 2.4 2.4 2.6-3.2 3.6 4.2"
        stroke="#7c3aed"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function SheetIcon() {
  return (
    <svg className="size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3.5h7l4.5 4.5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"
        fill="#dcfce7"
        stroke="#15803d"
        strokeWidth="1.5"
      />
      <path d="M14 3.5V8h4.5" stroke="#15803d" strokeWidth="1.5" />
      <path
        d="M8.4 12.2h7.2M8.4 15h7.2M8.4 17.8h7.2M11 12.2v5.6"
        stroke="#15803d"
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </svg>
  )
}

const FILE_ICONS: Record<SourceFileKind, { icon: typeof PdfIcon; className: string }> = {
  PDF: { icon: PdfIcon, className: 'bg-[#fde2e2]' },
  PPTX: { icon: PptxIcon, className: 'bg-[#fff1e4]' },
  DOCX: { icon: DocIcon, className: 'bg-[#dbeafe]' },
  JPG: { icon: ImageIcon, className: 'bg-[#f3e8ff]' },
  XLSX: { icon: SheetIcon, className: 'bg-[#dcfce7]' },
}

interface SourceFileTypeIconProps {
  type: SourceFileKind
  className?: string
}

export function SourceFileTypeIcon({ type, className }: SourceFileTypeIconProps) {
  const style = FILE_ICONS[type]
  const Icon = style.icon

  return (
    <span className={cn('grid size-8 shrink-0 place-items-center rounded-lg p-1.5', style.className, className)}>
      <Icon />
    </span>
  )
}
