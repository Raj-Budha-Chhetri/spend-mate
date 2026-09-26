import { useCallback, useMemo, useState } from 'react'
import { ToastContext } from './contexts'
import { ToastStack } from '../components/ToastStack'

let nextToastId = 0

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const dismissToast = useCallback((id) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }, [])

  const showToast = useCallback(
    ({ title, description, tone = 'neutral', action, duration = 5000 }) => {
      nextToastId += 1
      const id = nextToastId
      setToasts((current) => [...current, { id, title, description, tone, action, duration }])
      return id
    },
    [],
  )

  const value = useMemo(() => ({ showToast, dismissToast }), [showToast, dismissToast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastStack toasts={toasts} onDismiss={dismissToast} />
    </ToastContext.Provider>
  )
}
