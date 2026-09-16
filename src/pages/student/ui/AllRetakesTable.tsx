import type { RetakeItem } from '@/entities/retake'
import { splitDateTime, latestAttempt } from './retakeDisplay'

export default function AllRetakesTable({ items, title = 'Все пересдачи' }: { items: RetakeItem[]; title?: string }) {
  return (
    <div className="rounded-[16px] border border-border bg-white p-4">
      <div className="mb-3 text-[16px] font-semibold text-auth-black">{title}</div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-border text-[11px] uppercase text-auth-gray">
              <th className="px-4 py-2.5 font-semibold">Дисциплина</th>
              <th className="px-3 py-2.5 font-semibold">Дата</th>
              <th className="px-3 py-2.5 font-semibold">Время</th>
              <th className="px-3 py-2.5 font-semibold">Аудитория</th>
              <th className="px-3 py-2.5 font-semibold">Преподаватель</th>
              <th className="px-3 py-2.5 font-semibold">Баллы</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const { date, time } = splitDateTime(latestAttempt(item).date)
              return (
                <tr key={item.subject} className="border-b border-border last:border-none">
                  <td className="px-4 py-2.5 font-semibold text-auth-black">{item.subject}</td>
                  <td className="px-3 py-2.5 text-auth-black">{date}</td>
                  <td className="px-3 py-2.5 text-auth-black">{time}</td>
                  <td className="px-3 py-2.5 text-auth-black">Ауд. {item.room}</td>
                  <td className="px-3 py-2.5 text-auth-black">{item.teacher}</td>
                  <td className={`px-3 py-2.5 font-semibold ${item.score >= 50 ? 'text-green' : 'text-auth-black'}`}>{item.score}</td>
                </tr>
              )
            })}
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-auth-gray">Пересдач нет</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
