import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { FilterBar } from '../components/FilterBar'
import { TransactionList } from '../components/TransactionList'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { useTransactions } from '../hooks/useTransactions'
import { useDeleteTransaction } from '../hooks/useDeleteTransaction'
import { useSettings } from '../hooks/useSettings'
import { applyFilters, availableMonths, sortTransactions, summarise } from '../utils/stats'
import { formatMoney } from '../utils/format'
import './Transactions.css'

const DEFAULT_FILTERS = {
  query: '',
  type: 'all',
  categoryId: 'all',
  month: 'all',
  sortBy: 'date-desc',
}

export function Transactions() {
  const { transactions, isLoading } = useTransactions()
  const { settings } = useSettings()
  const { openEditor } = useOutletContext()
  const deleteTransaction = useDeleteTransaction()
  const [filters, setFilters] = useState(DEFAULT_FILTERS)

  const months = useMemo(() => availableMonths(transactions), [transactions])

  const visible = useMemo(
    () => sortTransactions(applyFilters(transactions, filters), filters.sortBy),
    [transactions, filters],
  )

  const totals = useMemo(() => summarise(visible), [visible])

  const isFiltered = useMemo(
    () => Object.keys(DEFAULT_FILTERS).some((key) => filters[key] !== DEFAULT_FILTERS[key]),
    [filters],
  )

  const handleChange = (patch) => setFilters((current) => ({ ...current, ...patch }))

  // Two different "nothing here" cases: an empty ledger, or filters that
  // matched nothing. They need different wording and different actions.
  const emptyState =
    transactions.length === 0 ? (
      <EmptyState
        icon="receipt"
        title="Your ledger is empty"
        description="Add your first income or expense and it will appear here, grouped by day."
        action={
          <button type="button" className="btn btn-primary" onClick={() => openEditor()}>
            <Icon name="plus" size={15} />
            Add transaction
          </button>
        }
      />
    ) : (
      <EmptyState
        icon="search"
        title="No matching transactions"
        description="Nothing fits the current filters. Try a different month, category or search term."
        action={
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setFilters(DEFAULT_FILTERS)}
          >
            Clear filters
          </button>
        }
      />
    )

  return (
    <div className="transactions-page">
      <FilterBar
        filters={filters}
        months={months}
        isDirty={isFiltered}
        onChange={handleChange}
        onReset={() => setFilters(DEFAULT_FILTERS)}
      />

      {!isLoading && visible.length > 0 && (
        <div className="result-bar">
          <p className="result-count">
            <strong>{visible.length}</strong> {visible.length === 1 ? 'transaction' : 'transactions'}
            {isFiltered && ' matched'}
          </p>
          <div className="result-totals">
            <span>
              In <strong className="money money-in">{formatMoney(totals.income, settings.currency)}</strong>
            </span>
            <span>
              Out <strong className="money money-out">{formatMoney(totals.expense, settings.currency)}</strong>
            </span>
            <span>
              Net <strong className="money">{formatMoney(totals.balance, settings.currency)}</strong>
            </span>
          </div>
        </div>
      )}

      <section className="card">
        <div className="card-body card-body-flush">
          <TransactionList
            transactions={visible}
            isLoading={isLoading}
            onEdit={openEditor}
            onDelete={deleteTransaction}
            emptyState={emptyState}
          />
        </div>
      </section>
    </div>
  )
}
