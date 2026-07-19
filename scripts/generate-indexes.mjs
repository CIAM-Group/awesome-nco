import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadPapers, scopes } from './content-lib.mjs'
import { renderPaperIndex, replaceGeneratedIndex } from './index-lib.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const papers = await loadPapers(root)

for (const scope of scopes) {
  const readmePath = path.join(root, scope, 'README.md')
  const readme = await fs.readFile(readmePath, 'utf8')
  const generated = renderPaperIndex(papers.filter((paper) => paper.scope === scope))
  const next = replaceGeneratedIndex(readme, generated)
  if (next !== readme) await fs.writeFile(readmePath, next)
}

console.log('Updated Specialist and Generalist paper indexes.')
