import { Icon } from './Icon'
import './EmptyState.css'

/** Shared placeholder for "nothing here yet" and "nothing matched" states. */
export function EmptyState({ icon = 'inbox', title, description, action, compact = false }) {
  return (
    <div className={`empty-state${compact ? ' is-compact' : ''}`}>
      <span className="empty-icon">
        <Icon name={icon} size={compact ? 18 : 22} />
      </span>
      <p className="empty-title">{title}</p>
      {description && <p className="empty-description">{description}</p>}
      {action && <div className="empty-action">{action}</div>}
    </div>
  )
}
