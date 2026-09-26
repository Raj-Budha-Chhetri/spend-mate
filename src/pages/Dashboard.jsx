import { useMemo, useState } from 'react'
import { Link, useOutletContext } from 'react-router-dom'
import { StatCard } from '../components/StatCard'
import { BudgetCard } from '../components/BudgetCard'
import { CategoryBreakdown } from '../components/CategoryBreakdown'
import { TransactionList } from '../components/TransactionList'
import { TrendChart } from '../components/charts/LazyCharts'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { useTransactions } from '../hooks/useTransactions'
import { useDeleteTransaction } from '../hooks/useDeleteTransaction'
import { currentMonthKey, formatMonthKey, monthKey, shiftMonthKey } from '../utils/format'
import {
  monthlySeries,
  percentChange,
  sortTransactions,
  summarise,
  totalsByCategory,
} from '../utils/stats'
import './Dashboard.css'

const RECENT_LIMIT = 6

const PERIODS = [
  { value: 'month', label: 'This month', months: 1 },
  { value: 'quarter', label: 'Last 3 months', months: 3 },
  { value: 'all', label: 'All time', months: null },
]

export function Dashboard() {
  const { transactions, isLoading } = useTransactions()
  const { openEditor } = useOutletContext()
  const deleteTransaction = useDeleteTransaction()
  const [period, setPeriod] = useState('month')

  const thisMonth = currentMonthKey()

  /** Transactions inside the selected period, plus the equivalent slice of the
   *  period before it — the comparison the stat cards show. */
  const { current, previous, periodLabel } = useMemo(() => {
    const config = PERIODS.find((option) => option.value === period)

    if (!config.months) {
      return { current: transactions, previous: [], periodLabel: 'all time' }
    }

    const inWindow = (transaction, offset) => {
      const key = monthKey(transaction.date)
      for (let index = 0; index < config.months; index += 1) {
        if (key === shiftMonthKey(thisMonth, -index - offset * config.months)) return true
      }
      return false
    }

    return {
      current: transactions.filter((transaction) => inWindow(transaction, 0)),
      previous: transactions.filter((transaction) => inWindow(transaction, 1)),
      periodLabel: config.months === 1 ? formatMonthKey(thisMonth) : 'the last 3 months',
    }
  }, [transactions, period, thisMonth])

  const totals = useMemo(() => summarise(current), [current])
  const previousTotals = useMemo(() => summarise(previous), [previous])
  const categoryRows = useMemo(() => totalsByCategory(current, 'expense'), [current])
  const trend = useMemo(() => monthlySeries(transactions, 6, thisMonth), [transactions, thisMonth])

  const recent = useMemo(
    () => sortTransactions(transactions, 'date-desc').slice(0, RECENT_LIMIT),
    [transactions],
  )

  const hasComparison = period !== 'all' && previous.length > 0

  return (
    <div className="dashboard">
      <div className="period-bar">
        <div className="segmented" role="group" aria-label="Summary period">
          {PERIODS.map((option) => (
            <button
              key={option.value}
              type="button"
              aria-pressed={period === option.value}
              onClick={() => setPeriod(option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>
        <p className="period-note">
          Showing {periodLabel} · {current.length} {current.length === 1 ? 'entry' : 'entries'}
        </p>
      </div>

      <div className="dash-grid">
        <StatCard
          label="Net balance"
          value={totals.balance}
          icon="wallet"
          isLoading={isLoading}
          change={hasComparison ? percentChange(totals.balance, previousTotals.balance) : null}
        />
        <StatCard
          label="Income"
          value={totals.income}
          icon="arrowDown"
          tone="income"
          isLoading={isLoading}
          change={hasComparison ? percentChange(totals.income, previousTotals.income) : null}
        />
        <StatCard
          label="Expenses"
          value={totals.expense}
          icon="arrowUp"
          tone="expense"
          goodDirection="down"
          isLoading={isLoading}
          change={hasComparison ? percentChange(totals.expense, previousTotals.expense) : null}
        />

        <section className="card span-2">
          <div className="card-head">
            <div>
              <h2 className="card-title">Income vs expenses</h2>
              <p className="card-subtitle">Last six months</p>
            </div>
            <Link to="/insights" className="btn btn-ghost btn-sm">
              Insights
              <Icon name="chevronRight" size={14} />
            </Link>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="skeleton" style={{ height: 244 }} />
            ) : (
              <TrendChart data={trend} />
            )}
          </div>
        </section>

        <BudgetCard month={thisMonth} />

        <section className="card">
          <div className="card-head">
            <div>
              <h2 className="card-title">Top categories</h2>
              <p className="card-subtitle">Where the spending went</p>
            </div>
          </div>
          <div className="card-body">
            <CategoryBreakdown
              rows={categoryRows}
              isLoading={isLoading}
              emptyHint="Log an expense and its category will show up here."
            />
          </div>
        </section>

        <section className="card span-2">
          <div className="card-head">
            <div>
              <h2 className="card-title">Recent activity</h2>
              <p className="card-subtitle">Your latest entries</p>
            </div>
            <Link to="/transactions" className="btn btn-ghost btn-sm">
              View all
              <Icon name="chevronRight" size={14} />
            </Link>
          </div>
          <div className="card-body card-body-flush">
            <TransactionList
              transactions={recent}
              isLoading={isLoading}
              grouped={false}
              onEdit={openEditor}
              onDelete={deleteTransaction}
              emptyState={
                <EmptyState
                  icon="receipt"
                  title="No transactions yet"
                  description="Add your first income or expense to start tracking your balance."
                  action={
                    <button type="button" className="btn btn-primary" onClick={() => openEditor()}>
                      <Icon name="plus" size={15} />
                      Add transaction
                    </button>
                  }
                />
              }
            />
          </div>
        </section>
      </div>
    </div>
  )
}
