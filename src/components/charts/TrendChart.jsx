import {
  Bar,
  BarChart,
  CartesianGrid,
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
 * Income against expenses for the last few months. Two series on one shared
 * value axis — never a second y-scale — with a legend so the pairing is never
 * carried by colour alone.
 */
export function TrendChart({ data }) {
  // Bars redraw whenever the period filter changes; animating each redraw
  // reads as noise rather than polish, so the grow-in is switched off.
  const { settings } = useSettings()

  return (
    <div className="chart-block">
      <ul className="chart-legend">
        <li>
          <span className="dot" style={{ background: 'var(--chart-income)' }} />
          Income
        </li>
        <li>
          <span className="dot" style={{ background: 'var(--chart-expense)' }} />
          Expenses
        </li>
      </ul>

      <div className="chart-canvas">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -14 }} barGap={2}>
            <CartesianGrid vertical={false} stroke="var(--chart-grid)" />
            <XAxis
              dataKey="label"
              tick={AXIS_STYLE}
              tickLine={false}
              axisLine={{ stroke: 'var(--chart-grid)' }}
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
              cursor={{ fill: 'var(--surface-sunken)', radius: 6 }}
            />
            <Bar
              dataKey="income"
              name="Income"
              fill="var(--chart-income)"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
              isAnimationActive={false}
            />
            <Bar
              dataKey="expense"
              name="Expenses"
              fill="var(--chart-expense)"
              radius={[4, 4, 0, 0]}
              maxBarSize={22}
              isAnimationActive={false}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
