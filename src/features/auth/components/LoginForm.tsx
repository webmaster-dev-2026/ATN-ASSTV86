import { useState } from 'react'
import { Button } from '@/components/buttons'
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher'
import { useLogin } from '@/features/auth/hooks/useLogin'
import { useI18n } from '@/i18n'

type IconName = 'mail' | 'lock' | 'eye' | 'eyeOff' | 'login'

function Icon({ name, className = 'size-4' }: { name: IconName; className?: string }) {
  const commonProps = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    'aria-hidden': true,
  }

  switch (name) {
    case 'mail':
      return (
        <svg {...commonProps}>
          <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.6" />
          <path d="m5 8 7 5 7-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
    case 'lock':
      return (
        <svg {...commonProps}>
          <rect x="5.5" y="10" width="13" height="9.5" rx="1.8" stroke="currentColor" strokeWidth="1.6" />
          <path d="M8.5 10V7.8a3.5 3.5 0 0 1 7 0V10" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      )
    case 'eye':
      return (
        <svg {...commonProps}>
          <path d="M3.8 12s2.8-5 8.2-5 8.2 5 8.2 5-2.8 5-8.2 5-8.2-5-8.2-5Z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <circle cx="12" cy="12" r="2.3" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      )
    case 'eyeOff':
      return (
        <svg {...commonProps}>
          <path d="m4 4 16 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path
            d="M9.5 5.7A9.5 9.5 0 0 1 12 5.3c5.4 0 8.2 5 8.2 5a14 14 0 0 1-2.5 3.1M14.2 14.3A3.2 3.2 0 0 1 9.7 9.8M6.3 7.7a14 14 0 0 0-2.5 2.6s2.8 5 8.2 5c.9 0 1.7-.1 2.4-.4"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )
    case 'login':
      return (
        <svg {...commonProps}>
          <path d="M13 6h4a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
          <path d="m10 8 4 4-4 4M14 12H4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )
  }
}

export function LoginForm() {
  const { t } = useI18n()
  const { values, errors, isSubmitting, rememberMe, setField, setRememberMe, handleSubmit } =
    useLogin()
  const [showPassword, setShowPassword] = useState(false)

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div>
        <label htmlFor="email" className="mb-2 block text-[13px] font-semibold text-[#2c3859]">
          {t('auth.email')}
        </label>
        <div className="relative">
          <Icon name="mail" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8b95a8]" />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="sophie.martin@asstv86.fr"
            value={values.email}
            onChange={(event) => setField('email', event.target.value)}
            className="auth-input"
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
        </div>
        {errors.email ? (
          <p id="email-error" className="mt-1.5 text-[12px] font-semibold text-danger" role="alert">
            {t(errors.email)}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="password" className="mb-2 block text-[13px] font-semibold text-[#2c3859]">
          {t('auth.password')}
        </label>
        <div className="relative">
          <Icon name="lock" className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8b95a8]" />
          <input
            key={showPassword ? 'password-visible' : 'password-hidden'}
            id="password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            autoComplete="current-password"
            placeholder="**********"
            value={values.password}
            onChange={(event) => setField('password', event.target.value)}
            className="auth-input pr-11"
            aria-invalid={Boolean(errors.password)}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            className="absolute right-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-md text-[#8b95a9] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[#2860B9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/30"
            aria-label={showPassword ? t('auth.hidePassword') : t('auth.showPassword')}
            aria-pressed={showPassword}
            onMouseDown={(event) => event.preventDefault()}
            onClick={() => setShowPassword((current) => !current)}
          >
            <Icon name={showPassword ? 'eye' : 'eyeOff'} className="size-4" />
          </button>
        </div>
        {errors.password ? (
          <p id="password-error" className="mt-1.5 text-[12px] font-semibold text-danger" role="alert">
            {t(errors.password)}
          </p>
        ) : null}
      </div>

      <div className="flex items-center justify-between gap-3 pt-0.5 text-[12px] font-semibold">
        <label className="inline-flex min-w-0 cursor-pointer items-center gap-2.5 text-[#7d8799]">
          <input
            type="checkbox"
            checked={rememberMe}
            onChange={(event) => setRememberMe(event.target.checked)}
            className="peer sr-only"
          />
          <span className="grid size-4 place-items-center rounded-[4px] border border-[#c5d0e0] bg-white text-transparent transition-colors duration-200 ease-[cubic-bezier(0.22,1,0.36,1)] peer-checked:border-[#2860B9] peer-checked:bg-[#2860B9] peer-checked:text-white peer-focus-visible:ring-2 peer-focus-visible:ring-[#2860B9]/30">
            <svg className="size-2.5" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="m2 6 2.7 2.7L10 3.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span>{t('auth.rememberMe')}</span>
        </label>
        <button
          type="button"
          className="shrink-0 rounded text-[#2860B9] transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:text-[#1f529e] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/30"
        >
          {t('auth.forgotPassword')}
        </button>
      </div>

      <Button
        type="submit"
        className="h-12 w-full rounded-[10px] bg-[#2860B9] text-[14px] font-bold shadow-[0_12px_24px_rgba(40,96,185,0.22)] transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#1f529e] active:scale-[0.985]"
        size="md"
        isLoading={isSubmitting}
      >
        {!isSubmitting ? <Icon name="login" className="size-4" /> : null}
        {isSubmitting ? t('auth.submitting') : t('auth.submit')}
      </Button>

      <div className="flex items-center gap-4">
        <span className="h-px flex-1 bg-[#e1e8f1]" />
        <span className="text-[12px] font-semibold text-[#8b94a6]">
          {t('common.language')}
        </span>
        <span className="h-px flex-1 bg-[#e1e8f1]" />
      </div>

      <LanguageSwitcher />
    </form>
  )
}
