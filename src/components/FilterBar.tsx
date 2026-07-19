import { RotateCcw, Search } from 'lucide-react'
import type { PaperFilters } from '../types'

interface Option {
  value: string
  label: string
}

interface FilterBarProps {
  filters: PaperFilters
  paradigmOptions: Option[]
  familyOptions: Option[]
  yearOptions: Option[]
  resultCount: number
  onChange: (key: keyof PaperFilters, value: string) => void
  onReset: () => void
}

export function FilterBar({
  filters,
  paradigmOptions,
  familyOptions,
  yearOptions,
  resultCount,
  onChange,
  onReset,
}: FilterBarProps) {
  const hasFilters = filters.query !== '' || filters.paradigm !== 'all' || filters.family !== 'all' || filters.year !== 'all'

  return (
    <div className="filter-bar" aria-label="Paper filters">
      <label className="search-field">
        <span>Search</span>
        <div>
          <Search size={16} aria-hidden="true" />
          <input
            value={filters.query}
            onChange={(event) => onChange('query', event.target.value)}
            placeholder="Title, author, venue, institution, or problem"
          />
        </div>
      </label>
      <label className="select-field">
        <span>Paradigm</span>
        <select value={filters.paradigm} onChange={(event) => onChange('paradigm', event.target.value)}>
          {paradigmOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
        </select>
      </label>
      <label className="select-field">
        <span>Problem family</span>
        <select value={filters.family} onChange={(event) => onChange('family', event.target.value)}>
          {familyOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
        </select>
      </label>
      <label className="select-field">
        <span>First public</span>
        <select value={filters.year} onChange={(event) => onChange('year', event.target.value)}>
          {yearOptions.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
        </select>
      </label>
      <div className="filter-status">
        <span aria-live="polite">{resultCount} result{resultCount === 1 ? '' : 's'}</span>
        <button type="button" onClick={onReset} disabled={!hasFilters}>
          <RotateCcw size={14} aria-hidden="true" /> Reset
        </button>
      </div>
    </div>
  )
}
