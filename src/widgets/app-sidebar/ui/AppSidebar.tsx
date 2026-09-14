import { NavLink } from "react-router-dom";
import { X } from "lucide-react";
import logo from "@/shared/assets/images/logo.png";

export interface AppSidebarItem {
    path: string;
    label: string;
    icon: React.ComponentType<{ size?: number; color?: string }>;
    end?: boolean;
}

const BADGE_COLORS = [
    { bg: "var(--color-blue-light)", fg: "var(--color-blue)" },
    { bg: "var(--color-purple-light)", fg: "var(--color-purple)" },
    { bg: "var(--color-amber-light)", fg: "var(--color-amber)" },
];

interface AppSidebarProps {
    items: AppSidebarItem[];
    isOpen: boolean;
    onClose: () => void;
}

export default function AppSidebar({ items, isOpen, onClose }: AppSidebarProps) {
    return (
        <>
            {isOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 md:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-60 shrink-0 flex-col bg-auth-bg px-4 py-5 transition-transform duration-200 md:static md:z-auto md:translate-x-0 ${
                    isOpen ? "translate-x-0" : "-translate-x-full"
                }`}
            >
                <div className="mb-8 flex items-center justify-between px-2">
                    <img src={logo} alt="IThub" width={167} height={64} className="h-16 w-auto" />
                    <button
                        type="button"
                        aria-label="Закрыть меню"
                        onClick={onClose}
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-auth-gray transition-colors hover:bg-white md:hidden"
                    >
                        <X size={20} />
                    </button>
                </div>

                <nav className="flex flex-col gap-1.5">
                    {items.map((item, i) => {
                        const Icon = item.icon;
                        const badge = BADGE_COLORS[i % BADGE_COLORS.length]!;
                        return (
                            <NavLink
                                key={item.path}
                                to={item.path}
                                end={item.end}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 rounded-[14px] px-3 py-2.5 text-[14px] font-medium transition-colors ${
                                        isActive ? "bg-auth-primary text-white" : "text-auth-black hover:bg-white"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <span
                                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px]"
                                            style={{ background: isActive ? "rgba(255,255,255,0.2)" : badge.bg }}
                                        >
                                            <Icon size={16} color={isActive ? "white" : badge.fg} />
                                        </span>
                                        {item.label}
                                    </>
                                )}
                            </NavLink>
                        );
                    })}
                </nav>
            </aside>
        </>
    );
}
