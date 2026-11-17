import { sortPapersNewestFirst } from './content-lib.mjs'

export const indexMarkers = {
  review: {
    start: '<!-- GENERATED_REVIEW_START -->',
    end: '<!-- GENERATED_REVIEW_END -->',
  },
  navigation: {
    start: '<!-- GENERATED_NAVIGATION_START -->',
    end: '<!-- GENERATED_NAVIGATION_END -->',
  },
  generalist: {
    start: '<!-- GENERATED_GENERALIST_INDEX_START -->',
    end: '<!-- GENERATED_GENERALIST_INDEX_END -->',
  },
  specialist: {
    start: '<!-- GENERATED_SPECIALIST_INDEX_START -->',
    end: '<!-- GENERATED_SPECIALIST_INDEX_END -->',
  },
  study: {
    start: '<!-- GENERATED_STUDY_INDEX_START -->',
    end: '<!-- GENERATED_STUDY_INDEX_END -->',
  },
  reference: {
    start: '<!-- GENERATED_REFERENCE_INDEX_START -->',
    end: '<!-- GENERATED_REFERENCE_INDEX_END -->',
  },
}

const websiteUrl = 'https://ciam-group.github.io/awesome-nco/'

function escapeTableText(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
    .replaceAll('|', '&#124;')
    .replace(/[\r\n]+/g, ' ')
}

function renderLink(label, url, newTab = false) {
  const attributes = newTab ? ' target="_blank" rel="noopener noreferrer"' : ''
  return `<a href="${escapeTableText(url)}"${attributes}>${escapeTableText(label)}</a>`
}

export function renderNavigationBadges(papers) {
  const main = papers.filter(paper => paper.inclusion !== 'reference')
  const generalistCount = main.filter((paper) => paper.scope === 'generalist').length
  const specialistCount = main.filter((paper) => paper.scope === 'specialist').length
  const studyCount = main.filter((paper) => paper.scope === 'study').length
  const referenceCount = papers.length - main.length

  return [
    `[![Website](https://img.shields.io/badge/Website-Awesome%20NCO-3e6177?style=flat-square)](${websiteUrl})`,
    `[![Generalist Solvers: ${generalistCount} papers](https://img.shields.io/badge/Generalist-${generalistCount}-805e6f?style=flat-square)](#generalist-solvers)`,
    `[![Specialist Solvers: ${specialistCount} papers](https://img.shields.io/badge/Specialist-${specialistCount}-315f86?style=flat-square)](#specialist-solvers)`,
    `[![Research Studies: ${studyCount} papers](https://img.shields.io/badge/Studies-${studyCount}-58765b?style=flat-square)](#research-studies)`,
    `[![Reference collection: ${referenceCount} papers](https://img.shields.io/badge/References-${referenceCount}-7a756a?style=flat-square)](#reference-collection)`,
  ].join(' ')
}

function renderPaperRow(paper) {
  const resources = [renderLink('Note', `${websiteUrl}papers/${paper.id}`, true)]
  if (paper.code_url) resources.push(renderLink('Code', paper.code_url))

  const cells = [
    renderLink(paper.title, paper.paper_url),
    escapeTableText(`${paper.venue} ${paper.year}`),
    paper.arxiv_url ? renderLink(paper.date, paper.arxiv_url) : '—',
    resources.join(' · '),
  ]

  return `| ${cells.join(' | ')} |`
}

export function renderPaperIndex(papers) {
  if (papers.length === 0) return '_No papers have been added yet._'

  const years = [...new Set(papers.map((paper) => paper.year))].sort((first, second) => second - first)

  return years.map((year, index) => {
    const yearPapers = sortPapersNewestFirst(papers.filter((paper) => paper.year === year))
    const countLabel = yearPapers.length === 1 ? 'paper' : 'papers'

    return [
      index === 0 ? '<details open>' : '<details>',
      `<summary><strong>${year}</strong> · ${yearPapers.length} ${countLabel}</summary>`,
      '',
      '| Paper | Publication | Preprint | Links |',
      '| :--- | :--- | :--- | :--- |',
      ...yearPapers.map(renderPaperRow),
      '',
      '</details>',
    ].join('\n')
  }).join('\n\n')
}

export function replaceGeneratedIndex(readme, generated, section) {
  const markers = indexMarkers[section]
  if (!markers) throw new Error(`Unknown README generated section: ${section}`)

  const start = readme.indexOf(markers.start)
  const end = readme.indexOf(markers.end)
  if (start < 0 || end < 0 || end < start) throw new Error(`README ${section} markers are missing or invalid`)

  return `${readme.slice(0, start + markers.start.length)}\n${generated.trim()}\n${readme.slice(end)}`
}
