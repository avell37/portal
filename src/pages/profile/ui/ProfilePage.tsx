import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '@/entities/session'
import { ROLES } from '@/entities/user'

function getInitials(fullName: string) {
  const parts = fullName.trim().split(/\s+/).filter(Boolean)
  return (parts[0]?.[0] ?? '') + (parts[1]?.[0] ?? '')
}

export default function ProfilePage() {
  const currentUser = useAuth((s) => s.currentUser)
  const resetPassword = useAuth((s) => s.resetPassword)
  const navigate = useNavigate()

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [saved, setSaved] = useState(false)

  if (!currentUser) return null
  const role = ROLES[currentUser.role]

  function handleChangePassword() {
    setError('')
    setSaved(false)
    if (newPassword.length < 4) {
      setError('Пароль слишком короткий')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Пароли не совпадают')
      return
    }
    const result = resetPassword(currentUser!.email, newPassword)
    if (!result.ok) {
      setError(result.error)
      return
    }
    setNewPassword('')
    setConfirmPassword('')
    setSaved(true)
  }

  return (
    <div>
      <h1 className="text-[22px] font-semibold text-auth-black">Профиль</h1>
      <p className="mt-1 text-[14px] text-auth-gray">Личные данные и пароль</p>

      <div className="mt-6 max-w-lg space-y-4">
        <div className="flex items-center gap-4 rounded-[16px] border border-border bg-white p-4">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-auth-primary text-[18px] font-semibold text-white">
            {getInitials(currentUser.fullName)}
          </span>
          <div>
            <div className="text-[15px] font-semibold text-auth-black">{currentUser.fullName}</div>
            <div className="text-[13px] text-auth-gray">{currentUser.email}</div>
            <span
              className="mt-1.5 inline-block rounded-full px-2.5 py-0.5 text-[11px] font-semibold"
              style={{ background: role.colorLight, color: role.color }}
            >
              {role.label}
            </span>
          </div>
        </div>

        <div className="rounded-[16px] border border-border bg-white p-4">
          <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Сменить пароль</div>
          <div className="space-y-3">
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase text-auth-gray">Новый пароль</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full rounded-[14px] border border-border bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-auth-primary"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[11px] font-semibold uppercase text-auth-gray">Повторите пароль</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-[14px] border border-border bg-white px-3.5 py-2.5 text-[14px] outline-none focus:border-auth-primary"
              />
            </div>
            {error && <div className="text-[13px] font-semibold text-red">{error}</div>}
            {saved && <div className="text-[13px] font-semibold text-green">✓ Пароль обновлён</div>}
            <button
              onClick={handleChangePassword}
              className="rounded-[14px] bg-auth-primary px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
            >
              Сохранить
            </button>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="text-[13px] font-semibold text-auth-primary hover:opacity-75"
        >
          ← Назад
        </button>
      </div>
    </div>
  )
}
