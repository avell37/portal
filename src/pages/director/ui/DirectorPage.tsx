import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { StatCard, Panel, PanelRow, DonutChart, ColumnChart, TrendLineChart, ExportButton, PeriodComparison, type ComparisonMetric } from '@/shared/ui'
import { shortenPeriod } from '@/shared/lib/period'
import { downloadCsv } from '@/shared/lib/csv'
import { CONTINGENT, CONTINGENT_PERIODS, CURATOR_ZONES, CURATOR_ZONE_PERIODS, TEACHER_SOP, EMPLOYER_FEEDBACK, TEACHER_PERIOD_SUMMARY } from '@/entities/metrics'
import { useTickets } from '@/entities/ticket'
import CuratorActivityPanel from '@/pages/vospitatelniy/ui/CuratorActivityPanel'

function OpenSectionLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      className="inline-block rounded-[12px] border border-border bg-white px-3.5 py-2 text-[13px] font-semibold text-auth-primary transition-colors hover:bg-gray-light"
    >
      {label} →
    </Link>
  )
}

interface DeptRow {
  label: string
  value: string | number
  color: string
}

function DeptPreview({ title, titleColor, rows, to }: { title: string; titleColor: string; rows: DeptRow[]; to: string }) {
  return (
    <Link
      to={to}
      className="block rounded-[16px] border border-border bg-white p-4 transition-colors hover:bg-gray-light"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-[14px] font-semibold" style={{ color: titleColor }}>{title}</span>
        <span className="text-[12px] font-semibold text-auth-primary">Открыть →</span>
      </div>
      <div className="space-y-1.5">
        {rows.map((r) => (
          <div key={r.label} className="flex items-center justify-between text-[12px]">
            <span className="text-auth-gray">{r.label}</span>
            <span className="font-bold" style={{ color: r.color }}>{r.value}</span>
          </div>
        ))}
      </div>
    </Link>
  )
}

const ZONE_COLORS = { risk: '#a32d2d', attention: '#eba237', development: '#438e4d' }

const TABS = [
  { id: 'summary', label: 'Общая сводка' },
  { id: 'vosp', label: 'Воспитательный отдел' },
  { id: 'ucheb', label: 'Учебный отдел' },
  { id: 'it', label: 'IT-заявки' },
] as const

type TabId = (typeof TABS)[number]['id']

// CONTINGENT_PERIODS — надмножество (в CURATOR_ZONE_PERIODS есть данные
// только с 2025-2026 года), поэтому глобальный фильтр периода строится на
// нём; для более старых периодов вкладка "Воспитательный" просто покажет
// "нет данных" — это ограничение реальных данных, не баг.
const DEFAULT_PERIOD = [...CONTINGENT_PERIODS].reverse().find((p) => CONTINGENT.some((r) => r.period === p && r.avgGrade !== null))!

function round1(v: number) {
  return Math.round(v * 10) / 10
}

// "Текущий момент" — самый свежий период вообще, даже незавершённый (в
// отличие от DEFAULT_PERIOD, который берёт последний период с ПОЛНЫМИ
// данными); архив — всё, кроме текущего учебного года (последних двух
// семестров), открывается отдельным действием, не в одном ряду с текущими.
const LIVE_PERIOD = CONTINGENT_PERIODS[CONTINGENT_PERIODS.length - 1]!
const CURRENT_YEAR_PERIODS = CONTINGENT_PERIODS.slice(-2)
const ARCHIVE_PERIODS = CONTINGENT_PERIODS.slice(0, -2)

export default function DirectorPage() {
  const [tab, setTab] = useState<TabId>('summary')
  const [period, setPeriod] = useState(DEFAULT_PERIOD)
  const [showArchive, setShowArchive] = useState(false)
  const tickets = useTickets()

  const ticketTotals = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter((t) => t.status === 'Новая' || t.status === 'В работе').length,
    done: tickets.filter((t) => t.status === 'Выполнено').length,
    rejected: tickets.filter((t) => t.status === 'Отклонена').length,
  }), [tickets])

  const roomsByTickets = useMemo(() => {
    const map = new Map<string, number>()
    for (const t of tickets) map.set(t.room, (map.get(t.room) ?? 0) + 1)
    return Array.from(map.entries())
      .map(([room, count]) => ({ room, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 4)
  }, [tickets])

  const ticketsByType = useMemo(
    () => [
      { label: 'Неисправность', value: tickets.filter((t) => t.type === 'Неисправность').length },
      { label: 'Установка ПО', value: tickets.filter((t) => t.type === 'Установка ПО').length },
    ],
    [tickets],
  )

  const contingentRows = useMemo(() => CONTINGENT.filter((r) => r.period === period), [period])
  const curatorRows = useMemo(() => CURATOR_ZONES.filter((r) => r.period === period), [period])

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

  // "Таблица преподаватели" — отдельная оценка руководителя учебного отдела
  // по периодам (профильные/общеобразовательные), не пересекается с TEACHER_SOP.
  const teacherPeriodRows = useMemo(() => TEACHER_PERIOD_SUMMARY.filter((r) => r.period === period), [period])
  const teacherWatchCount = useMemo(() => new Set(teacherPeriodRows.flatMap((r) => r.watchList)).size, [teacherPeriodRows])
  const teacherProfile = teacherPeriodRows.find((r) => r.direction === 'Профильные')
  const teacherGeneral = teacherPeriodRows.find((r) => r.direction === 'Общеобразовательные')

  const vospComparisonMetrics: ComparisonMetric[] = useMemo(
    () => [
      { key: 'risk', label: 'Зона риска', getValue: (p) => CURATOR_ZONES.filter((r) => r.period === p).reduce((s, r) => s + r.risk, 0) },
      { key: 'attention', label: 'Зона внимания', getValue: (p) => CURATOR_ZONES.filter((r) => r.period === p).reduce((s, r) => s + r.attention, 0) },
      { key: 'development', label: 'Зона развития', getValue: (p) => CURATOR_ZONES.filter((r) => r.period === p).reduce((s, r) => s + r.development, 0) },
      { key: 'lateness', label: 'Опоздания', getValue: (p) => CURATOR_ZONES.filter((r) => r.period === p).reduce((s, r) => s + r.lateness, 0) },
    ],
    [],
  )

  const uchebComparisonMetrics: ComparisonMetric[] = useMemo(
    () => [
      { key: 'count', label: 'Студентов', getValue: (p) => CONTINGENT.filter((r) => r.period === p).reduce((s, r) => s + r.count, 0) },
      { key: 'retakes', label: 'Пересдач всего', getValue: (p) => CONTINGENT.filter((r) => r.period === p).reduce((s, r) => s + (r.retakes ?? 0), 0) },
      { key: 'expelled', label: 'Отчислено', getValue: (p) => CONTINGENT.filter((r) => r.period === p).reduce((s, r) => s + r.expelled, 0) },
      {
        key: 'attendance',
        label: 'Ср. посещаемость',
        format: (v) => `${v}%`,
        getValue: (p) => {
          const rows = CONTINGENT.filter((r) => r.period === p && r.attendance !== null)
          if (!rows.length) return 0
          return Math.round(rows.reduce((s, r) => s + (r.attendance ?? 0), 0) / rows.length)
        },
      },
    ],
    [],
  )

  function exportVosp() {
    downloadCsv(
      `vospitatelniy_${period}`,
      ['Направление', 'Курс', 'Зона риска', 'Зона внимания', 'Зона развития', 'Опоздания', 'Плохая посещаемость'],
      curatorRows.map((r) => [r.direction, r.course, r.risk, r.attention, r.development, r.lateness, r.poorAttendance]),
    )
  }

  function exportUcheb() {
    downloadCsv(
      `uchebny_${period}`,
      ['Направление', 'Курс', 'Кол-во', 'Отчислено', 'Переводы', 'Ак. отпуск', 'Посещаемость', 'Ср. оценка', 'Пересдач'],
      contingentRows.map((r) => [r.direction, r.course, r.count, r.expelled, r.transfers, r.academicLeave, r.attendance ?? '', r.avgGrade ?? '', r.retakes ?? '']),
    )
  }

  function exportIt() {
    downloadCsv(
      'it_tickets',
      ['Тип', 'Аудитория', 'ПК', 'Автор', 'Описание', 'Статус', 'Дата'],
      tickets.map((t) => [t.type, t.room, t.pc, t.authorName, t.detail, t.status, t.date]),
    )
  }

  return (
    <div>
      <h1 className="text-[22px] font-semibold text-auth-black">Дашборд директора</h1>
      <p className="mt-1 text-[14px] text-auth-gray">Сводная аналитика · Три отдела</p>

      <div className="mt-6">
        <div className="mb-4 rounded-[14px] bg-auth-primary px-3.5 py-2.5">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold uppercase text-white/60">Период:</span>
            <button
              onClick={() => setPeriod(LIVE_PERIOD)}
              className={`rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
                period === LIVE_PERIOD ? 'bg-white text-auth-primary' : 'border border-white/30 text-white hover:bg-white/10'
              }`}
            >
              Текущий момент
            </button>
            {CURRENT_YEAR_PERIODS.map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
                  period === p ? 'bg-white text-auth-primary' : 'border border-white/30 text-white hover:bg-white/10'
                }`}
              >
                {p}
              </button>
            ))}
            {ARCHIVE_PERIODS.length > 0 && (
              <button
                onClick={() => setShowArchive((v) => !v)}
                className="rounded-full border border-white/30 px-3 py-1 text-[12px] font-semibold text-white transition-colors hover:bg-white/10"
              >
                Архив {showArchive ? '▴' : '▾'}
              </button>
            )}
          </div>
          {showArchive && ARCHIVE_PERIODS.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-2 border-t border-white/20 pt-2">
              <span className="text-[11px] font-semibold uppercase text-white/60">Архив прошлых лет:</span>
              {ARCHIVE_PERIODS.map((p) => (
                <button
                  key={p}
                  onClick={() => setPeriod(p)}
                  className={`rounded-full px-3 py-1 text-[12px] font-semibold transition-colors ${
                    period === p ? 'bg-white text-auth-primary' : 'border border-white/30 text-white hover:bg-white/10'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </div>

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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard value={curatorTotals.risk} label="Студентов в зоне риска" color="var(--color-red)" />
              <StatCard value={ticketTotals.open} label="Открытых IT-заявок" color="var(--color-amber)" />
              <StatCard value={criticalTeachers.length} label="Преподавателей с флагами" color="var(--color-purple)" />
              <StatCard value={contingentTotals.retakes} label="Активных пересдач" color="var(--color-blue)" />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <DeptPreview
                title="Воспитательный отдел"
                titleColor="var(--color-teal)"
                to="/vospitatelniy"
                rows={[
                  { label: 'Зона риска', value: curatorTotals.risk, color: 'var(--color-red)' },
                  { label: 'Зона внимания', value: curatorTotals.attention, color: 'var(--color-amber)' },
                  { label: 'Зона развития', value: curatorTotals.development, color: 'var(--color-green)' },
                ]}
              />
              <DeptPreview
                title="Учебный отдел"
                titleColor="var(--color-blue)"
                to="/uchebny"
                rows={[
                  { label: 'Студентов', value: contingentTotals.count, color: 'var(--color-blue)' },
                  { label: 'Пересдач всего', value: contingentTotals.retakes, color: 'var(--color-amber)' },
                  { label: 'Отчислено', value: contingentTotals.expelled, color: 'var(--color-red)' },
                ]}
              />
              <DeptPreview
                title="Преподаватели"
                titleColor="var(--color-purple)"
                to="/teacher-analytics"
                rows={[
                  { label: 'Средняя оценка СОП', value: teacherAvg, color: 'var(--color-green)' },
                  { label: 'С критическим флагом', value: criticalTeachers.length, color: 'var(--color-red)' },
                  { label: 'Профильные (ср. балл)', value: teacherProfile?.avgScore ?? '—', color: 'var(--color-blue)' },
                  { label: 'Общеобр. (ср. балл)', value: teacherGeneral?.avgScore ?? '—', color: 'var(--color-blue)' },
                  { label: 'В зоне внимания', value: teacherWatchCount, color: 'var(--color-amber)' },
                ]}
              />
              <DeptPreview
                title="IT-заявки"
                titleColor="var(--color-amber)"
                to="/it-support"
                rows={[
                  { label: 'Всего заявок', value: ticketTotals.total, color: 'var(--color-amber)' },
                  { label: 'Открытых', value: ticketTotals.open, color: 'var(--color-amber)' },
                  { label: 'Выполнено', value: ticketTotals.done, color: 'var(--color-green)' },
                ]}
              />
            </div>
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
              <div className="min-w-0 rounded-[16px] border border-border bg-white p-4">
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
              <div className="min-w-0 rounded-[16px] border border-border bg-white p-4">
                <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Зона риска по семестрам</div>
                <TrendLineChart labels={riskTrend.map((p) => shortenPeriod(p.period))} values={riskTrend.map((p) => p.value)} color={ZONE_COLORS.risk} height={180} />
              </div>
            )}
            {curatorByDirection.length > 0 && (
              <div className="overflow-x-auto rounded-[16px] border border-border bg-white">
                <table className="w-full text-left text-[13px]">
                  <thead>
                    <tr className="border-b border-border text-[11px] uppercase text-auth-gray">
                      <th className="px-4 py-3 font-semibold">Направление</th>
                      <th className="px-3 py-3 font-semibold">Ср. % выполнения</th>
                      <th className="px-3 py-3 font-semibold">Красных</th>
                      <th className="px-3 py-3 font-semibold">Эскалации</th>
                    </tr>
                  </thead>
                  <tbody>
                    {curatorByDirection.map((d) => (
                      <tr key={d.direction} className="border-b border-border last:border-none">
                        <td className="px-4 py-2.5 font-semibold text-auth-black">{d.direction}</td>
                        <td className="px-3 py-2.5 text-green">{d.developmentPct}%</td>
                        <td className="px-3 py-2.5 text-red">{d.risk || '—'}</td>
                        <td className="px-3 py-2.5 text-auth-gray">—</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="border-t border-border px-4 py-2 text-[11px] text-auth-gray">
                  «Эскалации» по направлению — нет источника в реальных данных (только по кураторам, см. «Активность кураторов» выше)
                </div>
              </div>
            )}
            <CuratorActivityPanel />
            <PeriodComparison periods={CURATOR_ZONE_PERIODS} metrics={vospComparisonMetrics} />
            <div className="flex flex-wrap gap-2">
              <ExportButton label="Выгрузить в Excel" onClick={exportVosp} />
              <OpenSectionLink to="/vospitatelniy" label="Открыть воспитательный отдел" />
            </div>
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
              <div className="min-w-0 rounded-[16px] border border-border bg-white p-4">
                <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Студентов по направлениям</div>
                <ColumnChart
                  categories={contingentByDirection.map(([direction]) => direction)}
                  series={[{ label: 'Студентов', color: '#9a33f4', values: contingentByDirection.map(([, count]) => count) }]}
                  height={180}
                />
              </div>
            )}
            <PeriodComparison periods={CONTINGENT_PERIODS} metrics={uchebComparisonMetrics} />
            <div className="flex flex-wrap gap-2">
              <ExportButton label="Выгрузить в Excel" onClick={exportUcheb} />
              <OpenSectionLink to="/uchebny" label="Открыть учебный отдел" />
            </div>
          </div>
        )}

        {tab === 'it' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard value={ticketTotals.total} label="Всего заявок" color="var(--color-amber)" />
              <StatCard value={ticketTotals.open} label="Открытых" color="var(--color-amber-deep)" />
              <StatCard value={ticketTotals.done} label="Выполнено" color="var(--color-green)" />
              <StatCard value={ticketTotals.rejected} label="Отклонено" color="var(--color-red)" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Panel title="По типу заявки" titleColor="var(--color-amber)" bg="var(--color-amber-light)">
                {ticketsByType.map((r) => (
                  <PanelRow key={r.label} label={r.label} value={r.value} valueColor="var(--color-blue)" />
                ))}
              </Panel>
              <Panel title="Проблемные аудитории" titleColor="var(--color-amber)" bg="var(--color-amber-light)">
                {roomsByTickets.map((r) => (
                  <PanelRow key={r.room} label={`Ауд. ${r.room}`} value={r.count} valueColor="var(--color-red)" />
                ))}
                {roomsByTickets.length === 0 && <PanelRow label="Нет данных" value="—" />}
              </Panel>
            </div>
            <div className="flex flex-wrap gap-2">
              <ExportButton label="Выгрузить в Excel" onClick={exportIt} />
              <OpenSectionLink to="/it-support" label="Открыть IT-поддержку" />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
