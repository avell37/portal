import { useState } from 'react'

export interface ComparisonMetric {
  key: string
  label: string
  getValue: (period: string) => number
  format?: (v: number) => string
}

interface PeriodComparisonProps {
  periods: string[]
  metrics: ComparisonMetric[]
}

/** Сравнение двух периодов бок о бок — "период А" и "период Б" выбираются
 * независимо, дельта окрашивается по знаку (не по тому, хорошо это или
 * плохо для конкретной метрики — для зоны риска рост дельты это ухудшение,
 * для зоны развития улучшение, но однозначного правила на все метрики нет,
 * поэтому цвет тут чисто "выросло/упало", смысл додумывает читающий). */
export default function PeriodComparison({ periods, metrics }: PeriodComparisonProps) {
  const [periodA, setPeriodA] = useState(periods[periods.length - 2] ?? periods[0]!)
  const [periodB, setPeriodB] = useState(periods[periods.length - 1]!)

  return (
    <div className="rounded-[16px] border border-border bg-white p-4">
      <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Сравнение периодов</div>
      <div className="mb-3 grid gap-2 sm:grid-cols-2">
        <select
          value={periodA}
          onChange={(e) => setPeriodA(e.target.value)}
          className="rounded-[10px] border border-border bg-white px-3 py-2 text-[13px] outline-none focus:border-auth-primary"
        >
          {periods.map((p) => (
            <option key={p} value={p}>Период А: {p}</option>
          ))}
        </select>
        <select
          value={periodB}
          onChange={(e) => setPeriodB(e.target.value)}
          className="rounded-[10px] border border-border bg-white px-3 py-2 text-[13px] outline-none focus:border-auth-primary"
        >
          {periods.map((p) => (
            <option key={p} value={p}>Период Б: {p}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase text-auth-gray">
              <th className="px-3 py-2 font-semibold">Метрика</th>
              <th className="px-3 py-2 font-semibold">А</th>
              <th className="px-3 py-2 font-semibold">Б</th>
              <th className="px-3 py-2 font-semibold">Δ</th>
            </tr>
          </thead>
          <tbody>
            {metrics.map((m) => {
              const a = m.getValue(periodA)
              const b = m.getValue(periodB)
              const delta = Math.round((b - a) * 100) / 100
              const fmt = m.format ?? ((v: number) => String(v))
              return (
                <tr key={m.key} className="border-b border-border last:border-none">
                  <td className="px-3 py-2 font-semibold text-auth-black">{m.label}</td>
                  <td className="px-3 py-2 text-auth-gray">{fmt(a)}</td>
                  <td className="px-3 py-2 text-auth-black">{fmt(b)}</td>
                  <td className={`px-3 py-2 font-semibold ${delta > 0 ? 'text-green' : delta < 0 ? 'text-red' : 'text-auth-gray'}`}>
                    {delta > 0 ? '+' : ''}{fmt(delta)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}
