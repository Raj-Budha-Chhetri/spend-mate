import { toISODate } from '../utils/format'

/**
 * Demo data for first-time visitors and the "load sample data" button in
 * Settings. Dates are generated relative to today so the dashboard always has
 * a populated current month, whenever the app is opened.
 */

const TEMPLATES = [
  { type: 'income', categoryId: 'salary', description: 'Monthly salary', amount: 3200, day: 1 },
  { type: 'income', categoryId: 'freelance', description: 'Landing page build', amount: 640, day: 12 },
  { type: 'expense', categoryId: 'housing', description: 'Apartment rent', amount: 1150, day: 2 },
  { type: 'expense', categoryId: 'utilities', description: 'Electricity bill', amount: 74.2, day: 4 },
  { type: 'expense', categoryId: 'utilities', description: 'Internet — fibre plan', amount: 45, day: 4 },
  { type: 'expense', categoryId: 'groceries', description: 'Weekly groceries', amount: 82.35, day: 5 },
  { type: 'expense', categoryId: 'transport', description: 'Metro card top-up', amount: 40, day: 6 },
  { type: 'expense', categoryId: 'food', description: 'Coffee with Sam', amount: 11.5, day: 7 },
  { type: 'expense', categoryId: 'entertainment', description: 'Cinema tickets', amount: 28, day: 9 },
  { type: 'expense', categoryId: 'groceries', description: 'Weekly groceries', amount: 76.9, day: 12 },
  { type: 'expense', categoryId: 'health', description: 'Pharmacy', amount: 23.4, day: 14 },
  { type: 'expense', categoryId: 'shopping', description: 'Running shoes', amount: 95, day: 15 },
  { type: 'expense', categoryId: 'food', description: 'Dinner — Thai place', amount: 46.8, day: 17 },
  { type: 'expense', categoryId: 'groceries', description: 'Weekly groceries', amount: 91.2, day: 19 },
  { type: 'expense', categoryId: 'transport', description: 'Fuel', amount: 52.6, day: 20 },
  { type: 'expense', categoryId: 'education', description: 'Online course', amount: 39, day: 22 },
  { type: 'expense', categoryId: 'entertainment', description: 'Music subscription', amount: 10.99, day: 23 },
  { type: 'expense', categoryId: 'food', description: 'Team lunch', amount: 32.5, day: 25 },
  { type: 'expense', categoryId: 'groceries', description: 'Weekly groceries', amount: 68.4, day: 26 },
  { type: 'expense', categoryId: 'other-expense', description: 'Gift for Mum', amount: 55, day: 27 },
]

/** Nudges a demo amount so the months are not carbon copies of each other. */
function vary(amount, monthOffset, index) {
  if (amount >= 1000) return amount
  const swing = ((index * 7 + monthOffset * 13) % 21) - 10
  return Math.max(1, Math.round(amount * (1 + swing / 100) * 100) / 100)
}

export function createSampleTransactions(monthsBack = 5) {
  const today = new Date()
  const transactions = []
  let sequence = 0

  for (let monthOffset = monthsBack; monthOffset >= 0; monthOffset -= 1) {
    const isCurrentMonth = monthOffset === 0

    for (const [index, template] of TEMPLATES.entries()) {
      const date = new Date(today.getFullYear(), today.getMonth() - monthOffset, template.day)

      // Never invent transactions dated in the future.
      if (isCurrentMonth && date > today) continue

      sequence += 1
      transactions.push({
        id: `sample-${monthOffset}-${index}`,
        type: template.type,
        amount: vary(template.amount, monthOffset, index),
        categoryId: template.categoryId,
        description: template.description,
        date: toISODate(date),
        createdAt: Date.now() - (300 - sequence) * 60000,
      })
    }
  }

  return transactions
}
