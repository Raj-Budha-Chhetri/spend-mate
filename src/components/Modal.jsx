import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Icon } from './Icon'
import './Modal.css'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Accessible dialog shell: renders in a portal, locks background scrolling,
 * closes on Escape or overlay click, and keeps Tab focus inside itself.
 * On phones it presents as a bottom sheet instead of a centred card.
 */
export function Modal({ title, description, onClose, children, footer, size = 'md' }) {
  const dialogRef = useRef(null)

  useEffect(() => {
    const previouslyFocused = document.activeElement
    const { overflow } = document.body.style
    document.body.style.overflow = 'hidden'

    // Move focus into the dialog. A field marked `data-autofocus` wins, so
    // focus lands on the first thing worth typing into rather than on the
    // close button that happens to come first in the markup.
    const target =
      dialogRef.current?.querySelector('[data-autofocus]') ??
      dialogRef.current?.querySelector(FOCUSABLE)
    target?.focus()

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation()
        onClose()
        return
      }

      if (event.key !== 'Tab') return

      const focusable = [...(dialogRef.current?.querySelectorAll(FOCUSABLE) ?? [])]
      if (focusable.length === 0) return

      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = overflow
      previouslyFocused?.focus?.()
    }
  }, [onClose])

  return createPortal(
    <div className="modal-root">
      <div className="modal-overlay" onClick={onClose} />

      <div
        ref={dialogRef}
        className={`modal modal-${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
      >
        <header className="modal-head">
          <div>
            <h2 className="modal-title">{title}</h2>
            {description && <p className="modal-description">{description}</p>}
          </div>
          <button type="button" className="btn btn-icon" onClick={onClose}>
            <Icon name="close" size={16} />
            <span className="sr-only">Close dialog</span>
          </button>
        </header>

        {children}

        {footer && <footer className="modal-foot">{footer}</footer>}
      </div>
    </div>,
    document.body,
  )
}
