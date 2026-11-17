import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadPapers } from './content-lib.mjs'
import { renderNavigationBadges, renderPaperIndex, renderReviewSummary, replaceGeneratedIndex } from './index-lib.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const papers = await loadPapers(root)
const readmePath = path.join(root, 'README.md')
const readme = await fs.readFile(readmePath, 'utf8')
let next = replaceGeneratedIndex(readme, renderNavigationBadges(papers), 'navigation')
let batch
try {
  batch = JSON.parse(await fs.readFile(path.join(root, 'data/imports/conference-163-2026-11-17.json'), 'utf8'))
} catch (error) { if (error.code !== 'ENOENT') throw error }
next = replaceGeneratedIndex(next, renderReviewSummary(papers, batch), 'review')

for (const scope of ['generalist', 'specialist', 'study']) {
  const generated = renderPaperIndex(papers.filter((paper) => paper.scope === scope && paper.inclusion === 'main'))
  next = replaceGeneratedIndex(next, generated, scope)
}
next = replaceGeneratedIndex(next, renderPaperIndex(papers.filter(paper => paper.inclusion === 'reference')), 'reference')

if (next !== readme) await fs.writeFile(readmePath, next)

console.log(`Updated README navigation and paper indexes for ${papers.length} papers.`)
