import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadPapers } from './content-lib.mjs'
import { renderNavigationBadges, renderPaperIndex, replaceGeneratedIndex } from './index-lib.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const papers = await loadPapers(root)
const readmePath = path.join(root, 'README.md')
const readme = await fs.readFile(readmePath, 'utf8')
let next = replaceGeneratedIndex(readme, renderNavigationBadges(papers), 'navigation')
const reviewedCount = papers.filter(paper => paper.review_status === 'verified').length
let batchSummary = ''
try {
  const batch = JSON.parse(await fs.readFile(path.join(root, 'data/imports/conference-163-2026-11-17.json'), 'utf8'))
  batchSummary = ` Conference batch: **${batch.completed_papers} reviewed notes**, with **${batch.deferred_papers} deferred candidates** recorded in the [batch checklist](docs/CONFERENCE_IMPORT_2026-11-17.md).`
} catch (error) { if (error.code !== 'ENOENT') throw error }
next = replaceGeneratedIndex(next, `**Full-text review: ${reviewedCount} / ${papers.length} papers complete.** Reading coverage, source versions, corrections, and qualifications are recorded in the [review ledger](docs/FULL_TEXT_REVIEW.md). The citation graph records explicit in-text citations with source-page evidence.${batchSummary}`, 'review')

for (const scope of ['generalist', 'specialist', 'study']) {
  const generated = renderPaperIndex(papers.filter((paper) => paper.scope === scope && paper.inclusion === 'main'))
  next = replaceGeneratedIndex(next, generated, scope)
}
next = replaceGeneratedIndex(next, renderPaperIndex(papers.filter(paper => paper.inclusion === 'reference')), 'reference')

if (next !== readme) await fs.writeFile(readmePath, next)

console.log(`Updated README navigation and paper indexes for ${papers.length} papers.`)
