import CoverHeader from '../../components/CoverHeader'
import { useAuth } from '../../store/auth'

export default function StudentDashboard() {
  const currentUser = useAuth((s) => s.currentUser)

  return (
    <div>
      <CoverHeader tag="Внутренний портал колледжа" title="Личный кабинет" subtitle={`Добро пожаловать, ${currentUser?.fullName ?? ''}`} />
      <div className="mx-auto max-w-3xl space-y-4 px-6 py-8">
        <div className="rounded-lg border border-border bg-white p-4">
          <div className="mb-1 text-[13px] font-semibold text-ink">Пересдачи</div>
          <div className="text-[13px] text-ink-muted">Активных пересдач нет.</div>
        </div>
        <div className="rounded-lg border border-border bg-white p-4">
          <div className="mb-1 text-[13px] font-semibold text-ink">Заявки в IT-поддержку</div>
          <div className="text-[13px] text-ink-muted">Вы ещё не подавали заявок.</div>
        </div>
      </div>
    </div>
  )
}
