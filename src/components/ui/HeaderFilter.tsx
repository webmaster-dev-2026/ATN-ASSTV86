import { useEffect, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'

function SortDownIcon() {
  return (
    <svg className="size-2.5 shrink-0" viewBox="0 0 12 12" fill="currentColor" aria-hidden>
      <path d="M6 9.4 2.2 4.8h7.6L6 9.4Z" />
    </svg>
  )
}

interface HeaderMenuProps {
  label: string
  children: (close: () => void) => ReactNode
  align?: 'left' | 'right'
}

export function HeaderMenu({ label, children, align = 'left' }: HeaderMenuProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onPointerDown = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        className="inline-flex max-w-full min-w-0 items-center gap-1 text-[#2860B9]"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="truncate">{label}</span>
        <SortDownIcon />
      </button>
      {open ? (
        <div
          className={cn(
            'absolute top-7 z-20 min-w-[11rem] rounded-xl border border-[#e4ecf6] bg-white py-1 shadow-[0_8px_24px_rgba(28,42,78,0.12)]',
            align === 'right' ? 'right-0' : 'left-0',
          )}
        >
          {children(() => setOpen(false))}
        </div>
      ) : null}
    </div>
  )
}

export interface HeaderFilterOption<T extends string> {
  value: T
  label: string
}

interface HeaderFilterProps<T extends string> {
  label: string
  value: T
  options: HeaderFilterOption<T>[]
  onChange: (value: T) => void
  align?: 'left' | 'right'
}

export function HeaderFilter<T extends string>({
  label,
  value,
  options,
  onChange,
  align,
}: HeaderFilterProps<T>) {
  return (
    <HeaderMenu label={label} align={align}>
      {(close) =>
        options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={cn(
              'flex w-full cursor-pointer px-3 py-2 text-left text-[13px] font-medium',
              value === option.value
                ? 'bg-[#eef5fc] text-[#1d4f9a]'
                : 'text-[#1c2a4e] hover:bg-[#f7fafc]',
            )}
            onClick={() => {
              onChange(option.value)
              close()
            }}
          >
            {option.label}
          </button>
        ))
      }
    </HeaderMenu>
  )
}
