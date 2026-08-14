import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import {
  ChatbotDock,
  ChatbotLauncher,
  ChatbotProvider,
  useChatbot,
  useDockAsLayout,
} from '@/features/chatbot'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { Header, NAV_ITEMS, Sidebar } from '@/components/header'

const DESKTOP_QUERY = '(min-width: 1024px)'

function AppShell() {
  const { t } = useI18n()
  const location = useLocation()
  const { mode } = useChatbot()
  const dockAsLayout = useDockAsLayout()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [collapsed, setCollapsed] = useState(false)
  const [isDesktop, setIsDesktop] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(DESKTOP_QUERY).matches : true,
  )

  const currentItem = NAV_ITEMS.find((item) => item.path === location.pathname)
  const pageTitle = currentItem ? t(currentItem.labelKey) : t('nav.dashboard')
  const pageSubtitle = currentItem?.subtitleKey ? t(currentItem.subtitleKey) : undefined
  const menuOpen = isDesktop ? !collapsed : mobileOpen
  const occupyChatLayout = mode === 'docked' && dockAsLayout

  useEffect(() => {
    const media = window.matchMedia(DESKTOP_QUERY)
    const onChange = () => setIsDesktop(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    document.title = `${pageTitle} — ${t('meta.appName')}`
  }, [pageTitle, t])

  const handleMenuClick = () => {
    if (isDesktop) {
      setCollapsed((current) => !current)
      return
    }
    setMobileOpen((current) => !current)
  }

  return (
    <>
      <div
        className={cn(
          'flex h-dvh w-full min-w-0 overflow-hidden bg-white lg:p-3',
          collapsed || occupyChatLayout ? 'lg:gap-3' : 'lg:gap-0',
        )}
      >
        <Sidebar
          open={mobileOpen}
          collapsed={collapsed}
          onClose={() => setMobileOpen(false)}
        />
        <div className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
          <Header title={pageTitle} subtitle={pageSubtitle} menuOpen={menuOpen} onMenuClick={handleMenuClick} />
          <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden px-3 pb-3 lg:px-0 lg:pb-0">
            <Outlet />
          </main>
        </div>
        <ChatbotDock />
      </div>
      <ChatbotLauncher />
    </>
  )
}

export function AppLayout() {
  return (
    <ChatbotProvider>
      <AppShell />
    </ChatbotProvider>
  )
}
