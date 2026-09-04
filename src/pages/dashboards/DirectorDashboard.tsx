import { useState } from 'react'
import CoverHeader from '../../components/CoverHeader'
import StatCard from '../../components/StatCard'
import Panel, { PanelRow } from '../../components/Panel'

const TABS = [
  { id: 'summary', label: 'Общая сводка' },
  { id: 'vosp', label: 'Воспитательный отдел' },
  { id: 'ucheb', label: 'Учебный отдел' },
  { id: 'it', label: 'IT-заявки' },
] as const

type TabId = (typeof TABS)[number]['id']

export default function DirectorDashboard() {
  const [tab, setTab] = useState<TabId>('summary')

  return (
    <div>
      <CoverHeader tag="Внутренний портал колледжа" title="Дашборд директора" subtitle="Сводная аналитика · Три отдела · Архив по семестрам" />
      <div className="mx-auto max-w-5xl px-6 py-8">
        <div className="mb-4 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`rounded-full px-4 py-2 text-[13px] font-semibold transition-colors ${
                tab === t.id ? 'bg-purple text-white' : 'bg-white text-ink-muted border border-border hover:bg-gray-light'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {tab === 'summary' && (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatCard value={18} label="Студентов в красной зоне" color="#A32D2D" />
            <StatCard value={38} label="Открытых IT-заявок" color="#854F0B" />
            <StatCard value={3} label="Преподавателей с флагами" color="#534AB7" />
            <StatCard value={24} label="Активных пересдач" color="#185FA5" />
          </div>
        )}

        {tab === 'vosp' && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatCard value={96} label="Всего студентов" color="#0F6E56" />
              <StatCard value={18} label="Красная зона" color="#A32D2D" />
              <StatCard value={24} label="Бесед проведено" color="#0F6E56" />
              <StatCard value={7} label="Эскалаций" color="#854F0B" />
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
              <StatCard value={142} label="Всего заявок" color="#854F0B" />
              <StatCard value={38} label="Открытых" color="#6B3E08" />
              <StatCard value={96} label="Выполнено" color="#3B6D11" />
              <StatCard value={8} label="Отклонено" color="#A32D2D" />
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
