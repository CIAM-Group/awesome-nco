import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FilterBar } from '../components/FilterBar'
import { PageMeta } from '../components/PageMeta'
import { Timeline } from '../components/Timeline'
import {
  filterPapers,
  filtersFromSearchParams,
  papersForScope,
  paradigmLabels,
  scopeDescriptions,
  scopeLabels,
  timelineYear,
  uniqueValues,
} from '../lib/data'
import type { PaperFilters, Scope } from '../types'

interface CollectionPageProps {
  scope: Scope
}

export function CollectionPage({ scope }: CollectionPageProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const source = useMemo(() => papersForScope(scope), [scope])
  const families = useMemo(() => uniqueValues(source.flatMap((paper) => paper.problem_families)), [source])
  const years = useMemo(() => uniqueValues(source.map((paper) => String(timelineYear(paper)))).sort((a, b) => Number(b) - Number(a)), [source])
  const paradigmValues = Object.keys(paradigmLabels)

  const filters = filtersFromSearchParams(searchParams, { paradigms: paradigmValues, families, years })

  const filtered = filterPapers(source, filters)

  function updateFilter(key: string, value: string) {
    const typedKey = key as keyof PaperFilters
    const keyMap: Record<keyof PaperFilters, string> = { query: 'q', scope: 'scope', paradigm: 'paradigm', family: 'family', year: 'year' }
    const next = new URLSearchParams(searchParams)
    if (value === '' || value === 'all') next.delete(keyMap[typedKey])
    else next.set(keyMap[typedKey], value)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className={`collection-page collection-page--${scope}`}>
      <PageMeta title={scopeLabels[scope]} description={scopeDescriptions[scope]} />
      <header className="collection-heading page-shell">
        <p className="eyebrow">{scope === 'specialist' ? 'Single-problem training' : 'Cross-problem models'}</p>
        <h1>{scopeLabels[scope]}</h1>
        <p>{scopeDescriptions[scope]}</p>
        <div className="collection-heading__links">
          <a href={`https://github.com/CIAM-Group/awesome-nco/blob/main/${scope}/README.md`} target="_blank" rel="noreferrer">Read the inclusion criteria</a>
          <Link to={scope === 'specialist' ? '/generalist' : '/specialist'}>Compare with {scope === 'specialist' ? 'generalist' : 'specialist'} solvers</Link>
        </div>
      </header>

      <section className="collection-workbench page-shell" aria-label={`${scopeLabels[scope]} timeline`}>
        <FilterBar
          query={filters.query}
          selects={[
            {
              key: 'paradigm', label: 'Paradigm', value: filters.paradigm,
              options: [{ value: 'all', label: 'All paradigms' }, ...Object.entries(paradigmLabels).map(([value, label]) => ({ value, label }))],
            },
            {
              key: 'family', label: 'Problem family', value: filters.family,
              options: [{ value: 'all', label: 'All problem families' }, ...families.map((value) => ({ value, label: value }))],
            },
            {
              key: 'year', label: 'Timeline year', value: filters.year,
              options: [{ value: 'all', label: 'All timeline years' }, ...years.map((value) => ({ value, label: value }))],
            },
          ]}
          resultCount={filtered.length}
          onChange={updateFilter}
          onReset={() => setSearchParams({}, { replace: true })}
        />
        {filtered.length > 0 ? <Timeline papers={filtered} /> : (
          <div className="empty-state">
            <strong>No papers match this view.</strong>
            <p>Clear the search or select broader filters.</p>
            <button type="button" onClick={() => setSearchParams({}, { replace: true })}>Reset filters</button>
          </div>
        )}
      </section>
    </div>
  )
}
