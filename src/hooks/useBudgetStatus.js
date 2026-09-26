import { useMemo } from 'react'
import { useTransactions } from './useTransactions'
import { useSettings } from './useSettings'
import { currentMonthKey, daysInMonth, monthKey, todayISO } from '../utils/format'

/**
 * Budget health for one month.
 *
 * `state` drives every budget colour in the UI:
 *   ok      — comfortably inside the limit
 *   warning — 80% or more of the limit spent
 *   over    — the limit has been exceeded
 */
export function useBudgetStatus(month = currentMonthKey()) {
  const { transactions } = useTransactions()
  const { settings } = useSettings()
  const budget = Number(settings.monthlyBudget) || 0

  return useMemo(() => {
    const spent = transactions
      .filter((t) => t.type === 'expense' && monthKey(t.date) === month)
      .reduce((total, t) => total + t.amount, 0)

    const remaining = budget - spent
    const percent = budget > 0 ? (spent / budget) * 100 : 0

    let state = 'ok'
    if (budget > 0 && spent > budget) state = 'over'
    else if (budget > 0 && percent >= 80) state = 'warning'

    // How far through the month we are, so the UI can say whether spending is
    // ahead of or behind pace. Past months count as fully elapsed.
    const total = daysInMonth(month)
    const today = todayISO()
    const isCurrent = month === monthKey(today)
    const dayOfMonth = isCurrent ? Number(today.slice(8, 10)) : total
    const expectedSpend = budget > 0 ? (budget / total) * dayOfMonth : 0

    return {
      budget,
      spent,
      remaining,
      percent,
      state,
      hasBudget: budget > 0,
      dayOfMonth,
      daysInMonth: total,
      daysLeft: Math.max(0, total - dayOfMonth),
      expectedSpend,
      isAheadOfPace: budget > 0 && spent > expectedSpend,
      dailyAllowance: isCurrent && total - dayOfMonth > 0 ? remaining / (total - dayOfMonth) : 0,
    }
  }, [transactions, budget, month])
}
