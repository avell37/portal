import { Link } from 'react-router-dom'
import { useAuth } from '@/entities/session'
import { useTickets, type TicketStatus } from '@/entities/ticket'

const STATUS_LABEL: Record<TicketStatus, string> = {
  'Новая': 'На рассмотрении',
  'В работе': 'В работе',
  'Выполнено': 'Выполнено',
  'Отклонена': 'Отклонена',
}

const STATUS_DOT: Record<TicketStatus, string> = {
  'Новая': 'bg-amber',
  'В работе': 'bg-blue',
  'Выполнено': 'bg-green',
  'Отклонена': 'bg-red',
}

const STATUS_TEXT: Record<TicketStatus, string> = {
  'Новая': 'text-amber',
  'В работе': 'text-blue',
  'Выполнено': 'text-green',
  'Отклонена': 'text-red',
}

export default function TicketStatusWidget() {
  const currentUser = useAuth((s) => s.currentUser)
  const myTickets = useTickets()
    .filter((t) => t.authorEmail === currentUser?.email)
    .slice(0, 3)

  return (
    <div className="rounded-[16px] border border-border bg-white p-4">
      <div className="mb-3 text-[16px] font-semibold text-auth-black">Статусы моих заявок</div>
      <div className="space-y-2.5">
        {myTickets.map((t) => (
          <Link
            key={t.id}
            to="/student/tickets"
            className="block rounded-[14px] border border-border bg-white p-3 transition-colors hover:bg-gray-light"
          >
            <div className="flex items-center justify-between">
              <span className={`flex items-center gap-1.5 text-[11px] font-semibold ${STATUS_TEXT[t.status]}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[t.status]}`} />
                {STATUS_LABEL[t.status]}
              </span>
              <span className="text-[10px] text-auth-gray">{t.date}</span>
            </div>
            <div className="mt-1.5 text-[11px] font-semibold text-auth-black">{t.detail}</div>
            <div className="mt-0.5 text-[11px] text-auth-gray">Ауд. {t.room}  {t.pc}</div>
          </Link>
        ))}
        {myTickets.length === 0 && <div className="py-4 text-center text-[13px] text-auth-gray">Заявок пока нет</div>}
      </div>
      <Link to="/student/tickets" className="mt-3 inline-block text-[11px] font-semibold text-auth-primary hover:opacity-75">
        Все мои заявки →
      </Link>
    </div>
  )
}
