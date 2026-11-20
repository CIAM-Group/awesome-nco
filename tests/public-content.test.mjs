import { describe, expect, it } from 'vitest'
import { publicContent } from '../scripts/public-content.mjs'
import { loadContent } from '../scripts/content-lib.mjs'

const paper = (id, inclusion = 'main') => ({ id, inclusion, note_path: `specialist/${id}.md`, paper_url: `https://example.com/${id}`, body_html: '<h2>Motivation</h2>' })

describe('website data boundary', () => {
  it('keeps internal reference records intact while publishing only eligible endpoints', () => {
    const source = { version: 5, papers: [paper('a'), paper('b'), paper('hidden', 'reference')], relations: [{ citing: 'a', cited: 'b' }, { citing: 'a', cited: 'hidden' }, { citing: 'hidden', cited: 'b' }] }
    const result = publicContent(source)
    expect(result.papers.map(p => p.id)).toEqual(['a', 'b'])
    expect(result.relations).toEqual([{ citing: 'a', cited: 'b' }])
    expect(source.papers).toHaveLength(3)
    expect(source.relations).toHaveLength(3)
  })
  it('rewrites retained-note links to original papers and valid notes to base-aware routes', () => {
    const source = { papers: [{ ...paper('a'), body_html: '<div class="note-table-wrap"><a href="hidden.md">Old note</a><a href="../specialist/b.md#methodology">Current</a><a href="https://example.org/other.md">Other</a></div>' }, paper('b'), paper('hidden', 'reference')], relations: [] }
    const html = publicContent(source, { basePath: '/awesome-nco' }).papers[0].body_html
    expect(html).toContain('href="https://example.com/hidden" target="_blank"')
    expect(html).toContain('href="/awesome-nco/papers/b#methodology"')
    expect(html).toContain('href="https://example.org/other.md"')
    expect(html).toContain('class="note-table-wrap"')
  })
  it('publishes the requested collection without losing archived papers or citations', async () => {
    const complete = await loadContent(process.cwd())
    const website = publicContent(complete)
    expect(complete.papers).toHaveLength(504)
    expect(complete.relations).toHaveLength(5688)
    expect(website.papers).toHaveLength(482)
    expect(website.relations).toHaveLength(4945)
    const ids = new Set(website.papers.map(p => p.id))
    expect(website.relations.every(r => ids.has(r.citing) && ids.has(r.cited))).toBe(true)
    for (const p of website.papers) {
      for (const hidden of complete.papers.filter(p => p.inclusion === 'reference')) expect(p.body_html).not.toMatch(new RegExp('/papers/' + hidden.id + '(?:["#/?])'))
    }
  }, 15000)
})
