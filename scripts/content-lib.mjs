import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import YAML from 'yaml'
import { z } from 'zod'

export const scopes = ['specialist', 'generalist']
export const paradigms = ['constructive', 'improvement', 'constructive-improvement']
export const relationKinds = ['architecture', 'learning', 'search', 'scope']
export const requiredSections = [
  'Motivation',
  'Contributions',
  'Methodology',
  'Experiments',
  'Limitations',
  'Reproducibility',
]

const isoDate = /^\d{4}-\d{2}-\d{2}$/

function isRealIsoDate(value) {
  if (!isoDate.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(date.valueOf()) && date.toISOString().slice(0, 10) === value
}

export const paperSchema = z.object({
  id: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  short_title: z.string().min(1),
  title: z.string().min(1),
  authors: z.array(z.string().min(1)).min(1),
  year: z.number().int().min(1900).max(2200),
  date: z.preprocess(
    (value) => value instanceof Date ? value.toISOString().slice(0, 10) : value,
    z.string().refine(isRealIsoDate, 'date must be a real YYYY-MM-DD date'),
  ),
  venue: z.string().min(1),
  paper_url: z.string().url(),
  arxiv_url: z.string().url().optional(),
  code_url: z.string().url().optional(),
  institutions: z.array(z.string().min(1)).min(1),
  scope: z.enum(scopes),
  paradigm: z.enum(paradigms),
  problem_families: z.array(z.string().min(1)).min(1),
  problems: z.array(z.string().min(1)).min(1),
  summary: z.string().min(1),
  figure: z.object({
    path: z.string().min(1),
    alt: z.string().min(1),
    caption: z.string().min(1),
    source_url: z.string().url(),
  }).strict().optional(),
}).strict()

export const relationSchema = z.object({
  papers: z.tuple([z.string().min(1), z.string().min(1)]),
  kind: z.enum(relationKinds),
  description: z.string().min(1),
}).strict()

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
  const parsed = matter(raw, { engines: { yaml: (source) => YAML.parse(source) } })
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
    note_path: `${expectedScope}/${path.basename(filePath)}`.replaceAll('\\', '/'),
    body_html: renderMarkdown(parsed.content),
  }
}

export function sortPapersNewestFirst(papers) {
  return [...papers].sort((first, second) => second.date.localeCompare(first.date) || first.title.localeCompare(second.title))
}

export async function loadPapers(root = process.cwd()) {
  const papers = []

  for (const scope of scopes) {
    const directory = path.join(root, scope)
    const entries = await fs.readdir(directory, { withFileTypes: true })
    const markdownFiles = entries
      .filter((entry) => entry.isFile() && entry.name.endsWith('.md') && entry.name !== 'README.md')
      .map((entry) => entry.name)
      .sort()

    for (const filename of markdownFiles) {
      const filePath = path.join(directory, filename)
      const raw = await fs.readFile(filePath, 'utf8')
      papers.push(parsePaper(raw, { filePath, expectedScope: scope }))
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
  const connectedIds = new Set()

  for (const relation of relations) {
    const [first, second] = relation.papers
    if (!paperIds.has(first) || !paperIds.has(second)) {
      const unknown = relation.papers.filter((id) => !paperIds.has(id))
      throw new Error(`relation has unknown paper endpoint(s): ${unknown.join(', ')}`)
    }
    if (first === second) throw new Error(`relation cannot connect a paper to itself: ${first}`)

    const pairKey = [first, second].sort().join('::')
    if (pairs.has(pairKey)) throw new Error(`duplicate undirected relation: ${pairKey}`)
    pairs.add(pairKey)
    connectedIds.add(first)
    connectedIds.add(second)
  }

  const unconnected = paperList.map((paper) => paper.id).filter((id) => !connectedIds.has(id))
  if (unconnected.length > 0) throw new Error(`papers without relations: ${unconnected.join(', ')}`)

  return relations
}

export async function loadContent(root = process.cwd()) {
  const papers = await loadPapers(root)
  const relations = await loadRelations(root, papers)
  return { version: 2, papers, relations }
}
