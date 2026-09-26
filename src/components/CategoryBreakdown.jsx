import { useState } from 'react'
import { Icon } from './Icon'
import { EmptyState } from './EmptyState'
import { formatMoney, formatPercent } from '../utils/format'
import { useSettings } from '../hooks/useSettings'
import './CategoryBreakdown.css'

const COLLAPSED_COUNT = 5

/**
 * Spending per category as a ranked bar list.
 *
 * Bars share one hue and are sorted by size, because the question here is
 * "which is biggest" — rank, not identity. Every row is directly labelled with
 * its name, amount and share, so nothing depends on reading a colour.
 */
export function CategoryBreakdown({ rows, isLoading = false, emptyHint }) {
  const { settings } = useSettings()
  const [isExpanded, setIsExpanded] = useState(false)

  if (isLoading) {
    return (
      <div className="breakdown">
        {Array.from({ length: 4 }, (_, index) => (
          <div className="breakdown-row" key={index}>
            <span className="skeleton" style={{ width: '100%', height: 30 }} />
          </div>
        ))}
      </div>
    )
  }

  if (rows.length === 0) {
    return (
      <EmptyState
        compact
        icon="chart"
        title="Nothing to break down yet"
        description={emptyHint}
      />
    )
  }

  const visibleRows = isExpanded ? rows : rows.slice(0, COLLAPSED_COUNT)
  const largest = rows[0].total

  return (
    <div className="breakdown">
      <ul>
        {visibleRows.map((row) => (
          <li className="breakdown-row" key={row.categoryId}>
            <div className="breakdown-head">
              <span className="breakdown-icon" style={{ '--row-color': row.color }}>
                <Icon name={row.icon} size={13} />
              </span>
              <span className="breakdown-label">{row.label}</span>
              <span className="breakdown-share tnum">{formatPercent(row.share)}</span>
              <span className="breakdown-amount money">
                {formatMoney(row.total, settings.currency)}
              </span>
            </div>
            <div className="breakdown-track">
              <span
                className="breakdown-bar"
                style={{ width: `${Math.max(2, (row.total / largest) * 100)}%` }}
              />
            </div>
          </li>
        ))}
      </ul>

      {rows.length > COLLAPSED_COUNT && (
        <button
          type="button"
          className="btn btn-ghost btn-sm breakdown-toggle"
          onClick={() => setIsExpanded((current) => !current)}
        >
          {isExpanded ? 'Show less' : `Show ${rows.length - COLLAPSED_COUNT} more`}
          <Icon name={isExpanded ? 'arrowUp' : 'chevronDown'} size={14} />
        </button>
      )}
    </div>
  )
}
