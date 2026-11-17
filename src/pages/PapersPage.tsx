import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FilterBar } from '../components/FilterBar'
import { InstitutionMarks } from '../components/InstitutionMarks'
import { PageMeta } from '../components/PageMeta'
import { Pagination } from '../components/Pagination'
import { usePagination } from '../lib/usePagination'
import { clearPages } from '../lib/pagination'
import {
  compactProblemFamily,
  compactVenue,
  filterPapers,
  filtersFromSearchParams,
  formatPartialDate,
  formatPublicDate,
  papers,
  paradigmLabels,
  paperClassification,
  paperTypeLabels,
  scopeShortLabels,
  timelineYear,
  uniqueValues,
} from '../lib/data'
import type { PaperFilters } from '../types'

export function PapersPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const families = useMemo(() => uniqueValues(papers.flatMap((paper) => paper.problem_families)), [])
  const years = useMemo(() => uniqueValues(papers.map((paper) => String(timelineYear(paper)))).sort((a, b) => Number(b) - Number(a)), [])
  const filters = filtersFromSearchParams(searchParams, {
    scopes: ['specialist', 'generalist', 'study'],
    paradigms: Object.keys(paradigmLabels),
    families,
    years,
  })
  filters.inclusion = 'main'
  const filtered = filterPapers(papers, filters)
  const page = usePagination(filtered, 'papers-results')

  function updateFilter(key: string, value: string) {
    const keyMap: Record<keyof PaperFilters, string> = { query: 'q', scope: 'scope', paradigm: 'paradigm', family: 'family', year: 'year', type: 'type', inclusion: 'inclusion' }
    const param = keyMap[key as keyof PaperFilters]
    const next = clearPages(new URLSearchParams(searchParams))
    next.delete('inclusion')
    if (value === '' || (key === 'inclusion' ? value === 'main' : value === 'all')) next.delete(param)
    else next.set(param, value)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="directory-page">
      <PageMeta title="Papers" description="Search neural combinatorial optimization papers and research studies." />
      <header className="directory-heading directory-heading--papers page-shell">
        <p className="eyebrow">Complete collection</p>
        <h1>All papers</h1>
        <p>A searchable directory of specialist and generalist solvers, theory, benchmarks, and analyses.</p>
      </header>
      <section className="directory-workbench page-shell" aria-label="All papers">
        <FilterBar
          query={filters.query}
          selects={[
            { key: 'scope', label: 'Scope', value: filters.scope, options: [{ value: 'all', label: 'All scopes' }, { value: 'specialist', label: 'Specialist' }, { value: 'generalist', label: 'Generalist' }, { value: 'study', label: 'Research Studies' }] },
            { key: 'type', label: 'Paper type', value: filters.type ?? 'all', options: [{ value: 'all', label: 'All paper types' }, ...Object.entries(paperTypeLabels).map(([value, label]) => ({ value, label }))] },
            { key: 'paradigm', label: 'Paradigm', value: filters.paradigm, options: [{ value: 'all', label: 'All paradigms' }, ...Object.entries(paradigmLabels).map(([value, label]) => ({ value, label }))] },
            { key: 'family', label: 'Problem family', value: filters.family, options: [{ value: 'all', label: 'All problem families' }, ...families.map((value) => ({ value, label: value }))] },
            { key: 'year', label: 'Timeline year', value: filters.year, options: [{ value: 'all', label: 'All timeline years' }, ...years.map((value) => ({ value, label: value }))] },
          ]}
          resultCount={filtered.length}
          onChange={updateFilter}
          onReset={() => setSearchParams({}, { replace: true })}
        />
        {filtered.length > 0 ? (
          <div id="papers-results" className="listing-target">
            <Pagination {...page} label="Papers" />
          <div className="paper-table-wrap">
            <table className="paper-table">
              <thead><tr><th>Paper</th><th>Institution</th><th>Scope</th><th>Paradigm / Type</th><th>Problem family</th><th>Accepted</th><th>Published</th><th>Preprint</th><th>Venue</th><th>Resources</th></tr></thead>
              <tbody>
                {page.items.map((paper) => (
                  <tr key={paper.id}>
                    <th scope="row"><Link to={`/papers/${paper.id}`}><strong>{paper.short_title}</strong><span>{paper.title}</span></Link></th>
                    <td className="paper-table__institution"><InstitutionMarks institutions={paper.institutions} /></td>
                    <td><span className={`scope-chip scope-chip--${paper.scope}`}>{scopeShortLabels[paper.scope]}</span></td>
                    <td>{paperClassification(paper)}</td>
                    <td className="paper-table__family"><span title={paper.problem_families.join(', ')} aria-label={paper.problem_families.join(', ')}>{paper.problem_families.map(compactProblemFamily).join(', ')}</span></td>
                    <td className="paper-table__date">{paper.acceptance ? <a href={paper.acceptance.source_url} target="_blank" rel="noreferrer"><time dateTime={paper.acceptance.date}>{formatPartialDate(paper.acceptance.date)}</time></a> : <span aria-label="Acceptance date not documented">—</span>}</td>
                    <td className="paper-table__date">{paper.publication ? <a href={paper.publication.source_url} target="_blank" rel="noreferrer"><time dateTime={paper.publication.date}>{formatPartialDate(paper.publication.date)}</time></a> : <span aria-label="Publication date not documented">—</span>}</td>
                    <td className="paper-table__date">{paper.arxiv_url ? <a href={paper.arxiv_url} target="_blank" rel="noreferrer"><time dateTime={paper.date}>{formatPublicDate(paper.date)}</time></a> : <span aria-label="No arXiv preprint">—</span>}</td>
                    <td><span className="paper-table__venue" title={paper.venue}>{compactVenue(paper.venue)}</span></td>
                    <td><div className="table-resources"><a href={paper.paper_url} target="_blank" rel="noreferrer">Paper</a>{paper.code_url && <a href={paper.code_url} target="_blank" rel="noreferrer">Code</a>}<Link to={`/papers/${paper.id}`}>Note</Link></div></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
            <Pagination {...page} label="Papers" />
          </div>
        ) : (
          <div className="empty-state"><strong>No papers match this view.</strong><p>Clear the search or select broader filters.</p><button type="button" onClick={() => setSearchParams({}, { replace: true })}>Reset filters</button></div>
        )}
      </section>
    </div>
  )
}
