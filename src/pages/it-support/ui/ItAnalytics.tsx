import { useMemo } from "react";
import { useTickets } from "@/entities/ticket";
import { StatCard } from "@/shared/ui";

export default function ItAnalytics() {
    const tickets = useTickets();

    const byType = useMemo(() => {
        const repair = tickets.filter((t) => t.type === "Неисправность").length;
        const install = tickets.filter((t) => t.type === "Установка ПО").length;
        return [
            { label: "Неисправности", value: repair, color: "var(--color-red)" },
            { label: "Установка ПО", value: install, color: "var(--color-blue)" },
        ];
    }, [tickets]);

    const byRoom = useMemo(() => {
        const map = new Map<string, number>();
        for (const t of tickets) map.set(t.room, (map.get(t.room) ?? 0) + 1);
        return Array.from(map.entries())
            .map(([room, count]) => ({ room, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 6);
    }, [tickets]);

    const maxType = Math.max(1, ...byType.map((r) => r.value));
    const maxRoom = Math.max(1, ...byRoom.map((r) => r.count));

    return (
        <div>
            <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <StatCard value={tickets.length} label="Всего заявок" color="var(--color-amber)" />
                <StatCard value={tickets.filter((t) => t.status === "Новая" || t.status === "В работе").length} label="Открытых" color="var(--color-amber-deep)" />
                <StatCard value={tickets.filter((t) => t.status === "Выполнено").length} label="Выполнено" color="var(--color-green)" />
                <StatCard value={tickets.filter((t) => t.status === "Отклонена").length} label="Отклонено" color="var(--color-red)" />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
                <div className="min-w-0 rounded-[16px] border border-border bg-white p-4">
                    <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">По типу заявки</div>
                    {byType.map((r) => (
                        <div key={r.label} className="mb-2 flex items-center gap-2">
                            <span className="min-w-[110px] text-[12px] text-auth-black">{r.label}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-light">
                                <div className="h-full rounded-full" style={{ width: `${(r.value / maxType) * 100}%`, background: r.color }} />
                            </div>
                            <span className="min-w-[24px] text-right text-[12px] font-bold text-auth-black">{r.value}</span>
                        </div>
                    ))}
                </div>
                <div className="min-w-0 rounded-[16px] border border-border bg-white p-4">
                    <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Проблемные аудитории</div>
                    {byRoom.map((r) => (
                        <div key={r.room} className="mb-2 flex items-center gap-2">
                            <span className="min-w-[70px] text-[12px] text-auth-black">Ауд. {r.room}</span>
                            <div className="h-2 flex-1 overflow-hidden rounded-full bg-gray-light">
                                <div className="h-full rounded-full bg-red" style={{ width: `${(r.count / maxRoom) * 100}%` }} />
                            </div>
                            <span className="min-w-[24px] text-right text-[12px] font-bold text-red">{r.count}</span>
                        </div>
                    ))}
                    {byRoom.length === 0 && <div className="text-[12px] text-auth-gray">Нет данных</div>}
                </div>
            </div>
        </div>
    );
}
