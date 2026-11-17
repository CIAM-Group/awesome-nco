import fs from 'node:fs/promises'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { loadContent } from '../scripts/content-lib.mjs'
import { loadReviews } from '../scripts/review-lib.mjs'

const manifest = JSON.parse(await fs.readFile(new URL('../data/imports/iclr-neurips-icml-2026-11.json', import.meta.url), 'utf8'))
const conferenceManifest = JSON.parse(await fs.readFile(new URL('../data/imports/conference-163-2026-11-17.json', import.meta.url), 'utf8'))
const audit = JSON.parse(await fs.readFile(new URL('../docs/nco-publication-audit-2026-11-16.json', import.meta.url), 'utf8'))
const content = await loadContent(process.cwd())
const reviews = await loadReviews(process.cwd())
const ids = new Set(manifest.papers.map(paper => paper.paper_id))

describe('ICLR, NeurIPS and ICML import', () => {
  it('imports the exact approved batch with one stable note per audit record', () => {
    expect(manifest.papers).toHaveLength(272)
    expect(ids.size).toBe(272)
    expect(new Set(manifest.papers.map(paper => paper.audit_id)).size).toBe(272)
    expect(content.papers).toHaveLength(manifest.baseline_papers + manifest.added_papers + conferenceManifest.active_candidates)
    const venues = Object.fromEntries(['ICLR', 'NeurIPS', 'ICML'].map(venue => [venue, manifest.papers.filter(paper => paper.venue === venue).length]))
    expect(venues).toEqual({ ICLR: 78, NeurIPS: 116, ICML: 78 })
    for (const entry of manifest.papers) {
      const note = content.papers.find(paper => paper.id === entry.paper_id)
      expect(note, entry.audit_id).toBeDefined()
      for (const field of ['note_path', 'venue', 'year', 'scope', 'paper_type']) {
        if (note[field] === entry[field]) continue
        // The import manifest is historical provenance; fresh source evidence may correct its classifications.
        const review = reviews.get(entry.paper_id)
        expect(review?.status, `${entry.paper_id}: changed ${field} requires a completed review`).toBe('verified')
        if (['note_path', 'scope', 'paper_type'].includes(field)) {
          expect(review.claims.some(claim => claim.category === 'classification')).toBe(true)
        } else {
          expect(review.metadata_evidence.length).toBeGreaterThan(0)
        }
      }
      expect(new URL(entry.publication_source_url).protocol).toBe('https:')
      expect(entry.reading_copy.sha256).toMatch(/^[a-f0-9]{64}$/)
      expect(entry.reading_copy.pages).toBeGreaterThan(0)
    }
  })

  it('retains the historical graph for audit and requires evidence for the replacement graph', async () => {
    const baseline = JSON.parse(await fs.readFile(path.resolve('data/reviews/baseline.json'), 'utf8'))
    expect(baseline.original_relations.filter(relation => relation.papers.every(id => !ids.has(id)))).toHaveLength(259)
    expect(baseline.original_relations.filter(relation => relation.papers.some(id => ids.has(id)))).toHaveLength(manifest.new_relation_pairs)
    const pairs = content.relations.map(relation => `${relation.citing}::${relation.cited}`)
    expect(new Set(pairs).size).toBe(content.relations.length)
    expect(content.relations.every(relation => relation.kind === 'citation' && relation.evidence.length > 0)).toBe(true)
  })

  it('closes three-venue coverage and reconciles the broader audit', async () => {
    const scopeAudit = JSON.parse(await fs.readFile(path.resolve('data/reviews/conference-163-scope-audit.json'), 'utf8'))
    expect(audit.counts.qualified_total).toBe(scopeAudit.qualified_total_after_boundary_corrections)
    expect(scopeAudit.initial_qualified_total - scopeAudit.new_topic_boundary_references).toBe(audit.counts.qualified_total)
    expect(audit.counts.already_covered + audit.counts.to_add).toBe(audit.counts.qualified_total)
    expect(audit.counts.repository_note_count).toBe(content.papers.length)
    expect(audit.counts.already_covered).toBeGreaterThanOrEqual(349)
    for (const entry of manifest.papers) {
      expect(audit.records.find(record => record.audit_id === entry.audit_id)).toMatchObject({ in_repository: true, existing_ids: expect.arrayContaining([entry.paper_id]) })
    }
    expect(audit.records.filter(record => record.audit_status === 'eligible' && !record.in_repository && ['ICLR', 'NeurIPS', 'ICML'].includes(record.venue))).toEqual([])
    const checklist = await fs.readFile(path.resolve('docs/NCO_PAPER_CHECKLIST_2026-11.md'), 'utf8')
    expect([...checklist.matchAll(/^- \[ \]/gm)]).toHaveLength(audit.counts.to_add)
  })

  it('keeps existing identifiers while correcting collection and workshop metadata', () => {
    expect(content.papers.find(paper => paper.id === 'softdist')).toMatchObject({ scope: 'study', paper_type: 'analysis', note_path: 'studies/softdist.md' })
    expect(content.papers.find(paper => paper.id === 'neural-combinatorial-optimization')).toMatchObject({ venue: 'ICLR Workshop' })
  })
})
