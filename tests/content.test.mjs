import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { loadContent, loadPapers, loadRelations, parsePaper, renderMarkdown, sortPapersNewestFirst } from '../scripts/content-lib.mjs'

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
    if (Array.isArray(value)) {
      lines.push(`${key}:`, ...value.map((item) => `  - ${item}`))
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
    expect(paper.body_html).toContain('<h2>Motivation</h2>')
  })

  it('rejects invalid dates and paradigms', () => {
    expect(() => parsePaper(paperMarkdown({ date: '2024-02-31' }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })).toThrow()
    expect(() => parsePaper(paperMarkdown({ paradigm: 'hybrid' }), { filePath: 'sample-paper.md', expectedScope: 'specialist' })).toThrow()
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
  async function relationRoot(yaml) {
    const root = await fs.mkdtemp(path.join(os.tmpdir(), 'awesome-nco-relations-'))
    temporaryDirectories.push(root)
    await fs.mkdir(path.join(root, 'data'))
    await fs.writeFile(path.join(root, 'data', 'relations.yml'), yaml)
    return root
  }

  const samplePapers = [{ id: 'sample-paper' }, { id: 'other-paper' }]

  it('rejects unknown endpoints and self-relations', async () => {
    const unknown = await relationRoot('relations:\n  - papers: [sample-paper, missing-paper]\n    kind: architecture\n    description: Related architectures.\n')
    await expect(loadRelations(unknown, samplePapers)).rejects.toThrow('unknown paper endpoint')

    const self = await relationRoot('relations:\n  - papers: [sample-paper, sample-paper]\n    kind: learning\n    description: Related learning methods.\n')
    await expect(loadRelations(self, samplePapers)).rejects.toThrow('cannot connect a paper to itself')
  })

  it('rejects duplicate unordered pairs', async () => {
    const root = await relationRoot('relations:\n  - papers: [sample-paper, other-paper]\n    kind: architecture\n    description: Related architectures.\n  - papers: [other-paper, sample-paper]\n    kind: search\n    description: Related search procedures.\n')
    await expect(loadRelations(root, samplePapers)).rejects.toThrow('duplicate undirected relation')
  })

  it('requires every paper to participate in a relation', async () => {
    const root = await relationRoot('relations:\n  - papers: [sample-paper, other-paper]\n    kind: scope\n    description: Related problem scope.\n')
    await expect(loadRelations(root, [...samplePapers, { id: 'unconnected-paper' }])).rejects.toThrow('papers without relations: unconnected-paper')
  })
})

describe('content output', () => {
  it('builds the repository collection as version 2', async () => {
    const content = await loadContent(path.resolve('.'))
    expect(content.version).toBe(2)
    expect(content.relations.length).toBeGreaterThan(0)
  })
  it('sorts papers by first-public date in descending order', () => {
    const sorted = sortPapersNewestFirst([
      { id: 'old', title: 'Old', date: '2020-01-01' },
      { id: 'new', title: 'New', date: '2024-01-01' },
    ])
    expect(sorted.map((paper) => paper.id)).toEqual(['new', 'old'])
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
