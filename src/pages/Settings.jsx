import { useRef, useState } from 'react'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ThemeToggle } from '../components/ThemeToggle'
import { Icon } from '../components/Icon'
import { useSettings } from '../hooks/useSettings'
import { useTransactions } from '../hooks/useTransactions'
import { useToast } from '../hooks/useToast'
import { CURRENCIES, formatMoney } from '../utils/format'
import './Settings.css'

export function Settings() {
  const { settings, updateSettings } = useSettings()
  const { transactions, replaceAll, clearAll, loadSampleData } = useTransactions()
  const { showToast } = useToast()

  const [budgetDraft, setBudgetDraft] = useState(String(settings.monthlyBudget ?? ''))
  const [pendingAction, setPendingAction] = useState(null)
  const fileInputRef = useRef(null)

  const handleBudgetChange = (value) => {
    const cleaned = value.replace(/[^0-9.]/g, '')
    if (cleaned.split('.').length > 2) return
    setBudgetDraft(cleaned)
    updateSettings({ monthlyBudget: cleaned === '' ? 0 : Number(cleaned) })
  }

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(transactions, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `spendmate-export-${new Date().toISOString().slice(0, 10)}.json`
    link.click()
    URL.revokeObjectURL(url)
    showToast({ title: 'Export downloaded', description: `${transactions.length} transactions`, tone: 'success' })
  }

  const handleImport = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        if (!Array.isArray(parsed)) throw new Error('Expected a JSON array')
        replaceAll(parsed)
        showToast({ title: 'Data imported', description: `${parsed.length} transactions`, tone: 'success' })
      } catch {
        showToast({
          title: 'Import failed',
          description: 'That file is not a SpendMate export.',
          tone: 'danger',
        })
      }
    }
    reader.readAsText(file)
    // Allow re-importing the same file twice in a row.
    event.target.value = ''
  }

  return (
    <div className="settings">
      <section className="card settings-section">
        <div className="card-head">
          <div>
            <h2 className="card-title">Preferences</h2>
            <p className="card-subtitle">How SpendMate looks and counts</p>
          </div>
        </div>

        <div className="card-body settings-body">
          <div className="setting-row">
            <div className="setting-copy">
              <p className="setting-label">Currency</p>
              <p className="setting-hint">Used for every amount shown in the app.</p>
            </div>
            <select
              className="select setting-control"
              value={settings.currency}
              onChange={(event) => updateSettings({ currency: event.target.value })}
              aria-label="Currency"
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.code} — {currency.label}
                </option>
              ))}
            </select>
          </div>

          <div className="setting-row">
            <div className="setting-copy">
              <p className="setting-label">Monthly budget</p>
              <p className="setting-hint">
                {Number(budgetDraft) > 0
                  ? `Warnings appear once you pass ${formatMoney(Number(budgetDraft) * 0.8, settings.currency)}.`
                  : 'Leave at zero to turn budget tracking off.'}
              </p>
            </div>
            <input
              className="input setting-control"
              type="text"
              inputMode="decimal"
              value={budgetDraft}
              onChange={(event) => handleBudgetChange(event.target.value)}
              aria-label="Monthly budget"
            />
          </div>

          <div className="setting-row">
            <div className="setting-copy">
              <p className="setting-label">Theme</p>
              <p className="setting-hint">System follows your device appearance setting.</p>
            </div>
            <div className="setting-control">
              <ThemeToggle />
            </div>
          </div>
        </div>
      </section>

      <section className="card settings-section">
        <div className="card-head">
          <div>
            <h2 className="card-title">Your data</h2>
            <p className="card-subtitle">
              {transactions.length} {transactions.length === 1 ? 'transaction' : 'transactions'}{' '}
              stored in this browser
            </p>
          </div>
        </div>

        <div className="card-body settings-body">
          <p className="settings-note">
            <Icon name="info" size={15} />
            SpendMate runs entirely in your browser. Nothing is uploaded — clearing your browser
            storage also clears your ledger, so export a backup if it matters.
          </p>

          <div className="settings-actions">
            <button type="button" className="btn btn-secondary" onClick={handleExport}>
              <Icon name="download" size={15} />
              Export JSON
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Icon name="upload" size={15} />
              Import JSON
            </button>

            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setPendingAction('sample')}
            >
              <Icon name="sparkle" size={15} />
              Load sample data
            </button>

            <button
              type="button"
              className="btn btn-secondary settings-danger"
              onClick={() => setPendingAction('clear')}
              disabled={transactions.length === 0}
            >
              <Icon name="trash" size={15} />
              Delete everything
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="application/json"
              className="sr-only"
              onChange={handleImport}
            />
          </div>
        </div>
      </section>

      {pendingAction === 'sample' && (
        <ConfirmDialog
          title="Replace with sample data?"
          description="This overwrites your current transactions with a generated demo ledger covering the last six months."
          confirmLabel="Load sample data"
          tone="primary"
          onClose={() => setPendingAction(null)}
          onConfirm={() => {
            loadSampleData()
            showToast({ title: 'Sample data loaded', tone: 'success' })
          }}
        />
      )}

      {pendingAction === 'clear' && (
        <ConfirmDialog
          title="Delete all transactions?"
          description="Every transaction will be removed from this browser. This cannot be undone, so export a backup first if you might want the data back."
          confirmLabel="Delete everything"
          onClose={() => setPendingAction(null)}
          onConfirm={() => {
            clearAll()
            showToast({ title: 'All transactions deleted', tone: 'danger' })
          }}
        />
      )}
    </div>
  )
}
