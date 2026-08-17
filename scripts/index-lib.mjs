export const indexStart = '<!-- GENERATED_PAPER_INDEX_START -->'
export const indexEnd = '<!-- GENERATED_PAPER_INDEX_END -->'

const paradigmLabels = {
  constructive: 'Constructive',
  improvement: 'Improvement',
  'constructive-improvement': 'Constructive + Improvement',
}

export function renderPaperIndex(papers) {
  if (papers.length === 0) return '_No papers have been added yet._'

  const timelineDate = (paper) => paper.acceptance?.date ?? paper.date
  const sorted = [...papers].sort((first, second) => timelineDate(second).localeCompare(timelineDate(first)) || second.date.localeCompare(first.date) || first.title.localeCompare(second.title))
  return sorted.map((paper) => [
    `### [${paper.title}](${paper.id}.md)`,
    '',
    `- **Paradigm:** ${paradigmLabels[paper.paradigm]}`,
    `- **Problems:** ${paper.problems.join('; ')}`,
    `- **Venue:** ${paper.venue}`,
    `- **Year:** ${paper.year}`,
    `- **Accepted:** ${paper.acceptance ? `[${paper.acceptance.date}](${paper.acceptance.source_url})` : '—'}`,
    `- **arXiv:** ${paper.arxiv_url ? `[${paper.date}](${paper.arxiv_url})` : '—'}`,
    `- **Institutions:** ${paper.institutions.join('; ')}`,
  ].join('\n')).join('\n\n')
}

export function replaceGeneratedIndex(readme, generated) {
  const start = readme.indexOf(indexStart)
  const end = readme.indexOf(indexEnd)
  if (start < 0 || end < 0 || end < start) throw new Error('README generated index markers are missing or invalid')

  return `${readme.slice(0, start + indexStart.length)}\n${generated.trim()}\n${readme.slice(end)}`
}
