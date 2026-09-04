import { useState } from 'react'
import CoverHeader from '../../components/CoverHeader'
import StatCard from '../../components/StatCard'
import { useAuth } from '../../store/auth'

type Status = 'Новая' | 'В работе' | 'Выполнено' | 'Отклонена'
interface Ticket {
  id: string
  type: 'Неисправность' | 'Установка ПО'
  room: string
  detail: string
  author: string
  status: Status
  date: string
}

const STATUS_STYLES: Record<Status, string> = {
  'Новая': 'bg-gray-light text-gray',
  'В работе': 'bg-amber-light text-amber',
  'Выполнено': 'bg-green-light text-green',
  'Отклонена': 'bg-red-light text-red',
}

const INITIAL_TICKETS: Ticket[] = [
  { id: '1', type: 'Неисправность', room: '204 · ПК-07', detail: 'Не включается компьютер', author: 'Студент Громов П.И.', status: 'Новая', date: '07 июн, 09:14' },
  { id: '2', type: 'Установка ПО', room: '301 · вся ауд.', detail: 'Adobe Photoshop', author: 'Преп. Иванова С.М.', status: 'В работе', date: '06 июн, 14:30' },
  { id: '3', type: 'Неисправность', room: '112 · ПК-03', detail: 'Не работает мышь', author: 'Преп. Козлов А.В.', status: 'Выполнено', date: '05 июн, 11:00' },
  { id: '4', type: 'Неисправность', room: '204 · ПК-12', detail: 'Не работает монитор', author: 'Студент Ким А.В.', status: 'Отклонена', date: '04 июн, 16:22' },
]

const FILTERS: (Status | 'Все')[] = ['Все', 'Новая', 'В работе', 'Выполнено', 'Отклонена']

export default function ITSupport() {
  const currentUser = useAuth((s) => s.currentUser)
  const [tickets, setTickets] = useState(INITIAL_TICKETS)
  const [filter, setFilter] = useState<Status | 'Все'>('Все')
  const [room, setRoom] = useState('')
  const [detail, setDetail] = useState('')

  const isAdmin = currentUser?.role === 'it_admin' || currentUser?.role === 'director'
  const visible = filter === 'Все' ? tickets : tickets.filter((t) => t.status === filter)

  function cycleStatus(id: string) {
    const order: Status[] = ['Новая', 'В работе', 'Выполнено']
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id !== id) return t
        const idx = order.indexOf(t.status)
        const next = order[(idx + 1) % order.length] ?? t.status
        return { ...t, status: next }
      }),
    )
  }

  function submitTicket() {
    if (!room.trim() || !detail.trim()) return
    setTickets((prev) => [
      { id: crypto.randomUUID(), type: 'Неисправность', room, detail, author: currentUser?.fullName ?? '—', status: 'Новая', date: 'только что' },
      ...prev,
    ])
    setRoom('')
    setDetail('')
  }

  return (
    <div>
      <CoverHeader tag="Внутренний портал колледжа" title="IT-поддержка" subtitle="Заявки на ремонт · Установка ПО · Статусы" />
      <div className="mx-auto max-w-5xl space-y-6 px-6 py-8">
        {isAdmin && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard value={tickets.length} label="Всего заявок" color="#854F0B" />
            <StatCard value={tickets.filter((t) => t.status === 'Новая' || t.status === 'В работе').length} label="Открытых" color="#6B3E08" />
            <StatCard value={tickets.filter((t) => t.status === 'Выполнено').length} label="Выполнено" color="#3B6D11" />
            <StatCard value={tickets.filter((t) => t.status === 'Отклонена').length} label="Отклонено" color="#A32D2D" />
          </div>
        )}

        {!isAdmin && (
          <div className="rounded-xl border border-border bg-blue-light p-5">
            <div className="mb-3 text-[13px] font-semibold text-blue">Создать заявку</div>
            <div className="grid gap-3 sm:grid-cols-[160px_1fr_auto]">
              <input
                className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-blue"
                placeholder="Аудитория"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
              <input
                className="rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-blue"
                placeholder="Описание проблемы"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
              <button onClick={submitTicket} className="rounded-md bg-blue px-4 py-2 text-sm font-semibold text-white hover:opacity-90">
                Отправить
              </button>
            </div>
          </div>
        )}

        <div>
          <div className="mb-3 flex flex-wrap gap-2">
            {FILTERS.map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-semibold transition-colors ${
                  filter === f ? 'bg-purple text-white' : 'bg-gray-light text-gray hover:opacity-80'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {visible.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-white p-3.5">
                <span
                  className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                    t.type === 'Неисправность' ? 'bg-red-light text-red' : 'bg-blue-light text-blue'
                  }`}
                >
                  {t.type}
                </span>
                <div className="min-w-40 flex-1">
                  <div className="text-[13px] font-semibold text-ink">{t.room}</div>
                  <div className="mt-0.5 text-[11px] text-ink-faint">{t.author} · {t.detail}</div>
                </div>
                <button
                  onClick={() => isAdmin && cycleStatus(t.id)}
                  disabled={!isAdmin || t.status === 'Отклонена'}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLES[t.status]} ${isAdmin ? 'cursor-pointer' : ''}`}
                >
                  {t.status}
                </button>
                <span className="text-[11px] text-ink-faint">{t.date}</span>
              </div>
            ))}
            {visible.length === 0 && <div className="py-8 text-center text-sm text-ink-faint">Заявок нет</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
