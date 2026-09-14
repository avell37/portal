import { useState } from "react";
import { Outlet } from "react-router-dom";
import {
    BookOpen,
    GraduationCap,
    LayoutDashboard,
    Monitor,
    Users,
} from "lucide-react";
import { useAuth } from "@/entities/session";
import { AppTopbar } from "@/widgets/app-topbar";
import { AppSidebar } from "@/widgets/app-sidebar";

const NAV_ITEMS = [
    {
        path: "/director",
        label: "Дашборд директора",
        icon: LayoutDashboard,
        roles: ["director"],
    },
    {
        path: "/uchebny",
        label: "Учебный отдел",
        icon: BookOpen,
        roles: ["director", "uchebny_head"],
    },
    {
        path: "/teacher-analytics",
        label: "Преподаватели",
        icon: GraduationCap,
        roles: ["director", "uchebny_head", "teamlead"],
    },
    {
        path: "/vospitatelniy",
        label: "Воспитательный отдел",
        icon: Users,
        roles: ["director", "vospitatelny_head", "curator"],
    },
    {
        path: "/it-support",
        label: "IT-поддержка",
        icon: Monitor,
        roles: ["director", "it_admin"],
    },
];

export default function DashboardLayout() {
    const currentUser = useAuth((s) => s.currentUser);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    if (!currentUser) return null;
    const items = NAV_ITEMS.filter((i) => i.roles.includes(currentUser.role));

    return (
        <div className="flex min-h-screen bg-auth-bg">
            <AppSidebar items={items} isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col bg-auth-bg">
                <AppTopbar onMenuClick={() => setMobileNavOpen(true)} />
                <main className="flex-1 overflow-y-auto rounded-xl bg-white p-4 sm:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
