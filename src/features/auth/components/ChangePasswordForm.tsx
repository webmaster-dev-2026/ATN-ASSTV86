import { useState, type FormEvent } from 'react'
import { changePasswordApi, isApiError } from '@/api'
import { Button } from '@/components/buttons'
import { useToast } from '@/components/ui'
import { useI18n, type TranslationKey } from '@/i18n'
import { cn } from '@/lib/cn'

interface FormValues {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface FormErrors {
  currentPassword?: TranslationKey
  newPassword?: TranslationKey
  confirmPassword?: TranslationKey
  form?: TranslationKey
}

type VisibilityKey = 'current' | 'new' | 'confirm'
type IconName = 'lock' | 'eye' | 'eyeOff'
type RuleState = 'idle' | 'pass' | 'fail'

const INITIAL: FormValues = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
}

const HAS_UPPERCASE = /[A-Z]/
const HAS_SPECIAL = /[^A-Za-z0-9]/

const RULES: Array<{
  id: string
  labelKey: TranslationKey
  test: (password: string) => boolean
}> = [
  {
    id: 'minLength',
    labelKey: 'changePassword.rules.minLength',
    test: (password) => password.length >= 8,
  },
  {
    id: 'uppercase',
    labelKey: 'changePassword.rules.uppercase',
    test: (password) => HAS_UPPERCASE.test(password),
  },
  {
    id: 'special',
    labelKey: 'changePassword.rules.special',
    test: (password) => HAS_SPECIAL.test(password),
  },
  {
    id: 'maxLength',
    labelKey: 'changePassword.rules.maxLength',
    test: (password) => password.length > 0 && password.length <= 20,
  },
]

function getRuleState(password: string, passed: boolean): RuleState {
  if (!password) return 'idle'
  return passed ? 'pass' : 'fail'
}

function Icon({ name, className = 'size-4' }: { name: IconName; className?: string }) {
  const commonProps = {
    className,
    viewBox: '0 0 24 24',
    fill: 'none',
    'aria-hidden': true,
  }

  switch (name) {
    case 'lock':
      return (
        <svg {...commonProps}>
          <rect x="5.5" y="10" width="13" height="9.5" rx="1.8" stroke="currentColor" strokeWidth="1.6" />
          <path
            d="M8.5 10V7.8a3.5 3.5 0 0 1 7 0V10"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      )
    case 'eye':
      return (
        <svg {...commonProps}>
          <path
            d="M3.8 12s2.8-5 8.2-5 8.2 5 8.2 5-2.8 5-8.2 5-8.2-5-8.2-5Z"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
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
  }
}

function RuleStatusIcon({ state }: { state: RuleState }) {
  const shell =
    'grid size-5 shrink-0 place-items-center rounded-full border bg-white'

  if (state === 'idle') {
    return (
      <span className={cn(shell, 'border-[#c5d0e0]')} aria-hidden>
        <span className="size-1.5 rounded-full bg-[#9aa6b8]" />
      </span>
    )
  }

  if (state === 'fail') {
    return (
      <span className={cn(shell, 'border-[#f0b4b4] text-[#dc2626]')} aria-hidden>
        <svg className="size-3" viewBox="0 0 12 12" fill="none">
          <path
            d="M3 3l6 6M9 3 3 9"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
      </span>
    )
  }

  return (
    <span className={cn(shell, 'border-[#86efac] text-[#16a34a]')} aria-hidden>
      <svg className="size-3" viewBox="0 0 12 12" fill="none">
        <path
          d="m2.5 6.2 2.4 2.4 4.6-5"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="animate-[pw-check_320ms_ease-out_forwards]"
        />
      </svg>
    </span>
  )
}

function PasswordRulesChecklist({ password }: { password: string }) {
  const { t } = useI18n()

  return (
    <div className="mt-3">
      <p className="mb-2 text-[12px] font-semibold text-[#2c3859]">
        {t('changePassword.rules.title')}
      </p>
      <ul className="space-y-2" aria-live="polite">
        {RULES.map((rule) => {
          const state = getRuleState(password, rule.test(password))
          return (
            <li key={rule.id} className="flex items-center gap-2.5">
              <RuleStatusIcon state={state} />
              <span
                className={cn(
                  'text-[12px] font-medium transition-colors duration-200',
                  state === 'pass' && 'text-[#15803d]',
                  state === 'fail' && 'text-[#dc2626]',
                  state === 'idle' && 'text-[#6d7b93]',
                )}
              >
                {t(rule.labelKey)}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

function validateNewPassword(password: string): TranslationKey | undefined {
  if (!password.trim()) return 'changePassword.errors.newRequired'
  if (password.length < 8) return 'changePassword.errors.newMinLength'
  if (password.length > 20) return 'changePassword.errors.newMaxLength'
  if (!HAS_UPPERCASE.test(password)) return 'changePassword.errors.newUppercase'
  if (!HAS_SPECIAL.test(password)) return 'changePassword.errors.newSpecial'
  return undefined
}

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {}

  if (!values.currentPassword.trim()) {
    errors.currentPassword = 'changePassword.errors.currentRequired'
  }

  const newPasswordError = validateNewPassword(values.newPassword)
  if (newPasswordError) {
    errors.newPassword = newPasswordError
  }

  if (!values.confirmPassword.trim()) {
    errors.confirmPassword = 'changePassword.errors.confirmRequired'
  } else if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = 'changePassword.errors.confirmMismatch'
  }

  return errors
}

function PasswordField({
  id,
  label,
  value,
  autoComplete,
  visible,
  error,
  maxLength,
  onChange,
  onToggleVisible,
  showLabel,
  hideLabel,
}: {
  id: string
  label: string
  value: string
  autoComplete: string
  visible: boolean
  error?: TranslationKey
  maxLength?: number
  onChange: (value: string) => void
  onToggleVisible: () => void
  showLabel: string
  hideLabel: string
}) {
  const { t } = useI18n()

  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-[13px] font-semibold text-[#2c3859]">
        {label}
      </label>
      <div className="relative">
        <Icon
          name="lock"
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-[#8b95a8]"
        />
        <input
          key={visible ? `${id}-visible` : `${id}-hidden`}
          id={id}
          name={id}
          type={visible ? 'text' : 'password'}
          autoComplete={autoComplete}
          value={value}
          maxLength={maxLength}
          onChange={(event) => onChange(event.target.value)}
          className="auth-input pr-11"
          aria-invalid={Boolean(error)}
        />
        <button
          type="button"
          className="absolute right-2 top-1/2 z-10 grid size-8 -translate-y-1/2 place-items-center rounded-md text-[#8b95a9] transition-colors hover:text-[#2860B9] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/30"
          aria-label={visible ? hideLabel : showLabel}
          aria-pressed={visible}
          onMouseDown={(event) => event.preventDefault()}
          onClick={onToggleVisible}
        >
          <Icon name={visible ? 'eye' : 'eyeOff'} className="size-4" />
        </button>
      </div>
      {error ? (
        <p className="mt-1.5 text-[12px] font-semibold text-danger" role="alert">
          {t(error)}
        </p>
      ) : null}
    </div>
  )
}

export function ChangePasswordForm() {
  const { t } = useI18n()
  const { notify } = useToast()
  const [values, setValues] = useState<FormValues>(INITIAL)
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitting, setSubmitting] = useState(false)
  const [visible, setVisible] = useState<Record<VisibilityKey, boolean>>({
    current: false,
    new: false,
    confirm: false,
  })

  const setField = (field: keyof FormValues, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }))
  }

  const toggleVisible = (key: VisibilityKey) => {
    setVisible((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const nextErrors = validate(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    try {
      setSubmitting(true)
      setErrors({})
      await changePasswordApi({
        current_password: values.currentPassword,
        new_password: values.newPassword,
      })
      setValues(INITIAL)
      notify(t('changePassword.success'), 'success')
    } catch (err) {
      const key: TranslationKey =
        isApiError(err) && err.status === 400
          ? 'changePassword.errors.invalidCurrent'
          : 'changePassword.errors.failed'
      setErrors({ form: key })
      notify(t(key), 'error')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex h-full flex-col gap-4" noValidate>
      <PasswordField
        id="currentPassword"
        label={t('changePassword.currentPassword')}
        value={values.currentPassword}
        autoComplete="current-password"
        visible={visible.current}
        error={errors.currentPassword}
        onChange={(value) => setField('currentPassword', value)}
        onToggleVisible={() => toggleVisible('current')}
        showLabel={t('auth.showPassword')}
        hideLabel={t('auth.hidePassword')}
      />

      <PasswordField
        id="newPassword"
        label={t('changePassword.newPassword')}
        value={values.newPassword}
        autoComplete="new-password"
        visible={visible.new}
        error={errors.newPassword}
        maxLength={20}
        onChange={(value) => setField('newPassword', value)}
        onToggleVisible={() => toggleVisible('new')}
        showLabel={t('auth.showPassword')}
        hideLabel={t('auth.hidePassword')}
      />

      <div>
        <PasswordField
          id="confirmPassword"
          label={t('changePassword.confirmPassword')}
          value={values.confirmPassword}
          autoComplete="new-password"
          visible={visible.confirm}
          error={errors.confirmPassword}
          maxLength={20}
          onChange={(value) => setField('confirmPassword', value)}
          onToggleVisible={() => toggleVisible('confirm')}
          showLabel={t('auth.showPassword')}
          hideLabel={t('auth.hidePassword')}
        />
        <PasswordRulesChecklist password={values.newPassword} />
      </div>

      {errors.form ? (
        <p
          className="rounded-[10px] bg-[#fef2f2] px-3 py-2 text-[12px] font-semibold text-danger"
          role="alert"
        >
          {t(errors.form)}
        </p>
      ) : null}

      <div className="mt-auto pt-2">
        <Button
          type="submit"
          className="h-11 w-full rounded-[10px] bg-[#2860B9] text-[14px] font-bold hover:bg-[#1f529e]"
          isLoading={submitting}
        >
          {submitting ? t('changePassword.submitting') : t('changePassword.submit')}
        </Button>
      </div>
    </form>
  )
}
