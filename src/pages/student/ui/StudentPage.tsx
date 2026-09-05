import { useAuth } from '@/entities/session'

export default function StudentPage() {
  const currentUser = useAuth((s) => s.currentUser)

  return (
    <div>
      <h1 className="text-[22px] font-semibold text-auth-black">Главная</h1>
      <p className="mt-1 text-[14px] text-auth-gray">
        Добро пожаловать, {currentUser?.fullName ?? ''}
      </p>

      <div className="mt-8 flex h-64 items-center justify-center rounded-[20px] border border-dashed border-border bg-white text-[14px] text-auth-gray">
        Дашборд скоро появится здесь
      </div>
    </div>
  )
}
