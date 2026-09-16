import { useAuth } from '@/entities/session'
import { findRetakeStudentByFullName, useNotificationsForStudent } from '@/entities/retake'

export default function MyNotificationsPage() {
  const currentUser = useAuth((s) => s.currentUser)
  const student = currentUser ? findRetakeStudentByFullName(currentUser.fullName) : undefined
  // Хук должен вызываться безусловно — если студент не найден, передаём
  // заведомо несуществующий id, а список просто окажется пустым.
  const notifs = useNotificationsForStudent(student?.id ?? -1)

  return (
    <div>
      <h1 className="text-[22px] font-semibold text-auth-black">Уведомления</h1>
      <p className="mt-1 text-[14px] text-auth-gray">История уведомлений о пересдачах</p>

      <div className="mt-6 space-y-2">
        {notifs.map((n) => (
          <div key={n.id} className="rounded-[14px] border border-border bg-white p-3.5">
            <div className="text-[11px] text-auth-gray">{n.date}</div>
            <div className="mt-1 text-[13px] text-auth-black">{n.text}</div>
          </div>
        ))}
        {notifs.length === 0 && (
          <div className="flex h-64 items-center justify-center rounded-[20px] border border-dashed border-border bg-white text-[14px] text-auth-gray">
            Уведомлений пока нет
          </div>
        )}
      </div>
    </div>
  )
}
