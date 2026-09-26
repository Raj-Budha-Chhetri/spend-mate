import { useEffect } from 'react'
import { Icon } from './Icon'
import './ToastStack.css'

const TONE_ICONS = {
  neutral: 'info',
  success: 'check',
  danger: 'alert',
  warning: 'alert',
}

function Toast({ toast, onDismiss }) {
  const { id, title, description, tone, action, duration } = toast

  // Each toast owns its own dismissal timer so a late arrival does not reset
  // the countdown of the ones already on screen.
  useEffect(() => {
    const timer = window.setTimeout(() => onDismiss(id), duration)
    return () => window.clearTimeout(timer)
  }, [id, duration, onDismiss])

  return (
    <li className={`toast toast-${tone}`} role="status">
      <span className="toast-icon">
        <Icon name={TONE_ICONS[tone]} size={16} />
      </span>

      <div className="toast-content">
        <p className="toast-title">{title}</p>
        {description && <p className="toast-description">{description}</p>}
      </div>

      {action && (
        <button
          type="button"
          className="toast-action"
          onClick={() => {
            action.onClick()
            onDismiss(id)
          }}
        >
          {action.label}
        </button>
      )}

      <button type="button" className="toast-close" onClick={() => onDismiss(id)}>
        <Icon name="close" size={14} />
        <span className="sr-only">Dismiss notification</span>
      </button>
    </li>
  )
}

export function ToastStack({ toasts, onDismiss }) {
  if (toasts.length === 0) return null

  return (
    <ul className="toast-stack" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={onDismiss} />
      ))}
    </ul>
  )
}
