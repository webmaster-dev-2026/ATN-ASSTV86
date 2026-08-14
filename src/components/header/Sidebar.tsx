import { useCallback, useEffect, useRef, useState, type CSSProperties } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { BrandLogo } from '@/components/brand/BrandLogo'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { cn } from '@/lib/cn'
import { useI18n } from '@/i18n'
import { NavIcon } from './NavIcons'
import { NAV_ITEMS, type BadgeTone } from './nav-config'

const badgeStyles: Record<BadgeTone, string> = {
  orange: 'bg-[#f97316]',
  red: 'bg-[#ef4444]',
  purple: 'bg-[#8b5cf6]',
  green: 'bg-[#10b981]',
}

interface SidebarProps {
  open: boolean
  collapsed: boolean
  onClose: () => void
}

export function Sidebar({ open, collapsed, onClose }: SidebarProps) {
  const { t } = useI18n()
  const location = useLocation()
  const listRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({})
  const [pill, setPill] = useState({ y: 0, h: 44, ready: false })
  const [dotShape, setDotShape] = useState(collapsed)

  const updatePill = useCallback(() => {
    const list = listRef.current
    const activeItem = NAV_ITEMS.find((item) => item.path === location.pathname)
    const el = activeItem ? itemRefs.current[activeItem.id] : null
    if (!list || !el) {
      return
    }

    setPill((current) => ({
      y: el.offsetTop,
      h: el.offsetHeight,
      ready: current.ready,
    }))
  }, [location.pathname])

  useEffect(() => {
    updatePill()
    const frame = window.requestAnimationFrame(() => {
      setPill((current) => ({ ...current, ready: true }))
    })
    return () => window.cancelAnimationFrame(frame)
  }, [updatePill, t, open, collapsed])

  useEffect(() => {
    if (!collapsed) {
      setDotShape(false)
      return
    }

    const timer = window.setTimeout(() => setDotShape(true), 160)
    return () => window.clearTimeout(timer)
  }, [collapsed])

  useEffect(() => {
    const list = listRef.current
    if (!list) {
      return
    }

    const observer = new ResizeObserver(updatePill)
    observer.observe(list)
    window.addEventListener('resize', updatePill)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updatePill)
    }
  }, [updatePill])

  return (
    <div
      className={cn(
        'max-lg:fixed max-lg:inset-0 max-lg:z-40',
        open ? 'max-lg:pointer-events-auto' : 'max-lg:pointer-events-none',
        'lg:contents',
      )}
    >
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-hidden={!open}
        aria-label={t('nav.closeMenu')}
        className={cn(
          'absolute inset-0 z-30 bg-[#1d4f9a]/40 transition-opacity duration-300 lg:hidden',
          open ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
        onClick={onClose}
      />

      <aside
        className={cn(
          'absolute inset-y-0 left-0 z-40 flex h-full w-[260px] shrink-0 flex-col overflow-hidden rounded-r-2xl bg-[#1d4f9a] text-white transition-[transform,width] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] lg:relative lg:inset-auto lg:z-20 lg:h-full lg:rounded-none lg:bg-transparent',
          open ? 'translate-x-0' : '-translate-x-full',
          collapsed
            ? 'lg:w-[80px] lg:translate-x-0 lg:overflow-hidden'
            : 'lg:w-[272px] lg:translate-x-0 lg:overflow-visible',
        )}
      >
        <div
          className={cn(
            'pointer-events-none absolute inset-y-0 left-0 hidden rounded-2xl bg-[#1d4f9a] lg:block',
            collapsed ? 'w-full' : 'w-[260px]',
          )}
        />

        <div
          className={cn(
            'relative z-10 flex h-full flex-col',
            collapsed
              ? 'w-full overflow-hidden'
              : 'w-[260px] overflow-hidden lg:w-[272px] lg:overflow-visible',
          )}
        >
          <div
            className={cn(
              'flex shrink-0',
              collapsed ? 'justify-center px-1.5 py-3' : 'w-[260px] px-5 py-6',
            )}
          >
            <BrandLogo size="sm" iconOnly={collapsed} />
          </div>

          <nav
            className={cn(
              'flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-on-dark',
              collapsed ? 'px-1.5' : 'px-3',
            )}
            aria-label={t('nav.mainMenu')}
          >
            <div
              ref={listRef}
              className={cn('relative flex flex-col', collapsed ? 'items-center gap-2.5' : 'gap-4')}
            >
              <span
                aria-hidden
                className={cn(
                  'sidebar-active-pill pointer-events-none absolute bg-white',
                  pill.ready && 'is-ready',
                  dotShape ? 'rounded-full' : 'rounded-l-2xl rounded-r-none',
                )}
                style={
                  {
                    '--sidebar-pill-y': `${pill.y}px`,
                    '--sidebar-pill-h': `${pill.h}px`,
                    '--sidebar-pill-w': collapsed ? `${pill.h}px` : '100%',
                    '--sidebar-pill-mr': collapsed ? `calc((100% - ${pill.h}px) / 2)` : '0px',
                  } as CSSProperties
                }
              >
                {!collapsed && !dotShape ? (
                  <>
                    <span className="pointer-events-none absolute -top-4 right-0 hidden size-4 bg-white lg:block">
                      <span className="absolute inset-0 rounded-br-[16px] bg-[#1d4f9a]" />
                    </span>
                    <span className="pointer-events-none absolute -bottom-4 right-0 hidden size-4 bg-white lg:block">
                      <span className="absolute inset-0 rounded-tr-[16px] bg-[#1d4f9a]" />
                    </span>
                  </>
                ) : null}
              </span>

              {NAV_ITEMS.map((item) => (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={onClose}
                  title={collapsed ? t(item.labelKey) : undefined}
                  ref={(node) => {
                    itemRefs.current[item.id] = node
                  }}
                  className={({ isActive }) =>
                    cn(
                      'group relative z-10 flex items-center font-semibold',
                      'transition-[background-color,color] duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/50',
                      collapsed
                        ? 'justify-center rounded-full p-0'
                        : 'gap-2.5 rounded-l-2xl rounded-r-none px-2 py-1.5 text-[14px]',
                      isActive
                        ? 'text-[#1d4f9a]'
                        : collapsed
                          ? 'text-white/80'
                          : 'text-white/82 hover:bg-white/15 hover:text-white',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span
                        className={cn(
                          'relative grid shrink-0 place-items-center rounded-full transition-[background-color,color] duration-[180ms] ease-[cubic-bezier(0.22,1,0.36,1)]',
                          collapsed ? 'size-11' : 'size-8',
                          isActive
                            ? collapsed
                              ? 'bg-transparent text-[#1d4f9a]'
                              : 'bg-[#d9e8fb] text-[#1d4f9a]'
                            : collapsed
                              ? 'bg-transparent text-white group-hover:bg-white/10'
                              : 'bg-white/12 text-white group-hover:bg-white/25',
                        )}
                      >
                        <NavIcon
                          name={item.icon}
                          className={collapsed ? 'size-6' : 'size-[17px]'}
                          strokeWidth={collapsed ? 1.55 : 1.6}
                        />
                        {collapsed && item.badge ? (
                          <span
                            className={cn(
                              'absolute -right-0.5 -top-0.5 grid size-4 place-items-center rounded-full text-[8px] font-bold leading-none text-white',
                              badgeStyles[item.badge.tone],
                            )}
                          >
                            {item.badge.count > 9 ? '9+' : item.badge.count}
                          </span>
                        ) : null}
                      </span>
                      <span className={cn('min-w-0 flex-1 truncate', collapsed && 'sr-only')}>
                        {t(item.labelKey)}
                      </span>
                      {!collapsed && item.badge ? (
                        <span
                          className={cn(
                            'grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-bold leading-none text-white tabular-nums',
                            badgeStyles[item.badge.tone],
                          )}
                        >
                          {item.badge.count}
                        </span>
                      ) : null}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          </nav>

          <footer
            className={cn(
              'relative shrink-0',
              collapsed ? 'flex flex-col items-center px-1.5 pb-3.5 pt-2' : 'w-[260px] px-3 pb-5 pt-3',
            )}
          >
            {collapsed ? (
              <div className="mb-3.5 h-px w-8 bg-gradient-to-r from-transparent via-white/25 to-transparent" />
            ) : (
              <div className="mb-3.5 flex items-center gap-3">
                <span className="h-px flex-1 bg-white/20" />
                <span className="text-[11px] font-semibold tracking-wide text-white/60">
                  {t('common.language')}
                </span>
                <span className="h-px flex-1 bg-white/20" />
              </div>
            )}
            <LanguageSwitcher variant="sidebar" collapsed={collapsed} />
          </footer>
        </div>
      </aside>
    </div>
  )
}
