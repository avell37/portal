import { useState } from 'react'
import CoverHeader from '../../components/CoverHeader'

type Zone = 'red' | 'yellow' | 'green'
interface Student {
  id: string
  name: string
  zone: Zone
  avg: number
  redSubjects: number
}

const ZONE_META: Record<Zone, { label: string; color: string; bg: string }> = {
  red: { label: 'Красная', color: '#A32D2D', bg: '#FCEBEB' },
  yellow: { label: 'Жёлтая', color: '#854F0B', bg: '#FAEEDA' },
  green: { label: 'Зелёная', color: '#3B6D11', bg: '#EAF3DE' },
}

const STUDENTS: Student[] = [
  { id: '1', name: 'Громов П. И.', zone: 'red', avg: 41, redSubjects: 3 },
  { id: '2', name: 'Ким А. В.', zone: 'red', avg: 38, redSubjects: 4 },
  { id: '3', name: 'Захарова М. Е.', zone: 'yellow', avg: 55, redSubjects: 1 },
  { id: '4', name: 'Алиев Д. Р.', zone: 'yellow', avg: 52, redSubjects: 2 },
  { id: '5', name: 'Петрова Н. И.', zone: 'green', avg: 78, redSubjects: 0 },
  { id: '6', name: 'Морозова Е. А.', zone: 'green', avg: 84, redSubjects: 0 },
]

export default function Vospitatelniy() {
  const [filter, setFilter] = useState<Zone | 'all'>('all')
  const [selected, setSelected] = useState<Student | null>(null)

  const counts = {
    red: STUDENTS.filter((s) => s.zone === 'red').length,
    yellow: STUDENTS.filter((s) => s.zone === 'yellow').length,
    green: STUDENTS.filter((s) => s.zone === 'green').length,
  }
  const visible = filter === 'all' ? STUDENTS : STUDENTS.filter((s) => s.zone === filter)

  if (selected) {
    const meta = ZONE_META[selected.zone]
    return (
      <div>
        <CoverHeader tag="Внутренний портал колледжа" title="Карточка студента" subtitle="Успеваемость · История бесед" />
        <div className="mx-auto max-w-3xl px-6 py-8">
          <button onClick={() => setSelected(null)} className="mb-4 text-[12px] font-semibold text-purple">← Вернуться к списку</button>
          <div className="rounded-lg bg-purple p-4 text-white">
            <div className="text-base font-bold">{selected.name}</div>
            <div className="mt-1 text-[12px] opacity-70">Зона: <span style={{ color: meta.color === '#3B6D11' ? '#90EE90' : meta.color === '#854F0B' ? '#FFD700' : '#FF6B6B' }}>{meta.label}</span></div>
          </div>
          <div className="mt-4 rounded-lg border border-border bg-white p-4">
            <div className="mb-2 text-[11px] font-semibold uppercase text-ink-faint">История бесед</div>
            <div className="text-[13px] text-ink-muted">Бесед пока не зафиксировано.</div>
            <button className="mt-3 rounded-md bg-teal px-3 py-2 text-[12px] font-semibold text-white">Добавить запись о беседе</button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <CoverHeader tag="Внутренний портал колледжа" title="Воспитательный отдел" subtitle="Сводка группы · Зоны успеваемости" />
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="mb-4 flex flex-wrap gap-4 rounded-lg bg-gray-light px-4 py-2.5 text-[12px] text-ink-muted">
          <span>Красных: <b className="text-red">{counts.red}</b></span>
          <span>Жёлтых: <b className="text-amber">{counts.yellow}</b></span>
          <span>Зелёных: <b className="text-green">{counts.green}</b></span>
          <span>Всего: <b className="text-ink">{STUDENTS.length}</b></span>
        </div>

        <div className="mb-4 flex flex-wrap gap-2">
          {(['all', 'red', 'yellow', 'green'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                filter === f ? 'bg-purple text-white' : 'bg-white border border-border text-ink-muted'
              }`}
            >
              {f === 'all' ? 'Все' : ZONE_META[f].label}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {visible.map((s) => {
            const meta = ZONE_META[s.zone]
            return (
              <button
                key={s.id}
                onClick={() => setSelected(s)}
                className="flex w-full items-center gap-3 rounded-lg border border-border bg-white p-3.5 text-left transition-colors hover:bg-gray-light"
              >
                <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ background: meta.color }} />
                <span className="min-w-40 text-[13px] font-semibold text-ink">{s.name}</span>
                <span className="flex-1 text-[12px] text-ink-faint">Средний % по КТ: {s.avg}%</span>
                <span className="rounded-full px-2.5 py-1 text-[11px] font-medium" style={{ background: meta.bg, color: meta.color }}>
                  {s.redSubjects} красных предм.
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
