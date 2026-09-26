import { createContext } from 'react'

/**
 * Context objects live in their own module so that the provider files export
 * components only, and the consumer hooks export functions only. Keeping the
 * two apart is what lets Fast Refresh work reliably.
 */
export const TransactionsContext = createContext(null)
export const SettingsContext = createContext(null)
export const ToastContext = createContext(null)
