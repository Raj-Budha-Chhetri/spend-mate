import { Link } from 'react-router-dom'
import { Icon } from './Icon'
import { useBudgetStatus } from '../hooks/useBudgetStatus'
import { useSettings } from '../hooks/useSettings'
import { formatMoney, formatPercent } from '../utils/format'
import './BudgetCard.css'

const RADIUS = 52
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

const STATE_COPY = {
  ok: 'On track',
  warning: 'Getting close',
  over: 'Over budget',
}

/** Monthly budget ring plus a plain-language read on spending pace. */
export function BudgetCard({ month }) {
  const { settings } = useSettings()
  const status = useBudgetStatus(month)
  const { spent, budget, remaining, percent, state, hasBudget, daysLeft, dailyAllowance } = status

  if (!hasBudget) {
    return (
      <section className="card budget-card">
        <div className="card-head">
          <div>
            <h2 className="card-title">Monthly budget</h2>
            <p className="card-subtitle">No limit set</p>
          </div>
        </div>
        <div className="card-body budget-empty">
          <p>
            Set a monthly spending limit and SpendMate will track how much room you have left.
          </p>
          <Link to="/settings" className="btn btn-secondary btn-block">
            <Icon name="target" size={15} />
            Set a budget
          </Link>
        </div>
      </section>
    )
  }

  const progress = Math.min(100, percent)

  return (
    <section className={`card budget-card state-${state}`}>
      <div className="card-head">
        <div>
          <h2 className="card-title">Monthly budget</h2>
          <p className="card-subtitle">{formatMoney(budget, settings.currency)} limit</p>
        </div>
        <span className={`badge badge-${state === 'ok' ? 'income' : state === 'over' ? 'expense' : 'warning'}`}>
          {state !== 'ok' && <Icon name="alert" size={12} />}
          {STATE_COPY[state]}
        </span>
      </div>

      <div className="card-body budget-body">
        <div className="budget-ring">
          <svg viewBox="0 0 120 120" role="img" aria-label={`${formatPercent(percent)} of budget used`}>
            <circle className="ring-track" cx="60" cy="60" r={RADIUS} />
            <circle
              className="ring-value"
              cx="60"
              cy="60"
              r={RADIUS}
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={CIRCUMFERENCE - (progress / 100) * CIRCUMFERENCE}
            />
          </svg>
          <div className="ring-center">
            <p className="ring-percent tnum">{formatPercent(percent)}</p>
            <p className="ring-caption">used</p>
          </div>
        </div>

        <dl className="budget-facts">
          <div>
            <dt>Spent</dt>
            <dd className="money">{formatMoney(spent, settings.currency)}</dd>
          </div>
          <div>
            <dt>{remaining >= 0 ? 'Remaining' : 'Over by'}</dt>
            <dd className={`money ${remaining >= 0 ? '' : 'money-out'}`}>
              {formatMoney(Math.abs(remaining), settings.currency)}
            </dd>
          </div>
        </dl>
      </div>

      <p className="budget-note">
        <Icon name={state === 'over' ? 'alert' : 'info'} size={14} />
        {state === 'over'
          ? `You have passed this month's limit by ${formatMoney(Math.abs(remaining), settings.currency)}.`
          : daysLeft > 0
            ? `${formatMoney(dailyAllowance, settings.currency)} a day for the remaining ${daysLeft} ${daysLeft === 1 ? 'day' : 'days'}.`
            : `The month is done — you stayed ${formatMoney(remaining, settings.currency)} under.`}
      </p>
    </section>
  )
}
