import { useState } from 'react'
import { CalendarClock, Bell, CalendarCheck } from 'lucide-react'
import { useAuth } from '@/entities/session'
import { findStudentByFullName } from '@/entities/group-student'
import { findRetakeStudentByFullName, useEffectiveItems } from '@/entities/retake'
import { useTickets } from '@/entities/ticket'
import StudentCard from '@/pages/vospitatelniy/ui/StudentCard'
import SopSurvey from './SopSurvey'
import TicketForm from '@/pages/it-support/ui/TicketForm'
import TicketStatusWidget from './TicketStatusWidget'
import TodayScheduleWidget from './TodayScheduleWidget'
import NearestRetakeCard from './NearestRetakeCard'
import AllRetakesTable from './AllRetakesTable'
import { findNearestItem, splitDateTime, latestAttempt } from './retakeDisplay'
import { TODAY_SCHEDULE } from '@/entities/schedule'

const SOP_DONE_KEY = 'portal-sop-done-v1'

function TopStat({ icon, iconBg, title, value, subtitle }: { icon: React.ReactNode; iconBg: string; title: string; value: string | number; subtitle: string }) {
  return (
    <div className="flex items-center gap-3 rounded-[16px] border border-border bg-white p-4">
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[12px]" style={{ background: iconBg }}>
        {icon}
      </span>
      <div className="min-w-0">
        <div className="text-[13px] font-semibold text-auth-black">{title}</div>
        <div className="text-[16px] font-semibold text-auth-black">{value}</div>
        <div className="truncate text-[11px] text-auth-gray">{subtitle}</div>
      </div>
    </div>
  )
}

export default function StudentPage() {
  const currentUser = useAuth((s) => s.currentUser)
  const [mode, setMode] = useState<'idle' | 'survey' | 'done'>(
    () => (localStorage.getItem(SOP_DONE_KEY) ? 'done' : 'idle'),
  )
  const performance = currentUser ? findStudentByFullName(currentUser.fullName) : undefined
  const retakeStudent = currentUser ? findRetakeStudentByFullName(currentUser.fullName) : undefined
  const retakeItems = useEffectiveItems(retakeStudent?.id ?? -1)
  const myTicketsCount = useTickets().filter((t) => t.authorEmail === currentUser?.email).length
  const nearestItem = findNearestItem(retakeItems)
  const nearestDate = nearestItem ? splitDateTime(latestAttempt(nearestItem).date).date : '—'

  function finishSurvey() {
    try {
      localStorage.setItem(SOP_DONE_KEY, '1')
    } catch {
      // storage unavailable — completion just won't be remembered next visit
    }
    setMode('done')
  }

  return (
    <div>
      <h1 className="text-[22px] font-semibold text-auth-black">Главная</h1>
      <p className="mt-1 text-[14px] text-auth-gray">
        Добро пожаловать, {currentUser?.fullName ?? ''}
      </p>

      {mode === 'survey' ? (
        <div className="mt-6">
          <SopSurvey onFinish={finishSurvey} />
        </div>
      ) : (
        <>
          {mode === 'idle' && (
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-[16px] border border-border bg-blue-light p-4">
              <span className="text-[13px] font-semibold text-blue">📋 Открыт новый СОП — Семестр 2, 2025/2026</span>
              <button
                onClick={() => setMode('survey')}
                className="rounded-[12px] bg-blue px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                Пройти опрос
              </button>
            </div>
          )}
          {mode === 'done' && (
            <div className="mt-6 rounded-[16px] border border-border bg-green-light p-4 text-[13px] font-semibold text-green">
              ✓ СОП пройден, спасибо! Результаты доступны только руководителю и директору после закрытия опроса.
            </div>
          )}

          <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <TopStat
              icon={<CalendarClock size={18} color="var(--color-purple)" />}
              iconBg="var(--color-purple-light)"
              title="Сегодня пар"
              value={TODAY_SCHEDULE.length}
              subtitle="Расписание на сегодня"
            />
            <TopStat
              icon={<Bell size={18} color="var(--color-amber)" />}
              iconBg="var(--color-amber-light)"
              title="Уведомления"
              value={myTicketsCount}
              subtitle="Статусы заявок"
            />
            <TopStat
              icon={<CalendarCheck size={18} color="var(--color-green)" />}
              iconBg="var(--color-green-light)"
              title="Ближайшая пересдача"
              value={nearestDate}
              subtitle={nearestItem?.subject ?? 'Пересдач нет'}
            />
          </div>

          <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-1">
              <TicketForm onSubmitted={() => {}} />
              <NearestRetakeCard item={nearestItem} />
            </div>
            <div className="space-y-4 lg:col-span-1">
              <TicketStatusWidget />
            </div>
            <div className="space-y-4 lg:col-span-1">
              <TodayScheduleWidget />
            </div>
          </div>

          <div className="mt-4">
            <AllRetakesTable items={retakeItems} />
          </div>

          <div className="mt-6 border-t border-border pt-6">
            <h2 className="mb-3 text-[16px] font-semibold text-auth-black">Моя успеваемость</h2>
            {performance ? (
              <StudentCard studentId={performance.id} canAddTalk={false} />
            ) : (
              <div className="flex h-64 items-center justify-center rounded-[20px] border border-dashed border-border bg-white text-[14px] text-auth-gray">
                Данные об успеваемости пока недоступны
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}
