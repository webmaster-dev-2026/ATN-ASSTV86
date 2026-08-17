import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageFrame } from '@/components/layout/PageFrame'
import { SearchBar } from '@/features/search/components/SearchBar'
import { SearchDetail } from '@/features/search/components/SearchDetail'
import { SearchIdle } from '@/features/search/components/SearchIdle'
import { SearchResults } from '@/features/search/components/SearchResults'
import { countHits, matchesQuery } from '@/features/search/format'
import { getSearchData } from '@/features/search/getSearchData'
import { cn } from '@/lib/cn'
import type { SearchScope } from '@/features/search/types'

const catalog = getSearchData()

function isScope(value: string | null): value is SearchScope {
  return value === 'all' || value === 'dossier' || value === 'document' || value === 'anomaly' || value === 'employee'
}

export function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const scope: SearchScope = isScope(searchParams.get('type')) ? (searchParams.get('type') as SearchScope) : 'all'
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const matched = useMemo(
    () => catalog.hits.filter((hit) => matchesQuery(hit, query)),
    [query],
  )
  const counts = useMemo(() => countHits(matched), [matched])
  const filtered = useMemo(() => {
    const items = scope === 'all' ? matched : matched.filter((hit) => hit.kind === scope)
    return [...items].sort((left, right) => right.at.localeCompare(left.at))
  }, [matched, scope])

  const selected = filtered.find((hit) => hit.id === selectedId) ?? null
  const browsing = query.trim().length > 0 || scope !== 'all'

  useEffect(() => {
    setSelectedId((current) => {
      if (current && filtered.some((hit) => hit.id === current)) {
        return current
      }
      return filtered[0]?.id ?? null
    })
  }, [filtered])

  const patchParams = (nextQuery: string, nextScope: SearchScope) => {
    setSearchParams(
      (current) => {
        const next = new URLSearchParams(current)
        if (nextQuery.trim()) {
          next.set('q', nextQuery)
        } else {
          next.delete('q')
        }
        if (nextScope === 'all') {
          next.delete('type')
        } else {
          next.set('type', nextScope)
        }
        return next
      },
      { replace: true },
    )
  }

  return (
    <PageFrame className="xl:overflow-hidden">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-4">
        <SearchBar
          query={query}
          scope={scope}
          counts={counts}
          onQueryChange={(value) => patchParams(value, scope)}
          onScopeChange={(value) => patchParams(query, value)}
        />

        {browsing ? (
          <div
            className={cn(
              'grid min-h-0 min-w-0 flex-1 grid-cols-1 gap-4',
              selected && 'xl:grid-cols-[minmax(0,1.55fr)_minmax(0,0.9fr)]',
            )}
          >
            <SearchResults
              items={filtered}
              selectedId={selectedId}
              onSelect={(id) => {
                setSelectedId((current) => (current === id ? null : id))
              }}
            />
            {selected ? <SearchDetail item={selected} /> : null}
          </div>
        ) : (
          <SearchIdle
            latest={catalog.latest}
            onSelectQuery={(value) => {
              patchParams(value, 'all')
            }}
          />
        )}
      </div>
    </PageFrame>
  )
}
