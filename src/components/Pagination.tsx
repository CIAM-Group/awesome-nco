import { Fragment } from 'react'
import { PAGE_SIZE } from '../lib/pagination'

interface PaginationProps {
  page: number
  pageCount: number
  total: number
  onChange: (page: number) => void
  label: string
}

export function Pagination({ page, pageCount, total, onChange, label }: PaginationProps) {
  if (!total) return null
  const summary = <span className="pagination-summary" role="status">Showing {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, total)} of {total}</span>
  if (pageCount === 1) return <div className="pagination pagination--single">{summary}</div>
  const numbers = [...new Set([1, page - 1, page, page + 1, pageCount])].filter(value => value >= 1 && value <= pageCount).sort((a, b) => a - b)
  return (
    <nav className="pagination" aria-label={`${label} pagination`} data-total={total} data-page={page}>
      {summary}
      <div className="pagination-controls">
        <button type="button" disabled={page === 1} onClick={() => onChange(page - 1)}>Previous</button>
        {numbers.map((number, index) => <Fragment key={number}>
          {index > 0 && number > numbers[index - 1] + 1 && <span aria-hidden="true">…</span>}
          <button type="button" aria-label={`Page ${number}`} aria-current={number === page ? 'page' : undefined} onClick={() => { if (number !== page) onChange(number) }}>{number}</button>
        </Fragment>)}
        <button type="button" disabled={page === pageCount} onClick={() => onChange(page + 1)}>Next</button>
      </div>
    </nav>
  )
}
