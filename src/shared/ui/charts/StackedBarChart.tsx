import { useState } from 'react'

export interface StackedBarSegment {
  key: string
  label: string
  color: string
}

export interface StackedBarRow {
  label: string
  values: Record<string, number>
}

interface StackedBarChartProps {
  segments: StackedBarSegment[]
  rows: StackedBarRow[]
}

export default function StackedBarChart({ segments, rows }: StackedBarChartProps) {
  const [hover, setHover] = useState<{ row: number; seg: number } | null>(null)
  const totals = rows.map((r) => segments.reduce((sum, s) => sum + (r.values[s.key] ?? 0), 0))
  const max = Math.max(...totals, 1)

  return (
    <div>
      <div className="mb-3 flex flex-wrap gap-4">
        {segments.map((s) => (
          <span key={s.key} className="flex items-center gap-1.5 text-[12px] text-auth-gray">
            <span className="h-2.5 w-2.5 rounded-full" style={{ background: s.color }} />
            {s.label}
          </span>
        ))}
      </div>

      <div className="space-y-2.5">
        {rows.map((row, ri) => {
          const total = totals[ri]!
          return (
            <div key={row.label} className="relative flex items-center gap-3">
              <span className="w-20 shrink-0 truncate text-[12px] text-auth-gray">{row.label}</span>
              <div className="flex h-4 min-w-0 flex-1 gap-[2px]">
                {segments.map((s, si) => {
                  const v = row.values[s.key] ?? 0
                  if (v <= 0) return null
                  const widthPct = (v / max) * 100
                  return (
                    <div
                      key={s.key}
                      className="h-4 first:rounded-l-full last:rounded-r-full"
                      style={{ width: `${widthPct}%`, background: s.color, minWidth: widthPct > 0 ? 4 : 0 }}
                      onMouseEnter={() => setHover({ row: ri, seg: si })}
                      onMouseLeave={() => setHover((h) => (h?.row === ri && h.seg === si ? null : h))}
                    />
                  )
                })}
              </div>
              <span className="w-10 shrink-0 text-right text-[12px] font-semibold text-auth-black">{total}</span>

              {hover?.row === ri && (
                <div className="absolute -top-9 left-20 z-10 whitespace-nowrap rounded-[8px] bg-auth-black px-2.5 py-1.5 text-[11px] font-medium text-white shadow-lg">
                  {row.label} · {segments[hover.seg]!.label}: {row.values[segments[hover.seg]!.key] ?? 0}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
