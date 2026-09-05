import { useState } from 'react'

const CRITERIA = [
  'Чёткость постановки целей урока',
  'Структура и логика подачи материала',
  'Вовлечённость студентов',
  'Обратная связь со студентами',
  'Темп и тайминг урока',
]

export default function TeacherAnalyticsPage() {
  const [ratings, setRatings] = useState<number[]>(Array(CRITERIA.length).fill(0))

  const filled = ratings.filter((r) => r > 0)
  const avg = filled.length ? (filled.reduce((a, b) => a + b, 0) / filled.length).toFixed(1) : '—'
  const avgNum = parseFloat(avg)
  const avgColor = avg === '—' ? 'white' : avgNum >= 4 ? 'var(--color-score-good)' : avgNum >= 3.1 ? 'var(--color-score-warn)' : 'var(--color-score-bad)'

  function rate(idx: number, val: number) {
    setRatings((prev) => prev.map((r, i) => (i === idx ? val : r)))
  }

  return (
    <div>
      <h1 className="text-[22px] font-semibold text-auth-black">Аналитика преподавателей</h1>
      <p className="mt-1 text-[14px] text-auth-gray">Открытые уроки · Чек-лист тимлидера</p>

      <div className="mt-6 max-w-2xl">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-auth-primary p-4">
          <div>
            <div className="text-sm font-semibold text-white">Открытый урок</div>
            <div className="text-[12px] text-white/70">Иванова С. М. · Математика · сегодня</div>
          </div>
          <div className="rounded-[12px] bg-white/15 px-4 py-1.5 text-center">
            <div className="text-xl font-bold text-white" style={{ color: avgColor }}>{avg}</div>
            <div className="text-[10px] text-white/70">Средняя оценка</div>
          </div>
        </div>

        <div className="mt-4 space-y-2">
          {CRITERIA.map((label, idx) => (
            <div key={label} className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-border bg-white px-3.5 py-2.5">
              <span className="flex-1 text-[13px] text-auth-black">{idx + 1}. {label}</span>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((v) => (
                  <button
                    key={v}
                    onClick={() => rate(idx, v)}
                    className={`h-6 w-6 rounded-[6px] border text-[13px] transition-colors ${
                      v <= ratings[idx] ? 'border-amber bg-amber text-white' : 'border-border bg-white text-auth-gray'
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
          <div className="mt-4 rounded-[14px] border-l-4 border-red bg-red-light p-3.5 text-[12px] text-red">
            Оценка ≤ 3 — система автоматически поставит флаг «Требует повторного ОУ»
          </div>
        )}
      </div>
    </div>
  )
}
