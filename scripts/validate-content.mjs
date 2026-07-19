import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadPapers } from './content-lib.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const papers = await loadPapers(root)

console.log(`Validated ${papers.length} papers.`)
