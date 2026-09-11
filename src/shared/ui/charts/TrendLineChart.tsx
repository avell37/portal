import { Line } from 'react-chartjs-2'
import { CHART_GRID, CHART_MUTED } from './chartSetup'
import './chartSetup'

interface TrendLineChartProps {
  labels: string[]
  values: number[]
  color: string
  height?: number
  formatValue?: (v: number) => string
}

export default function TrendLineChart({ labels, values, color, height = 200, formatValue = (v) => String(v) }: TrendLineChartProps) {
  return (
    <div className="relative" style={{ height }}>
      <Line
        data={{
          labels,
          datasets: [
            {
              data: values,
              borderColor: color,
              backgroundColor: `${color}14`,
              fill: true,
              tension: 0.3,
              pointRadius: 4,
              pointBackgroundColor: color,
              pointBorderColor: '#ffffff',
              pointBorderWidth: 2,
              borderWidth: 2,
            },
          ],
        }}
        options={{
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
              callbacks: { label: (ctx) => formatValue(ctx.parsed.y) },
            },
          },
          scales: {
            x: { grid: { display: false }, ticks: { color: CHART_MUTED, font: { family: 'Montserrat', size: 10 } } },
            y: {
              grid: { color: CHART_GRID },
              ticks: { color: CHART_MUTED, font: { family: 'Montserrat', size: 11 }, callback: (v) => formatValue(Number(v)) },
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  )
}
