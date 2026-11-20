import generated from '../generated/content.json'
import type { CollectionData, Paper, PaperFilters, Paradigm, Relation, RelationKind, Scope, PaperType, TimelineGroup } from '../types'

export const collection = generated as CollectionData
export const papers = collection.papers
export const relations = collection.relations
export const fullTextReviewComplete = papers.length > 0 && papers.every(paper => paper.review_status === 'verified')
export function citationEvidenceUrl(item: Relation['evidence'][number]) {
  const url = item.source_url?.split('#')[0] ?? ''
  return item.archive_member || /\.zip(?:\?|$)/i.test(url) ? url : `${url}#page=${item.pdf_pages[0]}`
}
export function citationEvidenceLabel(item: Relation['evidence'][number]) {
  return `${item.archive_member ? `Archive member ${item.archive_member}, ` : ''}PDF p. ${item.pdf_pages.join(', ')}`
}
const papersById = new Map(papers.map(paper => [paper.id, paper]))

export const scopeLabels: Record<Scope, string> = {
  specialist: 'Specialist Neural Solvers',
  generalist: 'Generalist Neural Solvers',
  study: 'Research Studies',
}

export const scopeShortLabels: Record<Scope, string> = {
  specialist: 'Specialist',
  generalist: 'Generalist',
  study: 'Study',
}

export const paperTypeLabels: Record<PaperType, string> = { solver: 'Solver / Method', theory: 'Theory', benchmark: 'Benchmark', analysis: 'Analysis / Position', survey: 'Survey' }
export function paperClassification(paper: Paper) { return paper.paradigm ? paradigmLabels[paper.paradigm] : paperTypeLabels[paper.paper_type] }

export const paradigmLabels: Record<Paradigm, string> = {
  constructive: 'Constructive',
  improvement: 'Improvement',
  neurodynamic: 'Neurodynamic',
  'constructive-improvement': 'Constructive + Improvement',
}

export const relationKindLabels: Record<RelationKind, string> = {
  citation: 'Citation',
}

export function scopePath(scope: Scope) { return scope === 'study' ? '/studies' : `/${scope}` }

const compactVenueLabels: Record<string, string> = {
  'AAAI Workshop on Deep Learning on Graphs: Methodologies and Applications': 'AAAI Workshop',
}

const compactProblemFamilyLabels: Record<string, string> = {
  'Multi-objective Optimization': 'Multi-object. Opt.',
  'Generative Optimization': 'Generative Opt.',
  'Robust Optimization': 'Robust Opt.',
  'Graph Optimization': 'Graph Opt.',
  'Subset Selection': 'Subset Sel.',
}

const institutionConnectorWords = new Set(['of', 'and', 'the'])

export function compactVenue(venue: string) {
  return compactVenueLabels[venue] ?? venue
}

export function compactProblemFamily(problemFamily: string) {
  return compactProblemFamilyLabels[problemFamily] ?? problemFamily
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
  study: 'Theoretical analyses, benchmarks, evaluations, surveys, and position papers about neural combinatorial optimization. These works are distinguished from solver models.',
  specialist: 'Models trained separately for one optimization problem, including methods that generalize across sizes or distributions within that problem.',
  generalist: 'Shared models or checkpoints that solve multiple distinct optimization problems, optionally through lightweight task-specific adapters.',
}

export function publicYear(paper: Paper) {
  return Number(paper.date.slice(0, 4))
}

export function timelineDate(paper: Paper) {
  return paper.acceptance?.date ?? paper.publication?.date ?? paper.date
}

export function timelineYear(paper: Paper) {
  return Number(timelineDate(paper).slice(0, 4))
}

export function formatPublicDate(date: string): string {
  if (date.length < 10) return formatPartialDate(date)
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date(`${date}T00:00:00Z`))
}

export function formatPartialDate(date: string): string {
  if (date.length === 4) return date
  const normalizedDate = date.length === 7 ? `${date}-01` : date
  return formatPublicDate(normalizedDate)
}

export function paperTimelineLabel(paper: Paper) {
  const labels: string[] = []
  if (paper.acceptance) labels.push(`Accepted ${formatPartialDate(paper.acceptance.date)}`)
  if (!paper.acceptance && paper.publication) labels.push(`Published ${formatPartialDate(paper.publication.date)}`)
  if (paper.arxiv_url) labels.push(`arXiv ${formatPublicDate(paper.date)}`)
  return labels.join(' · ')
}

export function sortPapersByFirstPublicNewestFirst(source: Paper[]) {
  return [...source].sort((first, second) => second.date.localeCompare(first.date) || first.title.localeCompare(second.title))
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
      && (!filters.type || filters.type === 'all' || paper.paper_type === filters.type)
      && (!filters.inclusion || filters.inclusion === 'all' || paper.inclusion === filters.inclusion)
      && (filters.scope === 'all' || paper.scope === filters.scope)
      && (filters.paradigm === 'all' || paper.paradigm === filters.paradigm)
      && (filters.family === 'all' || paper.problem_families.includes(filters.family))
      && (filters.year === 'all' || timelineYear(paper) === Number(filters.year))
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
    inclusion: ['main', 'reference', 'all'].includes(searchParams.get('inclusion') ?? '') ? searchParams.get('inclusion')! : 'main',
    type: Object.keys(paperTypeLabels).includes(searchParams.get('type') ?? '') ? searchParams.get('type')! : 'all',
    query: searchParams.get('q') ?? '',
    scope: options.scopes?.includes(scope) ? scope : 'all',
    paradigm: options.paradigms.includes(paradigm) ? paradigm : 'all',
    family: options.families.includes(family) ? family : 'all',
    year: options.years.includes(year) ? year : 'all',
  }
}

export function groupPapersByTimelineYear(source: Paper[]): TimelineGroup[] {
  const groups = new Map<number, Paper[]>()
  for (const paper of source) {
    const year = timelineYear(paper)
    groups.set(year, [...(groups.get(year) ?? []), paper])
  }
  return [...groups.entries()]
    .sort(([first], [second]) => second - first)
    .map(([year, groupedPapers]) => ({
      year,
      papers: [...groupedPapers].sort((first, second) => (
        timelineDate(second).localeCompare(timelineDate(first))
        || second.date.localeCompare(first.date)
        || first.title.localeCompare(second.title)
      )),
    }))
}

export function getPaper(id: string) {
  return papersById.get(id)
}

export function assetUrl(relativePath: string) {
  const base = import.meta.env.BASE_URL.endsWith('/') ? import.meta.env.BASE_URL : `${import.meta.env.BASE_URL}/`
  return `${base}${relativePath.replace(/^\//, '')}`
}

const relationsByPaper = new Map<string, Relation[]>()
const outgoingByPaper = new Map<string, Relation[]>()
for (const relation of relations) {
  for (const id of relation.papers) {
    if (!relationsByPaper.has(id)) relationsByPaper.set(id, [])
    relationsByPaper.get(id)!.push(relation)
  }
  if (!outgoingByPaper.has(relation.citing)) outgoingByPaper.set(relation.citing, [])
  outgoingByPaper.get(relation.citing)!.push(relation)
}

export function relationsForPaper(id: string, source: Relation[] = relations) {
  return source === relations ? relationsByPaper.get(id) ?? [] : source.filter((relation) => relation.papers.includes(id))
}
export function outgoingReferences(id: string) { return outgoingByPaper.get(id) ?? [] }

export function relatedPaperId(relation: Relation, id: string) {
  return relation.papers[0] === id ? relation.papers[1] : relation.papers[0]
}

export function relationCount(id: string) {
  return relationsForPaper(id).length
}

export function papersForScope(scope: Scope) {
  return papers.filter((paper) => paper.scope === scope && paper.inclusion === 'main')
}

export const reviewStatusLabels = { pending: 'Full-text review pending', reading: 'Full-text review in progress', verified: 'Full-text review complete', blocked: 'Review has unresolved issues' }
export function reviewRecordUrl(id: string) { return `https://github.com/CIAM-Group/awesome-nco/blob/main/data/reviews/papers/${id}.json` }

export function uniqueValues(values: string[]) {
  return [...new Set(values)].sort((first, second) => first.localeCompare(second))
}
