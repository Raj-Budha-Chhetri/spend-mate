/**
 * Pure derivation helpers. Nothing here touches React or storage — each
 * function takes a transaction array and returns a new value, which keeps the
 * maths easy to reason about (and easy to memoise at the call site).
 */

import { getCategory } from '../data/categories'
import { daysInMonth, formatMonthKey, monthKey, shiftMonthKey } from './format'

export function summarise(transactions) {
  let income = 0
  let expense = 0

  for (const transaction of transactions) {
    if (transaction.type === 'income') income += transaction.amount
    else expense += transaction.amount
  }

  return { income, expense, balance: income - expense }
}

/** Totals per category for one transaction type, largest share first. */
export function totalsByCategory(transactions, type) {
  const totals = new Map()

  for (const transaction of transactions) {
    if (transaction.type !== type) continue
    totals.set(
      transaction.categoryId,
      (totals.get(transaction.categoryId) ?? 0) + transaction.amount,
    )
  }

  const sum = [...totals.values()].reduce((acc, value) => acc + value, 0)

  return [...totals.entries()]
    .map(([categoryId, total]) => {
      const category = getCategory(categoryId)
      return {
        categoryId,
        label: category.label,
        color: category.color,
        icon: category.icon,
        total,
        share: sum > 0 ? (total / sum) * 100 : 0,
      }
    })
    .sort((a, b) => b.total - a.total)
}

/** Income/expense totals for each of the last `count` months, oldest first. */
export function monthlySeries(transactions, count, endMonth) {
  const buckets = new Map()

  for (let offset = count - 1; offset >= 0; offset -= 1) {
    buckets.set(shiftMonthKey(endMonth, -offset), { income: 0, expense: 0 })
  }

  for (const transaction of transactions) {
    const bucket = buckets.get(monthKey(transaction.date))
    if (!bucket) continue
    if (transaction.type === 'income') bucket.income += transaction.amount
    else bucket.expense += transaction.amount
  }

  return [...buckets.entries()].map(([key, bucket]) => ({
    key,
    label: formatMonthKey(key, { short: true }).replace(/ \d{4}$/, ''),
    fullLabel: formatMonthKey(key),
    income: bucket.income,
    expense: bucket.expense,
    net: bucket.income - bucket.expense,
  }))
}

/** Day-by-day cumulative spend for a month — the shape the burndown uses. */
export function cumulativeSpendSeries(transactions, month) {
  const totalDays = daysInMonth(month)
  const perDay = new Array(totalDays).fill(0)

  for (const transaction of transactions) {
    if (transaction.type !== 'expense' || monthKey(transaction.date) !== month) continue
    const day = Number(transaction.date.slice(8, 10))
    perDay[day - 1] += transaction.amount
  }

  let running = 0
  return perDay.map((amount, index) => {
    running += amount
    return { day: index + 1, spent: amount, cumulative: running }
  })
}

const MATCHERS = {
  all: () => true,
  income: (transaction) => transaction.type === 'income',
  expense: (transaction) => transaction.type === 'expense',
}

/**
 * Applies the transactions-view filters. Every field is optional, so the same
 * function serves the dashboard ("this month only") and the full list.
 */
export function applyFilters(transactions, filters) {
  const { query = '', type = 'all', categoryId = 'all', month = 'all' } = filters
  const needle = query.trim().toLowerCase()

  return transactions.filter((transaction) => {
    if (!MATCHERS[type](transaction)) return false
    if (categoryId !== 'all' && transaction.categoryId !== categoryId) return false
    if (month !== 'all' && monthKey(transaction.date) !== month) return false
    if (!needle) return true

    const haystack = `${transaction.description} ${getCategory(transaction.categoryId).label}`
    return haystack.toLowerCase().includes(needle)
  })
}

export const SORT_OPTIONS = [
  { value: 'date-desc', label: 'Newest first' },
  { value: 'date-asc', label: 'Oldest first' },
  { value: 'amount-desc', label: 'Amount: high to low' },
  { value: 'amount-asc', label: 'Amount: low to high' },
  { value: 'category', label: 'Category A–Z' },
]

const COMPARATORS = {
  'date-desc': (a, b) => b.date.localeCompare(a.date) || b.createdAt - a.createdAt,
  'date-asc': (a, b) => a.date.localeCompare(b.date) || a.createdAt - b.createdAt,
  'amount-desc': (a, b) => b.amount - a.amount,
  'amount-asc': (a, b) => a.amount - b.amount,
  category: (a, b) =>
    getCategory(a.categoryId).label.localeCompare(getCategory(b.categoryId).label) ||
    b.date.localeCompare(a.date),
}

export function sortTransactions(transactions, sortBy) {
  return [...transactions].sort(COMPARATORS[sortBy] ?? COMPARATORS['date-desc'])
}

/** Collapses a date-sorted list into day sections for the list view. */
export function groupByDay(transactions) {
  const groups = []
  let current = null

  for (const transaction of transactions) {
    if (!current || current.date !== transaction.date) {
      current = { date: transaction.date, items: [], net: 0 }
      groups.push(current)
    }
    current.items.push(transaction)
    current.net += transaction.type === 'income' ? transaction.amount : -transaction.amount
  }

  return groups
}

/** Distinct months present in the data, newest first. */
export function availableMonths(transactions) {
  const months = new Set(transactions.map((transaction) => monthKey(transaction.date)))
  return [...months].sort((a, b) => b.localeCompare(a))
}

/** Percentage change from `previous` to `current`, guarding divide-by-zero. */
export function percentChange(current, previous) {
  if (previous === 0) return current === 0 ? 0 : 100
  return ((current - previous) / previous) * 100
}
