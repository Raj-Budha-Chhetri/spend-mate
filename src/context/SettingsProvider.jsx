import { useCallback, useEffect, useMemo, useState } from 'react'
import { SettingsContext } from './contexts'
import { useLocalStorage } from '../hooks/useLocalStorage'

const STORAGE_KEY = 'spendmate:settings'

const DEFAULT_SETTINGS = {
  currency: 'USD',
  monthlyBudget: 2000,
  theme: 'system',
}

/** Resolves the `system` theme choice against the OS preference. */
function resolveTheme(theme) {
  if (theme !== 'system') return theme
  const prefersDark = window.matchMedia?.('(prefers-color-scheme: dark)').matches
  return prefersDark ? 'dark' : 'light'
}

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useLocalStorage(STORAGE_KEY, DEFAULT_SETTINGS)

  const updateSettings = useCallback(
    (patch) => setSettings((current) => ({ ...DEFAULT_SETTINGS, ...current, ...patch })),
    [setSettings],
  )

  const theme = settings.theme ?? DEFAULT_SETTINGS.theme
  const [resolvedTheme, setResolvedTheme] = useState(() => resolveTheme(theme))

  // Write the resolved theme onto <html> so the CSS variables switch, and keep
  // following the OS while the preference is "system".
  useEffect(() => {
    const apply = () => {
      const resolved = resolveTheme(theme)
      setResolvedTheme(resolved)
      document.documentElement.dataset.theme = resolved
      document
        .querySelector('meta[name="theme-color"]')
        ?.setAttribute('content', resolved === 'dark' ? '#121211' : '#f7f6f3')
    }

    apply()
    if (theme !== 'system') return undefined

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    media.addEventListener('change', apply)
    return () => media.removeEventListener('change', apply)
  }, [theme])

  const value = useMemo(
    () => ({
      settings: { ...DEFAULT_SETTINGS, ...settings },
      updateSettings,
      resolvedTheme,
    }),
    [settings, updateSettings, resolvedTheme],
  )

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
}
