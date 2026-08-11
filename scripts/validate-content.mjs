import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadContent } from './content-lib.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const content = await loadContent(root)

console.log(`Validated ${content.papers.length} papers and ${content.relations.length} relations.`)
