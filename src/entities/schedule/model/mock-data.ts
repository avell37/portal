export interface ScheduleSlot {
    time: string;
    subject: string;
    teacher: string;
    room: string;
    current?: boolean;
}

// Демо "Расписание на сегодня" — макет Figma (Desktop student main) показывает
// именно такой блок, но ни в одной реальной сущности расписания по дням нет
// (LXP её не отдаёт ни в одном из подключённых источников), поэтому это
// фиксированный демо-список, как и STUDENTS/RETAKE_STUDENTS.
export const TODAY_SCHEDULE: ScheduleSlot[] = [
    { time: "10:00 – 11:30", subject: "История", teacher: "Круглова Дарья Ивановна", room: "Лекторий 1", current: true },
    { time: "11:40 – 13:10", subject: "Основы предпринимательства", teacher: "Васильев Илья Русланович", room: "Лекторий 2" },
    { time: "14:00 – 15:30", subject: "Математика", teacher: "Круглова Дарья Семёновна", room: "201" },
    { time: "15:40 – 17:10", subject: "Английский язык, уровень A1", teacher: "Перова Дарья Васильевна", room: "205" },
];
