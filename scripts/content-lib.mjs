import fs from 'node:fs/promises'
import path from 'node:path'
import matter from 'gray-matter'
import { marked } from 'marked'
import sanitizeHtml from 'sanitize-html'
import YAML from 'yaml'
import { z } from 'zod'

export const scopes = ['specialist', 'generalist']
export const paradigms = ['constructive', 'improvement', 'constructive-improvement']
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
}).strict()

function sectionNames(markdown) {
  return [...markdown.matchAll(/^##\s+(.+?)\s*$/gm)].map((match) => match[1])
}

function markdownForWebsite(markdown) {
  return markdown.replace(/^\s*#\s+[^\r\n]+(?:\r?\n)+/, '').trim()
}

export function renderMarkdown(markdown) {
  const html = marked.parse(markdownForWebsite(markdown), { gfm: true })
  return sanitizeHtml(html, {
    allowedTags: [...sanitizeHtml.defaults.allowedTags, 'img'],
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      a: ['href', 'title', 'target', 'rel'],
      code: ['class'],
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

  return sortPapersNewestFirst(papers)
}
