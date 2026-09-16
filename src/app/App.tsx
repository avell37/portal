import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { ForgotPasswordPage } from "@/pages/forgot-password";
import { DirectorPage } from "@/pages/director";
import { ITSupportPage } from "@/pages/it-support";
import { UchebnyPage } from "@/pages/uchebny";
import { TeacherAnalyticsPage } from "@/pages/teacher-analytics";
import { VospitatelniyPage } from "@/pages/vospitatelniy";
import { ProfilePage } from "@/pages/profile";
import { StudentPage } from "@/pages/student";
import MyRetakesPage from "@/pages/student/ui/MyRetakesPage";
import MyTicketsPage from "@/pages/student/ui/MyTicketsPage";
import MyNotificationsPage from "@/pages/student/ui/MyNotificationsPage";
import { DashboardLayout } from "@/widgets/dashboard-layout";
import { StudentLayout } from "@/widgets/student-layout";
import { useAuth } from "@/entities/session";
import { ROLES } from "@/entities/user";
import ProtectedRoute from "./providers/ProtectedRoute";

function Home() {
    const currentUser = useAuth((s) => s.currentUser);
    if (!currentUser) return <Navigate to="/login" replace />;
    return <Navigate to={ROLES[currentUser.role].dashboardPath} replace />;
}

/** /profile — единственный маршрут, общий сразу для всех ролей (не привязан
 * к дашборду сотрудников или кабинету студента). DashboardLayout/StudentLayout
 * сами рендерят свой <Outlet/>, поэтому просто выбираем нужную оболочку по
 * роли, а не дублируем один и тот же path в двух ветках роутов — с
 * одинаковым абсолютным path в двух местах react-router оставит достижимой
 * только первую и всегда покажет ту же оболочку независимо от роли. */
function ProfileLayout() {
    const currentUser = useAuth((s) => s.currentUser);
    if (!currentUser) return null;
    return currentUser.role === "student" ? <StudentLayout /> : <DashboardLayout />;
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/" element={<Home />} />

            <Route
                element={
                    <ProtectedRoute>
                        <DashboardLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/director" element={<DirectorPage />} />
                <Route path="/it-support" element={<ITSupportPage />} />
                <Route path="/uchebny" element={<UchebnyPage />} />
                <Route
                    path="/teacher-analytics"
                    element={<TeacherAnalyticsPage />}
                />
                <Route path="/vospitatelniy" element={<VospitatelniyPage />} />
            </Route>

            <Route
                element={
                    <ProtectedRoute>
                        <StudentLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/student" element={<StudentPage />} />
                <Route path="/student/retakes" element={<MyRetakesPage />} />
                <Route path="/student/tickets" element={<MyTicketsPage />} />
                <Route
                    path="/student/notifications"
                    element={<MyNotificationsPage />}
                />
            </Route>

            <Route
                element={
                    <ProtectedRoute>
                        <ProfileLayout />
                    </ProtectedRoute>
                }
            >
                <Route path="/profile" element={<ProfilePage />} />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
