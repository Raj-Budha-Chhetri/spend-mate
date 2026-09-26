import { Icon } from './Icon'
import { useSettings } from '../hooks/useSettings'
import './ThemeToggle.css'

const THEMES = [
  { value: 'light', icon: 'sun', label: 'Light' },
  { value: 'dark', icon: 'moon', label: 'Dark' },
  { value: 'system', icon: 'monitor', label: 'System' },
]

export function ThemeToggle() {
  const { settings, updateSettings } = useSettings()

  return (
    <div className="segmented full theme-toggle" role="group" aria-label="Colour theme">
      {THEMES.map((theme) => (
        <button
          key={theme.value}
          type="button"
          title={`${theme.label} theme`}
          aria-pressed={settings.theme === theme.value}
          onClick={() => updateSettings({ theme: theme.value })}
        >
          <Icon name={theme.icon} size={15} />
          <span className="sr-only">{theme.label} theme</span>
        </button>
      ))}
    </div>
  )
}
