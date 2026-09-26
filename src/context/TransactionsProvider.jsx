import { useCallback, useEffect, useMemo, useState } from 'react'
import { TransactionsContext } from './contexts'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { createSampleTransactions } from '../data/sampleTransactions'

const STORAGE_KEY = 'spendmate:transactions'

function createId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `txn-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

/** Guards against a corrupted or hand-edited localStorage payload. */
function isValidTransaction(value) {
  return (
    value &&
    typeof value.id === 'string' &&
    (value.type === 'income' || value.type === 'expense') &&
    typeof value.amount === 'number' &&
    Number.isFinite(value.amount) &&
    typeof value.categoryId === 'string' &&
    typeof value.date === 'string'
  )
}

export function TransactionsProvider({ children }) {
  // `null` distinguishes "nothing saved yet" from "saved an empty list",
  // so the sample data is only ever seeded on a genuine first visit.
  const [stored, setStored] = useLocalStorage(STORAGE_KEY, null)
  const [isLoading, setIsLoading] = useState(true)

  const transactions = useMemo(() => {
    if (!Array.isArray(stored)) return []
    return stored.filter(isValidTransaction)
  }, [stored])

  useEffect(() => {
    if (stored === null) setStored(createSampleTransactions())
  }, [stored, setStored])

  useEffect(() => {
    // A short gate on first paint: the skeletons are shown while the stored
    // data is read and normalised, instead of flashing an empty dashboard.
    const timer = window.setTimeout(() => setIsLoading(false), 400)
    return () => window.clearTimeout(timer)
  }, [])

  const addTransaction = useCallback(
    (draft) => {
      const transaction = { ...draft, id: createId(), createdAt: Date.now() }
      setStored((current) => [transaction, ...(current ?? [])])
      return transaction
    },
    [setStored],
  )

  const updateTransaction = useCallback(
    (id, patch) => {
      setStored((current) =>
        (current ?? []).map((transaction) =>
          transaction.id === id ? { ...transaction, ...patch } : transaction,
        ),
      )
    },
    [setStored],
  )

  const removeTransaction = useCallback(
    (id) => {
      setStored((current) => (current ?? []).filter((transaction) => transaction.id !== id))
    },
    [setStored],
  )

  /** Puts a deleted transaction back — powers "Undo" in the delete toast. */
  const restoreTransaction = useCallback(
    (transaction) => {
      setStored((current) => [transaction, ...(current ?? [])])
    },
    [setStored],
  )

  const replaceAll = useCallback(
    (nextTransactions) => setStored(nextTransactions.filter(isValidTransaction)),
    [setStored],
  )

  const clearAll = useCallback(() => setStored([]), [setStored])

  const loadSampleData = useCallback(
    () => setStored(createSampleTransactions()),
    [setStored],
  )

  const value = useMemo(
    () => ({
      transactions,
      isLoading,
      addTransaction,
      updateTransaction,
      removeTransaction,
      restoreTransaction,
      replaceAll,
      clearAll,
      loadSampleData,
    }),
    [
      transactions,
      isLoading,
      addTransaction,
      updateTransaction,
      removeTransaction,
      restoreTransaction,
      replaceAll,
      clearAll,
      loadSampleData,
    ],
  )

  return <TransactionsContext.Provider value={value}>{children}</TransactionsContext.Provider>
}
