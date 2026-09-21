import { useMemo, useState } from 'react'
import { RETAKE_STUDENTS, uploadTask, useAllTasks } from '@/entities/retake'
import { useAuth } from '@/entities/session'

// Тимлидер выбирает предмет и грузит файл задания — система "распределяет"
// его по кураторам просто тем, что предмет теперь виден с заданием у любого
// студента с этим предметом на пересдаче (см. RetakeStudentCard/NearestRetakeCard),
// без отдельного шага "разослать по группам". Реального файлового хранилища
// нет — как и у остальных file-полей портала, сохраняем только имя файла.
export default function TasksPanel() {
  const currentUser = useAuth((s) => s.currentUser)
  const canUpload = currentUser?.role === 'teamlead'
  const subjects = useMemo(() => Array.from(new Set(RETAKE_STUDENTS.flatMap((s) => s.items.map((i) => i.subject)))), [])
  const tasks = useAllTasks()

  const [subject, setSubject] = useState(subjects[0] ?? '')
  const [fileName, setFileName] = useState('')
  const [uploaded, setUploaded] = useState(false)

  function handleUpload() {
    if (!subject || !fileName || !currentUser) return
    uploadTask(subject, fileName, currentUser.fullName)
    setUploaded(true)
    setTimeout(() => setUploaded(false), 2000)
  }

  return (
    <div className="rounded-[16px] border border-border bg-white p-4">
      <div className="mb-3 text-[16px] font-semibold text-auth-black">Задания для пересдач</div>

      {canUpload && (
        <div className="mb-4 grid gap-2 sm:grid-cols-[1fr_1fr_auto] sm:items-end">
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase text-auth-gray">Предмет</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full rounded-[14px] border border-border bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-auth-primary"
            >
              {subjects.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-[11px] font-semibold uppercase text-auth-gray">Файл задания</label>
            <input
              type="file"
              onChange={(e) => setFileName(e.target.files?.[0]?.name ?? '')}
              className="w-full rounded-[14px] border border-border bg-white px-3.5 py-2 text-[13px] outline-none focus:border-auth-primary"
            />
          </div>
          <button
            onClick={handleUpload}
            disabled={!fileName}
            className="rounded-[14px] bg-auth-primary px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {uploaded ? '✓ Загружено' : 'Загрузить'}
          </button>
        </div>
      )}

      <div className="space-y-1.5">
        {subjects.map((s) => {
          const task = tasks.find((t) => t.subject === s)
          return (
            <div key={s} className="flex flex-wrap items-center justify-between gap-2 rounded-[12px] bg-gray-light px-3 py-2 text-[12px]">
              <span className="font-semibold text-auth-black">{s}</span>
              {task ? (
                <span className="text-auth-gray">📎 {task.fileName} · {task.uploadedAt}</span>
              ) : (
                <span className="text-auth-gray">Задание не загружено</span>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
