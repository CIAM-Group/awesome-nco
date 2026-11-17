import { ArrowLeft, Code2, ExternalLink, FileText } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { Pagination } from '../components/Pagination'
import { usePagination } from '../lib/usePagination'
import type { Paper } from '../types'
import { assetUrl, citationEvidenceLabel, citationEvidenceUrl, formatPartialDate, formatPublicDate, getPaper, paperClassification, scopePath, outgoingReferences, scopeLabels, scopeShortLabels } from '../lib/data'

export function PaperDetailPage() {
  const { id } = useParams()
  const paper = id ? getPaper(id) : undefined
  if (!paper) return <Navigate to="/papers" replace />
  return <PaperArticle key={paper.id} paper={paper} />
}

function PaperArticle({ paper }: { paper: Paper }) {
  const page = usePagination(outgoingReferences(paper.id), 'paper-references')

  return (
    <div className={`paper-detail paper-detail--${paper.scope} page-shell`}>
      <PageMeta title={paper.short_title} description={paper.summary} />
      <Link className="back-link" to={scopePath(paper.scope)}><ArrowLeft size={15} aria-hidden="true" /> Back to {scopeShortLabels[paper.scope]} timeline</Link>
      <header className="paper-detail__header">
        <p className="eyebrow">{scopeLabels[paper.scope]}</p>
        <h1>{paper.title}</h1>
        <p>{paper.authors.join(' · ')}</p>
      </header>

      <div className="paper-detail__layout">
        <aside className="paper-metadata" aria-label="Paper metadata">
          <dl>
            <div><dt>Venue</dt><dd>{paper.venue} {paper.year}</dd></div>
            <div><dt>Accepted</dt><dd>{paper.acceptance ? <a href={paper.acceptance.source_url} target="_blank" rel="noreferrer"><time dateTime={paper.acceptance.date}>{formatPartialDate(paper.acceptance.date)}</time></a> : '—'}</dd></div>
            {paper.publication && <div><dt>Published</dt><dd><a href={paper.publication.source_url} target="_blank" rel="noreferrer"><time dateTime={paper.publication.date}>{formatPartialDate(paper.publication.date)}</time></a></dd></div>}
            <div><dt>Preprint</dt><dd>{paper.arxiv_url ? <a href={paper.arxiv_url} target="_blank" rel="noreferrer"><time dateTime={paper.date}>{formatPublicDate(paper.date)}</time></a> : '—'}</dd></div>
            <div><dt>Scope</dt><dd>{scopeShortLabels[paper.scope]}</dd></div>
            <div><dt>{paper.scope === 'study' ? 'Paper type' : 'Paradigm'}</dt><dd>{paperClassification(paper)}</dd></div>
            <div><dt>Institutions</dt><dd>{paper.institutions.join(' · ')}</dd></div>
            <div><dt>Problem families</dt><dd>{paper.problem_families.join(' · ')}</dd></div>
            <div><dt>Problems</dt><dd>{paper.problems.join(' · ')}</dd></div>
          </dl>
          <nav className="paper-resources" aria-label="Paper resources">
            <a href={paper.paper_url} target="_blank" rel="noreferrer"><FileText size={15} /> Paper <ExternalLink size={12} /></a>
            {paper.arxiv_url && <a href={paper.arxiv_url} target="_blank" rel="noreferrer"><FileText size={15} /> arXiv <ExternalLink size={12} /></a>}
            {paper.code_url && <a href={paper.code_url} target="_blank" rel="noreferrer"><Code2 size={15} /> Code <ExternalLink size={12} /></a>}
          </nav>
        </aside>
        <div className="paper-detail__content">
          {paper.figure && (
            <figure className="paper-figure">
              <img src={assetUrl(paper.figure.path)} alt={paper.figure.alt} />
              <figcaption>{paper.figure.caption} <a href={paper.figure.source_url} target="_blank" rel="noreferrer">View original paper</a></figcaption>
            </figure>
          )}
          <article className="paper-note" dangerouslySetInnerHTML={{ __html: paper.body_html }} />
        </div>
      </div>
      <section className="related-papers listing-target" id="paper-references" aria-label="References in this collection">
          <h2>References in this collection</h2>
          {page.total === 0 && <p>No references to papers in this collection.</p>}
          <div className="related-papers__grid">
            {page.items.map((relation) => {
              const relatedPaper = getPaper(relation.cited)!
              return <article className="related-paper-card" key={relatedPaper.id}><span>Cites</span><h3><Link to={`/papers/${relatedPaper.id}`}>{relatedPaper.short_title}</Link></h3><p className="related-paper-card__title">{relatedPaper.title}</p><p>{relation.description}</p>{relation.evidence.map((item, index) => <p key={index}><a href={citationEvidenceUrl(item)} target="_blank" rel="noreferrer">{citationEvidenceLabel(item)} · {item.locator}</a></p>)}</article>
            })}
          </div>
          <Pagination {...page} label="References" />
        </section>
    </div>
  )
}
