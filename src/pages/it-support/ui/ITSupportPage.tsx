import { useState } from 'react'
import { useAuth } from '@/entities/session'
import TicketForm from './TicketForm'
import MyTickets from './MyTickets'
import AdminTickets from './AdminTickets'
import ItAnalytics from './ItAnalytics'

const ADMIN_TABS = [
  { id: 'all', label: 'Все заявки' },
  { id: 'analytics', label: 'Аналитика' },
] as const

const USER_TABS = [
  { id: 'create', label: 'Создать заявку' },
  { id: 'my', label: 'Мои заявки' },
] as const

export default function ITSupportPage() {
  const currentUser = useAuth((s) => s.currentUser)
  const isAdmin = currentUser?.role === 'it_admin' || currentUser?.role === 'director'
  const tabs = isAdmin ? ADMIN_TABS : USER_TABS
  const [tab, setTab] = useState<string>(tabs[0].id)

  return (
    <div>
      <h1 className="text-[22px] font-semibold text-auth-black">IT-поддержка</h1>
      <p className="mt-1 text-[14px] text-auth-gray">Заявки на ремонт · Установка ПО · Статусы</p>

      <div className="mt-6">
        <div className="mb-4 flex flex-wrap gap-2">
          {tabs.map((t) => (
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

        {isAdmin ? (
          tab === 'all' ? <AdminTickets /> : <ItAnalytics />
        ) : tab === 'create' ? (
          <TicketForm onSubmitted={() => setTab('my')} />
        ) : (
          <MyTickets />
        )}
      </div>
    </div>
  )
}
