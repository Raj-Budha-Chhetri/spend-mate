import { Icon } from './Icon'
import { ALL_CATEGORIES } from '../data/categories'
import { formatMonthKey } from '../utils/format'
import { SORT_OPTIONS } from '../utils/stats'
import './FilterBar.css'

const TYPE_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'income', label: 'Income' },
  { value: 'expense', label: 'Expenses' },
]

/**
 * Controlled filter row. It owns no state of its own — the page holds the
 * filter object and passes an `onChange(patch)` callback down.
 */
export function FilterBar({ filters, months, onChange, onReset, isDirty }) {
  return (
    <div className="filter-bar">
      <div className="filter-search">
        <Icon name="search" size={16} />
        <input
          type="search"
          className="input"
          placeholder="Search descriptions and categories"
          value={filters.query}
          onChange={(event) => onChange({ query: event.target.value })}
          aria-label="Search transactions"
        />
      </div>

      <div className="segmented" role="group" aria-label="Transaction type">
        {TYPE_OPTIONS.map((option) => (
          <button
            key={option.value}
            type="button"
            aria-pressed={filters.type === option.value}
            onClick={() => onChange({ type: option.value })}
          >
            {option.label}
          </button>
        ))}
      </div>

      <select
        className="select filter-select"
        value={filters.categoryId}
        onChange={(event) => onChange({ categoryId: event.target.value })}
        aria-label="Filter by category"
      >
        <option value="all">All categories</option>
        {ALL_CATEGORIES.map((category) => (
          <option key={category.id} value={category.id}>
            {category.label}
          </option>
        ))}
      </select>

      <select
        className="select filter-select"
        value={filters.month}
        onChange={(event) => onChange({ month: event.target.value })}
        aria-label="Filter by month"
      >
        <option value="all">All months</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {formatMonthKey(month)}
          </option>
        ))}
      </select>

      <select
        className="select filter-select"
        value={filters.sortBy}
        onChange={(event) => onChange({ sortBy: event.target.value })}
        aria-label="Sort transactions"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {isDirty && (
        <button type="button" className="btn btn-ghost btn-sm filter-reset" onClick={onReset}>
          <Icon name="close" size={14} />
          Clear
        </button>
      )}
    </div>
  )
}
