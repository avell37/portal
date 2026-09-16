import { useMemo, useState } from 'react'
import { TEACHER_SOP } from '@/entities/metrics'
import { DonutChart, ColumnChart } from '@/shared/ui'
import { useAuth } from '@/entities/session'
import TeacherList from './TeacherList'
import TeacherCard from './TeacherCard'
import AssignOuForm from './AssignOuForm'

const TABS = [
  { id: 'ou', label: 'Открытые уроки' },
  { id: 'sop', label: 'СОП — Аналитика' },
] as const

type TabId = (typeof TABS)[number]['id']

function scoreColor(v: number) {
  return v >= 4 ? 'var(--color-green)' : v >= 3.1 ? 'var(--color-amber)' : 'var(--color-red)'
}

function scoreColorHex(v: number) {
  return v >= 4 ? '#438e4d' : v >= 3.1 ? '#eba237' : '#a32d2d'
}

function OuSection() {
  const currentUser = useAuth((s) => s.currentUser)
  const canAssign = currentUser?.role === 'teamlead'
  const [view, setView] = useState<'list' | 'card' | 'form'>('list')
  const [teacherId, setTeacherId] = useState<number | null>(null)
  // Из карточки "Назад"/"Сохранить" ведёт обратно в карточку, а из списка
  // (кнопка "Заполнить ОУ" в строке) — сразу в список, как в прототипе.
  const [formOrigin, setFormOrigin] = useState<'list' | 'card'>('list')

  if (view === 'form' && teacherId !== null) {
    return <AssignOuForm teacherId={teacherId} onDone={() => setView(formOrigin)} onCancel={() => setView(formOrigin)} />
  }
  if (view === 'card' && teacherId !== null) {
    return (
      <TeacherCard
        teacherId={teacherId}
        canAssign={canAssign}
        onBack={() => setView('list')}
        onAssign={() => {
          setFormOrigin('card')
          setView('form')
        }}
      />
    )
  }
  return (
    <TeacherList
      canAssign={canAssign}
      onSelectTeacher={(id) => {
        setTeacherId(id)
        setView('card')
      }}
      onAssignTeacher={(id) => {
        setTeacherId(id)
        setFormOrigin('list')
        setView('form')
      }}
    />
  )
}

function SopAnalyticsTab() {
  const currentUser = useAuth((s) => s.currentUser)
  const [launched, setLaunched] = useState(false)
  const critical = TEACHER_SOP.filter((t) => t.interest <= 3 || t.delivery <= 3 || t.feedback <= 3 || t.comfort <= 3)

  const extremes = useMemo(() => {
    const sorted = [...TEACHER_SOP].sort((a, b) => b.overall - a.overall)
    const top = sorted.slice(0, 5)
    const bottom = sorted.slice(-5).reverse()
    const seen = new Set(top.map((t) => t.name))
    const rows = [...top, ...bottom.filter((t) => !seen.has(t.name))]
    return {
      labels: rows.map((t) => t.name),
      colors: rows.map((t) => scoreColorHex(t.overall)),
      values: rows.map((t) => t.overall),
    }
  }, [])

  const tierSlices = useMemo(() => {
    const good = TEACHER_SOP.filter((t) => t.overall >= 4).length
    const warn = TEACHER_SOP.filter((t) => t.overall >= 3.1 && t.overall < 4).length
    const bad = TEACHER_SOP.filter((t) => t.overall < 3.1).length
    return [
      { label: 'Хорошо (≥ 4.0)', value: good, color: '#438e4d' },
      { label: 'Средне (3.1–3.9)', value: warn, color: '#eba237' },
      { label: 'Низко (< 3.1)', value: bad, color: '#a32d2d' },
    ]
  }, [])

  return (
    <div>
      {critical.length > 0 && (
        <div className="mb-4 rounded-[14px] border-l-4 border-red bg-red-light p-3.5 text-[12px] text-red">
          ⚠ Критический сигнал — {critical.map((t) => t.name).join(', ')}: оценка ≤ 3.0 по одному или нескольким критериям
        </div>
      )}

      <div className="mb-4 grid gap-3 sm:grid-cols-2">
        <div className="min-w-0 rounded-[16px] border border-border bg-white p-4">
          <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Преподаватели по уровню оценки</div>
          <DonutChart slices={tierSlices} />
        </div>
        <div className="min-w-0 rounded-[16px] border border-border bg-white p-4">
          <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Лучшие и худшие по средней оценке СОП</div>
          <ColumnChart
            categories={extremes.labels}
            series={[{ label: 'Средняя оценка', color: extremes.colors, values: extremes.values }]}
            horizontal
            height={220}
          />
        </div>
      </div>

      <div className="overflow-x-auto rounded-[16px] border border-border bg-white">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase text-auth-gray">
              <th className="px-4 py-3 font-semibold">Преподаватель</th>
              <th className="px-3 py-3 font-semibold">Интерес</th>
              <th className="px-3 py-3 font-semibold">Подача</th>
              <th className="px-3 py-3 font-semibold">Комфорт</th>
              <th className="px-3 py-3 font-semibold">Обр. связь</th>
              <th className="px-3 py-3 font-semibold">Среднее</th>
            </tr>
          </thead>
          <tbody>
            {TEACHER_SOP.map((t) => (
              <tr key={t.name} className="border-b border-border last:border-none">
                <td className="px-4 py-2.5">
                  <div className="font-semibold text-auth-black">{t.name}</div>
                  <div className="text-[11px] text-auth-gray">{t.subjects[0]}{t.subjects.length > 1 ? ` +${t.subjects.length - 1}` : ''}</div>
                </td>
                <td className="px-3 py-2.5 font-semibold" style={{ color: scoreColor(t.interest) }}>{t.interest}</td>
                <td className="px-3 py-2.5 font-semibold" style={{ color: scoreColor(t.delivery) }}>{t.delivery}{t.delivery <= 3 ? ' ⚠' : ''}</td>
                <td className="px-3 py-2.5 font-semibold" style={{ color: scoreColor(t.comfort) }}>{t.comfort}</td>
                <td className="px-3 py-2.5 font-semibold" style={{ color: scoreColor(t.feedback) }}>{t.feedback}{t.feedback <= 3 ? ' ⚠' : ''}</td>
                <td className="px-3 py-2.5 font-bold" style={{ color: scoreColor(t.overall) }}>{t.overall}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {currentUser?.role === 'uchebny_head' && (
        <button
          onClick={() => setLaunched(true)}
          className="mt-4 rounded-[14px] bg-auth-primary px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
        >
          {launched ? '✓ СОП запущен. Студенты получили уведомления.' : '🚀 Запустить СОП'}
        </button>
      )}
    </div>
  )
}

export default function TeacherAnalyticsPage() {
  const [tab, setTab] = useState<TabId>('ou')

  return (
    <div>
      <h1 className="text-[22px] font-semibold text-auth-black">Аналитика преподавателей</h1>
      <p className="mt-1 text-[14px] text-auth-gray">Открытые уроки · СОП</p>

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

        {tab === 'ou' ? <OuSection /> : <SopAnalyticsTab />}
      </div>
    </div>
  )
}
