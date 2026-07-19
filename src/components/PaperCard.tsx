import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { formatPublicDate, paradigmLabels, scopeShortLabels } from '../lib/data'
import type { Paper } from '../types'

interface PaperCardProps {
  paper: Paper
  side?: 'left' | 'right'
  compact?: boolean
}

export function PaperCard({ paper, side = 'right', compact = false }: PaperCardProps) {
  const className = [
    'paper-card',
    `paper-card--${paper.scope}`,
    `paper-card--${side}`,
    compact ? 'paper-card--compact' : '',
  ].filter(Boolean).join(' ')

  return (
    <article className={className}>
      <Link to={`/papers/${paper.id}`} aria-label={`Read the ${paper.short_title} research note`}>
        <span className="paper-card__topline">
          <span>{scopeShortLabels[paper.scope]}</span>
          <time dateTime={paper.date}>{formatPublicDate(paper.date)}</time>
        </span>
        <h3>{paper.short_title}</h3>
        <p className="paper-card__title">{paper.title}</p>
        {!compact && <p className="paper-card__summary">{paper.summary}</p>}
        <dl className="paper-card__metadata">
          <div><dt>Venue</dt><dd>{paper.venue} {paper.year}</dd></div>
          <div><dt>Institution</dt><dd>{paper.institutions[0]}{paper.institutions.length > 1 ? ` +${paper.institutions.length - 1}` : ''}</dd></div>
        </dl>
        <div className="paper-card__footer">
          <span>{paradigmLabels[paper.paradigm]}</span>
          <span>{paper.problem_families.slice(0, 2).join(' · ')}{paper.problem_families.length > 2 ? ` +${paper.problem_families.length - 2}` : ''}</span>
        </div>
        <ArrowUpRight className="paper-card__arrow" size={17} aria-hidden="true" />
      </Link>
    </article>
  )
}
