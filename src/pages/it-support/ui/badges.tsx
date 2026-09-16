import type { TicketStatus, TicketType } from "@/entities/ticket";

const STATUS_CLASS: Record<TicketStatus, string> = {
    "Новая": "bg-gray-light text-gray",
    "В работе": "bg-amber-light text-amber",
    "Выполнено": "bg-green-light text-green",
    "Отклонена": "bg-red-light text-red",
};

export function StatusBadge({ status }: { status: TicketStatus }) {
    return <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${STATUS_CLASS[status]}`}>{status}</span>;
}

const TYPE_CLASS: Record<TicketType, string> = {
    "Неисправность": "bg-red-light text-red",
    "Установка ПО": "bg-blue-light text-blue",
};

export function TypeBadge({ type }: { type: TicketType }) {
    return <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${TYPE_CLASS[type]}`}>{type}</span>;
}
