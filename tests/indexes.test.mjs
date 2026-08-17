import { describe, expect, it } from 'vitest'
import { indexEnd, indexStart, renderPaperIndex, replaceGeneratedIndex } from '../scripts/index-lib.mjs'

const paper = {
  id: 'example',
  title: 'Example Paper',
  paradigm: 'constructive',
  problems: ['Traveling Salesman Problem'],
  venue: 'ICLR',
  year: 2025,
  date: '2024-05-01',
  acceptance: { date: '2025-01-22', source_url: 'https://example.com/decision' },
  arxiv_url: 'https://arxiv.org/abs/2405.00001',
  institutions: ['Example University'],
}

describe('README index generation', () => {
  it('renders maintainable key-value entries without pipe tables', () => {
    const rendered = renderPaperIndex([paper])
    expect(rendered).toContain('### [Example Paper](example.md)')
    expect(rendered).toContain('- **Paradigm:** Constructive')
    expect(rendered).toContain('- **Accepted:** [2025-01-22](https://example.com/decision)')
    expect(rendered).toContain('- **arXiv:** [2024-05-01](https://arxiv.org/abs/2405.00001)')
    expect(rendered).not.toContain('|')
  })

  it('orders entries by acceptance date with the newest first', () => {
    const rendered = renderPaperIndex([
      { ...paper, id: 'older', title: 'Older Paper', date: '2025-01-01', acceptance: { date: '2024', source_url: 'https://example.com/older' } },
      { ...paper, id: 'newer', title: 'Newer Paper', date: '2020-01-01', acceptance: { date: '2025-01', source_url: 'https://example.com/newer' } },
    ])
    expect(rendered.indexOf('Newer Paper')).toBeLessThan(rendered.indexOf('Older Paper'))
  })

  it('only replaces content inside the generated markers and is idempotent', () => {
    const readme = `Before\n${indexStart}\nOld\n${indexEnd}\nAfter\n`
    const first = replaceGeneratedIndex(readme, renderPaperIndex([paper]))
    const second = replaceGeneratedIndex(first, renderPaperIndex([paper]))
    expect(first).toBe(second)
    expect(first.startsWith('Before')).toBe(true)
    expect(first.endsWith('After\n')).toBe(true)
  })

  it('fails clearly when marker boundaries are missing', () => {
    expect(() => replaceGeneratedIndex('No markers', 'Generated')).toThrow('markers are missing')
  })
})
