import { useState } from 'react'
import { CoverHeader } from '@/shared/ui'

interface Student {
  id: string
  name: string
  group: string
  subjects: { name: string; score: number; attempt: number }[]
}

const STUDENTS: Student[] = [
  { id: '1', name: 'Громов П. И.', group: 'ИТ-23', subjects: [
    { name: 'Математика', score: 38, attempt: 2 },
    { name: 'Основы ОС', score: 29, attempt: 2 },
    { name: 'Английский', score: 41, attempt: 1 },
  ] },
  { id: '2', name: 'Ким А. В.', group: 'ИТ-23', subjects: [
    { name: 'Математика', score: 41, attempt: 1 },
    { name: 'Физика', score: 33, attempt: 1 },
  ] },
  { id: '3', name: 'Захарова М. Е.', group: 'ИБ-24', subjects: [
    { name: 'Английский', score: 45, attempt: 1 },
  ] },
  { id: '4', name: 'Алиев Д. Р.', group: 'ИТ-24', subjects: [
    { name: 'Основы ОС', score: 36, attempt: 1 },
    { name: 'Математика', score: 22, attempt: 1 },
  ] },
]

export default function UchebnyPage() {
  const [openId, setOpenId] = useState<string | null>(null)

  const totalSubjects = STUDENTS.reduce((sum, s) => sum + s.subjects.length, 0)

  return (
    <div>
      <CoverHeader tag="Внутренний портал колледжа" title="Учебный отдел" subtitle="Пересдачи · Автоматическое выявление студентов" />
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-4 flex flex-wrap gap-4 rounded-lg bg-gray-light px-4 py-2.5 text-[12px] text-ink-muted">
          <span>Студентов: <b className="text-ink">{STUDENTS.length}</b></span>
          <span>Пересдач всего: <b className="text-ink">{totalSubjects}</b></span>
          <span>С 2+ предметами: <b className="text-ink">{STUDENTS.filter((s) => s.subjects.length >= 2).length}</b></span>
        </div>

        <div className="space-y-2">
          {STUDENTS.map((s) => (
            <div key={s.id} className="rounded-lg border border-border bg-white">
              <button
                onClick={() => setOpenId(openId === s.id ? null : s.id)}
                className="flex w-full flex-wrap items-center gap-3 p-3.5 text-left"
              >
                <span className="min-w-40 text-[13px] font-semibold text-ink">{s.name}</span>
                <span className="text-[11px] text-ink-faint">{s.group}</span>
                <div className="flex flex-1 flex-wrap gap-1.5">
                  {s.subjects.map((sub) => (
                    <span key={sub.name} className="rounded-full bg-red-light px-2 py-0.5 text-[11px] font-medium text-red">
                      {sub.name}
                    </span>
                  ))}
                </div>
                <span className="rounded bg-purple-light px-2 py-1 text-[11px] font-semibold text-purple">
                  {s.subjects.length} предм.
                </span>
              </button>
              {openId === s.id && (
                <div className="border-t border-gray-light p-3.5">
                  {s.subjects.map((sub) => (
                    <div key={sub.name} className="flex items-center justify-between border-b border-dashed border-border py-2 text-[13px] last:border-none">
                      <span className="text-ink">{sub.name}</span>
                      <div className="flex items-center gap-3">
                        <span className="rounded bg-red-light px-2 py-0.5 text-[11px] font-semibold text-red">{sub.score} б</span>
                        <span className="text-[11px] text-ink-faint">Попытка {sub.attempt} из 3</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
