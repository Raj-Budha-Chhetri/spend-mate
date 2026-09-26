import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { SettingsProvider } from './context/SettingsProvider'
import { TransactionsProvider } from './context/TransactionsProvider'
import { ToastProvider } from './context/ToastProvider'
import { AppShell } from './components/AppShell'
import { Dashboard } from './pages/Dashboard'
import { Transactions } from './pages/Transactions'
import { Insights } from './pages/Insights'
import { Settings } from './pages/Settings'

export function App() {
  return (
    <SettingsProvider>
      <TransactionsProvider>
        <ToastProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppShell />}>
                <Route index element={<Dashboard />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="insights" element={<Insights />} />
                <Route path="settings" element={<Settings />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </ToastProvider>
      </TransactionsProvider>
    </SettingsProvider>
  )
}
