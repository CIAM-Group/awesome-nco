export const PAGE_SIZE = 25

export function pagination(total: number, requested: string | number | null = 1, pageSize = PAGE_SIZE) {
  const pageCount = Math.max(1, Math.ceil(total / pageSize))
  const value = String(requested ?? '1')
  const number = /^[1-9]\d*$/.test(value) ? Number(value) : 1
  const page = Math.min(pageCount, Number.isSafeInteger(number) ? number : 1)
  const start = (page - 1) * pageSize
  return { page, pageCount, start, end: Math.min(total, start + pageSize), total }
}

export function clearPages(params: URLSearchParams) {
  for (const key of [...params.keys()]) if (key === 'page' || key.startsWith('page_')) params.delete(key)
  params.delete('openYears')
  return params
}

export function scrollToListing(id: string) {
  requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start', behavior: 'instant' }))
}

export function timelineSelection(years: number[], params: URLSearchParams) {
  const selected = years.find(year => String(year) === params.get('year')) ?? years[0]
  const requested = new Set((params.get('openYears') ?? '').split(','))
  const opened = requested.has(String(selected)) ? years.filter(year => requested.has(String(year))) : selected === undefined ? [] : [selected]
  return { selected, opened }
}
