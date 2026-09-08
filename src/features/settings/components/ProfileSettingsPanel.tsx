import { useEffect, useMemo, useState, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import {
  getProfileApi,
  isApiError,
  mapUserPublicToAuthUser,
  updateUserApi,
  type UserPublicOut,
} from '@/api'
import { Button } from '@/components/buttons'
import { Timeline, TimelineItem, useToast } from '@/components/ui'
import { useAuth } from '@/features/auth/AuthProvider'
import { ChangePasswordForm } from '@/features/auth/components/ChangePasswordForm'
import { PencilIcon } from '@/features/settings/components/SettingsIcons'
import { useI18n, type TranslationKey } from '@/i18n'
import { toIntlLocale } from '@/i18n/config'
import { cn } from '@/lib/cn'

function formatDateTime(value: string | null | undefined, locale: string): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat(locale, {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(date)
}

function statusTone(status: string): string {
  const normalized = status.toLowerCase()
  if (normalized === 'active') return 'bg-[#e8f6ee] text-[#1f7a4d]'
  if (normalized === 'inactive') return 'bg-[#f1f5f9] text-[#64748b]'
  if (normalized === 'pending') return 'bg-[#fff7e8] text-[#b45309]'
  return 'bg-[#eef3f9] text-[#2860B9]'
}

type ProfileFieldIcon = 'email' | 'user' | 'shield' | 'status' | 'phone'

function FieldIcon({ name }: { name: ProfileFieldIcon }) {
  const common = {
    className: 'size-4 shrink-0 text-[#2860B9]',
    viewBox: '0 0 24 24',
    fill: 'none',
    'aria-hidden': true as const,
  }
  const stroke = {
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  }

  switch (name) {
    case 'email':
      return (
        <svg {...common}>
          <rect x="4" y="6" width="16" height="12" rx="2" {...stroke} />
          <path d="m5 8 7 5 7-5" {...stroke} />
        </svg>
      )
    case 'user':
      return (
        <svg {...common}>
          <circle cx="12" cy="8" r="3" {...stroke} />
          <path d="M5.2 18.6c1.5-3.2 3.9-4.8 6.8-4.8s5.3 1.6 6.8 4.8" {...stroke} />
        </svg>
      )
    case 'shield':
      return (
        <svg {...common}>
          <path
            d="M12 4.4 18.6 6.6v5.3c0 3.7-2.5 6.4-6.6 7.7-4.1-1.3-6.6-4-6.6-7.7V6.6L12 4.4Z"
            {...stroke}
          />
        </svg>
      )
    case 'status':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="7.2" {...stroke} />
          <path d="m8.2 12.2 2.4 2.4 5.2-5.4" {...stroke} />
        </svg>
      )
    case 'phone':
      return (
        <svg {...common}>
          <path
            d="M8.2 4.8h2.4l1 3.2-1.6 1a10.5 10.5 0 0 0 4.8 4.8l1-1.6 3.2 1v2.4a1.6 1.6 0 0 1-1.6 1.6A13.6 13.6 0 0 1 4.8 6.4 1.6 1.6 0 0 1 6.4 4.8Z"
            {...stroke}
          />
        </svg>
      )
  }
}

function ProfileRow({
  label,
  icon,
  children,
}: {
  label: string
  icon: ProfileFieldIcon
  children: ReactNode
}) {
  return (
    <div className="grid grid-cols-1 gap-1 border-b border-[#edf2f7] py-3.5 last:border-b-0 sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center sm:gap-6">
      <dt className="flex items-center gap-2 text-[12px] font-semibold text-[#7a869c]">
        <FieldIcon name={icon} />
        <span>{label}</span>
      </dt>
      <dd className="min-w-0 break-words text-[14px] font-semibold text-[#1c2a4e]">{children}</dd>
    </div>
  )
}

interface TimelineEvent {
  labelKey: TranslationKey
  value: string | null | undefined
}

interface EditValues {
  fullName: string
  phone: string
}

const editInputClass =
  'h-10 w-full max-w-md rounded-[10px] border border-[#d7e1ef] bg-[#f7f9fd] px-3 text-[14px] font-semibold text-[#24314f] outline-none transition-colors focus:border-[#2860B9] focus:bg-white focus:ring-4 focus:ring-[#2860B9]/14'

export function ProfileSettingsPanel() {
  const { t, locale } = useI18n()
  const { login } = useAuth()
  const { notify } = useToast()
  const location = useLocation()
  const [profile, setProfile] = useState<UserPublicOut | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState(false)
  const [editValues, setEditValues] = useState<EditValues>({ fullName: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [editError, setEditError] = useState<TranslationKey | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)
      try {
        const data = await getProfileApi()
        if (cancelled) return
        setProfile(data)
        login(mapUserPublicToAuthUser(data), true)
      } catch (err) {
        if (cancelled) return
        // Session expired → forced logout; skip inline error flash.
        if (isApiError(err) && err.status === 401) {
          return
        }
        const message = isApiError(err) ? err.message : t('profile.loadError')
        setError(message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    void load()
    return () => {
      cancelled = true
    }
  }, [login, t])

  useEffect(() => {
    if (location.hash !== '#password') return
    const node = document.getElementById('change-password')
    node?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location.hash, loading])

  const intlLocale = toIntlLocale(locale)

  const initials = useMemo(() => {
    if (!profile) return '—'
    const name = profile.full_name?.trim() || profile.email
    const parts = name.split(/\s+/).filter(Boolean)
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase()
    }
    return name.slice(0, 2).toUpperCase()
  }, [profile])

  const timelineEvents: TimelineEvent[] = profile
    ? [
        { labelKey: 'profile.fields.createdAt', value: profile.created_at },
        { labelKey: 'profile.fields.updatedAt', value: profile.updated_at },
        { labelKey: 'profile.fields.lastLoginAt', value: profile.last_login_at },
      ]
    : []

  const startEdit = () => {
    if (!profile) return
    setEditValues({
      fullName: profile.full_name?.trim() ?? '',
      phone: profile.phone?.trim() ?? '',
    })
    setEditError(null)
    setEditing(true)
  }

  const cancelEdit = () => {
    setEditing(false)
    setEditError(null)
  }

  const saveEdit = async () => {
    if (!profile) return
    if (!editValues.fullName.trim()) {
      setEditError('profile.edit.errors.fullNameRequired')
      return
    }

    try {
      setSaving(true)
      setEditError(null)
      const updated = await updateUserApi(profile.user_id, {
        full_name: editValues.fullName.trim(),
        phone: editValues.phone.trim(),
      })
      setProfile(updated)
      login(mapUserPublicToAuthUser(updated), true)
      setEditing(false)
      notify(t('profile.edit.success'), 'success')
    } catch (err) {
      setEditError(
        isApiError(err) && err.status === 403
          ? 'profile.edit.errors.forbidden'
          : 'profile.edit.errors.failed',
      )
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-3 lg:grid-cols-[minmax(0,1fr)_340px]">
      <section className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white">
        <header className="flex flex-wrap items-center gap-4 border-b border-[#edf2f7] px-5 py-5 sm:px-6">
          <div className="grid size-14 shrink-0 place-items-center rounded-full bg-[#e8f1fc] text-[17px] font-bold text-[#2860B9]">
            {loading ? '…' : initials}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <h2 className="truncate text-[18px] font-bold text-[#1c2a4e]">
                {profile?.full_name?.trim() || t('profile.title')}
              </h2>
              {profile?.status ? (
                <span
                  className={cn(
                    'rounded-md px-2 py-0.5 text-[11px] font-bold uppercase tracking-[0.03em]',
                    statusTone(profile.status),
                  )}
                >
                  {profile.status.toUpperCase()}
                </span>
              ) : null}
            </div>
            <p className="mt-1 truncate text-[13px] font-medium text-[#6d7b93]">
              {profile?.email || t('profile.subtitle')}
            </p>
            {profile?.role ? (
              <p className="mt-0.5 text-[12px] font-semibold text-[#2860B9]">
                {profile.role.toUpperCase()}
              </p>
            ) : null}
          </div>
          {profile && !editing ? (
            <button
              type="button"
              className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-[10px] px-3 py-2 text-[13px] font-semibold text-[#2860B9] transition-colors hover:bg-[#eef5fc] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2860B9]/30"
              onClick={startEdit}
            >
              <PencilIcon className="size-4 text-[#2860B9]" />
              <span>{t('profile.editProfile')}</span>
            </button>
          ) : null}
        </header>

        <div className="min-h-0 flex-1 overflow-auto px-5 py-2 sm:px-6">
          {loading ? (
            <p className="py-10 text-center text-[14px] font-medium text-[#6d7b93]">
              {t('profile.loading')}
            </p>
          ) : null}

          {!loading && error ? (
            <p
              className="my-4 rounded-xl bg-[#fef2f2] px-4 py-3 text-[13px] font-semibold text-danger"
              role="alert"
            >
              {error}
            </p>
          ) : null}

          {!loading && profile ? (
            <div className="flex flex-col gap-6 py-4">
              <div className="min-w-0">
                <dl>
                  <ProfileRow icon="email" label={t('profile.fields.email')}>
                    {profile.email}
                  </ProfileRow>
                  <ProfileRow icon="user" label={t('profile.fields.fullName')}>
                    {editing ? (
                      <input
                        type="text"
                        value={editValues.fullName}
                        onChange={(event) =>
                          setEditValues((prev) => ({ ...prev, fullName: event.target.value }))
                        }
                        className={editInputClass}
                        aria-label={t('profile.fields.fullName')}
                      />
                    ) : (
                      profile.full_name?.trim() || '—'
                    )}
                  </ProfileRow>
                  <ProfileRow icon="shield" label={t('profile.fields.role')}>
                    {profile.role ? profile.role.toUpperCase() : '—'}
                  </ProfileRow>
                  <ProfileRow icon="status" label={t('profile.fields.status')}>
                    {profile.status ? profile.status.toUpperCase() : '—'}
                  </ProfileRow>
                  <ProfileRow icon="phone" label={t('profile.fields.phone')}>
                    {editing ? (
                      <input
                        type="tel"
                        value={editValues.phone}
                        onChange={(event) =>
                          setEditValues((prev) => ({ ...prev, phone: event.target.value }))
                        }
                        className={editInputClass}
                        aria-label={t('profile.fields.phone')}
                      />
                    ) : (
                      profile.phone?.trim() || '—'
                    )}
                  </ProfileRow>
                </dl>

                {editing ? (
                  <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
                    {editError ? (
                      <p className="mr-auto text-[12px] font-semibold text-danger" role="alert">
                        {t(editError)}
                      </p>
                    ) : null}
                    <Button type="button" variant="secondary" onClick={cancelEdit} disabled={saving}>
                      {t('profile.edit.cancel')}
                    </Button>
                    <Button
                      type="button"
                      className="rounded-[10px] bg-[#2860B9] font-bold hover:bg-[#1f529e]"
                      isLoading={saving}
                      onClick={() => void saveEdit()}
                    >
                      {saving ? t('profile.edit.saving') : t('profile.edit.save')}
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className="min-w-0 rounded-xl border border-[#edf2f7] bg-[#f8fafc] px-4 py-4 sm:px-5">
                <h3 className="mb-4 text-[13px] font-bold text-[#1c2a4e]">
                  {t('profile.timelineTitle')}
                </h3>
                <Timeline>
                  {timelineEvents.map((event, index) => (
                    <TimelineItem key={event.labelKey} last={index === timelineEvents.length - 1}>
                      <p className="text-[12px] font-semibold text-[#7a869c]">{t(event.labelKey)}</p>
                      <p className="mt-1 text-[14px] font-semibold text-[#1c2a4e]">
                        {formatDateTime(event.value, intlLocale)}
                      </p>
                    </TimelineItem>
                  ))}
                </Timeline>
              </div>
            </div>
          ) : null}
        </div>
      </section>

      <aside
        id="change-password"
        className="flex min-h-0 min-w-0 flex-col overflow-hidden rounded-2xl bg-white"
      >
        <header className="border-b border-[#edf2f7] px-5 py-5">
          <h2 className="text-[16px] font-bold text-[#1c2a4e]">{t('changePassword.title')}</h2>
        </header>
        <div className="flex-1 p-5">
          <ChangePasswordForm />
        </div>
      </aside>
    </div>
  )
}
