import { describe, expect, it } from 'vitest'
import { filterPapers, filtersFromSearchParams, groupPapersByPublicYear } from './data'
import type { Paper } from '../types'

const base: Paper = {
  id: 'sample',
  short_title: 'Sample',
  title: 'A Sample Routing Paper',
  authors: ['Ada Researcher'],
  year: 2025,
  date: '2024-01-01',
  venue: 'ICLR',
  paper_url: 'https://example.com/paper.pdf',
  institutions: ['Example University'],
  scope: 'specialist',
  paradigm: 'constructive',
  problem_families: ['Routing'],
  problems: ['Traveling Salesman Problem'],
  summary: 'Builds routing solutions.',
  note_path: 'specialist/sample.md',
  body_html: '<h2>Motivation</h2>',
}

describe('paper filters', () => {
  it.each(['sample', 'ada', 'iclr', 'example university', 'traveling salesman'])('searches across metadata using %s', (query) => {
    expect(filterPapers([base], { query, paradigm: 'all', family: 'all', year: 'all' })).toHaveLength(1)
  })

  it('combines paradigm, family, and public-year filters', () => {
    expect(filterPapers([base], { query: '', paradigm: 'constructive', family: 'Routing', year: '2024' })).toHaveLength(1)
    expect(filterPapers([base], { query: '', paradigm: 'improvement', family: 'Routing', year: '2024' })).toHaveLength(0)
  })

  it('returns an empty result for a query with no match', () => {
    expect(filterPapers([base], { query: 'scheduling', paradigm: 'all', family: 'all', year: 'all' })).toEqual([])
  })

  it('restores valid filter state from a shareable URL and rejects stale values', () => {
    const options = { paradigms: ['constructive'], families: ['Routing'], years: ['2024'] }
    const restored = filtersFromSearchParams(new URLSearchParams('q=route&paradigm=constructive&family=Routing&year=2024'), options)
    expect(restored).toEqual({ query: 'route', paradigm: 'constructive', family: 'Routing', year: '2024' })

    const stale = filtersFromSearchParams(new URLSearchParams('paradigm=hybrid&family=Unknown&year=1999'), options)
    expect(stale).toEqual({ query: '', paradigm: 'all', family: 'all', year: 'all' })
  })
})

describe('timeline grouping', () => {
  it('groups by first-public year and keeps newest years first', () => {
    const older = { ...base, id: 'older', date: '2021-01-01' }
    const groups = groupPapersByPublicYear([older, base])
    expect(groups.map((group) => group.year)).toEqual([2024, 2021])
  })
})
