import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadContent } from './content-lib.mjs'
import { publicContent } from './public-content.mjs'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const generatedDirectory = path.join(root, 'src', 'generated')
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const basePath = process.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}` : ''
const content = publicContent(await loadContent(root), { basePath })

await fs.mkdir(generatedDirectory, { recursive: true })
await fs.writeFile(
  path.join(generatedDirectory, 'content.json'),
  `${JSON.stringify(content, null, 2)}\n`,
)

console.log(`Generated website content for ${content.papers.length} papers and ${content.relations.length} relations.`)
