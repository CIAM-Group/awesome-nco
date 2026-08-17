import { Link } from 'react-router-dom'
import { formatPartialDate, formatPublicDate, paperTimelineLabel, paradigmLabels, relationCount } from '../lib/data'
import type { Paper } from '../types'
import { InstitutionMarks } from './InstitutionMarks'

interface TimelinePaperCardProps {
  paper: Paper
}

export function TimelinePaperCard({ paper }: TimelinePaperCardProps) {
  const relatedCount = relationCount(paper.id)

  return (
    <article className={`timeline-paper-card timeline-paper-card--${paper.scope}`}>
      <Link to={`/papers/${paper.id}`} aria-label={`Read the ${paper.short_title} research note`}>
        <div className="timeline-paper-card__topline">
          <InstitutionMarks institutions={paper.institutions} />
          <span className="timeline-paper-card__public" title={paperTimelineLabel(paper)}>
            {paper.acceptance && <time dateTime={paper.acceptance.date}>Accepted {formatPartialDate(paper.acceptance.date)}</time>}
            {paper.acceptance && paper.arxiv_url && ' · '}
            {paper.arxiv_url && <time dateTime={paper.date}>arXiv {formatPublicDate(paper.date)}</time>}
          </span>
        </div>
        <h3>{paper.short_title}</h3>
        <p title={paper.title}>{paper.title}</p>
        <div className="timeline-paper-card__footer">
          <span>{paradigmLabels[paper.paradigm]}</span>
          <span>{relatedCount} relation{relatedCount === 1 ? '' : 's'}</span>
        </div>
      </Link>
    </article>
  )
}
