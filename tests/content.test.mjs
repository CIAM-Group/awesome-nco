import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { createHash } from 'node:crypto'
import YAML from 'yaml'
import { afterEach, describe, expect, it } from 'vitest'
import { loadContent, loadPapers, loadRelations, parsePaper, renderMarkdown, sortPapersByFirstPublicNewestFirst, sortPapersNewestFirst } from '../scripts/content-lib.mjs'

const temporaryDirectories = []
const sections = `
## Motivation
Motivation.

## Contributions
Contributions.

## Methodology
Methodology.

## Experiments
Experiments.

## Limitations
Limitations.

## Reproducibility
Reproducibility.
`

function paperMarkdown(overrides = {}) {
  const metadata = {
    id: 'sample-paper',
    short_title: 'Sample',
    title: 'A Sample Paper',
    authors: ['Ada Researcher'],
    year: 2025,
    date: '2024-03-02',
    acceptance: { date: '2025-01-22', source_url: 'https://example.com/decision' },
    venue: 'ICLR',
    paper_url: 'https://example.com/paper.pdf',
    institutions: ['Example University'],
    scope: 'specialist',
    paradigm: 'constructive',
    problem_families: ['Routing'],
    problems: ['Traveling Salesman Problem'],
    summary: 'A concise summary.',
    ...overrides,
  }
  const lines = ['---']
  for (const [key, value] of Object.entries(metadata)) {
    if (value === undefined) continue
    if (Array.isArray(value)) {
      lines.push(`${key}:`, ...value.map((item) => `  - ${item}`))
    } else if (typeof value === 'object' && value !== null) {
      lines.push(`${key}:`, ...Object.entries(value).map(([nestedKey, nestedValue]) => `  ${nestedKey}: ${nestedValue}`))
    } else {
      lines.push(`${key}: ${value}`)
    }
  }
  return `${lines.join('\n')}\n---\n\n# ${metadata.title}\n${sections}`
}

function withFigure(markdown, overrides = {}) {
  const figure = {
    path: 'paper-assets/sample-paper/framework.png',
    alt: 'A framework diagram.',
    caption: 'Figure 1: Framework overview.',
    source_url: 'https://example.com/paper.pdf',
    ...overrides,
  }
  const yaml = [
    'figure:',
    `  path: ${figure.path}`,
    `  alt: ${figure.alt}`,
    `  caption: '${figure.caption}'`,
    `  source_url: ${figure.source_url}`,
  ].join('\n')
  return markdown.replace('\n---\n\n# ', `\n${yaml}\n---\n\n# `)
}

async function createPaperRoot(markdown) {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'awesome-nco-content-'))
  temporaryDirectories.push(root)
  await fs.mkdir(path.join(root, 'specialist'), { recursive: true })
  await fs.mkdir(path.join(root, 'generalist'), { recursive: true })
  await fs.writeFile(path.join(root, 'specialist', 'sample-paper.md'), markdown)
  return root
}

afterEach(async () => {
  await Promise.all(temporaryDirectories.splice(0).map((directory) => fs.rm(directory, { recursive: true, force: true })))
})

describe('paper content schema', () => {
  it('parses unquoted YAML dates and renders a valid paper', () => {
    const paper = parsePaper(paperMarkdown(), { filePath: 'sample-paper.md', expectedScope: 'specialist' })
    expect(paper.date).toBe('2024-03-02')
    expect(paper.acceptance.date).toBe('2025-01-22')
    expect(paper.body_html).toContain('<h2>Motivation</h2>')
  })

  it('rejects invalid dates and paradigms', () => {
    expect(() => parsePaper(paperMarkdown({ date: '2024-02-31' }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })).toThrow()
    expect(() => parsePaper(paperMarkdown({ paradigm: 'hybrid' }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })).toThrow()
  })

  it('accepts year, month, and day precision for decisions and rejects impossible values', () => {
    for (const date of ['2025', '2025-01', '2025-01-22']) {
      const paper = parsePaper(paperMarkdown({ acceptance: { date, source_url: 'https://example.com/decision' } }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })
      expect(paper.acceptance.date).toBe(date)
    }
    expect(() => parsePaper(paperMarkdown({ acceptance: { date: '2025-13', source_url: 'https://example.com/decision' } }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })).toThrow()
    expect(() => parsePaper(paperMarkdown({ acceptance: { date: '2025-02-31', source_url: 'https://example.com/decision' } }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })).toThrow()
  })

  it('requires decisions for published work and omits them for arXiv-only papers', () => {
    expect(() => parsePaper(paperMarkdown({ acceptance: undefined }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })).toThrow('formally published papers must declare acceptance metadata')
    const preprint = parsePaper(paperMarkdown({ venue: 'arXiv', acceptance: undefined, arxiv_url: 'https://arxiv.org/abs/2403.00001', inclusion: 'reference', inclusion_reason: 'Preprint only.' }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })
    expect(preprint.acceptance).toBeUndefined()
    expect(() => parsePaper(paperMarkdown({ venue: 'arXiv' }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })).toThrow('arXiv-only papers must not declare acceptance metadata')
  })

  it('normalizes Windows line endings before parsing YAML front matter', () => {
    const paper = parsePaper(paperMarkdown().replaceAll('\n', '\r\n'), { filePath: 'sample-paper.md', expectedScope: 'specialist' })
    expect(paper.id).toBe('sample-paper')
  })

  it('supports sourced publication precision without inventing an acceptance date', () => {
    for (const date of ['2026', '2026-07', '2026-07-06']) {
      const paper = parsePaper(paperMarkdown({ date, acceptance: undefined, publication: { date, source_url: 'https://proceedings.example/paper' } }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })
      expect(paper.publication.date).toBe(date)
      expect(paper.acceptance).toBeUndefined()
    }
    expect(() => parsePaper(paperMarkdown({ arxiv_url: 'https://arxiv.org/abs/2601.00001', date: '2026-01', publication: { date: '2026-01', source_url: 'https://doi.org/10.1234/example' } }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })).toThrow('arXiv v1 dates must have day precision')
    expect(() => parsePaper(paperMarkdown({ venue: 'arXiv', acceptance: undefined, arxiv_url: 'https://arxiv.org/abs/2601.00001', date: '2026-01', inclusion: 'reference', inclusion_reason: 'Preprint only.' }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })).toThrow('arXiv v1 dates must have day precision')
  })

  it('separates studies from solver paradigms and maps their note directory', () => {
    const metadata = { scope: 'study', paper_type: 'theory', paradigm: undefined }
    const paper = parsePaper(paperMarkdown(metadata), { filePath: 'sample-paper.md', expectedScope: 'study' })
    expect(paper.note_path).toBe('studies/sample-paper.md')
    expect(paper.paradigm).toBeUndefined()
    expect(() => parsePaper(paperMarkdown({ ...metadata, paradigm: 'constructive' }), { filePath: 'sample-paper.md', expectedScope: 'study' })).toThrow('studies require')
    expect(() => parsePaper(paperMarkdown({ paper_type: 'theory' }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })).toThrow('solver collections require')
  })

  it('rejects missing required fields, invalid scopes, and invalid URLs', () => {
    const missingVenue = paperMarkdown().replace('venue: ICLR\n', '')
    expect(() => parsePaper(missingVenue, { filePath: 'sample-paper.md', expectedScope: 'specialist' })).toThrow()
    expect(() => parsePaper(paperMarkdown({ scope: 'archive' }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })).toThrow()
    expect(() => parsePaper(paperMarkdown({ paper_url: 'not-a-url' }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })).toThrow()
  })

  it('rejects a scope that disagrees with its directory', () => {
    expect(() => parsePaper(paperMarkdown({ scope: 'generalist' }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })).toThrow('scope must be specialist')
  })

  it('rejects missing required note sections', () => {
    const markdown = paperMarkdown().replace('## Limitations', '### Limitations')
    expect(() => parsePaper(markdown, { filePath: 'sample-paper.md', expectedScope: 'specialist' })).toThrow('missing sections: Limitations')
  })

  it('parses complete optional figure metadata', () => {
    const paper = parsePaper(withFigure(paperMarkdown()), { filePath: 'sample-paper.md', expectedScope: 'specialist' })
    expect(paper.figure).toEqual({
      path: 'paper-assets/sample-paper/framework.png',
      alt: 'A framework diagram.',
      caption: 'Figure 1: Framework overview.',
      source_url: 'https://example.com/paper.pdf',
    })
  })

  it('rejects missing and out-of-directory figure files', async () => {
    const missingRoot = await createPaperRoot(withFigure(paperMarkdown()))
    await expect(loadPapers(missingRoot)).rejects.toThrow('figure file does not exist')

    const invalidRoot = await createPaperRoot(withFigure(paperMarkdown(), { path: 'paper-assets/another-paper/framework.png' }))
    await expect(loadPapers(invalidRoot)).rejects.toThrow('figure path must be inside')
  })

  it('rejects duplicate ids across scope directories', async () => {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'awesome-nco-content-'))
    temporaryDirectories.push(root)
    await fs.mkdir(path.join(root, 'specialist'))
    await fs.mkdir(path.join(root, 'generalist'))
    await fs.writeFile(path.join(root, 'specialist', 'sample-paper.md'), paperMarkdown())
    await fs.writeFile(path.join(root, 'generalist', 'sample-paper.md'), paperMarkdown({ scope: 'generalist' }))
    await expect(loadPapers(root)).rejects.toThrow('duplicate paper ids')
  })
})

describe('relation content schema', () => {
  const citation = (citing, cited) => ({ citing, cited, description: 'An explicitly located citation.', reference_label: '[1]', evidence: [{ source_id: 'paper', pdf_pages: [2], locator: 'Section 2 and bibliography' }] })
  async function relationRoot(relations) {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'awesome-nco-relations-'))
    temporaryDirectories.push(root)
    await fs.mkdir(path.join(root, 'data'))
    await fs.writeFile(path.join(root, 'data', 'relations.yml'), YAML.stringify({ relations }))
    await fs.mkdir(path.join(root, 'data/reviews/papers'), { recursive: true })
    for (const id of ['sample-paper', 'other-paper']) {
      const source = { id: 'paper', url: 'https://example.com/paper.pdf', version: 'published PDF', local_path: 'research/sample.pdf', sha256: 'b'.repeat(64), pages: 3, identity_checked: true, version_checked: true }
      const review = { version: 1, paper_id: id, note_path: `specialist/${id}.md`, baseline_note_sha256: 'a'.repeat(64), reviewed_note_sha256: 'c'.repeat(64), status: 'verified', sources: [source], reading_log: [{ source_id: 'paper', first_page: 1, last_page: 3, notes: 'Fixture complete reading.' }], claims: ['contribution', 'method', 'experiment', 'classification'].map(category => ({ id: category, category, statement: 'Checked fixture statement.', evidence: citation(id, 'target').evidence })), metadata_evidence: [{ field: 'title', source_url: source.url, locator: 'Page 1' }], citations: relations.filter(item => item.citing === id && item.cited !== id), citation_scan_complete: true, figures_checked: true, note_crosscheck_complete: true, issues: [], corrections: [] }
      review.supplements_checked = true
      review.metadata_evidence.push({ field: 'supplements', source_url: source.url, locator: 'Publisher checked; no separate scientific supplement.' })
      await fs.writeFile(path.join(root, 'data/reviews/papers', `${id}.json`), JSON.stringify(review))
    }
    return root
  }

  const samplePapers = [{ id: 'sample-paper' }, { id: 'other-paper' }]

  it('rejects unknown endpoints and self-relations', async () => {
    const unknown = await relationRoot([citation('sample-paper', 'missing-paper')])
    await expect(loadRelations(unknown, samplePapers)).rejects.toThrow('unknown paper endpoint')

    const self = await relationRoot([citation('sample-paper', 'sample-paper')])
    await expect(loadRelations(self, samplePapers)).rejects.toThrow('cannot connect a paper to itself')
  })

  it('rejects duplicate directions and preserves separately evidenced reverse citations', async () => {
    const root = await relationRoot([citation('sample-paper', 'other-paper'), citation('sample-paper', 'other-paper')])
    await expect(loadRelations(root, samplePapers)).rejects.toThrow('duplicate directed citation')
    const reverse = await relationRoot([citation('sample-paper', 'other-paper'), citation('other-paper', 'sample-paper')])
    expect(await loadRelations(reverse, samplePapers)).toHaveLength(2)
  })

  it('allows isolated papers and an empty verified citation graph', async () => {
    const root = await relationRoot([])
    expect(await loadRelations(root, [...samplePapers, { id: 'unconnected-paper' }])).toEqual([])
  })

  it('accepts equivalent line endings but reopens a review when its note changes', async () => {
    const root = await relationRoot([])
    await fs.mkdir(path.join(root, 'specialist'))
    await fs.mkdir(path.join(root, 'generalist'))
    for (const id of ['sample-paper', 'other-paper']) {
      const markdown = paperMarkdown({ id })
      await fs.writeFile(path.join(root, 'specialist', `${id}.md`), markdown.replaceAll('\n', '\r\n'))
      const filename = path.join(root, 'data/reviews/papers', `${id}.json`)
      const review = JSON.parse(await fs.readFile(filename, 'utf8'))
      review.reviewed_note_sha256 = createHash('sha256').update(markdown).digest('hex')
      await fs.writeFile(filename, JSON.stringify(review))
    }
    expect(await loadPapers(root)).toHaveLength(2)
    await fs.appendFile(path.join(root, 'specialist', 'sample-paper.md'), '\nUnreviewed claim.\n')
    await expect(loadPapers(root)).rejects.toThrow('note changed after full-text verification')
  })
})

describe('content output', () => {
  it('builds the reviewed citation format as version 5', async () => {
    const content = await loadContent(path.resolve('.'))
    expect(content.version).toBe(5)
    expect(content.relations.every(relation => relation.citing && relation.cited && relation.evidence.length)).toBe(true)
  })
  it('sorts collection timelines by acceptance and preserves first-public sorting for the home page', () => {
    const sorted = sortPapersNewestFirst([
      { id: 'old', title: 'Old', date: '2020-01-01', acceptance: { date: '2025', source_url: 'https://example.com/old' } },
      { id: 'new', title: 'New', date: '2024-01-01', acceptance: { date: '2024-05', source_url: 'https://example.com/new' } },
    ])
    expect(sorted.map((paper) => paper.id)).toEqual(['old', 'new'])
    expect(sortPapersByFirstPublicNewestFirst(sorted).map((paper) => paper.id)).toEqual(['new', 'old'])
  })

  it('sanitizes scripts and marks external links safely', () => {
    const html = renderMarkdown('\n# Hidden title\n\n## Section\n\n- Item\n\n> Quote\n\n`code`\n\n[Source](https://example.com)<script>alert(1)</script>')
    expect(html).not.toContain('<script>')
    expect(html).not.toContain('<h1>')
    expect(html).toContain('<h2>Section</h2>')
    expect(html).toContain('<ul>')
    expect(html).toContain('<blockquote>')
    expect(html).toContain('<code>code</code>')
    expect(html).toContain('target="_blank"')
    expect(html).toContain('rel="noreferrer"')
  })

  it('wraps note tables in a local horizontal scroller', () => {
    const html = renderMarkdown('| Method | Result |\n| --- | --- |\n| Sample | 1 |')
    expect(html).toContain('<div class="note-table-wrap"><table>')
  })
})
