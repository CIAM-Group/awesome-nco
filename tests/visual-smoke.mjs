import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const root = process.cwd()
const artifacts = path.join(root, 'tests', 'artifacts')
await fs.mkdir(artifacts, { recursive: true })
const generatedContent = JSON.parse(await fs.readFile(path.join(root, 'src', 'generated', 'content.json'), 'utf8'))
const expectedRelationCount = generatedContent.relations.length
const expectedPaperCount = generatedContent.papers.length
const expectedGeneralistConstructiveCount = generatedContent.papers.filter(
  (paper) => paper.scope === 'generalist' && paper.paradigm === 'constructive',
).length
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const basePath = process.env.GITHUB_ACTIONS && repositoryName ? `/${repositoryName}` : ''
const siteUrl = `http://127.0.0.1:4173${basePath}`

const vite = path.join(root, 'node_modules', 'vite', 'bin', 'vite.js')
const server = spawn(process.execPath, [vite, 'preview', '--host', '127.0.0.1', '--port', '4173'], {
  cwd: root,
  stdio: ['ignore', 'pipe', 'pipe'],
})

async function waitForServer() {
  for (let attempt = 0; attempt < 40; attempt += 1) {
    try {
      const response = await fetch(`${siteUrl}/`)
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
    await home.goto(`${siteUrl}/`, { waitUntil: 'networkidle' })
    await home.getByRole('heading', { name: 'A focused index of neural solvers.' }).waitFor()
    await assertNoHorizontalOverflow(home, `${viewport.name} home`)
    await home.screenshot({ path: path.join(artifacts, `home-${viewport.name}.png`), fullPage: true })

    const collection = await context.newPage()
    await collection.goto(`${siteUrl}/specialist`, { waitUntil: 'networkidle' })
    await collection.getByRole('heading', { name: 'Specialist Neural Solvers' }).waitFor()
    await assertNoHorizontalOverflow(collection, `${viewport.name} collection`)
    const timelineCard = collection.locator('.timeline-paper-card').first()
    await timelineCard.waitFor()
    if (!/^Accepted |^arXiv /i.test((await timelineCard.locator('.timeline-paper-card__public').innerText()).trim())) throw new Error(`${viewport.name}: timeline card does not expose acceptance/preprint timing`)
    if (await collection.locator('.select-field', { hasText: 'Timeline year' }).locator('select').count() !== 1) throw new Error(`${viewport.name}: timeline-year filter is missing`)
    if (await timelineCard.locator('.institution-marks').count() !== 1) throw new Error(`${viewport.name}: timeline institution marks were not rendered`)
    const timelineRadius = await timelineCard.evaluate((element) => getComputedStyle(element).borderRadius)
    if (timelineRadius !== '8px') throw new Error(`${viewport.name}: timeline card radius is not 8px`)
    if (await timelineCard.locator('.paper-card__summary, .paper-card__metadata').count()) {
      throw new Error(`${viewport.name}: compact timeline rendered removed detail metadata`)
    }
    if (viewport.name === 'desktop') {
      const cardBox = await timelineCard.boundingBox()
      if (!cardBox || cardBox.height < 125 || cardBox.height > 160) throw new Error('desktop: timeline card is outside the compact height target')
    }
    await collection.screenshot({ path: path.join(artifacts, `specialist-${viewport.name}.png`), fullPage: true })

    const papers = await context.newPage()
    await papers.goto(`${siteUrl}/papers?scope=generalist&paradigm=constructive`, { waitUntil: 'networkidle' })
    await papers.getByRole('heading', { name: 'All papers' }).waitFor()
    if (await papers.locator('.paper-table tbody tr').count() !== expectedGeneralistConstructiveCount) throw new Error(`${viewport.name}: combined paper filters returned an unexpected result count`)
    const expectedColumns = ['Paper', 'Institution', 'Scope', 'Paradigm', 'Problem family', 'Accepted', 'Preprint', 'Venue', 'Resources']
    const actualColumns = await papers.locator('.paper-table thead th').allTextContents()
    if (JSON.stringify(actualColumns) !== JSON.stringify(expectedColumns)) throw new Error(`${viewport.name}: papers table columns are incorrect (${JSON.stringify(actualColumns)})`)
    if (await papers.locator('.paper-table tbody .institution-marks').count() !== expectedGeneralistConstructiveCount) throw new Error(`${viewport.name}: papers table institution marks were not rendered`)
    await assertNoHorizontalOverflow(papers, `${viewport.name} papers`)
    const tableWrap = papers.locator('.paper-table-wrap')
    if (viewport.name === 'mobile') {
      const scrollable = await tableWrap.evaluate((element) => element.scrollWidth > element.clientWidth)
      if (!scrollable) throw new Error('mobile: paper table should scroll inside its wrapper')
    }
    await papers.screenshot({ path: path.join(artifacts, `papers-${viewport.name}.png`), fullPage: true })

    const compactFamily = await context.newPage()
    await compactFamily.goto(`${siteUrl}/papers?family=Multi-objective+Optimization`, { waitUntil: 'networkidle' })
    const familyCell = compactFamily.locator('.paper-table__family').first()
    await familyCell.waitFor()
    if (!(await familyCell.innerText()).includes('Multi-object. Opt.')) throw new Error(`${viewport.name}: long problem-family label was not compacted`)
    if (!(await familyCell.locator('span').getAttribute('title'))?.includes('Multi-objective Optimization')) throw new Error(`${viewport.name}: compact problem-family label lost its full tooltip`)

    const arxivOnly = await context.newPage()
    await arxivOnly.goto(`${siteUrl}/papers?q=Less+Is+More`, { waitUntil: 'networkidle' })
    const arxivOnlyCells = arxivOnly.locator('.paper-table tbody tr').first().locator('th, td')
    if ((await arxivOnlyCells.nth(5).innerText()).trim() !== '—') throw new Error(`${viewport.name}: arXiv-only paper must show an empty Accepted value`)
    if (!(await arxivOnlyCells.nth(6).innerText()).includes('Mar 2024')) throw new Error(`${viewport.name}: arXiv-only paper is missing its Preprint date`)

    const relationPage = await context.newPage()
    await relationPage.goto(`${siteUrl}/relations`, { waitUntil: 'networkidle' })
    await relationPage.getByRole('heading', { name: 'Paper relations' }).waitFor()
    await relationPage.locator('.relation-graph canvas').waitFor()
    if (await relationPage.locator('.relation-legend .relation-style-key').count() !== 4) throw new Error(`${viewport.name}: relation style legend is incomplete`)
    if (await relationPage.locator('.relation-row').count() !== expectedRelationCount) throw new Error(`${viewport.name}: relation register is incomplete`)
    if (await relationPage.getByLabel('Focus a paper').locator('option').count() !== expectedPaperCount + 1) throw new Error(`${viewport.name}: relation focus selector is incomplete`)
    await relationPage.getByLabel('Focus a paper').selectOption('attention-model')
    await assertNoHorizontalOverflow(relationPage, `${viewport.name} relations`)
    await relationPage.screenshot({ path: path.join(artifacts, `relations-${viewport.name}.png`), fullPage: true })

    const detail = await context.newPage()
    await detail.goto(`${siteUrl}/papers/attention-model`, { waitUntil: 'networkidle' })
    await detail.getByRole('heading', { name: 'Motivation' }).waitFor()
    if (await detail.locator('.paper-metadata dt', { hasText: 'Accepted' }).count() !== 1 || await detail.locator('.paper-metadata dt', { hasText: 'Preprint' }).count() !== 1) throw new Error(`${viewport.name}: detail metadata does not separate Accepted and Preprint`)
    await detail.locator('.paper-figure img').waitFor()
    const imageLoaded = await detail.locator('.paper-figure img').evaluate((image) => image.complete && image.naturalWidth > 0)
    if (!imageLoaded) throw new Error(`${viewport.name}: framework image did not load`)
    if (await detail.locator('.related-paper-card').count() === 0) throw new Error(`${viewport.name}: related papers were not rendered`)
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

    const detailWithoutFigure = await context.newPage()
    await detailWithoutFigure.goto(`${siteUrl}/papers/practical-vrp-joint-learning`, { waitUntil: 'networkidle' })
    await detailWithoutFigure.getByRole('heading', { name: 'Motivation' }).waitFor()
    if (await detailWithoutFigure.locator('.paper-figure').count()) throw new Error(`${viewport.name}: an empty framework image block was rendered`)
    await assertNoHorizontalOverflow(detailWithoutFigure, `${viewport.name} detail without figure`)

    await context.close()
  }
  console.log('Visual smoke checks passed for home, timelines, papers, relations, and detail routes at desktop and mobile sizes.')
} finally {
  if (browser) await browser.close()
  server.kill()
}

async function assertNoHorizontalOverflow(page, label) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth)
  if (overflow) {
    const offenders = await page.evaluate(() => [...document.body.querySelectorAll('*')]
      .map((element) => {
        const bounds = element.getBoundingClientRect()
        const parent = element.parentElement
        return {
          element: `${element.tagName.toLowerCase()}.${element.className}`,
          left: Math.round(bounds.left), right: Math.round(bounds.right), width: Math.round(bounds.width),
          parent: parent ? `${parent.tagName.toLowerCase()}.${parent.className}` : '',
          parentOverflow: parent ? getComputedStyle(parent).overflowX : '',
          parentWidth: parent ? Math.round(parent.getBoundingClientRect().width) : 0,
        }
      })
      .filter((item) => item.left < -1 || item.right > document.documentElement.clientWidth + 1)
      .slice(0, 8))
    throw new Error(`${label}: page has horizontal overflow (${JSON.stringify(offenders)})`)
  }
}
