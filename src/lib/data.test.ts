import { describe, expect, it } from 'vitest'
import {
  compactProblemFamily,
  compactVenue,
  filterPapers,
  filtersFromSearchParams,
  formatPartialDate,
  groupPapersByTimelineYear,
  institutionInitials,
  paperTimelineLabel,
  papers,
  relatedPaperId,
  relationKindStyles,
  relationNodeRelSize,
  relationNodeValue,
  relationsForPaper,
} from './data'
import type { Paper, Relation } from '../types'

const base: Paper = {
  id: 'sample',
  short_title: 'Sample',
  title: 'A Sample Routing Paper',
  authors: ['Ada Researcher'],
  year: 2025,
  date: '2024-01-01',
  acceptance: { date: '2025-01-22', source_url: 'https://example.com/decision' },
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
    expect(filterPapers([base], { query, scope: 'all', paradigm: 'all', family: 'all', year: 'all' })).toHaveLength(1)
  })

  it('combines paradigm, family, and timeline-year filters', () => {
    expect(filterPapers([base], { query: '', scope: 'specialist', paradigm: 'constructive', family: 'Routing', year: '2025' })).toHaveLength(1)
    expect(filterPapers([base], { query: '', scope: 'generalist', paradigm: 'constructive', family: 'Routing', year: '2025' })).toHaveLength(0)
    expect(filterPapers([base], { query: '', scope: 'specialist', paradigm: 'improvement', family: 'Routing', year: '2025' })).toHaveLength(0)
  })

  it('returns an empty result for a query with no match', () => {
    expect(filterPapers([base], { query: 'scheduling', scope: 'all', paradigm: 'all', family: 'all', year: 'all' })).toEqual([])
  })

  it('restores valid filter state from a shareable URL and rejects stale values', () => {
    const options = { scopes: ['specialist', 'generalist'], paradigms: ['constructive'], families: ['Routing'], years: ['2025'] }
    const restored = filtersFromSearchParams(new URLSearchParams('q=route&scope=specialist&paradigm=constructive&family=Routing&year=2025'), options)
    expect(restored).toEqual({ query: 'route', scope: 'specialist', paradigm: 'constructive', family: 'Routing', year: '2025' })

    const stale = filtersFromSearchParams(new URLSearchParams('scope=archive&paradigm=hybrid&family=Unknown&year=1999'), options)
    expect(stale).toEqual({ query: '', scope: 'all', paradigm: 'all', family: 'all', year: 'all' })
  })
})

describe('paper relations', () => {
  const relation: Relation = {
    papers: ['sample', 'related'],
    kind: 'architecture',
    description: 'The methods share an autoregressive construction architecture.',
  }

  it('finds undirected relations from either endpoint', () => {
    expect(relationsForPaper('sample', [relation])).toEqual([relation])
    expect(relationsForPaper('related', [relation])).toEqual([relation])
  })

  it('returns the opposite endpoint independent of stored order', () => {
    expect(relatedPaperId(relation, 'sample')).toBe('related')
    expect(relatedPaperId(relation, 'related')).toBe('sample')
  })
})

describe('timeline grouping', () => {
  it('groups by acceptance year and falls back to first-public year for arXiv-only work', () => {
    const older = { ...base, id: 'older', date: '2020-01-01', acceptance: { date: '2021', source_url: 'https://example.com/older-decision' } }
    const preprint = { ...base, id: 'preprint', date: '2024-03-01', acceptance: undefined, venue: 'arXiv', arxiv_url: 'https://arxiv.org/abs/2403.00001' }
    const groups = groupPapersByTimelineYear([older, preprint, base])
    expect(groups.map((group) => group.year)).toEqual([2025, 2024, 2021])
  })
})

describe('compact paper metadata', () => {
  it('uses the agreed method abbreviations without changing stable ids', () => {
    expect(Object.fromEntries(papers.map((paper) => [paper.id, paper.short_title]))).toMatchObject({
      'neural-combinatorial-optimization': 'PN-AC',
      'rl-vrp': 'VRP-RL',
      'attention-model': 'AM',
      'dynamic-am': 'AM-D',
      'efficient-graph-convnet-tsp': 'GCN',
      'learning-heuristic': 'Learning Heuristic',
    })
  })

  it('shortens the long workshop venue and preserves other venues', () => {
    expect(compactVenue('AAAI Workshop on Deep Learning on Graphs: Methodologies and Applications')).toBe('AAAI Workshop')
    expect(compactVenue('NeurIPS')).toBe('NeurIPS')
  })

  it('uses compact academic problem-family labels only for long categories', () => {
    expect(compactProblemFamily('Multi-objective Optimization')).toBe('Multi-object. Opt.')
    expect(compactProblemFamily('Generative Optimization')).toBe('Generative Opt.')
    expect(compactProblemFamily('Robust Optimization')).toBe('Robust Opt.')
    expect(compactProblemFamily('Graph Optimization')).toBe('Graph Opt.')
    expect(compactProblemFamily('Subset Selection')).toBe('Subset Sel.')
    expect(compactProblemFamily('Routing')).toBe('Routing')
  })

  it('formats accepted and arXiv dates according to their available precision', () => {
    expect(formatPartialDate('2025')).toBe('2025')
    expect(formatPartialDate('2025-01')).toBe('Jan 2025')
    expect(formatPartialDate('2025-01-22')).toBe('Jan 2025')
    expect(paperTimelineLabel({ ...base, arxiv_url: 'https://arxiv.org/abs/2401.00001' })).toBe('Accepted Jan 2025 · arXiv Jan 2024')
    expect(paperTimelineLabel({ ...base, acceptance: undefined, venue: 'arXiv', arxiv_url: 'https://arxiv.org/abs/2401.00001' })).toBe('arXiv Jan 2024')
  })

  it('derives compact institution marks while ignoring connector words', () => {
    expect(institutionInitials('National University of Singapore')).toBe('NUS')
    expect(institutionInitials('University of Amsterdam')).toBe('UA')
    expect(institutionInitials('Zhejiang Cainiao Supply Chain Management Co. Ltd')).toBe('ZCS')
    expect(institutionInitials('A*STAR')).toBe('AST')
  })
})

describe('relation graph presentation', () => {
  it('gives every relation kind a distinct non-color line treatment', () => {
    const styles = Object.values(relationKindStyles)
    expect(styles).toHaveLength(4)
    expect(new Set(styles.map((style) => `${style.dash.join(',')}|${style.curvature}|${style.marker}`)).size).toBe(4)
    expect(new Set(styles.map((style) => style.color)).size).toBe(4)
    expect(styles.every((style) => style.width >= 2.7 && style.width <= 3.1)).toBe(true)
    expect(relationKindStyles.scope.marker).toBe('opposed-triangles')
  })

  it('keeps degree-scaled node radii in the compact target range', () => {
    const radius = (degree: number) => Math.sqrt(relationNodeValue(degree)) * relationNodeRelSize
    expect(radius(1)).toBeGreaterThanOrEqual(4)
    expect(radius(1_000)).toBeLessThanOrEqual(8)
    expect(relationNodeValue(1_000)).toBe(relationNodeValue(10_000))
  })
})
