import { NavLink, Outlet } from "react-router-dom";
import {
    BookOpen,
    GraduationCap,
    LayoutDashboard,
    Monitor,
    Users,
} from "lucide-react";
import { useAuth } from "@/entities/session";
import { AppTopbar } from "@/widgets/app-topbar";
import logo from "@/shared/assets/images/logo.png";

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

const BADGE_COLORS = [
    { bg: "var(--color-blue-light)", fg: "var(--color-blue)" },
    { bg: "var(--color-purple-light)", fg: "var(--color-purple)" },
    { bg: "var(--color-amber-light)", fg: "var(--color-amber)" },
];

export default function DashboardLayout() {
    const currentUser = useAuth((s) => s.currentUser);

    if (!currentUser) return null;
    const items = NAV_ITEMS.filter((i) => i.roles.includes(currentUser.role));

    return (
        <div className="flex min-h-screen bg-auth-bg">
            <aside className="flex w-60 shrink-0 flex-col bg-auth-bg px-4 py-5">
                <div className="mb-8 flex items-center px-2">
                    <img
                        src={logo}
                        alt="IThub"
                        width={167}
                        height={64}
                        className="h-16 mr-auto w-auto"
                    />
                </div>

                <nav className="flex flex-col gap-1.5">
                    {items.map((item, i) => {
                        const Icon = item.icon;
                        const badge = BADGE_COLORS[i % BADGE_COLORS.length]!;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-[14px] font-medium transition-colors ${
                                        isActive
                                            ? "bg-auth-primary text-white"
                                            : "text-auth-black hover:bg-auth-bg"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
                                            style={{
                                                background: isActive
                                                    ? "rgba(255,255,255,0.2)"
                                                    : badge.bg,
                                            }}
                                        >
                                            <Icon
                                                size={16}
                                                color={
                                                    isActive
                                                        ? "white"
                                                        : badge.fg
                                                }
                                            />
                                        </span>
                                        {item.label}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>

            <div className="flex min-w-0 flex-1 flex-col bg-auth-bg">
                <AppTopbar />
                <main className="flex-1 overflow-y-auto bg-white p-8 rounded-xl">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
