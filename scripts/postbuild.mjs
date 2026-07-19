import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
await fs.copyFile(path.join(dist, 'index.html'), path.join(dist, '404.html'))
console.log('Created GitHub Pages SPA fallback.')
