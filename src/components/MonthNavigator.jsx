import { Icon } from './Icon'
import { currentMonthKey, formatMonthKey, shiftMonthKey } from '../utils/format'
import './MonthNavigator.css'

/**
 * Previous/next stepper for a `YYYY-MM` key. Stepping stops at the current
 * month, since there is nothing to review in the future.
 */
export function MonthNavigator({ month, earliestMonth, onChange }) {
  const canGoBack = !earliestMonth || month > earliestMonth
  const canGoForward = month < currentMonthKey()

  return (
    <div className="month-nav">
      <button
        type="button"
        className="btn btn-icon"
        disabled={!canGoBack}
        onClick={() => onChange(shiftMonthKey(month, -1))}
      >
        <Icon name="chevronLeft" size={16} />
        <span className="sr-only">Previous month</span>
      </button>

      <p className="month-nav-label">{formatMonthKey(month)}</p>

      <button
        type="button"
        className="btn btn-icon"
        disabled={!canGoForward}
        onClick={() => onChange(shiftMonthKey(month, 1))}
      >
        <Icon name="chevronRight" size={16} />
        <span className="sr-only">Next month</span>
      </button>
    </div>
  )
}
