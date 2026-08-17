import { CloseIcon, SearchIcon } from '@/features/dossiers/components/DossierIcons'
import { useI18n } from '@/i18n'
import { cn } from '@/lib/cn'
import { SCOPE_LABEL, SCOPES } from '../format'
import type { SearchCounts, SearchScope } from '../types'

interface SearchBarProps {
  query: string
  scope: SearchScope
  counts: SearchCounts
  onQueryChange: (value: string) => void
  onScopeChange: (value: SearchScope) => void
}

export function SearchBar({ query, scope, counts, onQueryChange, onScopeChange }: SearchBarProps) {
  const { t } = useI18n()

  return (
    <section className="flex shrink-0 flex-col gap-3 rounded-2xl bg-white px-4 py-4 shadow-[0_1px_2px_rgba(28,42,78,0.04)] sm:px-5">
      <label className="relative block">
        <span className="sr-only">{t('search.placeholder')}</span>
        <SearchIcon className="pointer-events-none absolute left-3.5 top-1/2 size-[18px] -translate-y-1/2 text-[#8b95a8]" />
        <input
          type="search"
          value={query}
          autoFocus
          autoComplete="off"
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder={t('search.placeholder')}
          className="h-11 w-full rounded-xl border border-[#e4ecf6] bg-[#f7fafc] py-0 pl-11 pr-11 text-[14px] text-[#1c2a4e] transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-[#8b95a8] focus:border-brand-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/30"
        />
        {query ? (
          <button
            type="button"
            className="absolute right-2 top-1/2 grid size-8 -translate-y-1/2 cursor-pointer place-items-center rounded-lg text-[#8b95a8] transition-colors hover:bg-[#eef5fc] hover:text-[#1d4f9a]"
            aria-label={t('search.clear')}
            onClick={() => onQueryChange('')}
          >
            <CloseIcon className="size-4" />
          </button>
        ) : null}
      </label>

      <div className="flex flex-wrap gap-1.5" role="tablist" aria-label={t('nav.search')}>
        {SCOPES.map((item) => {
          const selected = scope === item
          const count = counts[item]

          return (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={selected}
              onClick={() => onScopeChange(item)}
              className={cn(
                'inline-flex h-8 cursor-pointer items-center gap-1.5 rounded-lg px-3 text-[13px] font-semibold transition-colors duration-200',
                selected
                  ? 'bg-[#2860B9] text-white'
                  : 'border border-[#e4ecf6] bg-[#f7fafc] text-[#5b6b82] hover:bg-[#eef5fc] hover:text-[#1d4f9a]',
              )}
            >
              {t(SCOPE_LABEL[item])}
              <span className={cn('tabular-nums', selected ? 'text-white/80' : 'text-[#8b95a8]')}>{count}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
