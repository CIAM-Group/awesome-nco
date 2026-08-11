import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FilterBar } from '../components/FilterBar'
import { InstitutionMarks } from '../components/InstitutionMarks'
import { PageMeta } from '../components/PageMeta'
import {
  compactVenue,
  filterPapers,
  filtersFromSearchParams,
  formatPublicDate,
  papers,
  paradigmLabels,
  publicYear,
  scopeShortLabels,
  uniqueValues,
} from '../lib/data'
import type { PaperFilters } from '../types'

export function PapersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const families = useMemo(() => uniqueValues(papers.flatMap((paper) => paper.problem_families)), [])
  const years = useMemo(() => uniqueValues(papers.map((paper) => String(publicYear(paper)))).sort((a, b) => Number(b) - Number(a)), [])
  const filters = filtersFromSearchParams(searchParams, {
    scopes: ['specialist', 'generalist'],
    paradigms: Object.keys(paradigmLabels),
    families,
    years,
  })
  const filtered = filterPapers(papers, filters)

  function updateFilter(key: string, value: string) {
    const keyMap: Record<keyof PaperFilters, string> = { query: 'q', scope: 'scope', paradigm: 'paradigm', family: 'family', year: 'year' }
    const param = keyMap[key as keyof PaperFilters]
    const next = new URLSearchParams(searchParams)
    if (value === '' || value === 'all') next.delete(param)
    else next.set(param, value)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="directory-page">
      <PageMeta title="Papers" description="Search and filter every paper in the Awesome NCO research index." />
      <header className="directory-heading directory-heading--papers page-shell">
        <p className="eyebrow">Complete collection</p>
        <h1>All papers</h1>
        <p>A compact, searchable directory of every specialist and generalist method in the collection.</p>
      </header>
      <section className="directory-workbench page-shell" aria-label="All papers">
        <FilterBar
          query={filters.query}
          selects={[
            { key: 'scope', label: 'Scope', value: filters.scope, options: [{ value: 'all', label: 'All scopes' }, { value: 'specialist', label: 'Specialist' }, { value: 'generalist', label: 'Generalist' }] },
            { key: 'paradigm', label: 'Paradigm', value: filters.paradigm, options: [{ value: 'all', label: 'All paradigms' }, ...Object.entries(paradigmLabels).map(([value, label]) => ({ value, label }))] },
            { key: 'family', label: 'Problem family', value: filters.family, options: [{ value: 'all', label: 'All problem families' }, ...families.map((value) => ({ value, label: value }))] },
            { key: 'year', label: 'First public', value: filters.year, options: [{ value: 'all', label: 'All public years' }, ...years.map((value) => ({ value, label: value }))] },
          ]}
          resultCount={filtered.length}
          onChange={updateFilter}
          onReset={() => setSearchParams({}, { replace: true })}
        />
        {filtered.length > 0 ? (
          <div className="paper-table-wrap">
            <table className="paper-table">
              <thead><tr><th>Paper</th><th>Institution</th><th>Scope</th><th>Paradigm</th><th>Problem family</th><th>Public</th><th>Venue</th><th>Resources</th></tr></thead>
              <tbody>
                {filtered.map((paper) => (
                  <tr key={paper.id}>
                    <th scope="row"><Link to={`/papers/${paper.id}`}><strong>{paper.short_title}</strong><span>{paper.title}</span></Link></th>
                    <td className="paper-table__institution"><InstitutionMarks institutions={paper.institutions} /></td>
                    <td><span className={`scope-chip scope-chip--${paper.scope}`}>{scopeShortLabels[paper.scope]}</span></td>
                    <td>{paradigmLabels[paper.paradigm]}</td>
                    <td>{paper.problem_families.join(', ')}</td>
                    <td><time dateTime={paper.date}>{formatPublicDate(paper.date)}</time></td>
                    <td><span className="paper-table__venue" title={paper.venue}>{compactVenue(paper.venue)}</span></td>
                    <td><div className="table-resources"><a href={paper.paper_url} target="_blank" rel="noreferrer">Paper</a>{paper.code_url && <a href={paper.code_url} target="_blank" rel="noreferrer">Code</a>}<Link to={`/papers/${paper.id}`}>Note</Link></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="empty-state"><strong>No papers match this view.</strong><p>Clear the search or select broader filters.</p><button type="button" onClick={() => setSearchParams({}, { replace: true })}>Reset filters</button></div>
        )}
      </section>
    </div>
  )
}
