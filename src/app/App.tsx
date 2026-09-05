import { Navigate, Route, Routes } from "react-router-dom";
import { LoginPage } from "@/pages/login";
import { ForgotPasswordPage } from "@/pages/forgot-password";
import { DirectorPage } from "@/pages/director";
import { ITSupportPage } from "@/pages/it-support";
import { UchebnyPage } from "@/pages/uchebny";
import { TeacherAnalyticsPage } from "@/pages/teacher-analytics";
import { VospitatelniyPage } from "@/pages/vospitatelniy";
import { StudentPage } from "@/pages/student";
import { DashboardLayout } from "@/widgets/dashboard-layout";
import { StudentLayout } from "@/widgets/student-layout";
import { useAuth } from "@/entities/session";
import { ROLES } from "@/entities/user";
import { PlaceholderPage } from "@/shared/ui";
import ProtectedRoute from "./providers/ProtectedRoute";

function Home() {
    const currentUser = useAuth((s) => s.currentUser);
    if (!currentUser) return <Navigate to="/login" replace />;
    return <Navigate to={ROLES[currentUser.role].dashboardPath} replace />;
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
                <Route
                    path="/student/retakes"
                    element={<PlaceholderPage title="Пересдачи" />}
                />
                <Route
                    path="/student/tickets"
                    element={<PlaceholderPage title="Заявки" />}
                />
                <Route
                    path="/student/notifications"
                    element={<PlaceholderPage title="Уведомления" />}
                />
            </Route>

            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
