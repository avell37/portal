export type TicketType = "Неисправность" | "Установка ПО";
export type TicketStatus = "Новая" | "В работе" | "Выполнено" | "Отклонена";

export interface Ticket {
    id: string;
    type: TicketType;
    room: string;
    pc: string;
    softwareName?: string;
    detail: string;
    authorEmail: string;
    authorName: string;
    status: TicketStatus;
    date: string;
}
