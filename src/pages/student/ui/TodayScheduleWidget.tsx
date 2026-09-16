import { TODAY_SCHEDULE } from '@/entities/schedule'

export default function TodayScheduleWidget() {
  return (
    <div className="rounded-[16px] border border-border bg-white p-4">
      <div className="mb-3 text-[16px] font-semibold text-auth-black">Расписание на сегодня</div>
      <div className="divide-y divide-border">
        {TODAY_SCHEDULE.map((slot) => (
          <div key={slot.time} className={`flex items-center gap-3 py-2.5 ${slot.current ? 'rounded-[10px] bg-purple-light px-2' : ''}`}>
            <span className="min-w-[95px] text-[11px] font-semibold text-auth-black">{slot.time}</span>
            <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${slot.current ? 'bg-auth-primary' : 'bg-gray'}`} />
            <div className="min-w-0 flex-1">
              <div className="truncate text-[11px] font-semibold text-auth-black">{slot.subject}</div>
              <div className="truncate text-[10px] text-auth-gray">{slot.teacher}</div>
              <div className="truncate text-[10px] text-auth-gray">Аудитория {slot.room}</div>
            </div>
            {slot.current && (
              <span className="rounded-full bg-auth-primary px-2.5 py-0.5 text-[10px] font-semibold text-white">Сейчас</span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
