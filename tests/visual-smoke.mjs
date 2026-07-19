import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const root = process.cwd()
const artifacts = path.join(root, 'tests', 'artifacts')
await fs.mkdir(artifacts, { recursive: true })

const vite = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')
const server = spawn(process.execPath, [vite, 'preview', '--host', '127.0.0.1', '--port', '4173'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
})

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch('http://127.0.0.1:4173/')
      if (response.ok) return
    } catch {
      // The preview server is still starting.
    }
    await new Promise((resolve) => setTimeout(resolve, 250))
  }
  throw new Error('Preview server did not start in time.')
}

let browser
try {
  await waitForServer()
  browser = await chromium.launch({ headless: true })
  const viewports = [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'mobile', width: 390, height: 844 },
  ]

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })

    const home = await context.newPage()
    await home.goto('http://127.0.0.1:4173/', { waitUntil: 'networkidle' })
    await home.getByRole('heading', { name: 'A focused index of neural solvers.' }).waitFor()
    await assertNoHorizontalOverflow(home, `${viewport.name} home`)
    await home.screenshot({ path: path.join(artifacts, `home-${viewport.name}.png`), fullPage: true })

    const collection = await context.newPage()
    await collection.goto('http://127.0.0.1:4173/specialist', { waitUntil: 'networkidle' })
    await collection.getByRole('heading', { name: 'Specialist Neural Solvers' }).waitFor()
    await assertNoHorizontalOverflow(collection, `${viewport.name} collection`)
    await collection.screenshot({ path: path.join(artifacts, `specialist-${viewport.name}.png`), fullPage: true })

    const detail = await context.newPage()
    await detail.goto('http://127.0.0.1:4173/papers/attention-model', { waitUntil: 'networkidle' })
    await detail.getByRole('heading', { name: 'Motivation' }).waitFor()
    await assertNoHorizontalOverflow(detail, `${viewport.name} detail`)
    const metadataBox = await detail.locator('.paper-metadata').boundingBox()
    const noteBox = await detail.locator('.paper-note').boundingBox()
    if (!metadataBox || !noteBox) throw new Error(`${viewport.name}: detail columns were not rendered`)
    if (viewport.name === 'mobile' && metadataBox.y >= noteBox.y) {
      throw new Error('mobile: metadata must appear above the paper note')
    }
    if (viewport.name === 'desktop' && metadataBox.x >= noteBox.x) {
      throw new Error('desktop: metadata must appear beside the paper note')
    }
    await detail.screenshot({ path: path.join(artifacts, `detail-${viewport.name}.png`), fullPage: true })

    await context.close()
  }
  console.log('Visual smoke checks passed for home, collection, and direct detail routes at desktop and mobile sizes.')
} finally {
  if (browser) await browser.close()
  server.kill()
}

async function assertNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  if (overflow) throw new Error(`${label}: page has horizontal overflow`)
}
