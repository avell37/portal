import { useState } from 'react'

export interface BarChartItem {
  label: string
  value: number
  color: string
  sublabel?: string
}

interface BarChartProps {
  items: BarChartItem[]
  formatValue?: (v: number) => string
}

export default function BarChart({ items, formatValue = (v) => String(v) }: BarChartProps) {
  const [hover, setHover] = useState<number | null>(null)
  const max = Math.max(...items.map((i) => i.value), 1)

  return (
    <div className="space-y-2.5">
      {items.map((item, i) => (
        <div
          key={item.label}
          className="relative flex items-center gap-3"
          onMouseEnter={() => setHover(i)}
          onMouseLeave={() => setHover((h) => (h === i ? null : h))}
        >
          <span className="w-24 shrink-0 truncate text-[12px] text-auth-gray">{item.label}</span>
          <div className="h-4 min-w-0 flex-1 rounded-full bg-gray-light">
            <div
              className="h-4 rounded-full transition-[width]"
              style={{ width: `${(item.value / max) * 100}%`, background: item.color }}
            />
          </div>
          <span className="w-12 shrink-0 text-right text-[12px] font-semibold text-auth-black">{formatValue(item.value)}</span>

          {hover === i && (
            <div className="absolute -top-9 left-24 z-10 rounded-[8px] bg-auth-black px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg">
              {item.label}: {formatValue(item.value)}
              {item.sublabel ? ` · ${item.sublabel}` : ''}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
