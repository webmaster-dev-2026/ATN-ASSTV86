const common = {
  viewBox: '0 0 24 24',
  fill: 'none',
  'aria-hidden': true as const,
}

const stroke = {
  stroke: 'currentColor',
  strokeWidth: 1.7,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

export function FolderCheckIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path
        {...stroke}
        d="M4 8.2A1.6 1.6 0 0 1 5.6 6.6h3.4l1.4 1.7H18a1.6 1.6 0 0 1 1.6 1.6v7.2A1.6 1.6 0 0 1 18 18.7H5.6A1.6 1.6 0 0 1 4 17.1V8.2Z"
      />
      <path {...stroke} d="m9.2 13.4 1.8 1.8 3.8-4" />
    </svg>
  )
}

export function FileStackIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M7 7.2h6.2L17 11v8.2A1.4 1.4 0 0 1 15.6 20.6H7A1.4 1.4 0 0 1 5.6 19.2V8.6A1.4 1.4 0 0 1 7 7.2Z" />
      <path {...stroke} d="M13.2 7.2V11H17M8.2 14.2h5.6M8.2 16.8h3.8" />
      <path {...stroke} d="M8.2 4.6h7.4A1.4 1.4 0 0 1 17 6v1" />
    </svg>
  )
}

export function SendIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M4.6 12 19.2 5.4 14.8 19.2l-3.2-5.2L4.6 12Z" />
      <path {...stroke} d="m11.6 14 3.4-4.8" />
    </svg>
  )
}

export function ArchiveIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M4.6 6.2h14.8v3.2H4.6V6.2Z" />
      <path {...stroke} d="M6.2 9.4V18a1.4 1.4 0 0 0 1.4 1.4h8.8A1.4 1.4 0 0 0 17.8 18V9.4" />
      <path {...stroke} d="M10 13.2h4" />
    </svg>
  )
}

export function FunnelIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M4.6 5.4h14.8l-5.4 6.6v5.2l-4 1.6v-6.8L4.6 5.4Z" />
    </svg>
  )
}

export function SortDownIcon({ className = 'size-3' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M6 9.6 1.8 3.8h8.4L6 9.6Z" />
    </svg>
  )
}

export function StepCheckIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden>
      <circle cx="10" cy="10" r="9" fill="#16a34a" />
      <path
        d="m6.2 10.2 2.4 2.4 5.2-5.4"
        stroke="#fff"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function EyeIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M3.6 12S6.8 6.8 12 6.8 20.4 12 20.4 12 17.2 17.2 12 17.2 3.6 12 3.6 12Z" />
      <circle cx="12" cy="12" r="2.2" {...stroke} />
    </svg>
  )
}

export function ShareIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <circle cx="6.2" cy="12" r="2.1" {...stroke} />
      <circle cx="17.4" cy="6.4" r="2.1" {...stroke} />
      <circle cx="17.4" cy="17.6" r="2.1" {...stroke} />
      <path {...stroke} d="m8.1 10.9 5.4-3.2M8.1 13.1l5.4 3.2" />
    </svg>
  )
}

export function PdfExportIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M7 4.6h6.4L17.6 9v9.4A1.5 1.5 0 0 1 16.1 20H7a1.5 1.5 0 0 1-1.5-1.6V6.1A1.5 1.5 0 0 1 7 4.6Z" />
      <path {...stroke} d="M13.4 4.6V9h4.2M8.4 13.2h3.2M8.4 16.2h5.6" />
    </svg>
  )
}

export function WordExportIcon({ className = 'size-4' }: { className?: string }) {
  return (
    <svg {...common} className={className}>
      <path {...stroke} d="M7 4.6h6.4L17.6 9v9.4A1.5 1.5 0 0 1 16.1 20H7a1.5 1.5 0 0 1-1.5-1.6V6.1A1.5 1.5 0 0 1 7 4.6Z" />
      <path {...stroke} d="M13.4 4.6V9h4.2M8.6 13.4 10 17.2l1.4-3.8 1.4 3.8 1.4-3.8" />
    </svg>
  )
}

export function PdfFileIcon({ className = 'size-8' }: { className?: string }) {
  return (
    <span className={`grid place-items-center rounded-lg bg-[#fff1e4] p-1.5 text-[#ea7a1a] ${className}`}>
      <svg className="size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M7 3.5h7l4.5 4.5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"
          fill="#fff1e4"
          stroke="#ea7a1a"
          strokeWidth="1.5"
        />
        <path d="M14 3.5V8h4.5" stroke="#ea7a1a" strokeWidth="1.5" />
        <path d="M8.5 12.5h7M8.5 15.5h5" stroke="#ea7a1a" strokeWidth="1.4" strokeLinecap="round" />
      </svg>
    </span>
  )
}

export function MailFileIcon({ className = 'size-8' }: { className?: string }) {
  return (
    <span className={`grid place-items-center rounded-lg bg-[#e7f8ee] p-1.5 text-[#16a34a] ${className}`}>
      <svg className="size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="4.5" y="6.5" width="15" height="11" rx="2" fill="#e7f8ee" stroke="#16a34a" strokeWidth="1.5" />
        <path d="m6 8.8 6 4 6-4" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export function HtmlFileIcon({ className = 'size-8' }: { className?: string }) {
  return (
    <span className={`grid place-items-center rounded-lg bg-[#e7f8ee] p-1.5 text-[#16a34a] ${className}`}>
      <svg className="size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M7 3.5h7l4.5 4.5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"
          fill="#e7f8ee"
          stroke="#16a34a"
          strokeWidth="1.5"
        />
        <path d="M14 3.5V8h4.5" stroke="#16a34a" strokeWidth="1.5" />
        <path d="m9 13.2 2.2 2.2L9 17.6M15 13.2l-2.2 2.2L15 17.6" stroke="#16a34a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}

export function DocxFileIcon({ className = 'size-8' }: { className?: string }) {
  return (
    <span className={`grid place-items-center rounded-lg bg-[#d9e8fb] p-1.5 text-[#1d4f9a] ${className}`}>
      <svg className="size-full" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M7 3.5h7l4.5 4.5V20a1.5 1.5 0 0 1-1.5 1.5H7A1.5 1.5 0 0 1 5.5 20V5A1.5 1.5 0 0 1 7 3.5Z"
          fill="#d9e8fb"
          stroke="#1d4f9a"
          strokeWidth="1.5"
        />
        <path d="M14 3.5V8h4.5" stroke="#1d4f9a" strokeWidth="1.5" />
        <path d="M8.6 13.2 10 17l1.4-3.8L12.8 17l1.4-3.8" stroke="#1d4f9a" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </span>
  )
}
