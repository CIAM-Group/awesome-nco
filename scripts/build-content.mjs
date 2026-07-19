import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadPapers } from './content-lib.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const generatedDirectory = path.join(root, 'src', 'generated')
const papers = await loadPapers(root)

await fs.mkdir(generatedDirectory, { recursive: true })
await fs.writeFile(
  path.join(generatedDirectory, 'content.json'),
  `${JSON.stringify({ version: 1, papers }, null, 2)}\n`,
)

console.log(`Generated website content for ${papers.length} papers.`)
