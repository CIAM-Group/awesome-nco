import { describe, expect, it } from 'vitest'
import { clearPages, pagination, timelineSelection } from './pagination'

describe('bounded list pagination', () => {
  it('reaches every item without duplication, including a partial final page', () => {
    const items = Array.from({ length: 482 }, (_, index) => index)
    const result: number[] = []
    for (let page = 1; page <= 20; page++) {
      const { start, end } = pagination(items.length, page)
      expect(end - start).toBeLessThanOrEqual(25)
      result.push(...items.slice(start, end))
    }
    expect(result).toEqual(items)
    expect(pagination(482, 20).end - pagination(482, 20).start).toBe(7)
  })
  it.each([null, '', '0', '-1', '1.5', 'oops', 'Infinity', '99999999999999999999999'])('normalizes invalid page %s', value => {
    expect(pagination(100, value).page).toBe(1)
  })
  it('clamps stale pages and handles zero results', () => {
    expect(pagination(26, '100').page).toBe(2)
    expect(pagination(0, '10')).toMatchObject({ page: 1, pageCount: 1, start: 0, end: 0 })
  })
  it('resets pagination without dropping search, filters or selected year', () => {
    const params = clearPages(new URLSearchParams('q=route&family=Routing&year=2025&page=3&page_2025=2&openYears=2026,2025'))
    expect(params.toString()).toBe('q=route&family=Routing&year=2025')
  })
})

describe('explicit year browsing', () => {
  it('opens only the newest matching year by default', () => {
    expect(timelineSelection([2026, 2024, 2021], new URLSearchParams())).toEqual({ selected: 2026, opened: [2026] })
  })
  it('restores one selected year or a chronological set of explicitly expanded years', () => {
    expect(timelineSelection([2026, 2024, 2021], new URLSearchParams('year=2024'))).toEqual({ selected: 2024, opened: [2024] })
    expect(timelineSelection([2026, 2024, 2021], new URLSearchParams('year=2024&openYears=2024,2026,2024,1999'))).toEqual({ selected: 2024, opened: [2026, 2024] })
  })
  it('falls back when filters remove the selected year, and supports empty results', () => {
    expect(timelineSelection([2024], new URLSearchParams('year=2026&openYears=2026'))).toEqual({ selected: 2024, opened: [2024] })
    expect(timelineSelection([], new URLSearchParams())).toEqual({ selected: undefined, opened: [] })
  })
})
