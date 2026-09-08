import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { loginApi, isApiError } from '@/api'
import { useToast } from '@/components/ui'
import { useAuth } from '@/features/auth/AuthProvider'
import type {
  LoginCredentials,
  LoginFormErrors,
  LoginStatus,
} from '@/models'
import { validateLoginForm } from '@/features/auth/utils/validateLoginForm'
import { useI18n, type TranslationKey } from '@/i18n'

const INITIAL_VALUES: LoginCredentials = {
  email: 'admin@asstv86.local',
  password: 'Admin123!',
}

const LOGIN_ERROR_KEYS = {
  invalidCredentials: 'errors.invalidCredentials',
  accountInactive: 'errors.accountInactive',
  accountLocked: 'errors.accountLocked',
} as const satisfies Record<string, TranslationKey>

function isTranslationKey(value: string): value is TranslationKey {
  return (Object.values(LOGIN_ERROR_KEYS) as string[]).includes(value)
}

function mapLoginError(error: unknown): TranslationKey {
  if (isApiError(error)) {
    if (error.status === 401) return LOGIN_ERROR_KEYS.invalidCredentials
    if (error.status === 403) return LOGIN_ERROR_KEYS.accountInactive
  }

  if (error instanceof Error && isTranslationKey(error.message)) {
    return error.message
  }

  return 'auth.failed'
}

function getRedirectPath(from: unknown): string {
  if (
    from &&
    typeof from === 'object' &&
    'pathname' in from &&
    typeof from.pathname === 'string' &&
    from.pathname !== '/login'
  ) {
    return from.pathname
  }

  return '/dashboard'
}

export function useLogin() {
  const { t } = useI18n()
  const { notify } = useToast()
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [values, setValues] = useState<LoginCredentials>(INITIAL_VALUES)
  const [errors, setErrors] = useState<LoginFormErrors>({})
  const [status, setStatus] = useState<LoginStatus>('idle')

  const setField = (field: keyof LoginCredentials, value: string) => {
    setValues((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined, form: undefined }))
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const nextErrors = validateLoginForm(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      setStatus('error')
      return
    }

    try {
      setStatus('submitting')
      setErrors({})
      const user = await loginApi(values)
      login(user, true)
      setStatus('success')
      notify(t('auth.success'), 'success')
      const from =
        location.state &&
        typeof location.state === 'object' &&
        'from' in location.state
          ? location.state.from
          : undefined
      navigate(getRedirectPath(from), { replace: true })
    } catch (error) {
      const key = mapLoginError(error)
      setStatus('error')
      setErrors({ form: key })
      notify(t(key), 'error')
    }
  }

  return {
    values,
    errors,
    status,
    isSubmitting: status === 'submitting',
    setField,
    handleSubmit,
  }
}
