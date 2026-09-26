import { lazy, Suspense } from 'react'

/**
 * Recharts is by far the heaviest dependency here and only two cards need it,
 * so both charts are split into their own bundle and streamed in behind a
 * skeleton. The rest of the app stays small.
 */
const TrendChartImpl = lazy(() =>
  import('./TrendChart').then((module) => ({ default: module.TrendChart })),
)

const SpendPaceChartImpl = lazy(() =>
  import('./SpendPaceChart').then((module) => ({ default: module.SpendPaceChart })),
)

function ChartFallback() {
  return <div className="skeleton" style={{ height: 244 }} />
}

export function TrendChart(props) {
  return (
    <Suspense fallback={<ChartFallback />}>
      <TrendChartImpl {...props} />
    </Suspense>
  )
}

export function SpendPaceChart(props) {
  return (
    <Suspense fallback={<ChartFallback />}>
      <SpendPaceChartImpl {...props} />
    </Suspense>
  )
}
