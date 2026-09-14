import { useMemo, useState } from 'react'
import { CURATOR_ZONES, CURATOR_ZONE_PERIODS } from '@/entities/metrics'
import { DonutChart, ColumnChart, TrendLineChart } from '@/shared/ui'
import { shortenPeriod } from '@/shared/lib/period'

const ZONE_COLORS = { risk: '#a32d2d', attention: '#854f0b', development: '#3b6d11' }

export default function VospitatelniyPage() {
  const [period, setPeriod] = useState(CURATOR_ZONE_PERIODS[CURATOR_ZONE_PERIODS.length - 1]!)

  const rows = useMemo(() => CURATOR_ZONES.filter((r) => r.period === period), [period])

  const totals = useMemo(() => {
    const risk = rows.reduce((sum, r) => sum + r.risk, 0)
    const attention = rows.reduce((sum, r) => sum + r.attention, 0)
    const development = rows.reduce((sum, r) => sum + r.development, 0)
    const lateness = rows.reduce((sum, r) => sum + r.lateness, 0)
    const poorAttendance = rows.reduce((sum, r) => sum + r.poorAttendance, 0)
    return { risk, attention, development, lateness, poorAttendance, total: risk + attention + development }
  }, [rows])

  const byDirection = useMemo(() => {
    const map = new Map<string, { risk: number; attention: number; development: number }>()
    for (const r of rows) {
      const cur = map.get(r.direction) ?? { risk: 0, attention: 0, development: 0 }
      cur.risk += r.risk
      cur.attention += r.attention
      cur.development += r.development
      map.set(r.direction, cur)
    }
    return Array.from(map.entries()).map(([direction, v]) => ({ direction, ...v }))
  }, [rows])

  const zoneSlices = useMemo(
    () => [
      { label: 'Зона риска', value: totals.risk, color: ZONE_COLORS.risk },
      { label: 'Зона внимания', value: totals.attention, color: ZONE_COLORS.attention },
      { label: 'Зона развития', value: totals.development, color: ZONE_COLORS.development },
    ],
    [totals],
  )

  const directionLabels = byDirection.map((d) => d.direction)
  const zoneSeries = useMemo(
    () => [
      { label: 'Зона риска', color: ZONE_COLORS.risk, values: byDirection.map((d) => d.risk) },
      { label: 'Зона внимания', color: ZONE_COLORS.attention, values: byDirection.map((d) => d.attention) },
      { label: 'Зона развития', color: ZONE_COLORS.development, values: byDirection.map((d) => d.development) },
    ],
    [byDirection],
  )

  const riskTrend = useMemo(
    () =>
      CURATOR_ZONE_PERIODS.map((p) => ({
        period: p,
        value: CURATOR_ZONES.filter((r) => r.period === p).reduce((s, r) => s + r.risk, 0),
      })),
    [],
  )

  return (
    <div>
      <h1 className="text-[22px] font-semibold text-auth-black">Воспитательный отдел</h1>
      <p className="mt-1 text-[14px] text-auth-gray">Зоны успеваемости по направлениям · Кураторские отчёты</p>

      <div className="mt-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {CURATOR_ZONE_PERIODS.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                period === p ? 'bg-auth-primary text-white' : 'bg-gray-light text-gray hover:opacity-80'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
          <div className="rounded-[16px] bg-red p-4 text-center text-white">
            <div className="text-2xl font-bold leading-none">{totals.risk}</div>
            <div className="mt-1.5 text-[11px] opacity-80">Зона риска</div>
          </div>
          <div className="rounded-[16px] bg-amber p-4 text-center text-white">
            <div className="text-2xl font-bold leading-none">{totals.attention}</div>
            <div className="mt-1.5 text-[11px] opacity-80">Зона внимания</div>
          </div>
          <div className="rounded-[16px] bg-green p-4 text-center text-white">
            <div className="text-2xl font-bold leading-none">{totals.development}</div>
            <div className="mt-1.5 text-[11px] opacity-80">Зона развития</div>
          </div>
          <div className="rounded-[16px] bg-gray p-4 text-center text-white">
            <div className="text-2xl font-bold leading-none">{totals.lateness}</div>
            <div className="mt-1.5 text-[11px] opacity-80">Опоздания</div>
          </div>
          <div className="rounded-[16px] bg-gray p-4 text-center text-white">
            <div className="text-2xl font-bold leading-none">{totals.poorAttendance}</div>
            <div className="mt-1.5 text-[11px] opacity-80">Плохая посещаемость</div>
          </div>
        </div>

        {byDirection.length > 0 && (
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[16px] border border-border bg-white p-4">
              <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Состав зон</div>
              <DonutChart slices={zoneSlices} />
            </div>
            <div className="rounded-[16px] border border-border bg-white p-4">
              <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Зоны по направлениям</div>
              <ColumnChart categories={directionLabels} series={zoneSeries} height={180} />
            </div>
          </div>
        )}

        {riskTrend.length > 1 && (
          <div className="mb-4 rounded-[16px] border border-border bg-white p-4">
            <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Зона риска по семестрам</div>
            <TrendLineChart labels={riskTrend.map((p) => shortenPeriod(p.period))} values={riskTrend.map((p) => p.value)} color={ZONE_COLORS.risk} height={180} />
          </div>
        )}

        <div className="overflow-x-auto rounded-[16px] border border-border bg-white">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase text-auth-gray">
                <th className="px-4 py-3 font-semibold">Направление</th>
                <th className="px-3 py-3 font-semibold">Курс</th>
                <th className="px-3 py-3 font-semibold">Зона риска</th>
                <th className="px-3 py-3 font-semibold">Зона внимания</th>
                <th className="px-3 py-3 font-semibold">Зона развития</th>
                <th className="px-3 py-3 font-semibold">Опоздания</th>
                <th className="px-3 py-3 font-semibold">Плохая посещаемость</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.direction}-${r.course}`} className="border-b border-border last:border-none">
                  <td className="px-4 py-2.5 font-semibold text-auth-black">{r.direction}</td>
                  <td className="px-3 py-2.5 text-auth-gray">{r.course}</td>
                  <td className="px-3 py-2.5">
                    {r.risk > 0 ? <span className="rounded-full bg-red-light px-2 py-0.5 text-[11px] font-semibold text-red">{r.risk}</span> : <span className="text-auth-gray">—</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    {r.attention > 0 ? <span className="rounded-full bg-amber-light px-2 py-0.5 text-[11px] font-semibold text-amber">{r.attention}</span> : <span className="text-auth-gray">—</span>}
                  </td>
                  <td className="px-3 py-2.5">
                    {r.development > 0 ? <span className="rounded-full bg-green-light px-2 py-0.5 text-[11px] font-semibold text-green">{r.development}</span> : <span className="text-auth-gray">—</span>}
                  </td>
                  <td className="px-3 py-2.5 text-auth-black">{r.lateness || '—'}</td>
                  <td className="px-3 py-2.5 text-auth-black">{r.poorAttendance || '—'}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-auth-gray">Нет данных за этот период</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
