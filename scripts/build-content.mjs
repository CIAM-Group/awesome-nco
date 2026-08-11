import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadContent } from './content-lib.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const generatedDirectory = path.join(root, 'src', 'generated')
const content = await loadContent(root)

await fs.mkdir(generatedDirectory, { recursive: true })
await fs.writeFile(
  path.join(generatedDirectory, 'content.json'),
  `${JSON.stringify(content, null, 2)}\n`,
)

console.log(`Generated website content for ${content.papers.length} papers and ${content.relations.length} relations.`)
