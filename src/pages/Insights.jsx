import { useMemo, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { MonthNavigator } from '../components/MonthNavigator'
import { CategoryBreakdown } from '../components/CategoryBreakdown'
import { TransactionList } from '../components/TransactionList'
import { SpendPaceChart } from '../components/charts/LazyCharts'
import { EmptyState } from '../components/EmptyState'
import { Icon } from '../components/Icon'
import { useTransactions } from '../hooks/useTransactions'
import { useSettings } from '../hooks/useSettings'
import { useBudgetStatus } from '../hooks/useBudgetStatus'
import { useDeleteTransaction } from '../hooks/useDeleteTransaction'
import {
  currentMonthKey,
  daysInMonth,
  formatMoney,
  formatMonthKey,
  formatPercent,
  monthKey,
  shiftMonthKey,
} from '../utils/format'
import {
  availableMonths,
  cumulativeSpendSeries,
  percentChange,
  sortTransactions,
  summarise,
  totalsByCategory,
} from '../utils/stats'
import './Insights.css'

const BIGGEST_LIMIT = 5

export function Insights() {
  const { transactions, isLoading } = useTransactions()
  const { settings } = useSettings()
  const { openEditor } = useOutletContext()
  const deleteTransaction = useDeleteTransaction()

  const [month, setMonth] = useState(currentMonthKey())
  const budget = useBudgetStatus(month)

  const months = useMemo(() => availableMonths(transactions), [transactions])
  const earliestMonth = months.length > 0 ? months[months.length - 1] : null

  const monthTransactions = useMemo(
    () => transactions.filter((transaction) => monthKey(transaction.date) === month),
    [transactions, month],
  )

  const previousTransactions = useMemo(() => {
    const previousMonth = shiftMonthKey(month, -1)
    return transactions.filter((transaction) => monthKey(transaction.date) === previousMonth)
  }, [transactions, month])

  const totals = useMemo(() => summarise(monthTransactions), [monthTransactions])
  const previousTotals = useMemo(() => summarise(previousTransactions), [previousTransactions])
  const categoryRows = useMemo(
    () => totalsByCategory(monthTransactions, 'expense'),
    [monthTransactions],
  )

  const biggest = useMemo(
    () =>
      sortTransactions(
        monthTransactions.filter((transaction) => transaction.type === 'expense'),
        'amount-desc',
      ).slice(0, BIGGEST_LIMIT),
    [monthTransactions],
  )

  /** Cumulative spend per day, with the even-pace reference line alongside. */
  const paceData = useMemo(() => {
    const series = cumulativeSpendSeries(monthTransactions, month)
    const totalDays = daysInMonth(month)
    return series.map((point) => ({
      ...point,
      fullLabel: `${formatMonthKey(month, { short: true }).replace(/ \d{4}$/, '')} ${point.day}`,
      pace: budget.hasBudget ? (budget.budget / totalDays) * point.day : undefined,
    }))
  }, [monthTransactions, month, budget.hasBudget, budget.budget])

  const savingsRate = totals.income > 0 ? (totals.balance / totals.income) * 100 : 0
  const spendChange = percentChange(totals.expense, previousTotals.expense)
  const hasPrevious = previousTransactions.length > 0
  const dailyAverage = totals.expense / (budget.dayOfMonth || 1)

  if (!isLoading && transactions.length === 0) {
    return (
      <section className="card">
        <EmptyState
          icon="chart"
          title="No data to analyse yet"
          description="Insights compare your months against each other. Add a few transactions and this page fills in."
          action={
            <button type="button" className="btn btn-primary" onClick={() => openEditor()}>
              <Icon name="plus" size={15} />
              Add transaction
            </button>
          }
        />
      </section>
    )
  }

  return (
    <div className="insights">
      <div className="insights-bar">
        <MonthNavigator month={month} earliestMonth={earliestMonth} onChange={setMonth} />
        <p className="insights-count">
          {monthTransactions.length} {monthTransactions.length === 1 ? 'entry' : 'entries'} this
          month
        </p>
      </div>

      <div className="insights-grid">
        <section className="card summary-card">
          <div className="card-head">
            <div>
              <h2 className="card-title">Monthly summary</h2>
              <p className="card-subtitle">{formatMonthKey(month)}</p>
            </div>
          </div>
          <div className="card-body">
            <dl className="summary-list">
              <div>
                <dt>Income</dt>
                <dd className="money money-in">{formatMoney(totals.income, settings.currency)}</dd>
              </div>
              <div>
                <dt>Expenses</dt>
                <dd className="money money-out">{formatMoney(totals.expense, settings.currency)}</dd>
              </div>
              <div>
                <dt>Net saved</dt>
                <dd className="money">{formatMoney(totals.balance, settings.currency)}</dd>
              </div>
              <div>
                <dt>Savings rate</dt>
                <dd className="tnum">{formatPercent(Math.max(0, savingsRate))}</dd>
              </div>
              <div>
                <dt>Daily average spend</dt>
                <dd className="money">{formatMoney(dailyAverage, settings.currency)}</dd>
              </div>
              <div>
                <dt>vs previous month</dt>
                <dd className="tnum">
                  {hasPrevious ? (
                    <span className={spendChange > 0 ? 'money-out' : 'money-in'}>
                      {spendChange > 0 ? '+' : '−'}
                      {formatPercent(Math.abs(spendChange))} spend
                    </span>
                  ) : (
                    <span className="summary-muted">No earlier data</span>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="card span-2">
          <div className="card-head">
            <div>
              <h2 className="card-title">Spending pace</h2>
              <p className="card-subtitle">
                {budget.hasBudget
                  ? budget.isAheadOfPace
                    ? 'Running ahead of an even budget pace'
                    : 'Tracking at or below an even budget pace'
                  : 'Cumulative spend through the month'}
              </p>
            </div>
          </div>
          <div className="card-body">
            {isLoading ? (
              <div className="skeleton" style={{ height: 244 }} />
            ) : (
              <SpendPaceChart data={paceData} hasBudget={budget.hasBudget} />
            )}
          </div>
        </section>

        <section className="card span-2">
          <div className="card-head">
            <div>
              <h2 className="card-title">Spending by category</h2>
              <p className="card-subtitle">Ranked by total for {formatMonthKey(month)}</p>
            </div>
          </div>
          <div className="card-body">
            <CategoryBreakdown
              rows={categoryRows}
              isLoading={isLoading}
              emptyHint={`No expenses recorded in ${formatMonthKey(month)}.`}
            />
          </div>
        </section>

        <section className="card">
          <div className="card-head">
            <div>
              <h2 className="card-title">Biggest expenses</h2>
              <p className="card-subtitle">Top {BIGGEST_LIMIT} this month</p>
            </div>
          </div>
          <div className="card-body card-body-flush">
            <TransactionList
              transactions={biggest}
              isLoading={isLoading}
              grouped={false}
              onEdit={openEditor}
              onDelete={deleteTransaction}
              emptyState={
                <EmptyState
                  compact
                  icon="inbox"
                  title="No expenses this month"
                  description="Nothing was spent in this period."
                />
              }
            />
          </div>
        </section>
      </div>
    </div>
  )
}
