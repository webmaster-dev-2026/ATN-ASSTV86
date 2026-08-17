import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'

interface BrandLogoProps {
  tone?: 'light' | 'dark'
  size?: 'xs' | 'sm' | 'md'
  iconOnly?: boolean
}

const MARK_SIZES = {
  sm: {
    box: 'size-8 rounded-[8px]',
    as: 'text-[7px] tracking-[0.14em]',
    num: 'mt-px text-[11px]',
  },
  md: {
    box: 'size-12 rounded-[12px]',
    as: 'text-[9px] tracking-[0.16em]',
    num: 'mt-0.5 text-[16px]',
  },
} as const

interface BrandMarkProps {
  size?: keyof typeof MARK_SIZES
  className?: string
}

export function BrandMark({ size = 'md', className }: BrandMarkProps) {
  const mark = MARK_SIZES[size]

  return (
    <span
      className={cn(
        'grid shrink-0 place-items-center bg-[#1b2b4c] text-center leading-none',
        mark.box,
        className,
      )}
      aria-hidden
    >
      <span className={cn('block font-semibold text-[#c8d4e8]', mark.as)}>AS</span>
      <span className={cn('block font-bold leading-none text-white', mark.num)}>86</span>
    </span>
  )
}

export function BrandLogo({ tone = 'light', size = 'md', iconOnly = false }: BrandLogoProps) {
  const { t } = useI18n()
  const textColor = tone === 'light' ? 'text-white' : 'text-[#2860B9]'
  const subTextColor = tone === 'light' ? 'text-white/80' : 'text-[#6b7a99]'
  const compact = size === 'sm'
  const tiny = size === 'xs'

  return (
    <div className={cn('flex items-center', tiny ? 'gap-1.5' : compact ? 'gap-2.5' : 'gap-3', textColor)}>
      <svg
        className={cn(
          'shrink-0',
          tiny ? 'h-7 w-8' : iconOnly ? 'h-8 w-9' : compact ? 'h-11 w-12' : 'h-14 w-16',
        )}
        viewBox="0 0 72 62"
        fill="none"
        aria-hidden
      >
        <path
          d="M9.4 16.6 39.6 29 63.4 5.8 35.2 38.7 24.3 56.1 21.4 35.1 9.4 16.6Z"
          fill="currentColor"
          opacity="0.96"
        />
        <path
          d="M18.1 20.1 5.9 16.6l15.6 17.1 5.1-7.1-8.5-6.5Z"
          fill="currentColor"
          opacity="0.75"
        />
        <path
          d="M39.6 29c-8.8 7.8-14.7 15.9-17.8 24.3"
          stroke="currentColor"
          strokeWidth="2.8"
          strokeLinecap="round"
          opacity="0.65"
        />
        <path
          d="M7.6 33.8c3.6 1.4 7.4 2 11.4 1.7"
          stroke="currentColor"
          strokeWidth="2.3"
          strokeLinecap="round"
          opacity="0.65"
        />
      </svg>
      <div className={cn(iconOnly && 'sr-only')}>
        <div
          className={cn(
            'flex items-end font-sans font-bold leading-none',
            compact ? 'text-[22px]' : 'text-[31px]',
          )}
        >
          ASSTV
          <span
            className={cn(
              'font-semibold',
              compact ? 'mb-px ml-0.5 text-[12px]' : 'mb-0.5 ml-0.5 text-[17px]',
            )}
          >
            86
          </span>
        </div>
        <p
          className={cn(
            'font-semibold uppercase leading-tight tracking-[0.04em]',
            compact ? 'mt-1 text-[8px]' : 'mt-1 text-[8px]',
            subTextColor,
          )}
        >
          {t('brand.center')}
          {compact ? null : (
            <>
              <br />
              {t('brand.locations')}
            </>
          )}
        </p>
      </div>
    </div>
  )
}
