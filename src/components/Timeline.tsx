import { groupPapersByTimelineYear } from '../lib/data'
import type { Paper } from '../types'
import { TimelinePaperCard } from './TimelinePaperCard'

interface TimelineProps {
  papers: Paper[]
}

export function Timeline({ papers }: TimelineProps) {
  const groups = groupPapersByTimelineYear(papers)
  let paperIndex = 0

  return (
    <div className="timeline-layout">
      <aside className="year-index" aria-label="Jump to timeline year">
        <span>Year</span>
        {groups.map((group) => <a href={`#year-${group.year}`} key={group.year}>{group.year}</a>)}
      </aside>
      <div className="timeline-map">
        {groups.map((group) => (
          <section className="timeline-year" id={`year-${group.year}`} key={group.year} aria-labelledby={`year-title-${group.year}`}>
            <header className="timeline-year__marker">
              <h2 id={`year-title-${group.year}`}>{group.year}</h2>
              <span>{group.papers.length} paper{group.papers.length === 1 ? '' : 's'}</span>
            </header>
            <div className="timeline-year__papers">
              {group.papers.map((paper) => {
                const side = paperIndex % 2 === 0 ? 'left' : 'right'
                paperIndex += 1
                return (
                  <div className={`timeline-entry timeline-entry--${side}`} key={paper.id}>
                    <TimelinePaperCard paper={paper} />
                  </div>
                )
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
