import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import YAML from 'yaml'
import { z } from 'zod'
import { createHash } from 'node:crypto'
import { citationSchema, loadReviews } from './review-lib.mjs'

const inclusionPolicy = JSON.parse(await fs.readFile(new URL('../data/inclusion-policy.json', import.meta.url), 'utf8'))
export function qualifiesForMainCollection(venue) {
  const canonical = inclusionPolicy.conference_aliases[venue] ?? venue
  return inclusionPolicy.conferences.includes(canonical) || inclusionPolicy.non_ieee_journals.includes(canonical) || canonical.startsWith(inclusionPolicy.ieee_transactions_prefix)
}

export const scopes = ['specialist', 'generalist', 'study']
export const scopeDirectories = { specialist: 'specialist', generalist: 'generalist', study: 'studies' }
export const paradigms = ['constructive', 'improvement', 'constructive-improvement', 'neurodynamic']
export const paperTypes = ['solver', 'theory', 'benchmark', 'analysis', 'survey']
export const relationKinds = ['citation']
export const requiredSections = [
  'Motivation',
  'Contributions',
  'Methodology',
  'Experiments',
  'Limitations',
  'Reproducibility',
]

const isoDate = /^\d{4}-\d{2}-\d{2}$/
const partialIsoDate = /^\d{4}(?:-\d{2}(?:-\d{2})?)?$/

function isRealIsoDate(value) {
  if (!isoDate.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
}

function isRealPartialIsoDate(value) {
  if (!partialIsoDate.test(value)) return false
  const year = Number(value.slice(0, 4))
  if (year < 1900 || year > 2200) return false
  if (value.length === 4) return true

  const month = Number(value.slice(5, 7))
  if (month < 1 || month > 12) return false
  if (value.length === 7) return true

  return isRealIsoDate(value)
}

const acceptanceSchema = z.object({
  date: z.preprocess(
    (value) => value instanceof Date ? value.toISOString().slice(0, 10) : typeof value === 'number' ? String(value) : value,
    z.string().refine(isRealPartialIsoDate, 'acceptance.date must be a real YYYY, YYYY-MM, or YYYY-MM-DD date'),
  ),
  source_url: z.string().url(),
}).strict()

export const paperSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  short_title: z.string().min(1),
  title: z.string().min(1),
  authors: z.array(z.string().min(1)).min(1),
  year: z.number().int().min(1900).max(2200),
  date: z.preprocess(
    (value) => value instanceof Date ? value.toISOString().slice(0, 10) : typeof value === 'number' ? String(value) : value,
    z.string().refine(isRealPartialIsoDate, 'date must be a real YYYY, YYYY-MM, or YYYY-MM-DD date'),
  ),
  acceptance: acceptanceSchema.optional(),
  publication: acceptanceSchema.optional(),
  paper_type: z.enum(paperTypes).default('solver'),
  venue: z.string().min(1),
  paper_url: z.string().url(),
  arxiv_url: z.string().url().optional(),
  code_url: z.string().url().optional(),
  institutions: z.array(z.string().min(1)),
  inclusion: z.enum(['main', 'reference']).default('main'),
  inclusion_reason: z.string().min(1).optional(),
  scope: z.enum(scopes),
  paradigm: z.enum(paradigms).optional(),
  problem_families: z.array(z.string().min(1)).min(1),
  problems: z.array(z.string().min(1)).min(1),
  summary: z.string().min(1),
  figure: z.object({
    path: z.string().min(1),
    alt: z.string().min(1),
    caption: z.string().min(1),
    source_url: z.string().url(),
  }).strict().optional(),
}).strict().superRefine((paper, context) => {
  if (paper.inclusion === 'reference' && !paper.inclusion_reason) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['inclusion_reason'], message: 'reference entries require an exclusion reason' })
  }
  if (paper.inclusion === 'main' && !qualifiesForMainCollection(paper.venue)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['inclusion'], message: 'venues outside the main publication criteria must use the reference collection' })
  }
  if (paper.venue === 'arXiv' && (paper.acceptance || paper.publication)) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['acceptance'],
      message: 'arXiv-only papers must not declare acceptance metadata',
    })
  }
  if (paper.venue !== 'arXiv' && !paper.acceptance && !paper.publication) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['acceptance'],
      message: 'formally published papers must declare acceptance metadata or publication evidence',
    })
  }
  if (paper.arxiv_url && !isRealIsoDate(paper.date)) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['date'], message: 'arXiv v1 dates must have day precision' })
  }
  if (paper.scope === 'study') {
    if (paper.paper_type === 'solver' || paper.paradigm) context.addIssue({ code: z.ZodIssueCode.custom, path: ['paper_type'], message: 'studies require a non-solver paper_type and no solver paradigm' })
  } else if (paper.paper_type !== 'solver' || !paper.paradigm) {
    context.addIssue({ code: z.ZodIssueCode.custom, path: ['paradigm'], message: 'solver collections require paper_type solver and a paradigm' })
  }
})

export const relationSchema = citationSchema

const relationsFileSchema = z.object({
  relations: z.array(relationSchema),
}).strict()

function sectionNames(markdown) {
  return [...markdown.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => match[1])
}

function markdownForWebsite(markdown) {
  return markdown.replace(/^\s*#\s+[^\r\n]+(?:\r?\n)+/, '').trim()
}

export function renderMarkdown(markdown) {
  const html = marked.parse(markdownForWebsite(markdown), { gfm: true })
  const wrappedTables = html.replaceAll('<table>', '<div class="note-table-wrap"><table>').replaceAll('</table>', '</table></div>')
  return sanitizeHtml(wrappedTables, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'title', 'target', 'rel'],
      code: ['class'],
      div: ['class'],
      img: ['src', 'alt', 'title', 'loading'],
    },
    allowedSchemes: ['http', 'https', 'mailto'],
    transformTags: {
      a: (tagName, attribs) => {
        if (!attribs.href?.startsWith('http')) return { tagName, attribs }
        return { tagName, attribs: { ...attribs, target: '_blank', rel: 'noreferrer' } }
      },
      img: (tagName, attribs) => ({ tagName, attribs: { ...attribs, loading: 'lazy' } }),
    },
  })
}

export function parsePaper(raw, { filePath, expectedScope }) {
  const normalizedRaw = raw.replace(/\r\n?/g, '\n')
  const parsed = matter(normalizedRaw, { engines: { yaml: (source) => YAML.parse(source) } })
  const metadata = paperSchema.parse(parsed.data)
  const filename = path.basename(filePath, path.extname(filePath))

  if (metadata.id !== filename) {
    throw new Error(`${filePath}: id must match filename (${filename})`)
  }
  if (metadata.scope !== expectedScope) {
    throw new Error(`${filePath}: scope must be ${expectedScope}`)
  }

  const headings = new Set(sectionNames(parsed.content))
  const missingSections = requiredSections.filter((section) => !headings.has(section))
  if (missingSections.length > 0) {
    throw new Error(`${filePath}: missing sections: ${missingSections.join(', ')}`)
  }

  return {
    ...metadata,
    note_path: `${scopeDirectories[expectedScope]}/${path.basename(filePath)}`.replaceAll('\\', '/'),
    body_html: renderMarkdown(parsed.content),
  }
}

function sortablePartialDate(date) {
  if (date.length === 4) return `${date}-00-00`
  if (date.length === 7) return `${date}-00`
  return date
}

export function timelineDate(paper) {
  return paper.acceptance?.date ?? paper.publication?.date ?? paper.date
}

export function sortPapersNewestFirst(papers) {
  return [...papers].sort((first, second) => (
    sortablePartialDate(timelineDate(second)).localeCompare(sortablePartialDate(timelineDate(first)))
    || second.date.localeCompare(first.date)
    || first.title.localeCompare(second.title)
  ))
}

export function sortPapersByFirstPublicNewestFirst(papers) {
  return [...papers].sort((first, second) => second.date.localeCompare(first.date) || first.title.localeCompare(second.title))
}

export async function loadPapers(root = process.cwd()) {
  const papers = []
  const reviews = await loadReviews(root)

  for (const scope of scopes) {
    const directory = path.join(root, scopeDirectories[scope])
    if (scope === 'study') {
      try { await fs.access(directory) } catch { continue }
    }
    const entries = await fs.readdir(directory, { withFileTypes: true })
    const markdownFiles = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md')
      .map((entry) => entry.name)
      .sort()

    for (const filename of markdownFiles) {
      const filePath = path.join(directory, filename)
      const raw = await fs.readFile(filePath, 'utf8')
      const paper = parsePaper(raw, { filePath, expectedScope: scope })
      const review = reviews.get(paper.id)
      if (review?.status === 'verified' && createHash('sha256').update(raw.replace(/\r\n?/g, '\n')).digest('hex') !== review.reviewed_note_sha256) throw new Error(`${paper.id}: note changed after full-text verification; reopen its review`)
      papers.push({ ...paper, review_status: review?.status ?? 'pending' })
    }
  }

  const duplicates = [...new Set(papers.map((paper) => paper.id).filter((id, index, ids) => ids.indexOf(id) !== index))]
  if (duplicates.length > 0) throw new Error(`duplicate paper ids: ${duplicates.join(', ')}`)

  for (const paper of papers) {
    if (!paper.figure) continue

    const expectedPrefix = `paper-assets/${paper.id}/`
    const normalizedPath = paper.figure.path.replaceAll('\\', '/')
    if (normalizedPath !== paper.figure.path || !normalizedPath.startsWith(expectedPrefix) || normalizedPath.includes('../')) {
      throw new Error(`${paper.note_path}: figure path must be inside public/${expectedPrefix}`)
    }

    const assetPath = path.join(root, 'public', ...normalizedPath.split('/'))
    try {
      const stat = await fs.stat(assetPath)
      if (!stat.isFile()) throw new Error('not a file')
    } catch {
      throw new Error(`${paper.note_path}: figure file does not exist: public/${normalizedPath}`)
    }
  }

  return sortPapersNewestFirst(papers)
}

export async function loadRelations(root = process.cwd(), papers) {
  const paperList = papers ?? await loadPapers(root)
  const raw = await fs.readFile(path.join(root, 'data', 'relations.yml'), 'utf8')
  const { relations } = relationsFileSchema.parse(YAML.parse(raw))
  const paperIds = new Set(paperList.map((paper) => paper.id))
  const pairs = new Set()
  const reviews = await loadReviews(root)

  for (const relation of relations) {
    const [first, second] = [relation.citing, relation.cited]
    if (!paperIds.has(first) || !paperIds.has(second)) {
      const unknown = [first, second].filter((id) => !paperIds.has(id))
      throw new Error(`relation has unknown paper endpoint(s): ${unknown.join(', ')}`)
    }
    if (first === second) throw new Error(`relation cannot connect a paper to itself: ${first}`)

    const pairKey = [first, second].join('::')
    if (pairs.has(pairKey)) throw new Error(`duplicate directed citation: ${pairKey}`)
    pairs.add(pairKey)
    const review = reviews.get(first)
    if (!review || review.status !== 'verified') throw new Error(`${first}: citation requires a completed full-text review`)
    for (const evidence of relation.evidence) {
      const source = review.sources.find(item => item.id === evidence.source_id)
      if (!source || evidence.pdf_pages.some(page => page > source.pages)) throw new Error(`${first}: invalid citation evidence page`)
    }
    if (!review.citations.some(item => item.cited === second && JSON.stringify(item) === JSON.stringify(relation))) throw new Error(`${first}: citation differs from its reviewed evidence record`)
  }
  // `papers` and `kind` are derived compatibility fields for shared card helpers.
  return relations.map(relation => ({
    ...relation, papers: [relation.citing, relation.cited], kind: 'citation',
    evidence: relation.evidence.map(item => {
      const source = reviews.get(relation.citing).sources.find(source => source.id === item.source_id)
      return { ...item, source_url: source.url, ...(source.archive_member ? { archive_member: source.archive_member } : {}) }
    }),
  }))
}

export async function loadContent(root = process.cwd()) {
  const papers = await loadPapers(root)
  const relations = await loadRelations(root, papers)
  return { version: 5, papers, relations }
}
