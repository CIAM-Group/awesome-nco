import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const root = process.cwd()
const artifacts = path.join(root, 'tests', 'artifacts')
await fs.mkdir(artifacts, { recursive: true })
const generatedContent = JSON.parse(await fs.readFile(path.join(root, 'src', 'generated', 'content.json'), 'utf8'))
const mainPapers = generatedContent.papers.filter(paper => paper.inclusion === 'main')
const mainIds = new Set(mainPapers.map(paper => paper.id))
const mainRelations = generatedContent.relations.filter(edge => mainIds.has(edge.citing) && mainIds.has(edge.cited))
const expectedRelationCount = mainRelations.length
const expectedPaperCount = mainPapers.length
const referencePapers = generatedContent.papers.filter(paper => paper.inclusion === 'reference')
const studyIds = new Set(generatedContent.papers.filter(paper => paper.scope === 'study').map(paper => paper.id))
const expectedBenchmarkCount = mainPapers.filter(paper => paper.scope === 'study' && paper.paper_type === 'benchmark').length
const expectedGeneralistConstructiveCount = mainPapers.filter(
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
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH })
  const viewports = [
    { name: 'desktop', width: 1440, height: 1000 },
    { name: 'mobile', width: 390, height: 844 },
  ]

  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })
    const pageErrors = []
    context.on('page', page => page.on('pageerror', error => pageErrors.push(error.message)))

    const home = await context.newPage()
    await home.goto(`${siteUrl}/`, { waitUntil: 'networkidle' })
    await home.getByRole('heading', { name: 'A focused index of neural optimization research.' }).waitFor()
    await assertNoHorizontalOverflow(home, `${viewport.name} home`)
    await home.screenshot({ path: path.join(artifacts, `home-${viewport.name}.png`), fullPage: true })

    const collection = await context.newPage()
    await collection.goto(`${siteUrl}/specialist`, { waitUntil: 'networkidle' })
    await collection.getByRole('heading', { name: 'Specialist Neural Solvers' }).waitFor()
    await assertNoHorizontalOverflow(collection, `${viewport.name} collection`)
    const timelineCard = collection.locator('.timeline-paper-card').first()
    await timelineCard.waitFor()
    if (!/^Accepted |^Published |^arXiv /i.test((await timelineCard.locator('.timeline-paper-card__public').innerText()).trim())) throw new Error(`${viewport.name}: timeline card does not expose acceptance/preprint timing`)
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
    await collection.screenshot({ path: path.join(artifacts, `specialist-${viewport.name}.png`), fullPage: false })

    const studies = await context.newPage()
    await studies.goto(`${siteUrl}/studies?type=benchmark`, { waitUntil: 'networkidle' })
    await studies.getByRole('heading', { name: 'Research Studies', exact: true }).waitFor()
    if (await studies.locator('.timeline-paper-card').count() !== expectedBenchmarkCount) throw new Error(`${viewport.name}: study type filter returned an unexpected count`)
    await studies.getByLabel('Paper type', { exact: true }).selectOption('theory')
    const expectedTheoryCount = mainPapers.filter(paper => paper.scope === 'study' && paper.paper_type === 'theory').length
    if (await studies.locator('.timeline-paper-card').count() !== expectedTheoryCount) throw new Error(`${viewport.name}: changing study type did not update the timeline`)
    await assertNoHorizontalOverflow(studies, `${viewport.name} studies`)
    await studies.screenshot({ path: path.join(artifacts, `studies-${viewport.name}.png`), fullPage: false })

    const papers = await context.newPage()
    await papers.goto(`${siteUrl}/papers?scope=generalist&paradigm=constructive`, { waitUntil: 'networkidle' })
    await papers.getByRole('heading', { name: 'All papers' }).waitFor()
    if (await papers.locator('.paper-table tbody tr').count() !== expectedGeneralistConstructiveCount) throw new Error(`${viewport.name}: combined paper filters returned an unexpected result count`)
    const expectedColumns = ['Paper', 'Institution', 'Scope', 'Paradigm / Type', 'Problem family', 'Accepted', 'Published', 'Preprint', 'Venue', 'Resources']
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
    await papers.goto(`${siteUrl}/papers?scope=study&type=benchmark`, { waitUntil: 'networkidle' })
    if (await papers.locator('.paper-table tbody tr').count() !== expectedBenchmarkCount) throw new Error(`${viewport.name}: all-papers study filter returned an unexpected count`)

    const compactFamily = await context.newPage()
    await compactFamily.goto(`${siteUrl}/papers?family=Multi-objective+Optimization`, { waitUntil: 'networkidle' })
    const familyCell = compactFamily.locator('.paper-table__family').first()
    await familyCell.waitFor()
    if (!(await familyCell.innerText()).includes('Multi-object. Opt.')) throw new Error(`${viewport.name}: long problem-family label was not compacted`)
    if (!(await familyCell.locator('span').getAttribute('title'))?.includes('Multi-objective Optimization')) throw new Error(`${viewport.name}: compact problem-family label lost its full tooltip`)

    const arxivOnly = await context.newPage()
    const preprint = generatedContent.papers.find(paper => paper.venue === 'arXiv')
    if (!preprint) throw new Error('No retained arXiv fixture available for publication-status check')
    await arxivOnly.goto(`${siteUrl}/papers?inclusion=all&q=${encodeURIComponent(preprint.title)}`, { waitUntil: 'networkidle' })
    const arxivOnlyCells = arxivOnly.locator('.paper-table tbody tr').first().locator('th, td')
    if ((await arxivOnlyCells.nth(5).innerText()).trim() !== '—') throw new Error(`${viewport.name}: arXiv-only paper must show an empty Accepted value`)
    if (await arxivOnlyCells.nth(7).locator('time').getAttribute('datetime') !== preprint.date) throw new Error(`${viewport.name}: arXiv-only paper is missing its Preprint date`)

    const references = await context.newPage()
    await references.goto(`${siteUrl}/references`, { waitUntil: 'networkidle' })
    await references.getByRole('heading', { name: 'Reference collection', exact: true }).waitFor()
    if (await references.locator('.paper-table tbody tr').count() !== referencePapers.length) throw new Error(`${viewport.name}: reference collection count is incorrect`)
    await assertNoHorizontalOverflow(references, `${viewport.name} reference collection`)
    await references.screenshot({ path: path.join(artifacts, `references-${viewport.name}.png`), fullPage: false })
    await papers.goto(`${siteUrl}/papers`, { waitUntil: 'networkidle' })
    await papers.getByLabel('Collection', { exact: true }).selectOption('all')
    if (await papers.locator('.paper-table tbody tr').count() !== generatedContent.papers.length) throw new Error(`${viewport.name}: all-notes collection selector failed`)
    await papers.getByLabel('Collection', { exact: true }).selectOption('main')
    if (await papers.locator('.paper-table tbody tr').count() !== expectedPaperCount) throw new Error(`${viewport.name}: main collection selector failed`)

    const relationPage = await context.newPage()
    await relationPage.goto(`${siteUrl}/relations`, { waitUntil: 'networkidle' })
    await relationPage.getByRole('heading', { name: 'Paper citations' }).waitFor()
    await relationPage.locator('.relation-graph canvas').waitFor()
    if (await relationPage.locator('.relation-legend .relation-style-key').count() !== 1) throw new Error(`${viewport.name}: citation legend is incorrect`)
    if (await relationPage.locator('.relation-row').count() !== expectedRelationCount) throw new Error(`${viewport.name}: relation register is incomplete`)
    if (await relationPage.getByLabel('Focus a paper').locator('option').count() !== expectedPaperCount + 1) throw new Error(`${viewport.name}: relation focus selector is incomplete`)
    await relationPage.getByLabel('Collection', { exact: true }).selectOption('all')
    if (await relationPage.locator('.relation-row').count() !== generatedContent.relations.length) throw new Error(`${viewport.name}: reference-inclusive citation count is incorrect`)
    if (await relationPage.getByLabel('Focus a paper').locator('option').count() !== generatedContent.papers.length + 1) throw new Error(`${viewport.name}: graph omitted retained isolated nodes`)
    await relationPage.getByLabel('Collection', { exact: true }).selectOption('main')
    await relationPage.getByLabel('Focus a paper').selectOption('attention-model')
    await relationPage.waitForTimeout(800)
    await assertNoHorizontalOverflow(relationPage, `${viewport.name} relations`)
    await relationPage.screenshot({ path: path.join(artifacts, `relations-${viewport.name}.png`), fullPage: false })
    await relationPage.getByLabel('Connected collection', { exact: true }).selectOption('study')
    await relationPage.getByLabel('Relation', { exact: true }).selectOption('citation')
    const expectedStudyCitations = mainRelations.filter(relation => relation.papers.some(id => studyIds.has(id))).length
    if (await relationPage.locator('.relation-row').count() !== expectedStudyCitations) throw new Error(`${viewport.name}: graph scope and citation filters returned an unexpected count`)
    if (await relationPage.locator('.relation-row a[href*="#page="]').count() < expectedStudyCitations) throw new Error(`${viewport.name}: citation evidence links are missing`)

    const detail = await context.newPage()
    await detail.goto(`${siteUrl}/papers/attention-model`, { waitUntil: 'networkidle' })
    await detail.getByRole('heading', { name: 'Motivation' }).waitFor()
    if (await detail.locator('.paper-metadata dt', { hasText: 'Accepted' }).count() !== 1 || await detail.locator('.paper-metadata dt', { hasText: 'Preprint' }).count() !== 1) throw new Error(`${viewport.name}: detail metadata does not separate Accepted and Preprint`)
    await detail.locator('.paper-figure img').waitFor()
    const imageLoaded = await detail.locator('.paper-figure img').evaluate((image) => image.complete && image.naturalWidth > 0)
    if (!imageLoaded) throw new Error(`${viewport.name}: framework image did not load`)
    await assertReviewAndCitations(detail, generatedContent.papers.find(paper => paper.id === 'attention-model'))
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
    const paperWithoutFigure = generatedContent.papers.find(paper => !paper.figure)
    if (!paperWithoutFigure) throw new Error('No figure-free paper available for the optional-figure check')
    await detailWithoutFigure.goto(`${siteUrl}/papers/${paperWithoutFigure.id}`, { waitUntil: 'networkidle' })
    await detailWithoutFigure.getByRole('heading', { name: 'Motivation' }).waitFor()
    if (await detailWithoutFigure.locator('.paper-figure').count()) throw new Error(`${viewport.name}: an empty framework image block was rendered`)
    await assertNoHorizontalOverflow(detailWithoutFigure, `${viewport.name} detail without figure`)

    const importedDetail = await context.newPage()
    await importedDetail.goto(`${siteUrl}/papers/fmip`, { waitUntil: 'networkidle' })
    await importedDetail.getByRole('heading', { name: 'Reproducibility', exact: true }).waitFor()
    if (await importedDetail.locator('.paper-metadata dt', { hasText: 'Published' }).count() !== 1) throw new Error(`${viewport.name}: imported paper is missing its publication evidence`)
    if (!await importedDetail.locator('.paper-figure img').evaluate(image => image.complete && image.naturalWidth > 0)) throw new Error(`${viewport.name}: imported original figure failed to load`)
    await assertNoHorizontalOverflow(importedDetail, `${viewport.name} imported detail`)
    await importedDetail.screenshot({ path: path.join(artifacts, `imported-detail-${viewport.name}.png`), fullPage: true })

    await importedDetail.goto(`${siteUrl}/papers/beyond-heatmap-mcts`, { waitUntil: 'networkidle' })
    if ((await importedDetail.locator('.paper-metadata dt', { hasText: 'Paper type' }).count()) !== 1) throw new Error(`${viewport.name}: study detail is incorrectly classified as a solver`)
    if (await importedDetail.locator('a.back-link').getAttribute('href') !== `${basePath}/studies`) throw new Error(`${viewport.name}: study detail links to the wrong collection`)

    if (pageErrors.length) throw new Error(`${viewport.name}: browser errors: ${pageErrors.join('; ')}`)

    await context.close()
  }
  for (const viewport of viewports) {
    const routePage = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } })
    const routeErrors = []
    routePage.on('pageerror', error => routeErrors.push(error.message))
    for (const [index, entry] of generatedContent.papers.entries()) {
      await routePage.goto(`${siteUrl}/papers/${entry.id}`, { waitUntil: 'domcontentloaded' })
      await routePage.getByRole('heading', { name: 'Reproducibility', exact: true }).waitFor()
      for (const section of ['Motivation', 'Contributions', 'Methodology', 'Experiments', 'Limitations']) {
        if (await routePage.getByRole('heading', { name: section, exact: true }).count() !== 1) throw new Error(`${entry.id}: missing ${section}`)
      }
      await assertReviewAndCitations(routePage, entry)
      if (entry.figure) {
        await routePage.waitForFunction(() => [...document.querySelectorAll('.paper-figure img')].every(image => image.complete))
        if (!await routePage.locator('.paper-figure img').evaluate(image => image.naturalWidth > 0)) throw new Error(`${viewport.name} ${entry.id}: figure failed to load`)
      }
      await assertNoHorizontalOverflow(routePage, `${viewport.name} ${entry.id}`)
      if (entry.inclusion === 'reference' && await routePage.locator('a.back-link').getAttribute('href') !== `${basePath}/references`) throw new Error(`${entry.id}: reference back link is incorrect`)
      if ((index + 1) % 50 === 0) console.log(`Checked ${viewport.name} ${index + 1}/${generatedContent.papers.length} retained detail routes.`)
    }
    if (routeErrors.length) throw new Error(`${viewport.name}: detail browser errors: ${routeErrors.join('; ')}`)
    await routePage.close()
  }
  console.log(`Visual smoke checks passed at desktop and mobile sizes; all ${generatedContent.papers.length} retained detail routes rendered successfully.`)
} finally {
  if (browser) await browser.close()
  server.kill()
}

async function assertReviewAndCitations(page, paper) {
  const notice = page.locator(`.review-notice--${paper.review_status}`)
  if (await notice.count() !== 1) throw new Error(`${paper.id}: missing actual review status`)
  const recordHref = await notice.locator('a').getAttribute('href')
  if (!recordHref?.endsWith(`/data/reviews/papers/${paper.id}.json`)) throw new Error(`${paper.id}: incorrect review-record link`)
  for (const direction of ['outgoing', 'incoming']) {
    const field = direction === 'outgoing' ? 'citing' : 'cited'
    const targetField = direction === 'outgoing' ? 'cited' : 'citing'
    const label = direction === 'outgoing' ? 'References in this collection' : 'Cited by this collection'
    const section = page.getByRole('region', { name: label, exact: true })
    const expected = generatedContent.relations.filter(edge => edge[field] === paper.id)
    if (await section.locator('.related-paper-card').count() !== expected.length) throw new Error(`${paper.id}: incorrect ${direction} citation count`)
    const hrefs = await section.locator('.related-paper-card h3 a').evaluateAll(links => links.map(link => link.getAttribute('href')))
    const targets = expected.map(edge => `${basePath}/papers/${edge[targetField]}`)
    if (JSON.stringify(hrefs.sort()) !== JSON.stringify(targets.sort())) throw new Error(`${paper.id}: incorrect ${direction} citation endpoints`)
  }
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
