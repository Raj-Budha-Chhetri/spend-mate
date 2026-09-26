import { useCallback } from 'react'
import { useTransactions } from './useTransactions'
import { useToast } from './useToast'

/**
 * Deleting is immediate rather than confirmed — a toast offers an undo, which
 * is faster for the common case and still safe.
 */
export function useDeleteTransaction() {
  const { removeTransaction, restoreTransaction } = useTransactions()
  const { showToast } = useToast()

  return useCallback(
    (transaction) => {
      removeTransaction(transaction.id)
      showToast({
        title: 'Transaction deleted',
        description: transaction.description,
        tone: 'danger',
        duration: 7000,
        action: { label: 'Undo', onClick: () => restoreTransaction(transaction) },
      })
    },
    [removeTransaction, restoreTransaction, showToast],
  )
}
