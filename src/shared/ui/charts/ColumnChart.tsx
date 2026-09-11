import { Bar } from 'react-chartjs-2'
import { CHART_GRID, CHART_MUTED } from './chartSetup'
import './chartSetup'

export interface ColumnSeries {
  label: string
  color: string | string[]
  values: number[]
}

interface ColumnChartProps {
  categories: string[]
  series: ColumnSeries[]
  height?: number
  formatValue?: (v: number) => string
  horizontal?: boolean
}

export default function ColumnChart({ categories, series, height = 200, formatValue = (v) => String(v), horizontal = false }: ColumnChartProps) {
  const valueAxis = {
    grid: { color: CHART_GRID },
    ticks: { color: CHART_MUTED, font: { family: 'Montserrat', size: 11 }, callback: (v: string | number) => formatValue(Number(v)) },
    beginAtZero: true,
  }
  const categoryAxis = { grid: { display: false }, ticks: { color: CHART_MUTED, font: { family: 'Montserrat', size: 11 } } }

  return (
    <div>
      {series.length > 1 && (
        <div className="mb-3 flex flex-wrap gap-4">
          {series.map((s) => (
            <span key={s.label} className="flex items-center gap-1.5 text-[12px] text-auth-gray">
              <span className="h-2.5 w-2.5 rounded-[2px]" style={{ background: Array.isArray(s.color) ? s.color[0] : s.color }} />
              {s.label}
            </span>
          ))}
        </div>
      )}
      <div className="relative" style={{ height }}>
        <Bar
          data={{
            labels: categories,
            datasets: series.map((s) => ({
              label: s.label,
              data: s.values,
              backgroundColor: s.color,
              borderRadius: 4,
              maxBarThickness: 28,
            })),
          }}
          options={{
            indexAxis: horizontal ? 'y' : 'x',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: { display: false },
              tooltip: {
                backgroundColor: '#121212',
                padding: 8,
                cornerRadius: 8,
                titleFont: { family: 'Montserrat', size: 12 },
                bodyFont: { family: 'Montserrat', size: 12 },
                callbacks: { label: (ctx) => `${ctx.dataset.label}: ${formatValue(horizontal ? ctx.parsed.x : ctx.parsed.y)}` },
              },
            },
            scales: horizontal ? { x: valueAxis, y: categoryAxis } : { x: categoryAxis, y: valueAxis },
          }}
        />
      </div>
    </div>
  )
}
