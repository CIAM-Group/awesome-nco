import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'
import { afterEach, describe, expect, it } from 'vitest'
import { loadPapers, parsePaper, renderMarkdown, sortPapersNewestFirst } from '../scripts/content-lib.mjs'

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

describe('content output', () => {
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
})
