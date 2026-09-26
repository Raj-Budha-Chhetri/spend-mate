import { Icon } from './Icon'
import { formatMoney, formatPercent } from '../utils/format'
import { useSettings } from '../hooks/useSettings'
import './StatCard.css'

/**
 * Headline figure with an optional month-over-month delta.
 * `goodDirection` tells the card which way is the good way: spending less is
 * an improvement, earning less is not.
 */
export function StatCard({
  label,
  value,
  icon,
  tone = 'neutral',
  change = null,
  changeLabel = 'vs last month',
  goodDirection = 'up',
  isLoading = false,
}) {
  const { settings } = useSettings()

  if (isLoading) {
    return (
      <div className="card stat-card">
        <span className="skeleton" style={{ width: 84, height: 11 }} />
        <span className="skeleton" style={{ width: 132, height: 26, marginTop: 14 }} />
        <span className="skeleton" style={{ width: 100, height: 10, marginTop: 14 }} />
      </div>
    )
  }

  const hasChange = Number.isFinite(change) && change !== 0
  const isUp = change > 0
  const isGood = goodDirection === 'up' ? isUp : !isUp

  return (
    <div className={`card stat-card tone-${tone}`}>
      <div className="stat-head">
        <span className="eyebrow">{label}</span>
        <span className="stat-icon">
          <Icon name={icon} size={15} />
        </span>
      </div>

      <p className="stat-value money">{formatMoney(value, settings.currency)}</p>

      <p className="stat-change">
        {hasChange ? (
          <>
            <span className={`stat-delta${isGood ? ' is-good' : ' is-bad'}`}>
              <Icon name={isUp ? 'arrowUp' : 'arrowDown'} size={12} />
              {formatPercent(Math.abs(change))}
            </span>
            {changeLabel}
          </>
        ) : (
          <span className="stat-flat">No change {changeLabel}</span>
        )}
      </p>
    </div>
  )
}
