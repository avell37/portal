import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role, User } from '../types'

interface AuthState {
  users: User[]
  currentUser: User | null
  register: (fullName: string, email: string, password: string, role: Role) => { ok: true } | { ok: false; error: string }
  login: (email: string, password: string) => { ok: true } | { ok: false; error: string }
  logout: () => void
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,

      register: (fullName, email, password, role) => {
        const normalizedEmail = email.trim().toLowerCase()
        if (get().users.some((u) => u.email === normalizedEmail)) {
          return { ok: false, error: 'Пользователь с таким email уже зарегистрирован' }
        }
        const user: User = {
          id: crypto.randomUUID(),
          fullName: fullName.trim(),
          email: normalizedEmail,
          password,
          role,
        }
        set((s) => ({ users: [...s.users, user], currentUser: user }))
        return { ok: true }
      },

      login: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        const user = get().users.find((u) => u.email === normalizedEmail && u.password === password)
        if (!user) {
          return { ok: false, error: 'Неверный email или пароль' }
        }
        set({ currentUser: user })
        return { ok: true }
      },

      logout: () => set({ currentUser: null }),
    }),
    { name: 'portal-auth' },
  ),
)
