import { useState } from 'react'
import CoverHeader from '../../components/CoverHeader'

const CRITERIA = [
  'Чёткость постановки целей урока',
  'Структура и логика подачи материала',
  'Вовлечённость студентов',
  'Обратная связь со студентами',
  'Темп и тайминг урока',
]

export default function TeacherAnalytics() {
  const [ratings, setRatings] = useState<number[]>(Array(CRITERIA.length).fill(0))

  const filled = ratings.filter((r) => r > 0)
  const avg = filled.length ? (filled.reduce((a, b) => a + b, 0) / filled.length).toFixed(1) : '—'
  const avgNum = parseFloat(avg)
  const avgColor = avg === '—' ? 'white' : avgNum >= 4 ? '#90EE90' : avgNum >= 3.1 ? '#FFD700' : '#FF6B6B'

  function rate(idx: number, val: number) {
    setRatings((prev) => prev.map((r, i) => (i === idx ? val : r)))
  }

  return (
    <div>
      <CoverHeader tag="Внутренний портал колледжа · Учебный отдел" title="Аналитика преподавателей" subtitle="Открытые уроки · Чек-лист тимлидера" />
      <div className="mx-auto max-w-3xl px-6 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-purple p-4">
          <div>
            <div className="text-sm font-semibold text-white">Открытый урок</div>
            <div className="text-[12px] text-white/70">Иванова С. М. · Математика · сегодня</div>
          </div>
          <div className="rounded-md bg-white/15 px-4 py-1.5 text-center">
            <div className="text-xl font-bold text-white" style={{ color: avgColor }}>{avg}</div>
            <div className="text-[10px] text-white/70">Средняя оценка</div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {CRITERIA.map((label, idx) => (
            <div key={label} className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-gray-light px-3.5 py-2.5">
              <span className="flex-1 text-[13px] text-ink">{idx + 1}. {label}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => rate(idx, v)}
                    className={`h-6 w-6 rounded border text-[13px] transition-colors ${
                      v <= ratings[idx] ? 'border-amber bg-amber text-white' : 'border-border bg-white text-ink-faint'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {avg !== '—' && avgNum <= 3 && (
          <div className="mt-4 rounded-lg border-l-4 border-red bg-red-light p-3.5 text-[12px] text-red">
            Оценка ≤ 3 — система автоматически поставит флаг «Требует повторного ОУ»
          </div>
        )}
      </div>
    </div>
  )
}
