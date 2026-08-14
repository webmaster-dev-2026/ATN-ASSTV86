import { cn } from '@/lib/cn'

export type ChatFileKind = 'pdf' | 'doc' | 'image' | 'mail' | 'sheet' | 'text' | 'file'

export function getChatFileKind(name: string, mime = ''): ChatFileKind {
  const ext = name.split('.').pop()?.toLowerCase() ?? ''
  const type = mime.toLowerCase()

  if (type.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg', 'bmp'].includes(ext)) {
    return 'image'
  }
  if (type === 'application/pdf' || ext === 'pdf') {
    return 'pdf'
  }
  if (type.includes('word') || ['doc', 'docx'].includes(ext)) {
    return 'doc'
  }
  if (type.includes('spreadsheet') || type.includes('excel') || ['xls', 'xlsx', 'csv'].includes(ext)) {
    return 'sheet'
  }
  if (type.includes('message') || ext === 'eml') {
    return 'mail'
  }
  if (['txt', 'md', 'rtf'].includes(ext) || type.startsWith('text/')) {
    return 'text'
  }
  return 'file'
}

function PdfGlyph() {
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

function DocGlyph() {
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

function ImageGlyph() {
  return (
    <svg className="size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4.5" y="5.5" width="15" height="13" rx="2" fill="#dcfce7" stroke="#16a34a" strokeWidth="1.5" />
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

function MailGlyph() {
  return (
    <svg className="size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4.5" y="6.5" width="15" height="11" rx="2" fill="#eef3f9" stroke="#6d7b93" strokeWidth="1.5" />
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

function SheetGlyph() {
  return (
    <svg className="size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3.5h7l4.5 4.5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"
        fill="#dcfce7"
        stroke="#15803d"
        strokeWidth="1.5"
      />
      <path d="M14 3.5V8h4.5" stroke="#15803d" strokeWidth="1.5" />
      <path d="M8.4 12.2h7.2M8.4 15h7.2M8.4 17.8h7.2M11 12.2v5.6" stroke="#15803d" strokeWidth="1.3" strokeLinecap="round" />
    </svg>
  )
}

function TextGlyph() {
  return (
    <svg className="size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3.5h7l4.5 4.5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"
        fill="#eef3f9"
        stroke="#6d7b93"
        strokeWidth="1.5"
      />
      <path d="M14 3.5V8h4.5" stroke="#6d7b93" strokeWidth="1.5" />
      <path d="M8.5 12.5h7M8.5 15.5h5" stroke="#6d7b93" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

function FileGlyph() {
  return (
    <svg className="size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 3.5h7l4.5 4.5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"
        fill="#e8f0fb"
        stroke="#1d4f9a"
        strokeWidth="1.5"
      />
      <path d="M14 3.5V8h4.5" stroke="#1d4f9a" strokeWidth="1.5" />
    </svg>
  )
}

const KIND_STYLES: Record<ChatFileKind, { icon: typeof PdfGlyph; className: string }> = {
  pdf: { icon: PdfGlyph, className: 'bg-[#fde2e2]' },
  doc: { icon: DocGlyph, className: 'bg-[#dbeafe]' },
  image: { icon: ImageGlyph, className: 'bg-[#dcfce7]' },
  mail: { icon: MailGlyph, className: 'bg-[#eef3f9]' },
  sheet: { icon: SheetGlyph, className: 'bg-[#dcfce7]' },
  text: { icon: TextGlyph, className: 'bg-[#eef3f9]' },
  file: { icon: FileGlyph, className: 'bg-[#e8f0fb]' },
}

export function ChatFileTypeIcon({
  name,
  mime,
  className,
}: {
  name: string
  mime?: string
  className?: string
}) {
  const kind = getChatFileKind(name, mime)
  const style = KIND_STYLES[kind]
  const Icon = style.icon

  return (
    <span
      className={cn(
        'grid size-8 shrink-0 place-items-center rounded-lg p-1',
        style.className,
        className,
      )}
    >
      <Icon />
    </span>
  )
}
