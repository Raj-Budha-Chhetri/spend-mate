import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ChartTooltip } from './ChartTooltip'
import { useSettings } from '../../hooks/useSettings'
import { formatAxisMoney } from '../../utils/format'
import './charts.css'

const AXIS_STYLE = { fill: 'var(--chart-axis)', fontSize: 11 }

/**
 * Cumulative spending through the month against an even budget pace.
 * Both series are money, so they share one axis — the dashed pace line is a
 * reference, which is why it is drawn in neutral ink rather than a hue.
 */
export function SpendPaceChart({ data, hasBudget }) {
  // Redrawn on every month step, so the entry animation is switched off for
  // the same reason as the trend chart's.
  const { settings } = useSettings()

  return (
    <div className="chart-block">
      <ul className="chart-legend">
        <li>
          <span className="dot" style={{ background: 'var(--chart-expense)' }} />
          Spent so far
        </li>
        {hasBudget && (
          <li>
            <span className="dash" />
            Even budget pace
          </li>
        )}
      </ul>

      <div className="chart-canvas">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 4, right: 6, bottom: 0, left: -14 }}>
            <defs>
              <linearGradient id="spend-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--chart-expense)" stopOpacity={0.22} />
                <stop offset="100%" stopColor="var(--chart-expense)" stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
            <XAxis
              dataKey="day"
              tick={AXIS_STYLE}
              tickLine={false}
              axisLine={{ stroke: 'var(--chart-grid)' }}
              interval={4}
              dy={4}
            />
            <YAxis
              tick={AXIS_STYLE}
              tickLine={false}
              axisLine={false}
              width={62}
              tickFormatter={(value) => formatAxisMoney(value, settings.currency)}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{ stroke: 'var(--border-strong)', strokeWidth: 1 }}
              labelFormatter={(day) => `Day ${day}`}
            />

            <Area
              type="monotone"
              dataKey="cumulative"
              name="Spent so far"
              stroke="var(--chart-expense)"
              strokeWidth={2}
              fill="url(#spend-fill)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 2, stroke: 'var(--surface)' }}
              isAnimationActive={false}
            />
            {hasBudget && (
              <Line
                type="linear"
                dataKey="pace"
                name="Even budget pace"
                stroke="var(--text-muted)"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                dot={false}
                isAnimationActive={false}
              />
            )}
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
