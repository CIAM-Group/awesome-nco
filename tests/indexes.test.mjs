import { describe, expect, it } from 'vitest'
import { indexMarkers, renderNavigationBadges, renderPaperIndex, renderReviewSummary, replaceGeneratedIndex } from '../scripts/index-lib.mjs'

const paper = {
  id: 'example',
  title: 'Example Paper',
  scope: 'specialist',
  note_path: 'specialist/example.md',
  paradigm: 'constructive',
  problems: ['Traveling Salesman Problem'],
  venue: 'ICLR',
  year: 2025,
  paper_url: 'https://example.com/paper.pdf',
  date: '2024-05-01',
  acceptance: { date: '2025-01-22', source_url: 'https://example.com/decision' },
  arxiv_url: 'https://arxiv.org/abs/2405.00001',
  code_url: 'https://github.com/example/solver',
  institutions: ['Example University'],
}

describe('README index generation', () => {
  it('renders plain four-column tables with website notes and optional code links', () => {
    const rendered = renderPaperIndex([paper])
    expect(rendered).toContain('| Paper | Publication | Preprint | Links |')
    expect(rendered).toContain('<a href="https://example.com/paper.pdf">Example Paper</a>')
    expect(rendered).toContain('| ICLR 2025 |')
    expect(rendered).toContain('<a href="https://arxiv.org/abs/2405.00001">2024-05-01</a>')
    expect(rendered).toContain('<a href="https://ciam-group.github.io/awesome-nco/papers/example" target="_blank" rel="noopener noreferrer">Note</a>')
    expect(rendered).toContain('<a href="https://github.com/example/solver">Code</a>')
    expect(rendered).not.toContain('>Paper</a>')
    expect(rendered).not.toContain('shields.io')
    expect(rendered).not.toContain('<img')
    expect(rendered).not.toContain('- **Paradigm:**')
    expect(rendered).not.toContain('specialist/example.md')
  })

  it('groups by publication year and only expands the newest year', () => {
    const rendered = renderPaperIndex([
      { ...paper, id: 'older-year', title: 'Older Publication', year: 2025, acceptance: { date: '2027', source_url: 'https://example.com/decision' } },
      { ...paper, id: 'newer-year', title: 'Newer Publication', year: 2026, date: '2020-01-01', acceptance: { date: '2021', source_url: 'https://example.com/decision' } },
      { ...paper, id: 'same-year', title: 'Same Publication Year', year: 2025 },
    ])
    expect(rendered).toContain('<summary><strong>2026</strong> · 1 paper</summary>')
    expect(rendered).toContain('<summary><strong>2025</strong> · 2 papers</summary>')
    expect(rendered.indexOf('Newer Publication')).toBeLessThan(rendered.indexOf('Older Publication'))
    expect(rendered.match(/<details open>/g)).toHaveLength(1)
    expect(rendered.match(/<details>/g)).toHaveLength(1)
    expect(rendered.startsWith('<details open>')).toBe(true)
  })

  it('orders entries within a year by acceptance date with the newest first', () => {
    const source = [
      { ...paper, id: 'fallback', title: 'Fallback Paper', date: '2024-06-01', acceptance: undefined },
      { ...paper, id: 'older', title: 'Older Paper', date: '2025-01-01', acceptance: { date: '2024', source_url: 'https://example.com/older' } },
      { ...paper, id: 'newer', title: 'Newer Paper', date: '2020-01-01', acceptance: { date: '2025-01', source_url: 'https://example.com/newer' } },
    ]
    const rendered = renderPaperIndex(source)
    expect(rendered.indexOf('Newer Paper')).toBeLessThan(rendered.indexOf('Fallback Paper'))
    expect(rendered.indexOf('Fallback Paper')).toBeLessThan(rendered.indexOf('Older Paper'))
    expect(source.map((item) => item.id)).toEqual(['fallback', 'older', 'newer'])
  })

  it('uses an empty preprint cell and omits code when resources are unavailable', () => {
    const rendered = renderPaperIndex([
      { ...paper, arxiv_url: undefined, code_url: undefined },
    ])
    expect(rendered).toContain('| ICLR 2025 | — |')
    expect(rendered).toContain('>Note</a>')
    expect(rendered).not.toContain('>Code</a>')
    expect(rendered).not.toContain('arxiv.org')
  })

  it('escapes table text and link attributes without introducing additional columns', () => {
    const rendered = renderPaperIndex([{
      ...paper,
      title: 'A | <B> & "C" \'D\'\nNext',
      paper_url: 'https://example.com/?value="x"&other=<tag>|test',
      venue: 'Venue | <Track>',
    }])
    const row = rendered.split('\n').find((line) => line.startsWith('| <a '))
    expect(row).toContain('A &#124; &lt;B&gt; &amp; &quot;C&quot; &#39;D&#39; Next')
    expect(row).toContain('value=&quot;x&quot;&amp;other=&lt;tag&gt;&#124;test')
    expect(row).toContain('Venue &#124; &lt;Track&gt; 2025')
    expect(row.match(/\|/g)).toHaveLength(5)
  })

  it('renders an empty collection clearly', () => {
    expect(renderPaperIndex([])).toBe('_No papers have been added yet._')
  })

  it('links retained reference notes to the repository instead of a hidden website page', () => {
    const rendered = renderPaperIndex([{ ...paper, inclusion: 'reference' }])
    expect(rendered).toContain('https://github.com/CIAM-Group/awesome-nco/blob/main/specialist/example.md')
    expect(rendered).not.toContain('https://ciam-group.github.io/awesome-nco/papers/example')
  })

  it('derives navigation badge counts from the current collections', () => {
    const rendered = renderNavigationBadges([
      paper,
      { ...paper, id: 'generalist-one', scope: 'generalist' },
      { ...paper, id: 'generalist-two', scope: 'generalist' },
      { ...paper, id: 'reference-one', inclusion: 'reference' },
      { ...paper, id: 'study-one', scope: 'study' },
    ])
    expect(rendered.match(/img\.shields\.io/g)).toHaveLength(4)
    expect(rendered).toContain('https://ciam-group.github.io/awesome-nco/')
    expect(rendered).toMatch(/Generalist-2-/)
    expect(rendered).toMatch(/Specialist-1-/)
    expect(rendered).toMatch(/Studies-1-/)
    expect(rendered).not.toContain('References-')
    expect(rendered).not.toContain('#reference-collection')
    expect(rendered).toContain('#generalist-solvers')
    expect(rendered).toContain('#specialist-solvers')
    expect(renderNavigationBadges([])).toMatch(/Generalist-0-/)
    expect(renderNavigationBadges([])).toMatch(/Specialist-0-/)
  })

  it('keeps generated review progress hidden while updating its counts', () => {
    const rendered = renderReviewSummary([
      { ...paper, review_status: 'verified' },
      { ...paper, id: 'pending', review_status: 'pending' },
    ], { completed_papers: 140, deferred_papers: 23 })
    expect(rendered.startsWith('<!--\n')).toBe(true)
    expect(rendered.endsWith('\n-->')).toBe(true)
    expect(rendered).toContain('Full-text review: 1 / 2 papers complete.')
    expect(rendered).toContain('140 reviewed notes')
    expect(rendered).toContain('23 deferred candidates')
    expect(renderReviewSummary([])).toContain('0 / 0 papers complete.')
    expect(renderReviewSummary([])).not.toContain('Conference batch:')
    const readme = `${indexMarkers.review.start}\nOld progress\n${indexMarkers.review.end}`
    const updated = replaceGeneratedIndex(readme, rendered, 'review')
    expect(replaceGeneratedIndex(updated, rendered, 'review')).toBe(updated)
  })

  it('only replaces the selected generated section and is idempotent', () => {
    const navigation = indexMarkers.navigation
    const generalist = indexMarkers.generalist
    const specialist = indexMarkers.specialist
    const readme = [
      'Before', navigation.start, 'Navigation', navigation.end,
      'Generalist introduction', generalist.start, 'Old', generalist.end,
      'Specialist introduction', specialist.start, 'Specialist papers', specialist.end,
      'After', '',
    ].join('\n')
    const generated = renderPaperIndex([{ ...paper, scope: 'generalist' }])
    const first = replaceGeneratedIndex(readme, generated, 'generalist')
    const second = replaceGeneratedIndex(first, generated, 'generalist')
    expect(first).toBe(second)
    expect(first.startsWith('Before')).toBe(true)
    expect(first.endsWith('After\n')).toBe(true)
    expect(first).toContain(`${navigation.start}\nNavigation\n${navigation.end}`)
    expect(first).toContain(`${specialist.start}\nSpecialist papers\n${specialist.end}`)
    expect(first).toContain('Generalist introduction')
    expect(first).toContain('Specialist introduction')

    const withNavigation = replaceGeneratedIndex(first, 'New navigation', 'navigation')
    expect(withNavigation).toContain(`${navigation.start}\nNew navigation\n${navigation.end}`)
    expect(withNavigation).toContain(`${generalist.start}\n${generated}\n${generalist.end}`)
  })

  it('fails clearly when selected marker boundaries are missing or reversed', () => {
    const { start, end } = indexMarkers.generalist
    expect(() => replaceGeneratedIndex('No markers', 'Generated', 'generalist')).toThrow('markers are missing')
    expect(() => replaceGeneratedIndex(`${end}\nOld\n${start}`, 'Generated', 'generalist')).toThrow('markers are missing')
  })
})
