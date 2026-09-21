import { useMemo, useState } from 'react'
import { useEffectiveRetakeStudents, recordResult } from '@/entities/retake'

// "Руководитель вносит результаты пакетом (по группе или по предмету)" —
// плоский список всех незавершённых попыток (сгруппировано по предмету,
// как в "По предметам"), с быстрыми кнопками результата на каждой строке,
// без захода в карточку каждого студента по отдельности.
export default function BulkResultsPanel() {
  const students = useEffectiveRetakeStudents()
  const [justRecorded, setJustRecorded] = useState<string | null>(null)

  const bySubject = useMemo(() => {
    const map = new Map<string, { student: typeof students[number]; subject: string; score: number }[]>()
    for (const s of students) {
      for (const item of s.items) {
        const latest = item.attempts[item.attempts.length - 1]
        if (!latest || (latest.result !== 'scheduled' && latest.result !== 'waiting')) continue
        const rows = map.get(item.subject) ?? []
        rows.push({ student: s, subject: item.subject, score: item.score })
        map.set(item.subject, rows)
      }
    }
    return Array.from(map.entries())
  }, [students])

  function handle(studentId: number, subject: string, result: 'passed' | 'failed' | 'no-show') {
    recordResult(studentId, subject, result)
    setJustRecorded(`${studentId}::${subject}`)
    setTimeout(() => setJustRecorded(null), 1500)
  }

  if (bySubject.length === 0) {
    return (
      <div className="rounded-[16px] border border-border bg-white p-4">
        <div className="mb-2 text-[16px] font-semibold text-auth-black">Внести результаты пакетом</div>
        <div className="py-4 text-center text-[13px] text-auth-gray">Все текущие попытки уже с результатом</div>
      </div>
    )
  }

  return (
    <div className="rounded-[16px] border border-border bg-white p-4">
      <div className="mb-3 text-[16px] font-semibold text-auth-black">Внести результаты пакетом</div>
      <div className="space-y-3">
        {bySubject.map(([subject, rows]) => (
          <div key={subject} className="overflow-hidden rounded-[14px] border border-border">
            <div className="bg-gray-light px-3.5 py-2 text-[12px] font-semibold text-auth-black">{subject}</div>
            <div className="divide-y divide-border">
              {rows.map(({ student, score }) => (
                <div key={student.id} className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2">
                  <span className="text-[13px] text-auth-black">
                    {student.name} <span className="text-[11px] text-auth-gray">({student.group}, {score} б)</span>
                  </span>
                  {justRecorded === `${student.id}::${subject}` ? (
                    <span className="text-[12px] font-semibold text-green">✓ Записано</span>
                  ) : (
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => handle(student.id, subject, 'passed')}
                        className="rounded-[10px] bg-green px-2.5 py-1 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        ✓ Сдал
                      </button>
                      <button
                        onClick={() => handle(student.id, subject, 'failed')}
                        className="rounded-[10px] bg-red px-2.5 py-1 text-[11px] font-semibold text-white transition-opacity hover:opacity-90"
                      >
                        ✕ Не сдал
                      </button>
                      <button
                        onClick={() => handle(student.id, subject, 'no-show')}
                        className="rounded-[10px] border border-border bg-white px-2.5 py-1 text-[11px] font-semibold text-auth-black transition-colors hover:bg-gray-light"
                      >
                        ⦸ Не явился
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
