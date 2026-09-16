import { useState } from 'react'
import TicketForm from '@/pages/it-support/ui/TicketForm'
import MyTickets from '@/pages/it-support/ui/MyTickets'

const TABS = [
  { id: 'create', label: 'Создать заявку' },
  { id: 'my', label: 'Мои заявки' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function MyTicketsPage() {
  const [tab, setTab] = useState<TabId>('create')

  return (
    <div>
      <h1 className="text-[22px] font-semibold text-auth-black">Заявки</h1>
      <p className="mt-1 text-[14px] text-auth-gray">Неисправности в аудитории · Статус ваших обращений</p>

      <div className="mt-6">
        <div className="mb-4 flex flex-wrap gap-2">
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

        {tab === 'create' ? <TicketForm onSubmitted={() => setTab('my')} /> : <MyTickets />}
      </div>
    </div>
  )
}
