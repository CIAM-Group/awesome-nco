import { useMemo } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { FilterBar } from '../components/FilterBar'
import { PageMeta } from '../components/PageMeta'
import { Pagination } from '../components/Pagination'
import { citationEvidenceLabel, citationEvidenceUrl, getPaper, papers, relationKindLabels, relations, uniqueValues } from '../lib/data'
import { clearPages } from '../lib/pagination'
import { usePagination } from '../lib/usePagination'

const indexedRelations = relations.map(relation => ({
  relation,
  endpoints: relation.papers.map(id => getPaper(id)!),
  searchable: [relation.description, ...relation.papers.flatMap(id => {
    const paper = getPaper(id)!
    return [paper.short_title, paper.title]
  })].join(' ').toLowerCase(),
}))

export function RelationsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') ?? ''
  const families = useMemo(() => uniqueValues(papers.flatMap(paper => paper.problem_families)), [])
  const requestedFamily = searchParams.get('family') ?? 'all'
  const family = families.includes(requestedFamily) ? requestedFamily : 'all'
  const requestedScope = searchParams.get('scope') ?? 'all'
  const scope = ['specialist', 'generalist', 'study'].includes(requestedScope) ? requestedScope : 'all'

  const filtered = useMemo(() => indexedRelations.filter(({ endpoints, searchable }) =>
    (!query.trim() || searchable.includes(query.trim().toLowerCase()))
    && (family === 'all' || endpoints.some(paper => paper.problem_families.includes(family)))
    && (scope === 'all' || endpoints.some(paper => paper.scope === scope)),
  ).map(item => item.relation), [query, family, scope])
  const page = usePagination(filtered, 'citation-register')

  function updateFilter(key: string, value: string) {
    const next = clearPages(new URLSearchParams(searchParams))
    next.delete('inclusion')
    next.delete('kind')
    const param = key === 'query' ? 'q' : key
    if (!value || value === 'all') next.delete(param)
    else next.set(param, value)
    setSearchParams(next, { replace: true })
  }

  return (
    <div className="relations-page">
      <PageMeta title="Citations" description="Browse citations and original source evidence within the collection." />
      <header className="directory-heading page-shell">
        <p className="eyebrow">Research connections</p>
        <h1>Paper citations</h1>
        <p>Browse the papers cited within this collection. Each entry links the citing paper to its reference and the original source evidence.</p>
      </header>
      <section className="relations-workbench page-shell" aria-label="Paper citations explorer">
        <FilterBar
          query={query}
          searchPlaceholder="Paper title, method, or citation description"
          selects={[
            { key: 'scope', label: 'Connected collection', value: scope, options: [{ value: 'all', label: 'All collections' }, { value: 'specialist', label: 'Specialist' }, { value: 'generalist', label: 'Generalist' }, { value: 'study', label: 'Research Studies' }] },
            { key: 'family', label: 'Problem family', value: family, options: [{ value: 'all', label: 'All problem families' }, ...families.map(value => ({ value, label: value }))] },
          ]}
          resultCount={filtered.length}
          onChange={updateFilter}
          onReset={() => setSearchParams({}, { replace: true })}
        />
        <div id="citation-register" className="listing-target">
          <section className="relation-register" aria-labelledby="relation-register-title">
            <div className="section-heading section-heading--inline"><h2 id="relation-register-title">Citation register</h2><span>{filtered.length} citations</span></div>
            {filtered.length > 0 ? <>
              <Pagination {...page} label="Citations" />
              <div className="relation-list">
                {page.items.map(relation => {
                  const first = getPaper(relation.citing)!
                  const second = getPaper(relation.cited)!
                  return <article className="relation-row" key={relation.citing + ':' + relation.cited}>
                    <span className="relation-kind">{relationKindLabels[relation.kind]}</span>
                    <div><h3><Link to={'/papers/' + first.id}>{first.short_title}</Link><span aria-hidden="true"> → </span><Link to={'/papers/' + second.id}>{second.short_title}</Link></h3>
                      <p>{relation.description}</p>
                      {relation.evidence.map((item, index) => <p key={index}><a href={citationEvidenceUrl(item)} target="_blank" rel="noreferrer">{citationEvidenceLabel(item)} · {item.locator} · Reference {relation.reference_label}</a></p>)}
                    </div>
                  </article>
                })}
              </div>
              <Pagination {...page} label="Citations" />
            </> : <div className="empty-state"><strong>No citations match this view.</strong><p>Clear the search or select broader filters.</p><button type="button" onClick={() => setSearchParams({}, { replace: true })}>Reset filters</button></div>}
          </section>
        </div>
      </section>
    </div>
  )
}
