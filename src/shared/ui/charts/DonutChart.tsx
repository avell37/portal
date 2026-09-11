import { Doughnut } from 'react-chartjs-2'
import './chartSetup'

export interface DonutSlice {
  label: string
  value: number
  color: string
}

interface DonutChartProps {
  slices: DonutSlice[]
}

export default function DonutChart({ slices }: DonutChartProps) {
  const total = slices.reduce((s, x) => s + x.value, 0)

  return (
    <div className="flex items-center gap-4">
      <div className="relative h-[140px] w-[140px] shrink-0">
        <Doughnut
          data={{
            labels: slices.map((s) => s.label),
            datasets: [
              {
                data: slices.map((s) => s.value),
                backgroundColor: slices.map((s) => s.color),
                borderColor: '#ffffff',
                borderWidth: 2,
              },
            ],
          }}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            cutout: '68%',
            plugins: { legend: { display: false } },
          }}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        {slices.map((s) => (
          <div key={s.label} className="flex items-center gap-2 text-[12px] text-auth-gray">
            <span className="h-2.5 w-2.5 shrink-0 rounded-[2px]" style={{ background: s.color }} />
            <span className="truncate">{s.label}</span>
            <span className="ml-auto shrink-0 font-semibold text-auth-black">
              {s.value} · {total ? Math.round((s.value / total) * 100) : 0}%
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
