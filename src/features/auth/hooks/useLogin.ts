import { useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useToast } from '@/components/ui'
import { useAuth } from '@/features/auth/AuthProvider'
import type {
  AuthUser,
  LoginCredentials,
  LoginFormErrors,
  LoginStatus,
} from '@/models'
import { validateLoginForm } from '@/features/auth/utils/validateLoginForm'
import { useI18n, type TranslationKey } from '@/i18n'
import usersData from '../../../../mock/api/users.json'

const INITIAL_VALUES: LoginCredentials = {
  email: '',
  password: '',
}

interface MockUser {
  id: string
  email: string
  password: string
  status: string
  first_name: string
  last_name: string
  full_name: string
  job_title: string
  role_label: string
}

const LOGIN_ERROR_KEYS = {
  invalidCredentials: 'errors.invalidCredentials',
  accountInactive: 'errors.accountInactive',
  accountLocked: 'errors.accountLocked',
} as const satisfies Record<string, TranslationKey>

function toAuthUser(user: MockUser): AuthUser {
  return {
    id: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    fullName: user.full_name,
    jobTitle: user.job_title,
    roleLabel: user.role_label,
  }
}

async function mockLogin(credentials: LoginCredentials): Promise<AuthUser> {
  await new Promise((resolve) => setTimeout(resolve, 800))

  const email = credentials.email.trim().toLowerCase()
  const user = (usersData.users as MockUser[]).find(
    (item) => item.email.toLowerCase() === email,
  )

  if (!user || user.password !== credentials.password) {
    throw new Error(LOGIN_ERROR_KEYS.invalidCredentials)
  }

  if (user.status === 'INACTIVE') {
    throw new Error(LOGIN_ERROR_KEYS.accountInactive)
  }

  if (user.status === 'LOCKED') {
    throw new Error(LOGIN_ERROR_KEYS.accountLocked)
  }

  return toAuthUser(user)
}

function isTranslationKey(value: string): value is TranslationKey {
  return (Object.values(LOGIN_ERROR_KEYS) as string[]).includes(value)
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
  const [rememberMe, setRememberMe] = useState(false)
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
      const user = await mockLogin(values)
      login(user, rememberMe)
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
      const key =
        error instanceof Error && isTranslationKey(error.message)
          ? error.message
          : 'auth.failed'
      setStatus('error')
      setErrors({ form: key })
      notify(t(key), 'error')
    }
  }

  return {
    values,
    errors,
    status,
    rememberMe,
    isSubmitting: status === 'submitting',
    setField,
    setRememberMe,
    handleSubmit,
  }
}
