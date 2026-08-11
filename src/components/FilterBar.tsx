import { RotateCcw, Search } from 'lucide-react'

export interface FilterOption {
  value: string
  label: string
}

export interface SelectFilterConfig {
  key: string
  label: string
  value: string
  options: FilterOption[]
}

interface FilterBarProps {
  query: string
  selects: SelectFilterConfig[]
  resultCount: number
  searchPlaceholder?: string
  onChange: (key: string, value: string) => void
  onReset: () => void
}

export function FilterBar({
  query,
  selects,
  resultCount,
  searchPlaceholder = 'Title, author, venue, institution, or problem',
  onChange,
  onReset,
}: FilterBarProps) {
  const hasFilters = query !== '' || selects.some((select) => select.value !== 'all')

  return (
    <div className="filter-bar" style={{ '--filter-select-count': selects.length } as React.CSSProperties} aria-label="Content filters">
      <label className="search-field">
        <span>Search</span>
        <div>
          <Search size={16} aria-hidden="true" />
          <input
            value={query}
            onChange={(event) => onChange('query', event.target.value)}
            placeholder={searchPlaceholder}
          />
        </div>
      </label>
      {selects.map((select) => (
        <label className="select-field" key={select.key}>
          <span>{select.label}</span>
          <select value={select.value} onChange={(event) => onChange(select.key, event.target.value)}>
            {select.options.map((option) => <option value={option.value} key={option.value}>{option.label}</option>)}
          </select>
        </label>
      ))}
      <div className="filter-status">
        <span aria-live="polite">{resultCount} result{resultCount === 1 ? '' : 's'}</span>
        <button type="button" onClick={onReset} disabled={!hasFilters}>
          <RotateCcw size={14} aria-hidden="true" /> Reset
        </button>
      </div>
    </div>
  )
}
