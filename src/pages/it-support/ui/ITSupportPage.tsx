import { useState } from 'react'
import { Download, Send, Wrench } from 'lucide-react'
import { StatCard } from '@/shared/ui'
import { useAuth } from '@/entities/session'

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

export default function ITSupportPage() {
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
      <h1 className="text-[22px] font-semibold text-auth-black">IT-поддержка</h1>
      <p className="mt-1 text-[14px] text-auth-gray">Заявки на ремонт · Установка ПО · Статусы</p>

      <div className="mt-6 space-y-6">
        {isAdmin && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard value={tickets.length} label="Всего заявок" color="var(--color-amber)" />
            <StatCard value={tickets.filter((t) => t.status === 'Новая' || t.status === 'В работе').length} label="Открытых" color="var(--color-amber-deep)" />
            <StatCard value={tickets.filter((t) => t.status === 'Выполнено').length} label="Выполнено" color="var(--color-green)" />
            <StatCard value={tickets.filter((t) => t.status === 'Отклонена').length} label="Отклонено" color="var(--color-red)" />
          </div>
        )}

        {!isAdmin && (
          <div className="rounded-[20px] border border-border bg-blue-light p-5">
            <div className="mb-3 text-[14px] font-semibold text-blue">Создать заявку</div>
            <div className="grid gap-3 sm:grid-cols-[160px_1fr_auto]">
              <input
                className="rounded-[14px] border border-border bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-auth-primary"
                placeholder="Аудитория"
                value={room}
                onChange={(e) => setRoom(e.target.value)}
              />
              <input
                className="rounded-[14px] border border-border bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-auth-primary"
                placeholder="Описание проблемы"
                value={detail}
                onChange={(e) => setDetail(e.target.value)}
              />
              <button
                onClick={submitTicket}
                className="flex items-center justify-center gap-2 rounded-[14px] bg-auth-primary px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
              >
                <Send size={16} />
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
                className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                  filter === f ? 'bg-auth-primary text-white' : 'bg-gray-light text-gray hover:opacity-80'
                }`}
              >
                {f}
              </button>
            ))}
          </div>

          <div className="space-y-2">
            {visible.map((t) => (
              <div key={t.id} className="flex flex-wrap items-center gap-3 rounded-[16px] border border-border bg-white p-4">
                <span
                  className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${
                    t.type === 'Неисправность' ? 'bg-red-light text-red' : 'bg-blue-light text-blue'
                  }`}
                >
                  {t.type === 'Неисправность' ? <Wrench size={16} /> : <Download size={16} />}
                </span>
                <div className="min-w-40 flex-1">
                  <div className="text-[14px] font-semibold text-auth-black">{t.room}</div>
                  <div className="mt-0.5 text-[12px] text-auth-gray">{t.author} · {t.detail}</div>
                </div>
                <button
                  onClick={() => isAdmin && cycleStatus(t.id)}
                  disabled={!isAdmin || t.status === 'Отклонена'}
                  className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${STATUS_STYLES[t.status]} ${isAdmin ? 'cursor-pointer' : ''}`}
                >
                  {t.status}
                </button>
                <span className="text-[12px] text-auth-gray">{t.date}</span>
              </div>
            ))}
            {visible.length === 0 && <div className="py-8 text-center text-[14px] text-auth-gray">Заявок нет</div>}
          </div>
        </div>
      </div>
    </div>
  )
}
