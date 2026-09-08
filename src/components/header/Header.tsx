import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/auth/AuthProvider'
import { NotificationMenu } from '@/features/notifications'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'

interface HeaderProps {
  onMenuClick: () => void
  title: string
  subtitle?: string
  menuOpen: boolean
}

function HeaderSearch() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const expand = () => setOpen(true)

  const collapse = () => {
    if (document.activeElement === inputRef.current || query.trim()) {
      return
    }
    setOpen(false)
  }

  const clearQuery = () => {
    setQuery('')
    inputRef.current?.focus()
  }

  const goToSearch = () => {
    const value = query.trim()
    navigate(value ? `/recherche?q=${encodeURIComponent(value)}` : '/recherche')
  }

  return (
    <div
      className={cn(
        'flex h-10 items-center overflow-hidden rounded-[10px] border bg-transparent text-[#1d4f9a] transition-[width,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]',
        open ? 'w-[min(360px,calc(100vw-9.5rem))] border-[#c5d4e8]' : 'w-10 border-transparent',
      )}
      onMouseEnter={expand}
      onMouseLeave={collapse}
    >
      <button
        type="button"
        className="grid size-10 shrink-0 place-items-center"
        aria-label={t('header.search')}
        aria-expanded={open}
        onClick={() => {
          expand()
          inputRef.current?.focus()
        }}
      >
        <SearchIcon className="size-5" />
      </button>
      <input
        ref={inputRef}
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        onFocus={expand}
        onBlur={collapse}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            setQuery('')
            setOpen(false)
            inputRef.current?.blur()
          }
          if (event.key === 'Enter') {
            event.preventDefault()
            goToSearch()
          }
        }}
        placeholder={t('header.searchPlaceholder')}
        className="h-10 min-w-0 flex-1 bg-transparent text-[14px] font-medium text-[#1c2a4e] outline-none placeholder:text-[#8b95a8]"
      />
      {query ? (
        <button
          type="button"
          className="mr-1 grid size-8 shrink-0 place-items-center rounded-full text-[#6d7b93] transition-colors hover:text-[#1d4f9a]"
          aria-label={t('header.clearSearch')}
          onMouseDown={(event) => event.preventDefault()}
          onClick={clearQuery}
        >
          <CloseIcon className="size-4" />
        </button>
      ) : (
        <span className="w-3 shrink-0" aria-hidden />
      )}
    </div>
  )
}

function CloseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M7 7l10 10M17 7 7 17"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="11" cy="11" r="6.2" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="m15.6 15.6 3.6 3.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function MenuIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4.5 7h15M4.5 12h15M4.5 17h15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ChevronIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="m6.5 9.5 5.5 5.5 5.5-5.5"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function LogoutIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M15 6h3.5A1.5 1.5 0 0 1 20 7.5v9a1.5 1.5 0 0 1-1.5 1.5H15"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <path
        d="M10 8 6 12l4 4M6 12h10"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function UserMenu() {
  const { t } = useI18n()
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  const userName = user?.fullName ?? t('header.userName')
  const userRole = user?.jobTitle ?? t('header.userRole')
  const initials = user
    ? `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase()
    : 'SM'

  useEffect(() => {
    if (!open) {
      return
    }

    const onPointerDown = (event: MouseEvent) => {
      if (!menuRef.current?.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  const handleLogout = async () => {
    setOpen(false)
    await logout()
    navigate('/login', { replace: true })
  }

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        className="flex items-center gap-3 rounded-[10px] py-1 pl-1 pr-2 text-left transition-colors hover:bg-[#eef3f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/35"
        aria-label={t('header.accountMenu')}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <div
          className="grid size-10 shrink-0 place-items-center rounded-full bg-[#d9e8fb] text-[13px] font-bold text-[#1d4f9a]"
          aria-hidden
        >
          {initials}
        </div>
        <div className="hidden leading-tight sm:block">
          <p className="text-[14px] font-bold text-[#1c2a4e]">{userName}</p>
          <p className="mt-0.5 text-[12px] font-medium text-[#6d7b93]">{userRole}</p>
        </div>
        <ChevronIcon
          className={cn(
            'size-4 shrink-0 text-[#1d4f9a] transition-transform duration-200',
            open && 'rotate-180',
          )}
        />
      </button>

      {open ? (
        <div
          role="menu"
          className="absolute right-0 top-[calc(100%+8px)] z-50 min-w-[220px] overflow-hidden rounded-[10px] border border-[#e4ecf6] bg-white py-1.5 shadow-[0_12px_32px_rgba(30,64,116,0.14)]"
        >
          <button
            type="button"
            role="menuitem"
            className="flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left text-[13px] font-semibold text-[#1c2a4e] transition-colors hover:bg-[#eef3f9] focus-visible:bg-[#eef3f9] focus-visible:outline-none"
            onClick={handleLogout}
          >
            <LogoutIcon className="size-4 text-[#2860B9]" />
            {t('header.logout')}
          </button>
        </div>
      ) : null}
    </div>
  )
}

export function Header({ onMenuClick, title, subtitle, menuOpen }: HeaderProps) {
  const { t } = useI18n()

  return (
    <header className={cn('flex shrink-0 items-center justify-between gap-3 bg-white px-3 lg:px-0', subtitle ? 'h-[72px]' : 'h-16')}>
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <button
          type="button"
          className="grid size-10 shrink-0 place-items-center rounded-[10px] text-[#1d4f9a] transition-colors hover:bg-[#eef3f9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/35"
          aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={menuOpen}
          onClick={onMenuClick}
        >
          <MenuIcon className="size-5" />
        </button>
        <div className="min-w-0">
          <h1 className="truncate font-sans text-[20px] font-bold leading-tight text-[#1c2a4e]">
            {title}
          </h1>
          {subtitle ? (
            <p className="mt-0.5 truncate text-[12px] font-medium text-[#6d7b93]">{subtitle}</p>
          ) : null}
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-4">
        <HeaderSearch />
        <NotificationMenu />
        <UserMenu />
      </div>
    </header>
  )
}
