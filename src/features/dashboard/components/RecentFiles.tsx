import { Link } from 'react-router-dom'
import type { FileStatus, RecentFileItem } from '@/models'
import { formatReceivedAt, visitLabel } from '@/features/dashboard/format'
import { useI18n, type TranslationKey } from '@/i18n'
import { cn } from '@/lib/cn'
import { DashboardCard } from './DashboardCard'
import { FileTypeIcon } from './FileTypeIcon'

const STATUS_STYLES: Record<FileStatus, string> = {
  toValidate: 'bg-[#fff1e4] text-[#ea7a1a]',
  processing: 'bg-[#f3e8ff] text-[#7c3aed]',
  completed: 'bg-[#e7f8ee] text-[#16a34a]',
  anomaly: 'bg-[#fde2e2] text-[#e54848]',
}

const STATUS_KEYS: Record<FileStatus, TranslationKey> = {
  toValidate: 'dashboard.status.toValidate',
  processing: 'dashboard.status.processing',
  completed: 'dashboard.status.completed',
  anomaly: 'dashboard.status.anomaly',
}

interface RecentFilesProps {
  files: RecentFileItem[]
}

export function RecentFiles({ files }: RecentFilesProps) {
  const { t, locale } = useI18n()

  return (
    <DashboardCard
      title={t('dashboard.recentFiles')}
      className="h-full min-h-0 xl:col-span-2"
      action={
        <Link
          to="/dossiers"
          className="shrink-0 text-[13px] font-semibold text-[#1d4f9a] hover:underline"
        >
          {t('dashboard.seeMore')}
        </Link>
      }
    >
      <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden pr-3">
        <table className="w-full table-fixed text-left">
          <colgroup>
            <col className="w-[28%]" />
            <col className="w-[22%]" />
            <col className="w-[16%]" />
            <col className="w-[18%]" />
            <col className="w-[16%]" />
          </colgroup>
          <thead className="sticky top-0 z-10 bg-white">
            <tr className="text-[12px] font-semibold uppercase tracking-wide text-[#8b95a8]">
              <th className="pb-2 pr-3 font-semibold">{t('dashboard.columns.fileName')}</th>
              <th className="pb-2 pr-3 font-semibold">{t('dashboard.columns.source')}</th>
              <th className="pb-2 pr-3 font-semibold">{t('dashboard.columns.type')}</th>
              <th className="pb-2 pr-3 font-semibold">{t('dashboard.columns.receivedOn')}</th>
              <th className="pb-2 font-semibold">{t('dashboard.columns.status')}</th>
            </tr>
          </thead>
          <tbody>
            {files.map((file) => (
              <tr key={file.id} className="border-t border-[#eef3f9]">
                <td className="py-1.5 pr-3">
                  <div className="flex min-w-0 items-center gap-2.5">
                    <FileTypeIcon type={file.fileType} />
                    <span
                      className="min-w-0 truncate text-[13px] font-semibold text-[#1c2a4e]"
                      title={file.name}
                    >
                      {file.name}
                    </span>
                  </div>
                </td>
                <td className="py-1.5 pr-3">
                  <span className="block truncate text-[13px] text-[#5b6b82]" title={file.source}>
                    {file.source}
                  </span>
                </td>
                <td className="py-1.5 pr-3">
                  <span
                    className="block truncate text-[13px] text-[#5b6b82]"
                    title={visitLabel(file.visitType, t)}
                  >
                    {visitLabel(file.visitType, t)}
                  </span>
                </td>
                <td className="py-1.5 pr-3">
                  <span className="block truncate text-[13px] text-[#5b6b82]">
                    {formatReceivedAt(file.receivedAt, locale)}
                  </span>
                </td>
                <td className="py-1.5">
                  <span
                    className={cn(
                      'inline-flex max-w-full truncate rounded-full px-2.5 py-0.5 text-[11px] font-semibold',
                      STATUS_STYLES[file.status],
                    )}
                  >
                    {t(STATUS_KEYS[file.status])}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </DashboardCard>
  )
}
