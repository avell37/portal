import { NavLink, Outlet, useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import {
    Bell,
    CalendarClock,
    ChevronDown,
    FileEdit,
    Home,
    LogOut,
    User,
} from "lucide-react";
import { useAuth } from "@/entities/session";
import logo from "@/shared/assets/images/logo.png";

const NAV_ITEMS = [
    { path: "/student", label: "Главная", icon: Home, end: true },
    { path: "/student/retakes", label: "Пересдачи", icon: CalendarClock },
    { path: "/student/tickets", label: "Заявки", icon: FileEdit },
    { path: "/student/notifications", label: "Уведомления", icon: Bell },
] as const;

const BADGE_COLORS = [
    { bg: "var(--color-blue-light)", fg: "var(--color-blue)" },
    { bg: "var(--color-purple-light)", fg: "var(--color-purple)" },
    { bg: "var(--color-amber-light)", fg: "var(--color-amber)" },
] as const;

function getInitials(fullName: string) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export default function StudentLayout() {
    const currentUser = useAuth((s) => s.currentUser);
    const logout = useAuth((s) => s.logout);
    const navigate = useNavigate();

    if (!currentUser) return null;

    function handleLogout() {
        logout();
        navigate("/login");
    }

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
                    {NAV_ITEMS.map((item, i) => {
                        const Icon = item.icon;
                        const badge = BADGE_COLORS[i % BADGE_COLORS.length]!;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={"end" in item ? item.end : undefined}
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
                <header className="flex items-center justify-end gap-4 px-8 py-3.5">
                    <button
                        type="button"
                        aria-label="Уведомления"
                        className="relative flex h-10 w-10 items-center justify-center rounded-full text-auth-gray transition-colors hover:bg-auth-bg"
                    >
                        <Bell size={20} />
                        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-auth-error" />
                    </button>

                    <DropdownMenu.Root>
                        <DropdownMenu.Trigger asChild>
                            <button
                                type="button"
                                className="flex items-center gap-1.5 rounded-full outline-none"
                            >
                                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-auth-primary text-[13px] font-semibold text-white">
                                    {getInitials(currentUser.fullName)}
                                </span>
                                <ChevronDown
                                    size={16}
                                    className="text-auth-gray"
                                />
                            </button>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Portal>
                            <DropdownMenu.Content
                                align="end"
                                sideOffset={8}
                                className="z-50 min-w-[220px] rounded-[14px] border border-border bg-white p-1.5 shadow-[0_8px_24px_rgba(44,44,42,0.12)]"
                            >
                                <div className="px-3 py-2">
                                    <div className="text-[13px] font-semibold text-auth-black">
                                        {currentUser.fullName}
                                    </div>
                                    <div className="text-[12px] text-auth-gray">
                                        {currentUser.email}
                                    </div>
                                </div>
                                <DropdownMenu.Separator className="my-1 h-px bg-border" />
                                <DropdownMenu.Item className="flex cursor-pointer items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13px] font-medium text-auth-black outline-none transition-colors data-[highlighted]:bg-auth-bg">
                                    <User size={16} />
                                    Профиль
                                </DropdownMenu.Item>
                                <DropdownMenu.Item
                                    onSelect={handleLogout}
                                    className="flex cursor-pointer items-center gap-2.5 rounded-[10px] px-3 py-2 text-[13px] font-medium text-auth-error outline-none transition-colors data-[highlighted]:bg-auth-error/10"
                                >
                                    <LogOut size={16} />
                                    Выйти
                                </DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                    </DropdownMenu.Root>
                </header>

                <main className="flex-1 overflow-y-auto bg-white p-8 rounded-xl">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
