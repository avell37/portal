import { useMemo, useState } from 'react'
import { CalendarClock, Bell, CalendarCheck } from 'lucide-react'
import { useAuth } from '@/entities/session'
import { findRetakeStudentByFullName, useEffectiveItems } from '@/entities/retake'
import RetakeStudentCard from '@/pages/uchebny/ui/RetakeStudentCard'
import NearestRetakeCard from './NearestRetakeCard'
import AllRetakesTable from './AllRetakesTable'
import { findNearestItem, latestAttempt } from './retakeDisplay'

const TABS = [
  { id: 'all', label: 'Все пересдачи' },
  { id: 'scheduled', label: 'Запланированные' },
  { id: 'done', label: 'Завершённые' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function MyRetakesPage() {
  const currentUser = useAuth((s) => s.currentUser)
  const student = currentUser ? findRetakeStudentByFullName(currentUser.fullName) : undefined
  const [tab, setTab] = useState<TabId>('all')

  const items = useEffectiveItems(student?.id ?? -1)
  const scheduled = items.filter((i) => latestAttempt(i).result === 'scheduled')
  const done = items.filter((i) => latestAttempt(i).result === 'passed')
  const nearestItem = findNearestItem(items)

  const visible = useMemo(() => {
    if (tab === 'scheduled') return scheduled
    if (tab === 'done') return done
    return items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab, items])

  return (
    <div>
      <h1 className="text-[22px] font-semibold text-auth-black">Пересдачи</h1>
      <p className="mt-1 text-[14px] text-auth-gray">Ваши предметы на пересдаче и история попыток</p>

      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="flex items-center gap-3 rounded-[16px] border border-border bg-white p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]" style={{ background: 'var(--color-purple-light)' }}>
            <CalendarClock size={18} color="var(--color-purple)" />
          </span>
          <div>
            <div className="text-[13px] font-semibold text-auth-black">Всего пересдач</div>
            <div className="text-[16px] font-semibold text-auth-black">{items.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[16px] border border-border bg-white p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]" style={{ background: 'var(--color-amber-light)' }}>
            <Bell size={18} color="var(--color-amber)" />
          </span>
          <div>
            <div className="text-[13px] font-semibold text-auth-black">Запланировано</div>
            <div className="text-[16px] font-semibold text-auth-black">{scheduled.length}</div>
          </div>
        </div>
        <div className="flex items-center gap-3 rounded-[16px] border border-border bg-white p-4">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]" style={{ background: 'var(--color-green-light)' }}>
            <CalendarCheck size={18} color="var(--color-green)" />
          </span>
          <div>
            <div className="text-[13px] font-semibold text-auth-black">Сдано</div>
            <div className="text-[16px] font-semibold text-auth-black">{done.length}</div>
          </div>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex flex-wrap gap-2">
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
          <AllRetakesTable items={visible} title="" />
        </div>
        <div className="lg:col-span-1">
          <NearestRetakeCard item={nearestItem} />
        </div>
      </div>

      <div className="mt-6 border-t border-border pt-6">
        <h2 className="mb-3 text-[16px] font-semibold text-auth-black">Детали по попыткам</h2>
        {student ? (
          <RetakeStudentCard studentId={student.id} canNotify={false} />
        ) : (
          <div className="flex h-64 items-center justify-center rounded-[20px] border border-dashed border-border bg-white text-[14px] text-auth-gray">
            Пересдач нет — все предметы сданы
          </div>
        )}
      </div>
    </div>
  )
}
