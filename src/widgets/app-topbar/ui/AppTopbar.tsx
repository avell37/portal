import { useNavigate } from "react-router-dom";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell, ChevronDown, LogOut, User } from "lucide-react";
import { useAuth } from "@/entities/session";

function getInitials(fullName: string) {
    const parts = fullName.trim().split(/\s+/).filter(Boolean);
    return (parts[0]?.[0] ?? "") + (parts[1]?.[0] ?? "");
}

export default function AppTopbar() {
    const currentUser = useAuth((s) => s.currentUser);
    const logout = useAuth((s) => s.logout);
    const navigate = useNavigate();

    if (!currentUser) return null;

    function handleLogout() {
        logout();
        navigate("/login");
    }

    return (
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
                        <ChevronDown size={16} className="text-auth-gray" />
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
    );
}
