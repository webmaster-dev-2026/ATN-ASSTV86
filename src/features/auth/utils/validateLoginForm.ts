import type { LoginCredentials, LoginFormErrors } from '@/models'

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLoginForm(values: LoginCredentials): LoginFormErrors {
  const errors: LoginFormErrors = {}

  if (!values.email.trim()) {
    errors.email = 'validation.emailRequired'
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = 'validation.emailInvalid'
  }

  if (!values.password) {
    errors.password = 'validation.passwordRequired'
  } else if (values.password.length < 6) {
    errors.password = 'validation.passwordMinLength'
  }

  return errors
}
