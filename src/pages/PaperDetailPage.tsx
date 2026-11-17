import { ArrowLeft, Code2, ExternalLink, FileText } from 'lucide-react'
import { Link, Navigate, useParams } from 'react-router-dom'
import { PageMeta } from '../components/PageMeta'
import { assetUrl, citationEvidenceLabel, citationEvidenceUrl, formatPartialDate, formatPublicDate, fullTextReviewComplete, getPaper, paperClassification, scopePath, relatedPaperId, relationsForPaper, scopeLabels, scopeShortLabels, reviewStatusLabels, reviewRecordUrl } from '../lib/data'

export function PaperDetailPage() {
  const { id } = useParams()
  const paper = id ? getPaper(id) : undefined
  if (!paper) return <Navigate to="/" replace />
  const related = relationsForPaper(paper.id)

  return (
    <div className={`paper-detail paper-detail--${paper.scope} page-shell`}>
      <PageMeta title={paper.short_title} description={paper.summary} />
      <Link className="back-link" to={paper.inclusion === 'reference' ? '/references' : scopePath(paper.scope)}><ArrowLeft size={15} aria-hidden="true" /> Back to {paper.inclusion === 'reference' ? 'reference collection' : `${scopeShortLabels[paper.scope]} timeline`}</Link>
      <header className="paper-detail__header">
        <p className="eyebrow">{scopeLabels[paper.scope]}</p>
        <h1>{paper.title}</h1>
        <p>{paper.authors.join(' · ')}</p>
      </header>
      <p className={`review-notice review-notice--${paper.review_status}`}><strong>{reviewStatusLabels[paper.review_status]}.</strong> <a href={reviewRecordUrl(paper.id)} target="_blank" rel="noreferrer">Read the source evidence and review record</a>.{paper.inclusion === 'reference' && <> Reference collection: {paper.inclusion_reason}</>}</p>

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
      {(['outgoing', 'incoming'] as const).map(direction => {
        const entries = related.filter(relation => direction === 'outgoing' ? relation.citing === paper.id : relation.cited === paper.id)
        return <section className="related-papers" key={direction} aria-label={direction === 'outgoing' ? 'References in this collection' : 'Cited by this collection'}>
          <p className="eyebrow">Verified in-text citations</p>
          <h2>{direction === 'outgoing' ? 'References in this collection' : 'Cited by this collection'}</h2>
          {entries.length === 0 && <p>No verified internal citations recorded in this direction.{!fullTextReviewComplete && ' Citation coverage remains provisional while the full collection is reviewed.'}</p>}
          <div className="related-papers__grid">
            {entries.map((relation) => {
              const relatedPaper = getPaper(relatedPaperId(relation, paper.id))!
              return <article className="related-paper-card" key={relatedPaper.id}><span>{direction === 'outgoing' ? 'Cites' : 'Cited by'}</span><h3><Link to={`/papers/${relatedPaper.id}`}>{relatedPaper.short_title}</Link></h3><p className="related-paper-card__title">{relatedPaper.title}</p><p>{relation.description}</p>{relation.evidence.map((item, index) => <p key={index}><a href={citationEvidenceUrl(item)} target="_blank" rel="noreferrer">{citationEvidenceLabel(item)} · {item.locator}</a></p>)}</article>
            })}
          </div>
        </section>
      })}
    </div>
  )
}
