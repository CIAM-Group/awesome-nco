import fs from 'node:fs/promises'
import { describe, expect, it } from 'vitest'
import { loadContent } from '../scripts/content-lib.mjs'
import { loadReviews } from '../scripts/review-lib.mjs'

const readJson = async relative => JSON.parse(await fs.readFile(new URL(relative, import.meta.url), 'utf8'))
const manifest = await readJson('../data/imports/conference-163-2026-11-17.json')
const deferrals = await readJson('../data/imports/conference-163-deferrals-2026-11-17.json')
const baseline = await readJson('../data/reviews/baseline.json')
const { papers, relations } = await loadContent(process.cwd())
const reviews = await loadReviews(process.cwd())
const active = manifest.papers.filter(paper => paper.status !== 'deferred')
const deferred = manifest.papers.filter(paper => paper.status === 'deferred')

describe('approved 163-conference-paper candidate batch', () => {
  it('retains every candidate with exactly one active or user-deferred disposition', () => {
    expect(manifest.papers).toHaveLength(163)
    expect(new Set(manifest.papers.map(paper => paper.paper_id)).size).toBe(163)
    expect(new Set(manifest.papers.map(paper => paper.audit_id)).size).toBe(163)
    expect(active.length + deferred.length).toBe(163)
    expect(active.length).toBe(manifest.active_candidates)
    expect(deferred.length).toBe(manifest.deferred_papers)
    expect(baseline.paper_ids).toHaveLength(364 + active.length)
    expect(papers).toHaveLength(364 + active.length)
    for (const entry of active) {
      expect(papers.find(paper => paper.id === entry.paper_id)?.note_path, entry.paper_id).toBe(entry.note_path)
      expect(reviews.get(entry.paper_id)?.note_path, entry.paper_id).toBe(entry.note_path)
    }
  })

  it('preserves deferred drafts and evidence without public nodes or invented verification', async () => {
    expect(new Set(deferred.map(paper => paper.paper_id))).toEqual(new Set(deferrals.papers.map(paper => paper.paper_id)))
    const authorized = new Set(deferrals.authorization_events.flatMap(event => event.paper_ids))
    for (const entry of deferred) {
      expect(authorized.has(entry.paper_id), entry.paper_id).toBe(true)
      expect(papers.some(paper => paper.id === entry.paper_id)).toBe(false)
      expect(reviews.has(entry.paper_id)).toBe(false)
      expect(baseline.paper_ids.includes(entry.paper_id)).toBe(false)
      expect(relations.some(edge => edge.citing === entry.paper_id || edge.cited === entry.paper_id)).toBe(false)
      const record = JSON.parse(await fs.readFile(entry.review_path, 'utf8'))
      expect(record.status).not.toBe('verified')
      expect(record.note_path).toBe(entry.note_path)
      expect((await fs.readFile(entry.note_path, 'utf8')).length).toBeGreaterThan(0)
      expect(deferrals.papers.find(row => row.paper_id === entry.paper_id).retained_sources).toBe(record.sources.length)
    }
  })

  it('counts completed reading from verified evidence, with matching note and source provenance', () => {
    const verified = active.filter(entry => reviews.get(entry.paper_id)?.status === 'verified')
    expect(manifest.completed_papers).toBe(verified.length)
    expect(manifest.added_papers).toBe(verified.length)
    for (const entry of verified) {
      const review = reviews.get(entry.paper_id)
      expect(entry.review_status).toBe('verified')
      expect(entry.reading_copy.sha256).toBe(review.sources[0].sha256)
      expect(entry.reviewed_note_sha256).toBe(review.reviewed_note_sha256)
      expect(entry.reviewed_source_pages).toBe(review.sources.reduce((sum, source) => sum + source.pages, 0))
      expect(review.citation_scan_complete && review.supplements_checked && review.note_crosscheck_complete).toBe(true)
    }
  })

  it('retains recovery history and requires a fully verified active record before restoring a deferred candidate', () => {
    for (const recovery of deferrals.resolved_papers ?? []) {
      expect(deferred.some(entry => entry.paper_id === recovery.paper_id)).toBe(false)
      const review = reviews.get(recovery.paper_id)
      expect(review?.status).toBe('verified')
      expect(recovery.status).toBe('completed_after_source_recovery')
      expect(recovery.reason.length).toBeGreaterThan(0)
      expect(recovery.recovery_evidence.length).toBeGreaterThan(0)
      expect(recovery.verified_registered_sources).toBe(review.sources.length)
      expect(recovery.verified_registered_pages).toBe(review.sources.reduce((sum, source) => sum + source.pages, 0))
    }
  })

  it('distinguishes fully read topic-boundary references from qualifying NCO research resources', async () => {
    const scopeAudit = await readJson('../data/reviews/conference-163-scope-audit.json')
    for (const decision of scopeAudit.decisions) {
      const paper = papers.find(entry => entry.id === decision.paper_id)
      expect(paper?.scope).toBe('study')
      expect(reviews.get(paper.id).status).toBe('verified')
      expect(paper.inclusion).toBe(decision.decision === 'boundary' ? 'reference' : 'main')
      if (decision.decision === 'boundary') expect(paper.inclusion_reason).toBe(decision.reason)
    }
  })

  it('applies manually reviewed old-to-new citations and rejects bibliography-only matches', async () => {
    const expansion = await readJson('../data/reviews/conference-163-citation-expansion.json')
    const pairs = new Set(expansion.decisions.map(decision => `${decision.citing}::${decision.cited}`))
    expect(pairs.size).toBe(expansion.candidate_edges)
    const frozenIds = new Set((await readJson('../data/reviews/archives/completed-364-2026-11-17/baseline.json')).paper_ids)
    for (const decision of expansion.decisions) {
      expect(frozenIds.has(decision.citing)).toBe(true)
      const edge = relations.find(entry => entry.citing === decision.citing && entry.cited === decision.cited)
      if (decision.status === 'accepted' && decision.disposition === 'active-supported-edge') {
        expect(edge, `${decision.citing} → ${decision.cited}`).toBeDefined()
        expect(edge.evidence.map(({ source_url, ...evidence }) => evidence)).toEqual(decision.evidence)
      } else {
        expect(edge).toBeUndefined()
      }
    }
  })
})
