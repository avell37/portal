import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Bell, CalendarClock, FileEdit, Home } from "lucide-react";
import { useAuth } from "@/entities/session";
import { AppTopbar } from "@/widgets/app-topbar";
import { AppSidebar } from "@/widgets/app-sidebar";

const NAV_ITEMS = [
    { path: "/student", label: "Главная", icon: Home, end: true },
    { path: "/student/retakes", label: "Пересдачи", icon: CalendarClock },
    { path: "/student/tickets", label: "Заявки", icon: FileEdit },
    { path: "/student/notifications", label: "Уведомления", icon: Bell },
];

export default function StudentLayout() {
    const currentUser = useAuth((s) => s.currentUser);
    const [mobileNavOpen, setMobileNavOpen] = useState(false);

    if (!currentUser) return null;

    return (
        <div className="flex min-h-screen bg-auth-bg">
            <AppSidebar items={NAV_ITEMS} isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

            <div className="flex min-w-0 flex-1 flex-col bg-auth-bg">
                <AppTopbar onMenuClick={() => setMobileNavOpen(true)} />
                <main className="flex-1 overflow-y-auto rounded-xl bg-white p-4 sm:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
