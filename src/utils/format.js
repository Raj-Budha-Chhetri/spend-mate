/** Formatting helpers shared by every view that prints money or dates. */

export const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'NPR', symbol: 'Rs', label: 'Nepalese Rupee' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
]

export function getCurrencySymbol(code) {
  return CURRENCIES.find((currency) => currency.code === code)?.symbol ?? '$'
}

/** `1234.5` → `$1,234.50`. Falls back to a plain symbol + digits if Intl
 *  does not know the currency code. */
export function formatMoney(amount, currency = 'USD', { compact = false } = {}) {
  const value = Number.isFinite(amount) ? amount : 0
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: compact && Math.abs(value) >= 1000 ? 1 : 2,
      minimumFractionDigits: compact ? 0 : 2,
    }).format(value)
  } catch {
    return `${getCurrencySymbol(currency)}${value.toFixed(2)}`
  }
}

/** Prints `+$40.00` / `−$40.00` with a true minus sign. */
export function formatSignedMoney(amount, currency = 'USD') {
  const sign = amount < 0 ? '−' : '+'
  return `${sign}${formatMoney(Math.abs(amount), currency)}`
}

/**
 * Axis labels: whole units below 10k (`$1,100`), compact above it (`$12K`).
 * Keeping decimals off the axis stops ticks like `$1.1K` sitting next to
 * `$1.7K`, which are hard to compare at a glance.
 */
export function formatAxisMoney(amount, currency = 'USD') {
  const compact = Math.abs(amount) >= 10000
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      notation: compact ? 'compact' : 'standard',
      maximumFractionDigits: 0,
    }).format(amount)
  } catch {
    return `${getCurrencySymbol(currency)}${Math.round(amount)}`
  }
}

export function formatPercent(value) {
  if (!Number.isFinite(value)) return '0%'
  if (value >= 10 || value === 0) return `${Math.round(value)}%`
  // One decimal, but never a bare `.0` sitting next to whole numbers.
  return `${Number(value.toFixed(1))}%`
}

/* ---------- Dates ----------
 * Dates are stored as `YYYY-MM-DD` strings so they never shift across
 * timezones on the way in or out of localStorage. */

export function todayISO() {
  return toISODate(new Date())
}

export function toISODate(date) {
  const offsetMs = date.getTimezoneOffset() * 60 * 1000
  return new Date(date.getTime() - offsetMs).toISOString().slice(0, 10)
}

/** Parses `YYYY-MM-DD` into a local-midnight Date. */
export function parseISODate(iso) {
  const [year, month, day] = iso.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function formatDate(iso, options = { month: 'short', day: 'numeric', year: 'numeric' }) {
  return parseISODate(iso).toLocaleDateString('en-US', options)
}

/** "Today" / "Yesterday" / "Mon, Sep 8" — used as list group headings. */
export function formatDayHeading(iso) {
  const today = todayISO()
  if (iso === today) return 'Today'

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  if (iso === toISODate(yesterday)) return 'Yesterday'

  const date = parseISODate(iso)
  const sameYear = date.getFullYear() === new Date().getFullYear()
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    ...(sameYear ? {} : { year: 'numeric' }),
  })
}

/** `2026-09-23` → `2026-09` */
export function monthKey(iso) {
  return iso.slice(0, 7)
}

export function currentMonthKey() {
  return monthKey(todayISO())
}

export function formatMonthKey(key, { short = false } = {}) {
  const [year, month] = key.split('-').map(Number)
  return new Date(year, month - 1, 1).toLocaleDateString('en-US', {
    month: short ? 'short' : 'long',
    year: 'numeric',
  })
}

/** Steps a `YYYY-MM` key forward or backward by whole months. */
export function shiftMonthKey(key, delta) {
  const [year, month] = key.split('-').map(Number)
  const date = new Date(year, month - 1 + delta, 1)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
}

export function daysInMonth(key) {
  const [year, month] = key.split('-').map(Number)
  return new Date(year, month, 0).getDate()
}
