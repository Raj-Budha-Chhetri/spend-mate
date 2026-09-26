import { Link } from 'react-router-dom'
import { useBudgetStatus } from '../hooks/useBudgetStatus'
import { useSettings } from '../hooks/useSettings'
import { currentMonthKey, formatMonthKey, formatMoney } from '../utils/format'
import { Icon } from './Icon'
import './SidebarSummary.css'

/**
 * Compact budget read-out pinned to the bottom of the sidebar, so the current
 * month's headroom is visible from every page.
 */
export function SidebarSummary() {
  const month = currentMonthKey()
  const { settings } = useSettings()
  const { spent, budget, remaining, percent, state, hasBudget } = useBudgetStatus(month)

  if (!hasBudget) {
    return (
      <Link to="/settings" className="sidebar-summary sidebar-summary-empty">
        <Icon name="target" size={16} />
        <span>Set a monthly budget</span>
      </Link>
    )
  }

  return (
    <div className={`sidebar-summary state-${state}`}>
      <div className="sidebar-summary-head">
        <span className="eyebrow">{formatMonthKey(month, { short: true })}</span>
        {state === 'over' && <Icon name="alert" size={13} />}
      </div>

      <p className="sidebar-summary-value money">
        {formatMoney(spent, settings.currency)}
        <span className="sidebar-summary-of">of {formatMoney(budget, settings.currency)}</span>
      </p>

      <div className="meter" role="presentation">
        <span className="meter-fill" style={{ width: `${Math.min(100, percent)}%` }} />
      </div>

      <p className="sidebar-summary-note">
        {remaining >= 0
          ? `${formatMoney(remaining, settings.currency)} left`
          : `${formatMoney(Math.abs(remaining), settings.currency)} over budget`}
      </p>
    </div>
  )
}
