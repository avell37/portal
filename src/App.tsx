import { Navigate, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Register from './pages/Register'
import Layout from './components/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import DirectorDashboard from './pages/dashboards/DirectorDashboard'
import ITSupport from './pages/dashboards/ITSupport'
import UchebnyOtdel from './pages/dashboards/UchebnyOtdel'
import TeacherAnalytics from './pages/dashboards/TeacherAnalytics'
import Vospitatelniy from './pages/dashboards/Vospitatelniy'
import StudentDashboard from './pages/dashboards/StudentDashboard'
import { useAuth } from './store/auth'
import { ROLES } from './types'

function Home() {
  const currentUser = useAuth((s) => s.currentUser)
  if (!currentUser) return <Navigate to="/login" replace />
  return <Navigate to={ROLES[currentUser.role].dashboardPath} replace />
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/" element={<Home />} />

      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/director" element={<DirectorDashboard />} />
        <Route path="/it-support" element={<ITSupport />} />
        <Route path="/uchebny" element={<UchebnyOtdel />} />
        <Route path="/teacher-analytics" element={<TeacherAnalytics />} />
        <Route path="/vospitatelniy" element={<Vospitatelniy />} />
        <Route path="/student" element={<StudentDashboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
