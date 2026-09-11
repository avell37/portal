import { useMemo, useState } from 'react'
import { StatCard, Panel, PanelRow, DonutChart, ColumnChart, TrendLineChart } from '@/shared/ui'
import { CONTINGENT, CONTINGENT_PERIODS, CURATOR_ZONES, CURATOR_ZONE_PERIODS, TEACHER_SOP, EMPLOYER_FEEDBACK } from '@/entities/metrics'

const ZONE_COLORS = { risk: '#a32d2d', attention: '#854f0b', development: '#3b6d11' }

const TABS = [
  { id: 'summary', label: 'Общая сводка' },
  { id: 'vosp', label: 'Воспитательный отдел' },
  { id: 'ucheb', label: 'Учебный отдел' },
  { id: 'it', label: 'IT-заявки' },
] as const

type TabId = (typeof TABS)[number]['id']

const CONTINGENT_PERIOD = [...CONTINGENT_PERIODS].reverse().find((p) => CONTINGENT.some((r) => r.period === p && r.avgGrade !== null))!
const CURATOR_PERIOD = CURATOR_ZONE_PERIODS.includes(CONTINGENT_PERIOD) ? CONTINGENT_PERIOD : CURATOR_ZONE_PERIODS[CURATOR_ZONE_PERIODS.length - 1]!

function round1(v: number) {
  return Math.round(v * 10) / 10
}

export default function DirectorPage() {
  const [tab, setTab] = useState<TabId>('summary')

  const contingentRows = useMemo(() => CONTINGENT.filter((r) => r.period === CONTINGENT_PERIOD), [])
  const curatorRows = useMemo(() => CURATOR_ZONES.filter((r) => r.period === CURATOR_PERIOD), [])

  const contingentTotals = useMemo(() => ({
    count: contingentRows.reduce((s, r) => s + r.count, 0),
    expelled: contingentRows.reduce((s, r) => s + r.expelled, 0),
    academicLeave: contingentRows.reduce((s, r) => s + r.academicLeave, 0),
    retakes: contingentRows.reduce((s, r) => s + (r.retakes ?? 0), 0),
  }), [contingentRows])

  const curatorTotals = useMemo(() => ({
    risk: curatorRows.reduce((s, r) => s + r.risk, 0),
    attention: curatorRows.reduce((s, r) => s + r.attention, 0),
    development: curatorRows.reduce((s, r) => s + r.development, 0),
  }), [curatorRows])

  const curatorByDirection = useMemo(() => {
    const map = new Map<string, { risk: number; attention: number; development: number }>()
    for (const r of curatorRows) {
      const cur = map.get(r.direction) ?? { risk: 0, attention: 0, development: 0 }
      cur.risk += r.risk
      cur.attention += r.attention
      cur.development += r.development
      map.set(r.direction, cur)
    }
    return Array.from(map.entries()).map(([direction, v]) => {
      const total = v.risk + v.attention + v.development
      return { direction, ...v, developmentPct: total ? round1((v.development / total) * 100) : 0 }
    })
  }, [curatorRows])

  const zoneSlices = useMemo(
    () => [
      { label: 'Зона риска', value: curatorTotals.risk, color: ZONE_COLORS.risk },
      { label: 'Зона внимания', value: curatorTotals.attention, color: ZONE_COLORS.attention },
      { label: 'Зона развития', value: curatorTotals.development, color: ZONE_COLORS.development },
    ],
    [curatorTotals],
  )

  const riskTrend = useMemo(
    () =>
      CURATOR_ZONE_PERIODS.map((p) => ({
        period: p,
        value: CURATOR_ZONES.filter((r) => r.period === p).reduce((s, r) => s + r.risk, 0),
      })),
    [],
  )

  const contingentByDirection = useMemo(() => {
    const map = new Map<string, number>()
    for (const r of contingentRows) map.set(r.direction, (map.get(r.direction) ?? 0) + r.count)
    return Array.from(map.entries())
  }, [contingentRows])

  const criticalTeachers = useMemo(() => TEACHER_SOP.filter((t) => t.interest <= 3 || t.delivery <= 3 || t.feedback <= 3 || t.comfort <= 3), [])
  const teacherAvg = useMemo(() => round1(TEACHER_SOP.reduce((s, t) => s + t.overall, 0) / TEACHER_SOP.length), [])
  const employerAvg = useMemo(() => round1(EMPLOYER_FEEDBACK.reduce((s, e) => s + e.score, 0) / EMPLOYER_FEEDBACK.length), [])

  return (
    <div>
      <h1 className="text-[22px] font-semibold text-auth-black">Дашборд директора</h1>
      <p className="mt-1 text-[14px] text-auth-gray">Сводная аналитика · {CONTINGENT_PERIOD}</p>

      <div className="mt-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                tab === t.id ? 'bg-auth-primary text-white' : 'bg-gray-light text-gray hover:opacity-80'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'summary' && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard value={curatorTotals.risk} label="Студентов в зоне риска" color="var(--color-red)" />
            <StatCard value={38} label="Открытых IT-заявок" color="var(--color-amber)" />
            <StatCard value={criticalTeachers.length} label="Преподавателей с флагами" color="var(--color-purple)" />
            <StatCard value={contingentTotals.retakes} label="Активных пересдач" color="var(--color-blue)" />
          </div>
        )}

        {tab === 'vosp' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard value={contingentTotals.count} label="Всего студентов" color="var(--color-teal)" />
              <StatCard value={curatorTotals.risk} label="Зона риска" color="var(--color-red)" />
              <StatCard value={curatorTotals.attention} label="Зона внимания" color="var(--color-amber)" />
              <StatCard value={curatorTotals.development} label="Зона развития" color="var(--color-green)" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-[16px] border border-border bg-white p-4">
                <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Состав зон</div>
                <DonutChart slices={zoneSlices} />
              </div>
              <Panel title="Отзывы работодателей" titleColor="var(--color-teal)" bg="var(--color-teal-light)">
                <PanelRow label="Средняя оценка" value={employerAvg} valueColor="var(--color-green)" />
                {EMPLOYER_FEEDBACK.slice(-3).map((e, i) => (
                  <PanelRow key={i} label={`${e.employer} · ${e.direction}`} value={e.score} valueColor={e.score >= 4.5 ? 'var(--color-green)' : 'var(--color-amber)'} />
                ))}
              </Panel>
            </div>
            {riskTrend.length > 1 && (
              <div className="rounded-[16px] border border-border bg-white p-4">
                <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Зона риска по семестрам</div>
                <TrendLineChart labels={riskTrend.map((p) => p.period)} values={riskTrend.map((p) => p.value)} color={ZONE_COLORS.risk} height={180} />
              </div>
            )}
          </div>
        )}

        {tab === 'ucheb' && (
          <div className="space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <Panel title="Контингент и пересдачи" titleColor="var(--color-blue)" bg="var(--color-blue-light)">
                <PanelRow label="Студентов" value={contingentTotals.count} valueColor="var(--color-blue)" />
                <PanelRow label="Пересдач всего" value={contingentTotals.retakes} valueColor="var(--color-amber)" />
                <PanelRow label="Отчислено" value={contingentTotals.expelled} valueColor="var(--color-red)" />
                <PanelRow label="В академ. отпуске" value={contingentTotals.academicLeave} valueColor="var(--color-gray)" />
              </Panel>
              <Panel title="Преподавательский состав" titleColor="var(--color-purple)" bg="var(--color-purple-light)">
                <PanelRow label="Преподавателей в СОП" value={TEACHER_SOP.length} valueColor="var(--color-purple)" />
                <PanelRow label="Средняя оценка СОП" value={teacherAvg} valueColor="var(--color-green)" />
                <PanelRow label="С критическим флагом" value={criticalTeachers.length} valueColor="var(--color-red)" />
              </Panel>
            </div>
            {contingentByDirection.length > 0 && (
              <div className="rounded-[16px] border border-border bg-white p-4">
                <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Студентов по направлениям</div>
                <ColumnChart
                  categories={contingentByDirection.map(([direction]) => direction)}
                  series={[{ label: 'Студентов', color: '#9a33f4', values: contingentByDirection.map(([, count]) => count) }]}
                  height={180}
                />
              </div>
            )}
          </div>
        )}

        {tab === 'it' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard value={142} label="Всего заявок" color="var(--color-amber)" />
              <StatCard value={38} label="Открытых" color="var(--color-amber-deep)" />
              <StatCard value={96} label="Выполнено" color="var(--color-green)" />
              <StatCard value={8} label="Отклонено" color="var(--color-red)" />
            </div>
            <Panel title="Проблемные аудитории" titleColor="var(--color-amber)" bg="var(--color-amber-light)">
              <PanelRow label="Ауд. 204" value={24} valueColor="var(--color-red)" />
              <PanelRow label="Ауд. 301" value={18} valueColor="var(--color-amber)" />
              <PanelRow label="Ауд. 112" value={12} valueColor="var(--color-amber)" />
              <PanelRow label="Ауд. 108" value={7} valueColor="var(--color-gray)" />
            </Panel>
          </div>
        )}
      </div>
    </div>
  )
}
