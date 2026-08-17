import type { ReactNode } from 'react'
import { useI18n } from '@/i18n'

interface AuthLayoutProps {
  title: string
  description?: string
  children: ReactNode
}

function BrandLogo({ tone = 'light' }: { tone?: 'light' | 'dark' }) {
  const { t } = useI18n()
  const markColor = tone === 'light' ? 'text-white' : 'text-brand-600'
  const textColor = tone === 'light' ? 'text-white' : 'text-[#1b2b4c]'
  const subTextColor = tone === 'light' ? 'text-white/78' : 'text-[#6b7a99]'

  return (
    <div className="flex items-center gap-3">
      <svg className={`h-[52px] w-[58px] shrink-0 ${markColor}`} viewBox="0 0 72 62" fill="none" aria-hidden>
        <path
          d="M9.4 16.6 39.6 29 63.4 5.8 35.2 38.7 24.3 56.1 21.4 35.1 9.4 16.6Z"
          fill="currentColor"
        />
        <path
          d="M18.1 20.1 5.9 16.6l15.6 17.1 5.1-7.1-8.5-6.5Z"
          fill="currentColor"
          opacity="0.72"
        />
        <path
          d="M39.6 29c-8.8 7.8-14.7 15.9-17.8 24.3"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
      <div className={textColor}>
        <div className="flex items-end font-sans text-[30px] font-bold leading-none tracking-[0]">
          ASSTV
          <span className="mb-px ml-1 text-[16px] font-semibold tracking-normal">86</span>
        </div>
        <p
          className={`mt-1.5 max-w-[168px] text-[8px] font-semibold uppercase leading-[1.35] tracking-[0.08em] ${subTextColor}`}
        >
          {t('brand.center')}
          <br />
          {t('brand.locations')}
        </p>
      </div>
    </div>
  )
}

function ShieldIcon({ className = 'size-5' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M12 3.6 18.3 6v5.7c0 4-2.5 7.2-6.3 8.7-3.8-1.5-6.3-4.7-6.3-8.7V6L12 3.6Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M12 8.7v6.1M8.9 11.8h6.2" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function LineIcon({
  name,
  className = 'size-5',
}: {
  name: 'phone' | 'mail'
  className?: string
}) {
  if (name === 'phone') {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path d="M7.4 4.8 9 8.5l-1.6 1.3c1 2.1 2.6 3.7 4.8 4.8l1.3-1.6 3.7 1.6-.6 3.4c-.2.8-.9 1.3-1.7 1.2C9.2 18.6 5.4 14.8 4.8 9.1c-.1-.8.4-1.5 1.2-1.7l1.4-.3Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  }

  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="6" width="16" height="12" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="m5 8 7 5 7-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function AuthLayout({ title, description, children }: AuthLayoutProps) {
  const { t } = useI18n()
  const [productName = 'myATN', ...organizationNameParts] = t('meta.appName').split(' ')
  const organizationName = organizationNameParts.join(' ') || 'ASSTV86'

  return (
    <div className="grid min-h-dvh bg-surface font-sans text-ink lg:grid-cols-2">
      <aside className="relative isolate h-[430px] overflow-hidden bg-brand-50 text-[#1b2b4c] sm:h-[520px] lg:h-auto lg:min-h-dvh">
        <div className="auth-login-scene pointer-events-none absolute inset-0" aria-hidden>
          <img
            src="/images/bg-login.jpg"
            alt=""
            width={682}
            height={1024}
            fetchPriority="high"
            className="auth-login-building absolute inset-0 h-full w-full object-cover object-[68%_100%]"
          />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(108deg,#eff6ff_0%,#eff6ff_24%,rgba(239,246,255,0.78)_40%,rgba(219,234,254,0.28)_64%,rgba(40,96,185,0.06)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 top-0 h-[46%] bg-gradient-to-b from-brand-50 via-brand-50/80 to-transparent"
          aria-hidden
        />
        <div className="auth-login-dot-grid absolute bottom-[24%] left-7 h-[100px] w-[122px] sm:left-10 lg:left-14" aria-hidden />

        <div className="relative z-20 flex h-full flex-col px-7 py-7 sm:px-10 lg:px-14 lg:py-12 xl:px-16">
          <BrandLogo tone="dark" />

          <div className="mt-10 max-w-[350px] sm:mt-14 lg:mt-[82px]">
            <h2 className="font-sans font-bold leading-[0.96] tracking-[0]">
              <span className="block text-[42px] text-[#182846] sm:text-[48px] lg:text-[52px]">
                {productName}
              </span>
              <span className="mt-2 block text-[56px] text-brand-600 sm:text-[66px] lg:text-[72px]">
                {organizationName}
              </span>
            </h2>
            <p className="mt-5 max-w-[310px] text-[15px] font-semibold leading-[1.7] text-muted sm:text-[16px]">
              {t('brand.tagline')}
            </p>
            <div className="mt-7 flex h-[4px] w-[96px] items-center gap-1.5">
              <span className="h-full w-9 rounded-full bg-brand-600" />
              <span className="h-full w-4 rounded-full bg-brand-500/45" />
              <span className="h-px flex-1 rounded-full bg-brand-500/18" />
            </div>
          </div>

          <div className="mt-auto hidden w-fit items-center gap-3 rounded-[14px] border border-white/80 bg-white/78 px-4 py-3 shadow-[0_18px_38px_rgba(40,96,185,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] backdrop-blur-md sm:flex">
            <span className="grid size-9 place-items-center rounded-[10px] bg-brand-50 text-brand-600 shadow-[inset_3px_4px_10px_rgba(40,96,185,0.12)]">
              <ShieldIcon className="size-5" />
            </span>
            <span>
              <span className="block text-[13px] font-bold leading-tight text-brand-600">
                {t('auth.securityTitle')}
              </span>
              <span className="mt-0.5 block text-[11px] font-semibold leading-tight text-[#8a96aa]">
                {t('auth.securityText')}
              </span>
            </span>
          </div>
        </div>
      </aside>

      <main className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto px-5 py-10 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
          <span className="absolute -right-10 top-10 size-[280px] rotate-45 rounded-[36px] border border-white/80 bg-white/45 shadow-[inset_10px_10px_28px_rgba(40,96,185,0.10),inset_-8px_-8px_20px_rgba(255,255,255,0.85)]" />
          <span className="absolute right-[18%] top-[28%] size-[180px] rotate-45 rounded-[28px] border border-[#c5d4ea]/40" />
          <span className="absolute -left-16 bottom-16 size-[220px] rotate-45 rounded-[32px] border border-white/70 bg-white/50 shadow-[18px_22px_48px_rgba(36,72,128,0.14)]" />
          <span className="absolute -bottom-28 -right-16 size-[380px] rotate-45 rounded-[48px] border border-[#c5d4ea]/28" />
          <span className="absolute left-[7%] top-[16%] size-[72px] rotate-45 rounded-[14px] border border-white/80 bg-white/55 shadow-[inset_5px_5px_12px_rgba(40,96,185,0.12),inset_-4px_-4px_10px_rgba(255,255,255,0.9)]" />
          <span className="absolute right-[10%] bottom-[20%] size-[88px] rotate-45 rounded-[16px] border border-white/75 bg-white/50 shadow-[12px_16px_28px_rgba(36,72,128,0.16)]" />
          <span className="absolute left-[20%] top-[54%] size-[56px] rotate-45 rounded-[12px] border border-[#c5d4ea]/55 bg-[#eef3fa]/80 shadow-[inset_4px_4px_10px_rgba(40,96,185,0.10),inset_-3px_-3px_8px_rgba(255,255,255,0.85)]" />
        </div>

        <div className="auth-rise relative z-10 flex w-full max-w-[420px] flex-col">
          <div className="mb-8 flex justify-center lg:hidden">
            <BrandLogo tone="dark" />
          </div>

          <section
            className="rounded-[18px] bg-white px-7 py-9 sm:px-9 sm:py-10"
            aria-labelledby="auth-title"
          >
            <header className="mb-8 text-center">
              <h1
                id="auth-title"
                className="font-display text-[38px] font-semibold leading-none text-[#1a2b52]"
              >
                {title}
              </h1>
              <div className="mx-auto mt-4 flex w-12 items-center gap-1.5">
                <span className="h-px flex-1 bg-[#d7e1ee]" />
                <span className="size-1.5 rotate-45 bg-brand-600" />
                <span className="h-px flex-1 bg-[#d7e1ee]" />
              </div>
              {description ? (
                <p className="mt-3 text-[13.5px] font-medium leading-relaxed text-[#74809a]">
                  {description}
                </p>
              ) : null}
            </header>

            {children}
          </section>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold text-[#7d889d]">
            <span className="px-1">{t('common.needHelp')}</span>
            <a
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1.5 text-brand-600 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-brand-100"
              href="tel:0549445610"
            >
              <LineIcon name="phone" className="size-3.5" />
              05 49 44 56 10
            </a>
            <a
              className="inline-flex items-center gap-1.5 rounded-lg bg-brand-50 px-2.5 py-1.5 text-brand-600 transition-colors duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-brand-100"
              href="mailto:contact@asstv86.fr"
            >
              <LineIcon name="mail" className="size-3.5" />
              contact@asstv86.fr
            </a>
          </div>
        </div>
      </main>
    </div>
  )
}
