import { useEffect } from 'react'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { useI18n } from '@/i18n'

export function LoginPage() {
  const { t } = useI18n()

  useEffect(() => {
    document.title = t('meta.title')
  }, [t])

  return (
    <AuthLayout title={t('auth.welcome')} description={t('auth.description')}>
      <LoginForm />
    </AuthLayout>
  )
}
