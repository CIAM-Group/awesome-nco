import fs from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'

const evidenceSchema = z.object({
  source_id: z.string().min(1),
  pdf_pages: z.array(z.number().int().positive()).min(1),
  locator: z.string().min(1),
}).strict()

export const citationSchema = z.object({
  citing: z.string().min(1),
  cited: z.string().min(1),
  description: z.string().min(1),
  reference_label: z.string().min(1),
  evidence: z.array(evidenceSchema).min(1),
}).strict()

export const reviewSchema = z.object({
  version: z.literal(1), paper_id: z.string().min(1), note_path: z.string().min(1),
  round_id: z.string().min(1).optional(), reviewer: z.string().min(1).optional(),
  baseline_note_sha256: z.string().regex(/^[a-f0-9]{64}$/),
  reviewed_note_sha256: z.string().regex(/^[a-f0-9]{64}$/).optional(),
  status: z.enum(['pending', 'reading', 'verified', 'blocked']),
  sources: z.array(z.object({
    id: z.string().min(1), url: z.string().url(), retrieval_url: z.string().url().optional(),
    version: z.string().min(1), local_path: z.string().min(1), sha256: z.string().regex(/^[a-f0-9]{64}$/),
    pages: z.number().int().positive(), identity_checked: z.boolean(), version_checked: z.boolean(),
    archive_member: z.string().min(1).optional(),
  }).strict()),
  reading_log: z.array(z.object({
    source_id: z.string().min(1), first_page: z.number().int().positive(), last_page: z.number().int().positive(),
    notes: z.string().min(1),
  }).strict()),
  claims: z.array(z.object({
    id: z.string().min(1), category: z.enum(['motivation', 'contribution', 'method', 'experiment', 'limitation', 'reproducibility', 'classification']),
    statement: z.string().min(1), evidence: z.array(evidenceSchema).min(1),
  }).strict()),
  metadata_evidence: z.array(z.object({
    field: z.string().min(1), source_url: z.string().url(), locator: z.string().min(1),
  }).strict()),
  citations: z.array(citationSchema), citation_scan_complete: z.boolean(), figures_checked: z.boolean(),
  supplements_checked: z.boolean().default(false),
  note_crosscheck_complete: z.boolean(), issues: z.array(z.record(z.unknown())), corrections: z.array(z.string().min(1)),
}).strict()

export function reviewCoverage(record) {
  return record.sources.map(source => {
    const pages = new Set()
    for (const segment of record.reading_log.filter(item => item.source_id === source.id)) {
      for (let page = segment.first_page; page <= segment.last_page; page++) pages.add(page)
    }
    return { source_id: source.id, read_pages: pages.size, total_pages: source.pages, complete: pages.size === source.pages }
  })
}

export function validateReview(record) {
  const review = reviewSchema.parse(record)
  const sources = new Map(review.sources.map(source => [source.id, source]))
  if (sources.size !== review.sources.length) throw new Error(`${review.paper_id}: duplicate source IDs`)
  const evidenceItems = [...review.claims.flatMap(claim => claim.evidence), ...review.citations.flatMap(citation => citation.evidence)]
  for (const item of evidenceItems) {
    const source = sources.get(item.source_id)
    if (!source || item.pdf_pages.some(page => page > source.pages)) throw new Error(`${review.paper_id}: evidence references an unknown source or page`)
  }
  for (const segment of review.reading_log) {
    const source = sources.get(segment.source_id)
    if (!source || segment.first_page > segment.last_page || segment.last_page > source.pages) throw new Error(`${review.paper_id}: invalid reading range`)
  }
  for (const citation of review.citations) {
    if (citation.citing !== review.paper_id || citation.cited === review.paper_id) throw new Error(`${review.paper_id}: invalid citation direction`)
  }
  if (review.status === 'verified') {
    if (!review.reviewed_note_sha256) throw new Error(`${review.paper_id}: reviewed note hash is missing`)
    if (!review.sources.length || reviewCoverage(review).some(source => !source.complete)) throw new Error(`${review.paper_id}: full-page reading is incomplete`)
    if (review.sources.some(source => !source.identity_checked || !source.version_checked)) throw new Error(`${review.paper_id}: source identity or version is unchecked`)
    if (!review.citation_scan_complete || !review.figures_checked || !review.note_crosscheck_complete || review.issues.length) throw new Error(`${review.paper_id}: unresolved review checks`)
    if (!review.supplements_checked || !review.metadata_evidence.some(item => /supplement/i.test(item.field))) throw new Error(`${review.paper_id}: scientific supplement discovery is unchecked`)
    const categories = new Set(review.claims.map(claim => claim.category))
    for (const category of ['contribution', 'method', 'experiment', 'classification']) {
      if (!categories.has(category)) throw new Error(`${review.paper_id}: missing ${category} evidence`)
    }
    if (review.metadata_evidence.length === 0) throw new Error(`${review.paper_id}: missing metadata evidence`)
  }
  return review
}

export async function loadReviews(root) {
  const directory = path.join(root, 'data/reviews/papers')
  let names
  try { names = await fs.readdir(directory) } catch (error) { if (error.code === 'ENOENT') return new Map(); throw error }
  const reviews = new Map()
  for (const filename of names.filter(name => name.endsWith('.json')).sort()) {
    const review = validateReview(JSON.parse(await fs.readFile(path.join(directory, filename), 'utf8')))
    if (filename !== `${review.paper_id}.json`) throw new Error(`${filename}: mismatched review ID`)
    reviews.set(review.paper_id, review)
  }
  return reviews
}
