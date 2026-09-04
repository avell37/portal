import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../store/auth'
import { ROLES } from '../types'

const NAV_ITEMS = [
  { path: '/director', label: 'Дашборд директора', roles: ['director'] },
  { path: '/uchebny', label: 'Учебный отдел', roles: ['director', 'uchebny_head'] },
  { path: '/teacher-analytics', label: 'Преподаватели', roles: ['director', 'uchebny_head', 'teamlead'] },
  { path: '/vospitatelniy', label: 'Воспитательный отдел', roles: ['director', 'vospitatelny_head', 'curator'] },
  { path: '/it-support', label: 'IT-поддержка', roles: ['director', 'it_admin'] },
  { path: '/student', label: 'Личный кабинет', roles: ['student'] },
]

export default function Layout() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  if (!currentUser) return null
  const meta = ROLES[currentUser.role]
  const items = NAV_ITEMS.filter((i) => i.roles.includes(currentUser.role))

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <aside className="flex w-60 shrink-0 flex-col border-r border-border bg-white">
        <div className="border-b border-border px-5 py-5">
          <div className="text-sm font-semibold text-ink">Портал колледжа</div>
          <div className="mt-1 text-[11px] text-ink-faint">IThub</div>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `block rounded-md px-3 py-2 text-[13px] font-medium transition-colors ${
                  isActive ? 'bg-purple text-white' : 'text-ink-muted hover:bg-gray-light'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="border-t border-border p-3">
          <div className="mb-2 rounded-md p-2.5" style={{ background: meta.colorLight }}>
            <div className="text-[13px] font-semibold text-ink">{currentUser.fullName}</div>
            <div className="mt-0.5 text-[11px]" style={{ color: meta.color }}>{meta.label}</div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full rounded-md px-3 py-2 text-[13px] font-medium text-ink-muted transition-colors hover:bg-gray-light"
          >
            Выйти
          </button>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
