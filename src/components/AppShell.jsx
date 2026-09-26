import { useCallback, useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation } from 'react-router-dom'
import { Icon } from './Icon'
import { Logo } from './Logo'
import { ThemeToggle } from './ThemeToggle'
import { SidebarSummary } from './SidebarSummary'
import { TransactionSheet } from './TransactionSheet'
import './AppShell.css'

const NAV_ITEMS = [
  { to: '/', label: 'Dashboard', icon: 'grid', title: 'Dashboard', subtitle: 'Your money at a glance' },
  { to: '/transactions', label: 'Transactions', icon: 'receipt', title: 'Transactions', subtitle: 'Every entry you have logged' },
  { to: '/insights', label: 'Insights', icon: 'chart', title: 'Insights', subtitle: 'Where the money actually goes' },
  { to: '/settings', label: 'Settings', icon: 'sliders', title: 'Settings', subtitle: 'Budget, currency and your data' },
]

export function AppShell() {
  const { pathname } = useLocation()
  const [isNavOpen, setIsNavOpen] = useState(false)
  // `null` = closed, `{}` = adding, `{ ...transaction }` = editing.
  const [editorTarget, setEditorTarget] = useState(null)

  const activeItem = NAV_ITEMS.find((item) => item.to === pathname) ?? NAV_ITEMS[0]

  const openEditor = useCallback((transaction = null) => setEditorTarget(transaction ?? {}), [])
  const closeEditor = useCallback(() => setEditorTarget(null), [])

  // Route changes close the mobile drawer, so navigating never leaves the
  // overlay hanging over the new page.
  useEffect(() => {
    setIsNavOpen(false)
  }, [pathname])

  // Keyboard shortcut: "n" opens a new transaction from anywhere.
  useEffect(() => {
    const handleKeyDown = (event) => {
      const tag = event.target.tagName
      const isTyping = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT'
      if (isTyping || event.metaKey || event.ctrlKey || event.altKey) return
      if (event.key === 'n' || event.key === 'N') {
        event.preventDefault()
        setEditorTarget((current) => current ?? {})
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <div className="shell">
      <aside className={`sidebar${isNavOpen ? ' is-open' : ''}`}>
        <div className="sidebar-head">
          <Logo />
          <button
            type="button"
            className="btn btn-icon sidebar-dismiss"
            onClick={() => setIsNavOpen(false)}
          >
            <Icon name="close" size={16} />
            <span className="sr-only">Close navigation</span>
          </button>
        </div>

        <nav className="sidebar-nav" aria-label="Main">
          <p className="eyebrow sidebar-heading">Menu</p>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.to}>
                <NavLink to={item.to} end={item.to === '/'} className="nav-link">
                  <Icon name={item.icon} size={17} />
                  <span>{item.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="sidebar-foot">
          <SidebarSummary />
          <ThemeToggle />
        </div>
      </aside>

      {isNavOpen && (
        <button
          type="button"
          className="scrim"
          aria-label="Close navigation"
          onClick={() => setIsNavOpen(false)}
        />
      )}

      <div className="main">
        <header className="topbar">
          <div className="topbar-inner">
            <button
              type="button"
              className="btn btn-icon topbar-menu"
              onClick={() => setIsNavOpen(true)}
            >
              <Icon name="menu" size={18} />
              <span className="sr-only">Open navigation</span>
            </button>

            <div className="topbar-brand">
              <Logo />
            </div>

            <div className="topbar-titles">
              <h1 className="topbar-title">{activeItem.title}</h1>
              <p className="topbar-subtitle">{activeItem.subtitle}</p>
            </div>

            <button
              type="button"
              className="btn btn-primary topbar-add"
              onClick={() => openEditor()}
            >
              <Icon name="plus" size={16} />
              <span>Add transaction</span>
              <kbd className="kbd">N</kbd>
            </button>
          </div>
        </header>

        <main className="content">
          <Outlet context={{ openEditor }} />
        </main>
      </div>

      <nav className="tabbar" aria-label="Main">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.to === '/'} className="tab-link">
            <Icon name={item.icon} size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <button type="button" className="fab" onClick={() => openEditor()}>
        <Icon name="plus" size={22} />
        <span className="sr-only">Add transaction</span>
      </button>

      {editorTarget && (
        <TransactionSheet
          transaction={editorTarget.id ? editorTarget : null}
          onClose={closeEditor}
        />
      )}
    </div>
  )
}
