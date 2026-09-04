import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { ROLES } from '../types'

export default function Login() {
  const login = useAuth((s) => s.login)
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    const result = login(email, password)
    if (!result.ok) {
      setError(result.error)
      return
    }
    const user = useAuth.getState().currentUser
    navigate(user ? ROLES[user.role].dashboardPath : '/login')
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md rounded-xl border border-border bg-white p-8 shadow-sm">
        <div className="mb-1 text-[11px] font-medium uppercase tracking-[0.12em] text-purple">Портал колледжа</div>
        <h1 className="mb-6 text-2xl font-semibold text-ink">Вход</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-ink-muted">Email</label>
            <input
              type="email"
              className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-purple"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@college.ru"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-semibold text-ink-muted">Пароль</label>
            <input
              type="password"
              className="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-purple"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••"
            />
          </div>

          {error && <div className="rounded-md bg-red-light px-3 py-2 text-[12px] text-red">{error}</div>}

          <button
            type="submit"
            className="w-full rounded-md bg-purple px-3 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            Войти
          </button>
        </form>

        <p className="mt-5 text-center text-[13px] text-ink-muted">
          Нет аккаунта?{' '}
          <Link to="/register" className="font-semibold text-purple">Зарегистрироваться</Link>
        </p>
      </div>
    </div>
  )
}
