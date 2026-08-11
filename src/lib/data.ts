import generated from '../generated/content.json'
import type { CollectionData, Paper, PaperFilters, Paradigm, Relation, RelationKind, RelationKindStyle, Scope, TimelineGroup } from '../types'

export const collection = generated as CollectionData
export const papers = collection.papers
export const relations = collection.relations

export const scopeLabels: Record<Scope, string> = {
  specialist: 'Specialist Neural Solvers',
  generalist: 'Generalist Neural Solvers',
}

export const scopeShortLabels: Record<Scope, string> = {
  specialist: 'Specialist',
  generalist: 'Generalist',
}

export const paradigmLabels: Record<Paradigm, string> = {
  constructive: 'Constructive',
  improvement: 'Improvement',
  'constructive-improvement': 'Constructive + Improvement',
}

export const relationKindLabels: Record<RelationKind, string> = {
  architecture: 'Architecture',
  learning: 'Learning',
  search: 'Search',
  scope: 'Scope',
}

export const relationKindStyles: Record<RelationKind, RelationKindStyle> = {
  architecture: { color: '#2563eb', width: 2.8, dash: [], curvature: 0, marker: 'none' },
  learning: { color: '#d97706', width: 3, dash: [9, 5], curvature: 0.15, marker: 'none' },
  search: { color: '#7c3aed', width: 3.1, dash: [2, 5], curvature: -0.2, marker: 'none' },
  scope: { color: '#059669', width: 3, dash: [10, 4, 2, 4], curvature: 0, marker: 'opposed-triangles' },
}

export const relationNodeRelSize = 2.6

export function relationNodeValue(degree: number) {
  return 2 + degree * 0.55
}

const compactVenueLabels: Record<string, string> = {
  'AAAI Workshop on Deep Learning on Graphs: Methodologies and Applications': 'AAAI Workshop',
}

const institutionConnectorWords = new Set(['of', 'and', 'the'])

export function compactVenue(venue: string) {
  return compactVenueLabels[venue] ?? venue
}

export function institutionInitials(institution: string) {
  const words = institution
    .split(/\s+/)
    .map((word) => word.replace(/[^\p{L}\p{N}]/gu, ''))
    .filter(Boolean)

  if (words.length <= 1) return (words[0] ?? '').slice(0, 3).toUpperCase()

  const significantWords = words.filter((word) => !institutionConnectorWords.has(word.toLowerCase()))
  return (significantWords.length > 0 ? significantWords : words)
    .slice(0, 3)
    .map((word) => word[0])
    .join('')
    .toUpperCase()
}

export const scopeDescriptions: Record<Scope, string> = {
  specialist: 'Models trained separately for one optimization problem, including methods that generalize across sizes or distributions within that problem.',
  generalist: 'Shared models or checkpoints that solve multiple distinct optimization problems, optionally through lightweight task-specific adapters.',
}

export function publicYear(paper: Paper) {
  return Number(paper.date.slice(0, 4))
}

export function formatPublicDate(date: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${date}T00:00:00Z`))
}

export function filterPapers(source: Paper[], filters: PaperFilters) {
  const query = filters.query.trim().toLowerCase()

  return source.filter((paper) => {
    const searchable = [
      paper.short_title,
      paper.title,
      paper.summary,
      paper.venue,
      ...paper.authors,
      ...paper.institutions,
      ...paper.problem_families,
      ...paper.problems,
    ].join(' ').toLowerCase()

    return (!query || searchable.includes(query))
      && (filters.scope === 'all' || paper.scope === filters.scope)
      && (filters.paradigm === 'all' || paper.paradigm === filters.paradigm)
      && (filters.family === 'all' || paper.problem_families.includes(filters.family))
      && (filters.year === 'all' || publicYear(paper) === Number(filters.year))
  })
}

interface FilterOptions {
  scopes?: string[]
  paradigms: string[]
  families: string[]
  years: string[]
}

export function filtersFromSearchParams(searchParams: Pick<URLSearchParams, 'get'>, options: FilterOptions): PaperFilters {
  const paradigm = searchParams.get('paradigm') ?? 'all'
  const scope = searchParams.get('scope') ?? 'all'
  const family = searchParams.get('family') ?? 'all'
  const year = searchParams.get('year') ?? 'all'

  return {
    query: searchParams.get('q') ?? '',
    scope: options.scopes?.includes(scope) ? scope : 'all',
    paradigm: options.paradigms.includes(paradigm) ? paradigm : 'all',
    family: options.families.includes(family) ? family : 'all',
    year: options.years.includes(year) ? year : 'all',
  }
}

export function groupPapersByPublicYear(source: Paper[]): TimelineGroup[] {
  const groups = new Map<number, Paper[]>()
  for (const paper of source) {
    const year = publicYear(paper)
    groups.set(year, [...(groups.get(year) ?? []), paper])
  }
  return [...groups.entries()]
    .sort(([first], [second]) => second - first)
    .map(([year, groupedPapers]) => ({ year, papers: groupedPapers }))
}

export function getPaper(id: string) {
  return papers.find((paper) => paper.id === id)
}

export function assetUrl(relativePath: string) {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`
  return `${base}${relativePath.replace(/^\//, '')}`
}

export function relationsForPaper(id: string, source: Relation[] = relations) {
  return source.filter((relation) => relation.papers.includes(id))
}

export function relatedPaperId(relation: Relation, id: string) {
  return relation.papers[0] === id ? relation.papers[1] : relation.papers[0]
}

export function relationCount(id: string) {
  return relationsForPaper(id).length
}

export function papersForScope(scope: Scope) {
  return papers.filter((paper) => paper.scope === scope)
}

export function uniqueValues(values: string[]) {
  return [...new Set(values)].sort((first, second) => first.localeCompare(second))
}
