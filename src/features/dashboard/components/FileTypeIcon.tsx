import type { FileKind } from '@/models'
import { cn } from '@/lib/cn'

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
      <path
        d="M8.5 12h7M8.5 15h7M8.5 18h4.5"
        stroke="#1d4f9a"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ImageIcon() {
  return (
    <svg className="size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4.5"
        y="5.5"
        width="15"
        height="13"
        rx="2"
        fill="#dcfce7"
        stroke="#16a34a"
        strokeWidth="1.5"
      />
      <circle cx="9" cy="10" r="1.4" fill="#16a34a" />
      <path
        d="m6.5 16.5 3.4-3.4 2.4 2.4 2.6-3.2 3.6 4.2"
        stroke="#16a34a"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function MailIcon() {
  return (
    <svg className="size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect
        x="4.5"
        y="6.5"
        width="15"
        height="11"
        rx="2"
        fill="#eef3f9"
        stroke="#6d7b93"
        strokeWidth="1.5"
      />
      <path
        d="m6 8.5 6 4.2 6-4.2"
        stroke="#6d7b93"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const FILE_ICONS: Record<FileKind, { icon: typeof PdfIcon; className: string }> = {
  PDF: { icon: PdfIcon, className: 'bg-[#fde2e2]' },
  DOCX: { icon: DocIcon, className: 'bg-[#dbeafe]' },
  IMAGE: { icon: ImageIcon, className: 'bg-[#dcfce7]' },
  EML: { icon: MailIcon, className: 'bg-[#eef3f9]' },
}

export const FILE_KIND_LABEL_STYLES: Record<FileKind, string> = {
  PDF: 'bg-[#fde2e2] text-[#e54848]',
  DOCX: 'bg-[#dbeafe] text-[#1d4f9a]',
  IMAGE: 'bg-[#dcfce7] text-[#16a34a]',
  EML: 'bg-[#eef3f9] text-[#6d7b93]',
}

interface FileTypeIconProps {
  type: FileKind
  className?: string
}

export function FileTypeIcon({ type, className }: FileTypeIconProps) {
  const style = FILE_ICONS[type]
  const Icon = style.icon

  return (
    <span
      className={cn(
        'grid size-8 shrink-0 place-items-center rounded-lg p-1.5',
        style.className,
        className,
      )}
    >
      <Icon />
    </span>
  )
}
