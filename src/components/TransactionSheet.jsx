import { useMemo, useState } from 'react'
import { Modal } from './Modal'
import { Icon } from './Icon'
import { useTransactions } from '../hooks/useTransactions'
import { useSettings } from '../hooks/useSettings'
import { useToast } from '../hooks/useToast'
import { getCategoriesForType } from '../data/categories'
import { getCurrencySymbol, todayISO } from '../utils/format'
import './TransactionSheet.css'

const MAX_DESCRIPTION = 60

function buildInitialForm(transaction) {
  if (transaction) {
    return {
      type: transaction.type,
      amount: String(transaction.amount),
      categoryId: transaction.categoryId,
      description: transaction.description,
      date: transaction.date,
    }
  }

  return {
    type: 'expense',
    amount: '',
    categoryId: 'food',
    description: '',
    date: todayISO(),
  }
}

/** Returns a map of field name → message; an empty map means the form is valid. */
function validate(form) {
  const errors = {}
  const amount = Number(form.amount)

  if (form.amount.trim() === '') errors.amount = 'Enter an amount.'
  else if (!Number.isFinite(amount)) errors.amount = 'That is not a valid number.'
  else if (amount <= 0) errors.amount = 'Amount must be greater than zero.'
  else if (amount > 1_000_000_000) errors.amount = 'That amount is too large.'

  if (form.description.trim().length < 2) errors.description = 'Add a short description.'
  if (!form.date) errors.date = 'Pick a date.'

  return errors
}

/**
 * Create/edit form for a single transaction. Every input is controlled, and
 * validation messages only appear once a field has been left or the form has
 * been submitted — so the form never scolds someone mid-keystroke.
 */
export function TransactionSheet({ transaction, onClose }) {
  const { addTransaction, updateTransaction } = useTransactions()
  const { settings } = useSettings()
  const { showToast } = useToast()

  const isEditing = Boolean(transaction)
  const [form, setForm] = useState(() => buildInitialForm(transaction))
  const [touched, setTouched] = useState({})
  const [hasSubmitted, setHasSubmitted] = useState(false)

  const errors = useMemo(() => validate(form), [form])
  const categories = getCategoriesForType(form.type)

  const showError = (field) => Boolean(errors[field]) && (hasSubmitted || touched[field])

  const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }))
  const markTouched = (field) => setTouched((current) => ({ ...current, [field]: true }))

  /** Income and expense have separate category lists, so switching type moves
   *  the selection to a sensible default in the new list. */
  const handleTypeChange = (type) => {
    setForm((current) => ({
      ...current,
      type,
      categoryId: getCategoriesForType(type)[0].id,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    setHasSubmitted(true)
    if (Object.keys(errors).length > 0) return

    const payload = {
      type: form.type,
      amount: Math.round(Number(form.amount) * 100) / 100,
      categoryId: form.categoryId,
      description: form.description.trim(),
      date: form.date,
    }

    if (isEditing) {
      updateTransaction(transaction.id, payload)
      showToast({ title: 'Transaction updated', tone: 'success' })
    } else {
      addTransaction(payload)
      showToast({
        title: `${form.type === 'income' ? 'Income' : 'Expense'} added`,
        description: payload.description,
        tone: 'success',
      })
    }

    onClose()
  }

  return (
    <Modal
      title={isEditing ? 'Edit transaction' : 'New transaction'}
      description={isEditing ? 'Update the details and save.' : 'Log money coming in or going out.'}
      onClose={onClose}
      footer={
        <>
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" form="transaction-form" className="btn btn-primary">
            {isEditing ? 'Save changes' : 'Add transaction'}
          </button>
        </>
      }
    >
      <form id="transaction-form" className="modal-body txn-form" onSubmit={handleSubmit} noValidate>
        <div className="segmented full type-switch" role="group" aria-label="Transaction type">
          <button
            type="button"
            aria-pressed={form.type === 'expense'}
            onClick={() => handleTypeChange('expense')}
          >
            <Icon name="arrowUp" size={14} />
            Expense
          </button>
          <button
            type="button"
            aria-pressed={form.type === 'income'}
            onClick={() => handleTypeChange('income')}
          >
            <Icon name="arrowDown" size={14} />
            Income
          </button>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="amount">
            Amount
          </label>
          <div className="amount-input">
            <span className="currency-prefix">{getCurrencySymbol(settings.currency)}</span>
            <input
              id="amount"
              className="input amount-field"
              type="text"
              data-autofocus
              inputMode="decimal"
              autoComplete="off"
              placeholder="0.00"
              value={form.amount}
              aria-invalid={showError('amount')}
              aria-describedby={showError('amount') ? 'amount-error' : undefined}
              onChange={(event) => {
                // Accept digits and at most one decimal point while typing.
                const next = event.target.value.replace(/[^0-9.]/g, '')
                if (next.split('.').length > 2) return
                setField('amount', next)
              }}
              onBlur={() => markTouched('amount')}
            />
          </div>
          {showError('amount') && (
            <p className="field-error" id="amount-error">
              {errors.amount}
            </p>
          )}
        </div>

        <div className="field">
          <span className="field-label">Category</span>
          <div className="category-grid" role="radiogroup" aria-label="Category">
            {categories.map((category) => {
              const isSelected = form.categoryId === category.id
              return (
                <button
                  key={category.id}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  className={`category-chip${isSelected ? ' is-selected' : ''}`}
                  style={{ '--chip-color': category.color }}
                  onClick={() => setField('categoryId', category.id)}
                >
                  <Icon name={category.icon} size={15} />
                  <span>{category.label}</span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="field">
          <label className="field-label" htmlFor="description">
            Description
          </label>
          <input
            id="description"
            className="input"
            type="text"
            autoComplete="off"
            maxLength={MAX_DESCRIPTION}
            placeholder="e.g. Weekly groceries"
            value={form.description}
            aria-invalid={showError('description')}
            onChange={(event) => setField('description', event.target.value)}
            onBlur={() => markTouched('description')}
          />
          {showError('description') ? (
            <p className="field-error">{errors.description}</p>
          ) : (
            <p className="field-hint">
              {MAX_DESCRIPTION - form.description.length} characters left
            </p>
          )}
        </div>

        <div className="field">
          <label className="field-label" htmlFor="date">
            Date
          </label>
          <input
            id="date"
            className="input"
            type="date"
            value={form.date}
            aria-invalid={showError('date')}
            onChange={(event) => setField('date', event.target.value)}
            onBlur={() => markTouched('date')}
          />
          {showError('date') && <p className="field-error">{errors.date}</p>}
        </div>
      </form>
    </Modal>
  )
}
