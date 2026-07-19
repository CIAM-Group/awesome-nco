import generated from '../generated/content.json'
import type { CollectionData, Paper, PaperFilters, Paradigm, Scope, TimelineGroup } from '../types'

export const collection = generated as CollectionData
export const papers = collection.papers

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
      && (filters.paradigm === 'all' || paper.paradigm === filters.paradigm)
      && (filters.family === 'all' || paper.problem_families.includes(filters.family))
      && (filters.year === 'all' || publicYear(paper) === Number(filters.year))
  })
}

interface FilterOptions {
  paradigms: string[]
  families: string[]
  years: string[]
}

export function filtersFromSearchParams(searchParams: Pick<URLSearchParams, 'get'>, options: FilterOptions): PaperFilters {
  const paradigm = searchParams.get('paradigm') ?? 'all'
  const family = searchParams.get('family') ?? 'all'
  const year = searchParams.get('year') ?? 'all'

  return {
    query: searchParams.get('q') ?? '',
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

export function papersForScope(scope: Scope) {
  return papers.filter((paper) => paper.scope === scope)
}

export function uniqueValues(values: string[]) {
  return [...new Set(values)].sort((first, second) => first.localeCompare(second))
}
