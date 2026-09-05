import { useState } from 'react'
import { StatCard, Panel, PanelRow } from '@/shared/ui'

const TABS = [
  { id: 'summary', label: 'Общая сводка' },
  { id: 'vosp', label: 'Воспитательный отдел' },
  { id: 'ucheb', label: 'Учебный отдел' },
  { id: 'it', label: 'IT-заявки' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function DirectorPage() {
  const [tab, setTab] = useState<TabId>('summary')

  return (
    <div>
      <h1 className="text-[22px] font-semibold text-auth-black">Дашборд директора</h1>
      <p className="mt-1 text-[14px] text-auth-gray">Сводная аналитика · Три отдела · Архив по семестрам</p>

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

        {tab === 'summary' && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard value={18} label="Студентов в красной зоне" color="var(--color-red)" />
            <StatCard value={38} label="Открытых IT-заявок" color="var(--color-amber)" />
            <StatCard value={3} label="Преподавателей с флагами" color="var(--color-purple)" />
            <StatCard value={24} label="Активных пересдач" color="var(--color-blue)" />
          </div>
        )}

        {tab === 'vosp' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard value={96} label="Всего студентов" color="var(--color-teal)" />
              <StatCard value={18} label="Красная зона" color="var(--color-red)" />
              <StatCard value={24} label="Бесед проведено" color="var(--color-teal)" />
              <StatCard value={7} label="Эскалаций" color="var(--color-amber)" />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <Panel title="По направлениям" titleColor="var(--color-teal)" bg="var(--color-teal-light)">
                <PanelRow label="ИТ" value="54% · 7 красных" valueColor="var(--color-red)" />
                <PanelRow label="ИБ" value="61% · 4 красных" valueColor="var(--color-amber)" />
                <PanelRow label="Реклама" value="67% · 5 красных" valueColor="var(--color-green)" />
                <PanelRow label="Дизайн" value="72% · 2 красных" valueColor="var(--color-green)" />
              </Panel>
              <Panel title="Активность кураторов" titleColor="var(--color-teal)" bg="var(--color-teal-light)">
                <PanelRow label="Ср. время беседа → закрытие" value="3.2 дня" valueColor="var(--color-green)" />
                <PanelRow label="Закрыли долг после беседы" value="68%" valueColor="var(--color-green)" />
                <PanelRow label="Не отреагировали" value="3 куратора" valueColor="var(--color-amber)" />
              </Panel>
            </div>
          </div>
        )}

        {tab === 'ucheb' && (
          <div className="grid gap-3 sm:grid-cols-2">
            <Panel title="Пересдачи" titleColor="var(--color-blue)" bg="var(--color-blue-light)">
              <PanelRow label="На пересдаче" value={24} valueColor="var(--color-blue)" />
              <PanelRow label="Попытка 1" value={14} valueColor="var(--color-green)" />
              <PanelRow label="Попытка 2" value={7} valueColor="var(--color-amber)" />
              <PanelRow label="Попытка 3" value={3} valueColor="var(--color-red)" />
              <PanelRow label="Подлежат отчислению" value={2} valueColor="var(--color-red)" />
            </Panel>
            <Panel title="Преподавательский состав" titleColor="var(--color-purple)" bg="var(--color-purple-light)">
              <PanelRow label="Проведено ОУ" value={18} valueColor="var(--color-purple)" />
              <PanelRow label="Средняя оценка" value="4.1" valueColor="var(--color-green)" />
              <PanelRow label="С флагом повторного ОУ" value={3} valueColor="var(--color-red)" />
              <PanelRow label="Охват СОП" value="94%" valueColor="var(--color-green)" />
            </Panel>
          </div>
        )}

        {tab === 'it' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard value={142} label="Всего заявок" color="var(--color-amber)" />
              <StatCard value={38} label="Открытых" color="var(--color-amber-deep)" />
              <StatCard value={96} label="Выполнено" color="var(--color-green)" />
              <StatCard value={8} label="Отклонено" color="var(--color-red)" />
            </div>
            <Panel title="Проблемные аудитории" titleColor="var(--color-amber)" bg="var(--color-amber-light)">
              <PanelRow label="Ауд. 204" value={24} valueColor="var(--color-red)" />
              <PanelRow label="Ауд. 301" value={18} valueColor="var(--color-amber)" />
              <PanelRow label="Ауд. 112" value={12} valueColor="var(--color-amber)" />
              <PanelRow label="Ауд. 108" value={7} valueColor="var(--color-gray)" />
            </Panel>
          </div>
        )}
      </div>
    </div>
  )
}
