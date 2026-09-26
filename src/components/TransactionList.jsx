import { Fragment } from 'react'
import { TransactionRow } from './TransactionRow'
import { formatDayHeading, formatSignedMoney } from '../utils/format'
import { groupByDay } from '../utils/stats'
import { useSettings } from '../hooks/useSettings'
import './TransactionList.css'

function ListSkeleton({ rows = 5 }) {
  return (
    <ul className="txn-list">
      {Array.from({ length: rows }, (_, index) => (
        <li className="txn-row" key={index}>
          <span className="skeleton skeleton-glyph" />
          <div className="txn-main">
            <span className="skeleton skeleton-line" style={{ width: `${45 + index * 7}%` }} />
            <span className="skeleton skeleton-line skeleton-line-sm" />
          </div>
          <span className="skeleton skeleton-amount" />
        </li>
      ))}
    </ul>
  )
}

/**
 * Renders transactions grouped into day sections. `grouped={false}` gives a
 * flat list, which is what the dashboard's "recent activity" card wants.
 */
export function TransactionList({
  transactions,
  onEdit,
  onDelete,
  isLoading = false,
  grouped = true,
  emptyState = null,
}) {
  const { settings } = useSettings()

  if (isLoading) return <ListSkeleton />
  if (transactions.length === 0) return emptyState

  if (!grouped) {
    return (
      <ul className="txn-list">
        {transactions.map((transaction) => (
          <TransactionRow
            key={transaction.id}
            transaction={transaction}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </ul>
    )
  }

  return (
    <ul className="txn-list">
      {groupByDay(transactions).map((group) => (
        <Fragment key={group.date}>
          <li className="txn-day">
            <span>{formatDayHeading(group.date)}</span>
            <span className="txn-day-net money">
              {formatSignedMoney(group.net, settings.currency)}
            </span>
          </li>
          {group.items.map((transaction) => (
            <TransactionRow
              key={transaction.id}
              transaction={transaction}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </Fragment>
      ))}
    </ul>
  )
}
