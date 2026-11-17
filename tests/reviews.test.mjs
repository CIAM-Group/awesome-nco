import { describe, expect, it } from 'vitest'
import { loadReviews, validateReview } from '../scripts/review-lib.mjs'
import { loadContent } from '../scripts/content-lib.mjs'

const pending = {
  version: 1, paper_id: 'sample', note_path: 'specialist/sample.md', baseline_note_sha256: 'a'.repeat(64),
  status: 'pending', sources: [], reading_log: [], claims: [], metadata_evidence: [], citations: [],
  citation_scan_complete: false, figures_checked: false, note_crosscheck_complete: false, issues: [], corrections: [],
}
const source = { id: 'paper', url: 'https://example.com/paper.pdf', version: 'published PDF', local_path: 'research/sample.pdf', sha256: 'b'.repeat(64), pages: 3, identity_checked: true, version_checked: true }
const evidence = { source_id: 'paper', pdf_pages: [2], locator: 'Section 2' }
const completed = {
  ...pending, status: 'verified', reviewed_note_sha256: 'c'.repeat(64), sources: [source],
  reading_log: [{ source_id: 'paper', first_page: 1, last_page: 3, notes: 'Read all main text and references; no supplement is linked.' }],
  claims: ['contribution', 'method', 'experiment', 'classification'].map(category => ({ id: category, category, statement: 'A checked statement.', evidence: [evidence] })),
  metadata_evidence: [{ field: 'title', source_url: source.url, locator: 'Page 1' }],
  supplements_checked: true,
  citation_scan_complete: true, figures_checked: true, note_crosscheck_complete: true,
}
completed.metadata_evidence.push({ field: 'supplements', source_url: source.url, locator: 'Publisher landing page checked; no separate scientific supplement.' })

describe('full-text review evidence', () => {
  it('does not equate a downloaded source with a completed review', () => {
    expect(validateReview({ ...pending, sources: [source] }).status).toBe('pending')
    expect(() => validateReview({ ...completed, reading_log: [] })).toThrow('reading is incomplete')
    expect(() => validateReview({ ...completed, reading_log: [{ ...completed.reading_log[0], last_page: 2 }] })).toThrow('reading is incomplete')
  })

  it('rejects completion with unknown versions, unresolved issues, or missing checks', () => {
    expect(() => validateReview({ ...completed, sources: [{ ...source, version_checked: false }] })).toThrow('version is unchecked')
    expect(() => validateReview({ ...completed, issues: [{ message: 'Unresolved result discrepancy' }] })).toThrow('unresolved review checks')
    expect(() => validateReview({ ...completed, citation_scan_complete: false })).toThrow('unresolved review checks')
    expect(() => validateReview({ ...completed, reviewed_note_sha256: undefined })).toThrow('note hash is missing')
    expect(() => validateReview({ ...completed, supplements_checked: false })).toThrow('supplement discovery is unchecked')
    expect(() => validateReview({ ...completed, metadata_evidence: completed.metadata_evidence.filter(item => item.field !== 'supplements') })).toThrow('supplement discovery is unchecked')
  })

  it('requires evidence to refer to real pages and citations to point from the reviewed paper', () => {
    expect(() => validateReview({ ...completed, claims: [{ ...completed.claims[0], evidence: [{ ...evidence, pdf_pages: [4] }] }] })).toThrow('unknown source or page')
    const citation = { citing: 'other', cited: 'sample', reference_label: '[1]', description: 'An explicit citation.', evidence: [evidence] }
    expect(() => validateReview({ ...completed, citations: [citation] })).toThrow('invalid citation direction')
    expect(validateReview(completed).status).toBe('verified')
  })

  it('keeps the frozen review roster and publishes only supported citations', async () => {
    const reviews = await loadReviews(process.cwd())
    const content = await loadContent(process.cwd())
    expect(new Set(content.papers.map(paper => paper.id))).toEqual(new Set(reviews.keys()))
    for (const edge of content.relations) {
      expect(reviews.get(edge.citing).status).toBe('verified')
      expect(reviews.get(edge.citing).citations.some(item => item.cited === edge.cited)).toBe(true)
      expect(edge.evidence.every(item => item.source_url && item.pdf_pages.length)).toBe(true)
    }
  })
})
