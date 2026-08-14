import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import { cn } from '@/lib/cn'
import { useI18n } from '@/i18n'

export type ToastVariant = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  variant: ToastVariant
  leaving?: boolean
}

interface ToastContextValue {
  notify: (message: string, variant?: ToastVariant) => void
  dismiss: (id: string) => void
}

const TOAST_DURATION_MS = 3000
const TOAST_LEAVE_MS = 180

const ToastContext = createContext<ToastContextValue | null>(null)

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

function ToastIcon({ variant }: { variant: ToastVariant }) {
  const className = 'size-4 shrink-0'

  if (variant === 'success') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path
          d="m8.2 12.2 2.4 2.4 5.2-5.3"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

  if (variant === 'error') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
        <path d="M12 8v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        <path d="M12 16.2h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
    )
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 11.2V16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M12 8h.01" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

const variantStyles: Record<ToastVariant, string> = {
  success: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  error: 'border-red-200 bg-red-50 text-danger',
  info: 'border-[#d5e2f4] bg-[#f4f8fd] text-[#2c3859]',
}

function ToastItem({
  toast,
  onDismiss,
}: {
  toast: Toast
  onDismiss: (id: string) => void
}) {
  const { t } = useI18n()
  return (
    <div
      role={toast.variant === 'error' ? 'alert' : 'status'}
      className={cn(
        'pointer-events-auto flex w-full items-start gap-2.5 rounded-[5px] border px-3.5 py-2.5 shadow-[0_12px_28px_rgba(30,64,116,0.14)]',
        variantStyles[toast.variant],
        toast.leaving ? 'toast-leave' : 'toast-enter',
      )}
    >
      <span className="mt-0.5">
        <ToastIcon variant={toast.variant} />
      </span>
      <p className="flex-1 text-[12px] font-semibold leading-5">{toast.message}</p>
      <button
        type="button"
        className="mt-0.5 grid size-5 shrink-0 place-items-center rounded text-current/60 transition-colors hover:text-current focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/30"
        aria-label={t('common.closeNotification')}
        onClick={() => onDismiss(toast.id)}
      >
        <svg className="size-3.5" viewBox="0 0 24 24" fill="none" aria-hidden>
          <path
            d="m7 7 10 10M17 7 7 17"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timersRef = useRef<Map<string, number>>(new Map())

  const clearTimer = useCallback((id: string) => {
    const timer = timersRef.current.get(id)
    if (timer) {
      window.clearTimeout(timer)
      timersRef.current.delete(id)
    }
  }, [])

  const dismiss = useCallback(
    (id: string) => {
      clearTimer(id)
      setToasts((current) =>
        current.map((toast) => (toast.id === id ? { ...toast, leaving: true } : toast)),
      )

      const leaveTimer = window.setTimeout(() => {
        setToasts((current) => current.filter((toast) => toast.id !== id))
        timersRef.current.delete(id)
      }, TOAST_LEAVE_MS)

      timersRef.current.set(id, leaveTimer)
    },
    [clearTimer],
  )

  const notify = useCallback(
    (message: string, variant: ToastVariant = 'info') => {
      const id = crypto.randomUUID()
      setToasts((current) => [...current, { id, message, variant }])

      const hideTimer = window.setTimeout(() => {
        dismiss(id)
      }, TOAST_DURATION_MS)

      timersRef.current.set(id, hideTimer)
    },
    [dismiss],
  )

  useEffect(() => {
    const timers = timersRef.current
    return () => {
      timers.forEach((timer) => window.clearTimeout(timer))
      timers.clear()
    }
  }, [])

  const value = useMemo(() => ({ notify, dismiss }), [notify, dismiss])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="pointer-events-none fixed top-4 right-4 z-50 flex w-[min(100%-2rem,360px)] flex-col gap-2"
        aria-live="polite"
        aria-relevant="additions"
      >
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onDismiss={dismiss} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
