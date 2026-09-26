/**
 * The category catalogue. Categories are static reference data, so they live
 * here rather than in state — components look one up by id when they need a
 * label, colour or icon.
 */

export const EXPENSE_CATEGORIES = [
  { id: 'food', label: 'Food & Drink', icon: 'cup', color: 'var(--cat-2)' },
  { id: 'groceries', label: 'Groceries', icon: 'basket', color: 'var(--cat-3)' },
  { id: 'transport', label: 'Transport', icon: 'car', color: 'var(--cat-1)' },
  { id: 'housing', label: 'Housing & Rent', icon: 'home', color: 'var(--cat-5)' },
  { id: 'utilities', label: 'Bills & Utilities', icon: 'bolt', color: 'var(--cat-4)' },
  { id: 'shopping', label: 'Shopping', icon: 'bag', color: 'var(--cat-7)' },
  { id: 'health', label: 'Health', icon: 'heart', color: 'var(--cat-6)' },
  { id: 'entertainment', label: 'Entertainment', icon: 'play', color: 'var(--cat-5)' },
  { id: 'education', label: 'Education', icon: 'book', color: 'var(--cat-1)' },
  { id: 'other-expense', label: 'Other', icon: 'dots', color: 'var(--cat-8)' },
]

export const INCOME_CATEGORIES = [
  { id: 'salary', label: 'Salary', icon: 'briefcase', color: 'var(--cat-3)' },
  { id: 'freelance', label: 'Freelance', icon: 'laptop', color: 'var(--cat-6)' },
  { id: 'investments', label: 'Investments', icon: 'trending', color: 'var(--cat-1)' },
  { id: 'gifts', label: 'Gifts', icon: 'gift', color: 'var(--cat-7)' },
  { id: 'other-income', label: 'Other', icon: 'dots', color: 'var(--cat-8)' },
]

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES]

const CATEGORY_BY_ID = ALL_CATEGORIES.reduce((map, category) => {
  map[category.id] = category
  return map
}, {})

const FALLBACK_CATEGORY = {
  id: 'unknown',
  label: 'Uncategorised',
  icon: 'dots',
  color: 'var(--cat-8)',
}

export function getCategory(id) {
  return CATEGORY_BY_ID[id] ?? FALLBACK_CATEGORY
}

export function getCategoriesForType(type) {
  return type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES
}
