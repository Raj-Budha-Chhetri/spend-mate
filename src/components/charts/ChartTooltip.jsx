import { formatMoney } from '../../utils/format'
import { useSettings } from '../../hooks/useSettings'

/**
 * Recharts tooltip rendered with the app's own surface tokens, so it matches
 * the cards instead of the library default.
 */
export function ChartTooltip({ active, payload, label }) {
  const { settings } = useSettings()
  if (!active || !payload?.length) return null

  const heading = payload[0]?.payload?.fullLabel ?? label

  return (
    <div className="chart-tooltip">
      <p className="chart-tooltip-title">{heading}</p>
      <ul>
        {payload.map((entry) => (
          <li key={entry.dataKey}>
            <span className="dot" style={{ background: entry.color }} />
            <span className="chart-tooltip-name">{entry.name}</span>
            <span className="chart-tooltip-value money">
              {formatMoney(entry.value, settings.currency)}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
