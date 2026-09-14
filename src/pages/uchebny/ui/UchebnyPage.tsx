import { useMemo, useState } from 'react'
import { CONTINGENT, CONTINGENT_PERIODS } from '@/entities/metrics'
import { ColumnChart, TrendLineChart } from '@/shared/ui'
import { shortenPeriod } from '@/shared/lib/period'

const LATEST_PERIOD_WITH_DATA = [...CONTINGENT_PERIODS].reverse().find((p) => CONTINGENT.some((r) => r.period === p && r.avgGrade !== null)) ?? CONTINGENT_PERIODS[0]!

function fmt(v: number | null, digits = 1) {
  return v === null ? '—' : v.toFixed(digits)
}

export default function UchebnyPage() {
  const [period, setPeriod] = useState(LATEST_PERIOD_WITH_DATA)

  const rows = useMemo(() => CONTINGENT.filter((r) => r.period === period), [period])

  const totals = useMemo(() => {
    const count = rows.reduce((sum, r) => sum + r.count, 0)
    const expelled = rows.reduce((sum, r) => sum + r.expelled, 0)
    const transfers = rows.reduce((sum, r) => sum + r.transfers, 0)
    const academicLeave = rows.reduce((sum, r) => sum + r.academicLeave, 0)
    const retakeRows = rows.filter((r) => r.retakes !== null)
    const retakes = retakeRows.reduce((sum, r) => sum + (r.retakes ?? 0), 0)
    return { count, expelled, transfers, academicLeave, retakes }
  }, [rows])

  const byDirection = useMemo(() => {
    const map = new Map<string, { count: number; attendanceSum: number; attendanceWeight: number }>()
    for (const r of rows) {
      const cur = map.get(r.direction) ?? { count: 0, attendanceSum: 0, attendanceWeight: 0 }
      cur.count += r.count
      if (r.attendance !== null) {
        cur.attendanceSum += r.attendance * r.count
        cur.attendanceWeight += r.count
      }
      map.set(r.direction, cur)
    }
    return Array.from(map.entries()).map(([direction, v]) => ({
      direction,
      count: v.count,
      attendance: v.attendanceWeight ? Math.round(v.attendanceSum / v.attendanceWeight) : null,
    }))
  }, [rows])

  const directionLabels = byDirection.map((d) => d.direction)
  const countSeries = useMemo(
    () => [{ label: 'Студентов', color: '#9a33f4', values: byDirection.map((d) => d.count) }],
    [byDirection],
  )
  const attendanceSeries = useMemo(
    () => [{ label: 'Посещаемость', color: '#185fa5', values: byDirection.map((d) => d.attendance ?? 0) }],
    [byDirection],
  )
  const hasAttendance = byDirection.some((d) => d.attendance !== null)

  const retakesTrend = useMemo(() => {
    const points = CONTINGENT_PERIODS.map((p) => {
      const periodRows = CONTINGENT.filter((r) => r.period === p && r.retakes !== null)
      if (periodRows.length === 0) return null
      return { period: p, value: periodRows.reduce((s, r) => s + (r.retakes ?? 0), 0) }
    }).filter((x): x is { period: string; value: number } => x !== null)
    return points
  }, [])

  return (
    <div>
      <h1 className="text-[22px] font-semibold text-auth-black">Учебный отдел</h1>
      <p className="mt-1 text-[14px] text-auth-gray">Контингент · Пересдачи · Посещаемость по направлениям</p>

      <div className="mt-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {CONTINGENT_PERIODS.map((p) => (
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

        <div className="mb-4 flex flex-wrap gap-4 rounded-[14px] bg-gray-light px-4 py-2.5 text-[12px] text-auth-gray">
          <span>Студентов: <b className="text-auth-black">{totals.count}</b></span>
          <span>Отчислено: <b className="text-red">{totals.expelled}</b></span>
          <span>Переводов: <b className="text-auth-black">{totals.transfers}</b></span>
          <span>Академ. отпусков: <b className="text-auth-black">{totals.academicLeave}</b></span>
          <span>Пересдач всего: <b className="text-auth-black">{totals.retakes}</b></span>
        </div>

        {directionLabels.length > 0 && (
          <div className="mb-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-[16px] border border-border bg-white p-4">
              <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Студентов по направлениям</div>
              <ColumnChart categories={directionLabels} series={countSeries} height={180} />
            </div>
            {hasAttendance && (
              <div className="rounded-[16px] border border-border bg-white p-4">
                <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Посещаемость по направлениям</div>
                <ColumnChart categories={directionLabels} series={attendanceSeries} height={180} formatValue={(v) => `${v}%`} />
              </div>
            )}
          </div>
        )}

        {retakesTrend.length > 1 && (
          <div className="mb-4 rounded-[16px] border border-border bg-white p-4">
            <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Пересдачи по семестрам</div>
            <TrendLineChart labels={retakesTrend.map((p) => shortenPeriod(p.period))} values={retakesTrend.map((p) => p.value)} color="#a32d2d" height={200} />
          </div>
        )}

        <div className="overflow-x-auto rounded-[16px] border border-border bg-white">
          <table className="w-full text-left text-[13px]">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase text-auth-gray">
                <th className="px-4 py-3 font-semibold">Направление</th>
                <th className="px-3 py-3 font-semibold">Курс</th>
                <th className="px-3 py-3 font-semibold">Кол-во</th>
                <th className="px-3 py-3 font-semibold">Отчисл.</th>
                <th className="px-3 py-3 font-semibold">Переводы</th>
                <th className="px-3 py-3 font-semibold">Ак. отпуск</th>
                <th className="px-3 py-3 font-semibold">Посещаемость</th>
                <th className="px-3 py-3 font-semibold">Ср. оценка</th>
                <th className="px-3 py-3 font-semibold">Пересдач</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={`${r.direction}-${r.course}`} className="border-b border-border last:border-none">
                  <td className="px-4 py-2.5 font-semibold text-auth-black">{r.direction}</td>
                  <td className="px-3 py-2.5 text-auth-gray">{r.course}</td>
                  <td className="px-3 py-2.5 text-auth-black">{r.count}</td>
                  <td className="px-3 py-2.5">
                    {r.expelled > 0 ? <span className="rounded-full bg-red-light px-2 py-0.5 text-[11px] font-semibold text-red">{r.expelled}</span> : <span className="text-auth-gray">—</span>}
                  </td>
                  <td className="px-3 py-2.5 text-auth-black">{r.transfers || '—'}</td>
                  <td className="px-3 py-2.5 text-auth-black">{r.academicLeave || '—'}</td>
                  <td className="px-3 py-2.5 text-auth-black">{r.attendance !== null ? `${r.attendance}%` : '—'}</td>
                  <td className="px-3 py-2.5 text-auth-black">{fmt(r.avgGrade, 2)}</td>
                  <td className="px-3 py-2.5 text-auth-black">{r.retakes ?? '—'}</td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-auth-gray">Нет данных за этот период</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
