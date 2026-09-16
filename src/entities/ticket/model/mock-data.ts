import type { Ticket } from "./types";

// Заявителей привязали к реальным demo-аккаунтам (student@ithub.demo,
// teamlead@ithub.demo — играет роль "преподавателя", отдельной роли teacher
// в демо нет), чтобы вкладка "Мои заявки" сразу показывала что-то осмысленное
// при входе под этими логинами.
export const INITIAL_TICKETS: Ticket[] = [
    {
        id: "1",
        type: "Неисправность",
        room: "204",
        pc: "ПК-07",
        detail: "Не включается компьютер",
        authorEmail: "student@ithub.demo",
        authorName: "Ким Алина Вадимовна",
        status: "Новая",
        date: "07 июн, 09:14",
    },
    {
        id: "2",
        type: "Установка ПО",
        room: "301",
        pc: "Вся аудитория",
        softwareName: "Adobe Photoshop",
        detail: "Adobe Photoshop",
        authorEmail: "teamlead@ithub.demo",
        authorName: "Козлов Артём Викторович",
        status: "В работе",
        date: "06 июн, 14:30",
    },
    {
        id: "3",
        type: "Неисправность",
        room: "112",
        pc: "ПК-03",
        detail: "Не работает мышь",
        authorEmail: "teamlead@ithub.demo",
        authorName: "Козлов Артём Викторович",
        status: "Выполнено",
        date: "05 июн, 11:00",
    },
    {
        id: "4",
        type: "Неисправность",
        room: "204",
        pc: "ПК-12",
        detail: "Не работает монитор",
        authorEmail: "student@ithub.demo",
        authorName: "Ким Алина Вадимовна",
        status: "Отклонена",
        date: "04 июн, 16:22",
    },
];
