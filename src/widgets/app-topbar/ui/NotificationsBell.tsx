import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import { Bell } from "lucide-react";
import { useNotifications } from "./useNotifications";

export default function NotificationsBell() {
    const items = useNotifications();

    return (
        <DropdownMenu.Root>
            <DropdownMenu.Trigger asChild>
                <button
                    type="button"
                    aria-label="Уведомления"
                    className="relative flex h-10 w-10 items-center justify-center rounded-full text-auth-gray transition-colors hover:bg-auth-bg"
                >
                    <Bell size={20} />
                    {items.length > 0 && <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-auth-error" />}
                </button>
            </DropdownMenu.Trigger>

            <DropdownMenu.Portal>
                <DropdownMenu.Content
                    align="end"
                    sideOffset={8}
                    className="z-50 max-h-[360px] w-[320px] overflow-y-auto rounded-[14px] border border-border bg-white p-1.5 shadow-[0_8px_24px_rgba(44,44,42,0.12)]"
                >
                    <div className="px-3 py-2 text-[11px] font-semibold uppercase text-auth-gray">
                        Уведомления {items.length > 0 ? `(${items.length})` : ""}
                    </div>
                    <DropdownMenu.Separator className="mb-1 h-px bg-border" />
                    {items.length === 0 ? (
                        <div className="px-3 py-6 text-center text-[13px] text-auth-gray">Новых уведомлений нет</div>
                    ) : (
                        items.map((n) => (
                            <div key={n.id} className="rounded-[10px] px-3 py-2 text-[13px] text-auth-black hover:bg-auth-bg">
                                {n.text}
                                {n.date && <div className="mt-0.5 text-[11px] text-auth-gray">{n.date}</div>}
                            </div>
                        ))
                    )}
                </DropdownMenu.Content>
            </DropdownMenu.Portal>
        </DropdownMenu.Root>
    );
}
