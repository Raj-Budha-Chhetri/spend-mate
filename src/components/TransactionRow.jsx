import { Icon } from './Icon'
import { getCategory } from '../data/categories'
import { formatDate, formatMoney } from '../utils/format'
import { useSettings } from '../hooks/useSettings'

/** A single transaction line: category glyph, description, amount, actions. */
export function TransactionRow({ transaction, onEdit, onDelete }) {
  const { settings } = useSettings()
  const category = getCategory(transaction.categoryId)
  const isIncome = transaction.type === 'income'

  return (
    <li className="txn-row">
      <span className="txn-glyph" style={{ '--glyph-color': category.color }}>
        <Icon name={category.icon} size={16} />
      </span>

      <div className="txn-main">
        <p className="txn-description">{transaction.description}</p>
        {/* Category and date are stacked under the description on narrow
            screens and promoted to their own columns on wide ones, so a full
            width row reads as a ledger rather than as scattered text. */}
        <p className="txn-meta">
          {category.label} · {formatDate(transaction.date, { month: 'short', day: 'numeric' })}
        </p>
      </div>

      <p className="txn-category">
        <span className="dot" style={{ background: category.color }} />
        {category.label}
      </p>

      <p className="txn-date tnum">{formatDate(transaction.date)}</p>

      <p className={`txn-amount money ${isIncome ? 'money-in' : 'money-out'}`}>
        {isIncome ? '+' : '−'}
        {formatMoney(transaction.amount, settings.currency)}
      </p>

      <div className="txn-actions">
        <button
          type="button"
          className="btn btn-icon btn-sm"
          onClick={() => onEdit(transaction)}
          title="Edit transaction"
        >
          <Icon name="pencil" size={15} />
          <span className="sr-only">Edit {transaction.description}</span>
        </button>
        <button
          type="button"
          className="btn btn-icon btn-sm txn-delete"
          onClick={() => onDelete(transaction)}
          title="Delete transaction"
        >
          <Icon name="trash" size={15} />
          <span className="sr-only">Delete {transaction.description}</span>
        </button>
      </div>
    </li>
  )
}
