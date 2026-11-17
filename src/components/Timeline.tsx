import { useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { groupPapersByTimelineYear } from '../lib/data'
import { clearPages, pagination, scrollToListing, timelineSelection } from '../lib/pagination'
import type { Paper } from '../types'
import { TimelinePaperCard } from './TimelinePaperCard'
import { Pagination } from './Pagination'

export function Timeline({ papers }: { papers: Paper[] }) {
  const [params, setParams] = useSearchParams()
  const groups = useMemo(() => groupPapersByTimelineYear(papers), [papers])
  const years = groups.map(group => group.year)
  const { selected, opened } = timelineSelection(years, params)
  const openGroups = groups.filter(group => opened.includes(group.year))
  const oldest = openGroups[openGroups.length - 1]
  const previous = oldest ? groups[groups.findIndex(group => group.year === oldest.year) + 1] : undefined
  const oldestPage = oldest ? pagination(oldest.papers.length, params.get('page_' + oldest.year)) : undefined

  useEffect(() => {
    const next = new URLSearchParams(params)
    if (next.has('year') && selected !== undefined) next.set('year', String(selected))
    if (next.has('openYears')) {
      if (opened.length > 1) next.set('openYears', opened.join(','))
      else next.delete('openYears')
    }
    for (const key of [...next.keys()]) {
      if (key === 'page') { next.delete(key); continue }
      if (!key.startsWith('page_')) continue
      const group = openGroups.find(group => key === 'page_' + group.year)
      const page = group ? pagination(group.papers.length, next.get(key)).page : 1
      if (page === 1) next.delete(key)
      else next.set(key, String(page))
    }
    if (next.toString() !== params.toString()) setParams(next, { replace: true })
  }, [params, selected, opened.join(','), groups, setParams])

  function selectYear(year: number) {
    const next = clearPages(new URLSearchParams(params))
    next.set('year', String(year))
    setParams(next)
    scrollToListing('year-' + year)
  }

  function changePage(year: number, page: number) {
    const next = new URLSearchParams(params)
    next.set('year', String(year))
    if (page === 1) next.delete('page_' + year)
    else next.set('page_' + year, String(page))
    setParams(next)
    scrollToListing('year-' + year)
  }

  function openPrevious() {
    if (!previous) return
    const next = new URLSearchParams(params)
    next.set('year', String(previous.year))
    next.set('openYears', [...opened, previous.year].join(','))
    next.delete('page_' + previous.year)
    setParams(next)
    scrollToListing('year-' + previous.year)
  }

  return (
    <div className="timeline-layout">
      <aside className="year-index" aria-label="Browse by year">
        <span>Year</span>
        {groups.map(group => <button type="button" key={group.year} aria-current={group.year === selected ? 'date' : undefined} aria-label={'Show ' + group.year} onClick={() => selectYear(group.year)}>{group.year}</button>)}
      </aside>
      <div className="timeline-map">
        {openGroups.map(group => {
          const page = pagination(group.papers.length, params.get('page_' + group.year))
          return <section className="timeline-year listing-target" id={'year-' + group.year} key={group.year} data-year={group.year} aria-labelledby={'year-title-' + group.year}>
            <header className="timeline-year__marker">
              <h2 id={'year-title-' + group.year}>{group.year}</h2>
              <span>{group.papers.length} paper{group.papers.length === 1 ? '' : 's'}</span>
            </header>
            <div className="timeline-year__papers">
              {group.papers.slice(page.start, page.end).map((paper, index) => <div className={'timeline-entry timeline-entry--' + (index % 2 === 0 ? 'left' : 'right')} key={paper.id}><TimelinePaperCard paper={paper} /></div>)}
            </div>
            <Pagination {...page} label={String(group.year) + ' papers'} onChange={number => changePage(group.year, number)} />
          </section>
        })}
        {previous && oldestPage?.page === oldestPage?.pageCount && <div className="continue-year">
          <p>Continue browsing earlier work?</p>
          <button type="button" onClick={openPrevious}>Continue to {previous.year}</button>
        </div>}
      </div>
    </div>
  )
}
