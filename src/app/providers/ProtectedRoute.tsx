import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuth } from '@/entities/session'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const currentUser = useAuth((s) => s.currentUser)
  if (!currentUser) return <Navigate to="/login" replace />
  return <>{children}</>
}
