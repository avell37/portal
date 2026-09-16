import { Download, Wrench } from "lucide-react";
import { useTickets } from "@/entities/ticket";
import { useAuth } from "@/entities/session";
import { StatusBadge } from "./badges";

export default function MyTickets() {
    const currentUser = useAuth((s) => s.currentUser);
    const tickets = useTickets().filter((t) => t.authorEmail === currentUser?.email);

    return (
        <div className="space-y-2">
            {tickets.map((t) => (
                <div key={t.id} className="flex flex-wrap items-center gap-3 rounded-[16px] border border-border bg-white p-4">
                    <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] ${t.type === "Неисправность" ? "bg-red-light text-red" : "bg-blue-light text-blue"}`}>
                        {t.type === "Неисправность" ? <Wrench size={16} /> : <Download size={16} />}
                    </span>
                    <div className="min-w-40 flex-1">
                        <div className="text-[14px] font-semibold text-auth-black">Ауд. {t.room} · {t.pc}</div>
                        <div className="mt-0.5 text-[12px] text-auth-gray">{t.detail}</div>
                    </div>
                    <StatusBadge status={t.status} />
                    <span className="text-[12px] text-auth-gray">{t.date}</span>
                </div>
            ))}
            {tickets.length === 0 && <div className="py-8 text-center text-[14px] text-auth-gray">У вас пока нет заявок</div>}
        </div>
    );
}
