import fs from 'node:fs/promises'
import path from 'node:path'
import { spawn } from 'node:child_process'
import { chromium } from 'playwright'

const root = process.cwd()
const artifacts = path.join(root, 'tests', 'artifacts')
await fs.mkdir(artifacts, { recursive: true })
const content = JSON.parse(await fs.readFile(path.join(root, 'src/generated/content.json'), 'utf8'))
const { papers, relations } = content
const ids = new Set(papers.map(paper => paper.id))
const size = 25
const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1]
const base = process.env.GITHUB_ACTIONS && repositoryName ? '/' + repositoryName : ''
const site = 'http://127.0.0.1:4173' + base
const server = spawn(process.execPath, [path.join(root, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', '4173', '--strictPort'], { cwd: root, windowsHide: true, stdio: ['ignore', 'pipe', 'pipe'] })
const outgoing = new Map(papers.map(paper => [paper.id, relations.filter(relation => relation.citing === paper.id)]))
const date = paper => (paper.acceptance ?? paper.publication)?.date ?? paper.date
const yearsFor = source => [...new Set(source.map(paper => Number(date(paper).slice(0, 4))))].sort((a, b) => b - a)
const forYear = (source, year) => source.filter(paper => Number(date(paper).slice(0, 4)) === year)
const link = id => base + '/papers/' + id

function assert(condition, message) { if (!condition) throw new Error(message) }
async function count(page, selector, expected) {
  await page.waitForFunction(({ selector, expected }) => document.querySelectorAll(selector).length === expected, { selector, expected }, { timeout: 5000 })
}
async function links(page, selector, expected) {
  await page.waitForFunction(({ selector, expected }) => JSON.stringify([...document.querySelectorAll(selector)].map(a => a.getAttribute('href'))) === JSON.stringify(expected), { selector, expected }, { timeout: 5000 })
}
async function years(page, expected) {
  await page.waitForFunction(expected => JSON.stringify([...document.querySelectorAll('.timeline-year')].map(section => Number(section.dataset.year))) === JSON.stringify(expected), expected, { timeout: 5000 })
}
async function noOverflow(page, label) {
  const widths = await page.evaluate(() => [document.documentElement.scrollWidth, document.documentElement.clientWidth])
  assert(widths[0] <= widths[1], label + ': horizontal overflow ' + widths.join('/'))
}
async function noProgress(page) {
  await count(page, '.review-notice', 0)
  await count(page, '.primary-nav a[href$="/references"]', 0)
}
async function checkReferences(page, paper, pageNumber = 1) {
  await noProgress(page)
  assert(await page.getByRole('region', { name: 'Cited by this collection', exact: true }).count() === 0, paper.id + ': incoming section remains')
  await count(page, '.related-papers > .eyebrow', 0)
  const expected = outgoing.get(paper.id).slice((pageNumber - 1) * size, pageNumber * size)
  await count(page, '.related-paper-card', expected.length)
  await links(page, '.related-paper-card h3 a', expected.map(edge => link(edge.cited)))
  if (!expected.length) assert((await page.locator('#paper-references').innerText()).includes('No references to papers in this collection.'), 'Missing empty reference state')
}
async function checkReferencePosition(page, label) {
  try {
    await page.waitForFunction(() => Math.abs(document.getElementById('paper-references').getBoundingClientRect().top) < 200, undefined, { timeout: 5000 })
  } catch (error) {
    const position = await page.locator('#paper-references').evaluate(element => ({ top: element.getBoundingClientRect().top, scrollY, viewport: innerHeight, page: new URL(location.href).searchParams.get('page') }))
    throw new Error(`${label}: reference pagination jumped to the wrong position: ${JSON.stringify(position)}`, { cause: error })
  }
}

let browser
try {
  for (let attempt = 0; attempt < 40; attempt++) {
    try { if ((await fetch(site + '/')).ok) break } catch {}
    if (attempt === 39) throw new Error('Preview server did not start')
    await new Promise(resolve => setTimeout(resolve, 250))
  }
  assert(papers.length === 482 && relations.length === 4945, 'Unexpected public collection')
  assert(papers.every(paper => paper.inclusion === 'main'), 'Reference notes leaked into public data')
  browser = await chromium.launch({ headless: true, executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH })
  for (const viewport of [{ name: 'desktop', width: 1440, height: 1000 }, { name: 'mobile', width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport: { width: viewport.width, height: viewport.height } })
    const errors = []
    context.on('page', page => page.on('pageerror', error => errors.push(error.message)))
    const page = await context.newPage()
    await page.goto(site + '/', { waitUntil: 'networkidle' })
    await page.getByRole('heading', { name: 'A focused index of neural optimization research.' }).waitFor()
    await noProgress(page)
    assert(await page.getByText('Main collection', { exact: true }).count() === 0, 'Main label remains')
    const collectionStat = page.locator('.collection-stats div').filter({ has: page.locator('dt', { hasText: /^Collection$/ }) })
    assert((await collectionStat.locator('dd').innerText()) === '482', 'Incorrect home collection count')
    await noOverflow(page, viewport.name + ' home')
    await page.screenshot({ path: path.join(artifacts, 'home-' + viewport.name + '.png'), fullPage: true })

    for (const scope of ['specialist', 'generalist', 'study']) {
      const route = scope === 'study' ? 'studies' : scope
      const source = papers.filter(paper => paper.scope === scope)
      const available = yearsFor(source)
      const newest = forYear(source, available[0])
      await page.goto(site + '/' + route, { waitUntil: 'networkidle' })
      await years(page, [available[0]])
      await count(page, '.timeline-paper-card', Math.min(size, newest.length))
      await links(page, '.timeline-paper-card > a', newest.slice(0, size).map(paper => link(paper.id)))
      assert(await page.locator('.year-index').isVisible(), 'Year navigation is unavailable')
      assert(await page.getByLabel('Timeline year', { exact: true }).count() === 0, 'Old all-years selector remains')
      await noOverflow(page, viewport.name + ' ' + route)
      if (scope === 'specialist') {
        assert(await page.locator('.timeline-paper-card').first().evaluate(element => getComputedStyle(element).borderRadius) === '8px', 'Card styling regressed')
        await page.screenshot({ path: path.join(artifacts, 'specialist-' + viewport.name + '.png'), fullPage: false })
      }
      const last = Math.ceil(newest.length / size)
      if (last > 1) {
        assert(await page.getByRole('button', { name: 'Continue to ' + available[1], exact: true }).count() === 0, 'Earlier year offered before final page')
        await page.getByRole('navigation', { name: available[0] + ' papers pagination', exact: true }).getByRole('button', { name: 'Next', exact: true }).click()
        await links(page, '.timeline-paper-card > a', newest.slice(size, size * 2).map(paper => link(paper.id)))
        await page.getByRole('navigation', { name: available[0] + ' papers pagination', exact: true }).getByRole('button', { name: 'Page ' + last, exact: true }).click()
        await links(page, '.timeline-paper-card > a', newest.slice((last - 1) * size).map(paper => link(paper.id)))
      }
      if (available.length > 1) {
        await page.getByRole('button', { name: 'Continue to ' + available[1], exact: true }).click()
        await years(page, available.slice(0, 2))
        await count(page, '#year-' + available[1] + ' .timeline-paper-card', Math.min(size, forYear(source, available[1]).length))
        await page.reload({ waitUntil: 'networkidle' })
        await years(page, available.slice(0, 2))
        await page.getByRole('button', { name: 'Show ' + available[1], exact: true }).click()
        await years(page, [available[1]])
        await page.goBack({ waitUntil: 'domcontentloaded' })
        await years(page, available.slice(0, 2))
      }
      const oldPaper = source.find(paper => Number(date(paper).slice(0, 4)) === available[available.length - 1])
      await page.getByRole('textbox').fill(oldPaper.title)
      await years(page, [Number(date(oldPaper).slice(0, 4))])
      await count(page, '.timeline-paper-card', 1)
      await page.getByRole('button', { name: 'Reset', exact: true }).click()
      await years(page, [available[0]])
      await page.getByRole('textbox').fill('no-matching-paper-xyz123')
      await count(page, '.timeline-paper-card', 0)
      await page.getByRole('textbox').fill('')
      await years(page, [available[0]])
    }

    await page.goto(site + '/papers', { waitUntil: 'networkidle' })
    await links(page, '.paper-table tbody th a', papers.slice(0, size).map(paper => link(paper.id)))
    const headers = await page.locator('.paper-table thead th').allTextContents()
    assert(headers.join('|') === 'Paper|Institution|Scope|Paradigm / Type|Problem family|Accepted|Published|Preprint|Venue|Resources', 'Paper table columns changed')
    const navigation = () => page.getByRole('navigation', { name: 'Papers pagination', exact: true }).first()
    await navigation().getByRole('button', { name: 'Next', exact: true }).click()
    await links(page, '.paper-table tbody th a', papers.slice(size, size * 2).map(paper => link(paper.id)))
    await page.reload({ waitUntil: 'networkidle' })
    await links(page, '.paper-table tbody th a', papers.slice(size, size * 2).map(paper => link(paper.id)))
    await page.goBack({ waitUntil: 'domcontentloaded' })
    await links(page, '.paper-table tbody th a', papers.slice(0, size).map(paper => link(paper.id)))
    await navigation().getByRole('button', { name: 'Page 20', exact: true }).click()
    await count(page, '.paper-table tbody tr', 7)
    await page.getByLabel('Scope', { exact: true }).selectOption('generalist')
    await count(page, '.paper-table tbody tr', Math.min(size, papers.filter(paper => paper.scope === 'generalist').length))
    assert(!new URL(page.url()).searchParams.has('page'), 'Filter did not reset page')
    await noOverflow(page, viewport.name + ' papers')
    await page.screenshot({ path: path.join(artifacts, 'papers-' + viewport.name + '.png'), fullPage: false })
    for (const url of ['/papers?page=garbage', '/papers?page=0', '/papers?inclusion=reference', '/papers?inclusion=all']) {
      await page.goto(site + url, { waitUntil: 'networkidle' })
      await count(page, '.paper-table tbody tr', size)
      assert(await page.getByLabel('Collection', { exact: true }).count() === 0, 'Reference inclusion selector remains')
    }
    await page.goto(site + '/papers?page=99999', { waitUntil: 'networkidle' })
    await count(page, '.paper-table tbody tr', 7)
    await page.goto(site + '/references', { waitUntil: 'networkidle' })
    await page.getByRole('heading', { name: 'All papers', exact: true }).waitFor()
    assert(new URL(page.url()).pathname === base + '/papers', 'Reference route did not redirect')
    await page.goto(site + '/papers/neural-combinatorial-optimization', { waitUntil: 'networkidle' })
    await page.getByRole('heading', { name: 'All papers', exact: true }).waitFor()
    await page.goto(site + '/papers/neural-combinatorial-optimization?page=2', { waitUntil: 'networkidle' })
    await page.getByRole('heading', { name: 'All papers', exact: true }).waitFor()

    await page.goto(site + '/relations', { waitUntil: 'networkidle' })
    await page.getByRole('heading', { name: 'Paper citations', exact: true }).waitFor()
    assert(await page.getByLabel('Relation', { exact: true }).count() === 0, 'Redundant relation selector remains')
    await count(page, '.filter-bar select', 2)
    await count(page, 'canvas, .relation-graph, .relation-toolbar, .relation-legend', 0)
    const rows = relations.slice(0, size)
    await links(page, '.relation-row h3 a', rows.flatMap(row => [link(row.citing), link(row.cited)]))
    assert((await page.locator('.relation-kind').allTextContents()).every(label => label === 'Citation'), 'Citation labels regressed')
    const citationNav = () => page.getByRole('navigation', { name: 'Citations pagination', exact: true }).first()
    await citationNav().getByRole('button', { name: 'Next', exact: true }).click()
    await links(page, '.relation-row h3 a', relations.slice(size, size * 2).flatMap(row => [link(row.citing), link(row.cited)]))
    await page.goto(site + '/relations?kind=removed-legacy-kind&page=2', { waitUntil: 'networkidle' })
    await links(page, '.relation-row h3 a', relations.slice(size, size * 2).flatMap(row => [link(row.citing), link(row.cited)]))
    await page.getByLabel('Connected collection', { exact: true }).selectOption('study')
    const studyIds = new Set(papers.filter(paper => paper.scope === 'study').map(paper => paper.id))
    const expected = relations.filter(row => row.papers.some(id => studyIds.has(id)))
    await links(page, '.relation-row h3 a', expected.slice(0, size).flatMap(row => [link(row.citing), link(row.cited)]))
    assert(!new URL(page.url()).searchParams.has('page'), 'Citation filter did not reset page')
    assert(!new URL(page.url()).searchParams.has('kind'), 'Legacy kind was not cleared when filtering')
    assert(await page.locator('.relation-row a[target="_blank"]').count() >= Math.min(size, expected.length), 'Evidence links missing')
    await noProgress(page)
    await noOverflow(page, viewport.name + ' relations')
    await page.screenshot({ path: path.join(artifacts, 'relations-' + viewport.name + '.png'), fullPage: false })
    await page.getByRole('textbox').fill('no-matching-citation-xyz123')
    await count(page, '.relation-row', 0)

    const repairedPaper = papers.find(paper => paper.id === 'a-neural-column-generation-approach-to-the-vehicle-routing-problem-with-two-dimensiona')
    const repairedDescription = 'Explicit body citation with matching full title/byline bibliography; printed AM year 2018 qualified against unique formal representative.'
    await page.goto(site + '/relations', { waitUntil: 'networkidle' })
    await page.getByRole('textbox').fill(repairedPaper.title)
    const repairedRow = page.locator('.relation-row').filter({ has: page.locator('h3 a[href="' + link('attention-model') + '"]') })
    assert(await repairedRow.locator('div > p').first().innerText() === repairedDescription, 'Citation description has lost word spacing')
    assert((await repairedRow.innerText()).includes('Body p5; References p8 Kool et al. (2018)'), 'Evidence locator has lost word spacing')
    await noOverflow(page, viewport.name + ' repaired citation')
    await page.screenshot({ path: path.join(artifacts, 'repaired-citations-' + viewport.name + '.png'), fullPage: false })
    await page.goto(site + '/papers/' + repairedPaper.id, { waitUntil: 'networkidle' })
    const repairedCard = page.locator('.related-paper-card').filter({ has: page.locator('h3 a[href="' + link('attention-model') + '"]') })
    assert((await repairedCard.innerText()).includes(repairedDescription), 'Detail references did not inherit repaired text')

    const longest = papers.reduce((best, paper) => outgoing.get(paper.id).length > outgoing.get(best.id).length ? paper : best)
    await page.goto(site + '/papers/' + longest.id, { waitUntil: 'networkidle' })
    await checkReferences(page, longest)
    await page.getByRole('navigation', { name: 'References pagination', exact: true }).getByRole('button', { name: 'Next', exact: true }).click()
    await checkReferences(page, longest, 2)
    await checkReferencePosition(page, viewport.name)
    await page.screenshot({ path: path.join(artifacts, 'references-detail-' + viewport.name + '.png'), fullPage: false })

    if (viewport.name === 'mobile') {
      const session = await context.newCDPSession(page)
      try {
        await session.send('Emulation.setCPUThrottlingRate', { rate: 4 })
        const referenceNav = page.getByRole('navigation', { name: 'References pagination', exact: true })
        for (let attempt = 0; attempt < 3; attempt++) {
          await referenceNav.getByRole('button', { name: 'Previous', exact: true }).click()
          await checkReferences(page, longest)
          await checkReferencePosition(page, 'Throttled mobile previous')
          await referenceNav.getByRole('button', { name: 'Next', exact: true }).click()
          await checkReferences(page, longest, 2)
          await checkReferencePosition(page, 'Throttled mobile next')
        }
      } finally {
        await session.send('Emulation.setCPUThrottlingRate', { rate: 1 })
        await session.detach()
      }
    }

    for (const [index, paper] of papers.entries()) {
      await page.goto(site + '/papers/' + paper.id, { waitUntil: 'domcontentloaded' })
      await page.getByRole('heading', { name: 'Reproducibility', exact: true }).waitFor()
      for (const section of ['Motivation', 'Contributions', 'Methodology', 'Experiments', 'Limitations']) assert(await page.getByRole('heading', { name: section, exact: true }).count() === 1, paper.id + ': missing ' + section)
      await checkReferences(page, paper)
      if (paper.figure) {
        await page.waitForFunction(() => [...document.querySelectorAll('.paper-figure img')].every(image => image.complete && image.naturalWidth > 0))
      } else await count(page, '.paper-figure', 0)
      const noteLinks = await page.locator('.paper-note a').evaluateAll(anchors => anchors.map(a => a.href))
      for (const href of noteLinks) {
        const url = new URL(href)
        if (url.origin === new URL(site).origin && url.pathname.startsWith(base + '/papers/')) assert(ids.has(url.pathname.slice((base + '/papers/').length)), paper.id + ': invalid public note link ' + href)
      }
      await noOverflow(page, viewport.name + ' ' + paper.id)
      if ((index + 1) % 100 === 0) console.log('Checked ' + viewport.name + ' ' + (index + 1) + '/' + papers.length + ' public detail routes.')
    }
    assert(errors.length === 0, errors.join('; '))
    await context.close()
  }
  console.log('Visual checks passed: public collection, pagination, explicit year browsing, redirects and all482 desktop/mobile detail routes.')
} finally {
  if (browser) await browser.close()
  server.kill()
}
