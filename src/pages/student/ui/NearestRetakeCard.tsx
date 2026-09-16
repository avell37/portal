import { useState } from 'react'
import type { RetakeItem } from '@/entities/retake'
import { splitDateTime, latestAttempt } from './retakeDisplay'

export default function NearestRetakeCard({ item }: { item: RetakeItem | undefined }) {
  const [opened, setOpened] = useState(false)

  if (!item) {
    return (
      <div className="rounded-[16px] border border-border bg-white p-4">
        <div className="mb-3 text-[16px] font-semibold text-auth-black">Ближайшая пересдача</div>
        <div className="py-4 text-center text-[13px] text-auth-gray">Пересдач не запланировано</div>
      </div>
    )
  }

  const { date, time } = splitDateTime(latestAttempt(item).date)

  return (
    <div className="rounded-[16px] border border-border bg-white p-4">
      <div className="mb-3 text-[16px] font-semibold text-auth-black">Ближайшая пересдача</div>
      <div className="mb-2.5 rounded-[12px] border border-border px-3 py-2">
        <div className="text-[11px] text-auth-gray">Дисциплина</div>
        <div className="text-[14px] font-semibold text-auth-black">{item.subject}</div>
      </div>
      <div className="mb-2.5 grid grid-cols-3 gap-2">
        <div className="rounded-[12px] bg-purple-light px-2.5 py-2">
          <div className="text-[10px] text-auth-gray">Дата</div>
          <div className="text-[12px] font-semibold text-auth-black">{date}</div>
        </div>
        <div className="rounded-[12px] border border-border px-2.5 py-2">
          <div className="text-[10px] text-auth-gray">Время</div>
          <div className="text-[12px] font-semibold text-auth-black">{time}</div>
        </div>
        <div className="rounded-[12px] border border-border px-2.5 py-2">
          <div className="text-[10px] text-auth-gray">Аудитория</div>
          <div className="text-[12px] font-semibold text-auth-black">Ауд. {item.room}</div>
        </div>
      </div>
      <div className="mb-3 rounded-[12px] border border-border px-3 py-2">
        <div className="text-[11px] text-auth-gray">Преподаватель</div>
        <div className="text-[14px] font-semibold text-auth-black">{item.teacher}</div>
      </div>
      <button
        onClick={() => setOpened(true)}
        className="w-full rounded-[14px] bg-auth-primary px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
      >
        Открыть задание для подготовки
      </button>
      {opened && (
        <div className="mt-2 text-center text-[11px] text-auth-gray">
          Задание пока не загружено преподавателем
        </div>
      )}
    </div>
  )
}
