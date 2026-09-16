import { useState } from "react";
import { Download, Wrench } from "lucide-react";
import { setTicketStatus, useTickets, type TicketStatus } from "@/entities/ticket";
import { StatusBadge, TypeBadge } from "./badges";

const FILTERS: (TicketStatus | "Все")[] = ["Все", "Новая", "В работе", "Выполнено", "Отклонена"];

export default function AdminTickets() {
    const tickets = useTickets();
    const [filter, setFilter] = useState<TicketStatus | "Все">("Все");
    const visible = filter === "Все" ? tickets : tickets.filter((t) => t.status === filter);

    return (
        <div>
            <div className="mb-3 flex flex-wrap gap-2">
                {FILTERS.map((f) => (
                    <button
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                            filter === f ? "bg-auth-primary text-white" : "bg-gray-light text-gray hover:opacity-80"
                        }`}
                    >
                        {f}
                    </button>
                ))}
            </div>

            <div className="space-y-2">
                {visible.map((t) => (
                    <div key={t.id} className="flex flex-wrap items-center gap-3 rounded-[16px] border border-border bg-white p-4">
                        <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${t.type === "Неисправность" ? "bg-red-light text-red" : "bg-blue-light text-blue"}`}>
                            {t.type === "Неисправность" ? <Wrench size={16} /> : <Download size={16} />}
                        </span>
                        <div className="min-w-40 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                                <span className="text-[14px] font-semibold text-auth-black">Ауд. {t.room} · {t.pc}</span>
                                <TypeBadge type={t.type} />
                            </div>
                            <div className="mt-0.5 text-[12px] text-auth-gray">{t.authorName} · {t.detail}</div>
                        </div>
                        <StatusBadge status={t.status} />
                        <span className="text-[12px] text-auth-gray">{t.date}</span>

                        {t.status === "Новая" && (
                            <button
                                onClick={() => setTicketStatus(t.id, "В работе")}
                                className="rounded-[10px] bg-auth-primary px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
                            >
                                Взять в работу
                            </button>
                        )}
                        {t.status === "В работе" && (
                            <div className="flex gap-1.5">
                                <button
                                    onClick={() => setTicketStatus(t.id, "Выполнено")}
                                    className="rounded-[10px] bg-green px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
                                >
                                    Выполнено
                                </button>
                                <button
                                    onClick={() => setTicketStatus(t.id, "Отклонена")}
                                    className="rounded-[10px] border border-border bg-white px-3 py-1.5 text-[12px] font-semibold text-red transition-colors hover:bg-gray-light"
                                >
                                    Отклонить
                                </button>
                            </div>
                        )}
                    </div>
                ))}
                {visible.length === 0 && <div className="py-8 text-center text-[14px] text-auth-gray">Заявок нет</div>}
            </div>
        </div>
    );
}
