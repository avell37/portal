import type { OuRecord, Teacher } from "./types";

// Отдельный, полностью вымышленный список преподавателей для сценария
// "Открытые уроки" (назначение/история) — намеренно НЕ переиспользует реальные
// имена из TEACHER_SOP (entities/metrics): там реальные люди с реальными
// оценками из гугл-таблицы, приписывать им ещё и придуманную историю ОУ
// было бы недобросовестно. Имена/структура — как в исходном прототипе
// portal_college.html.
export const TEACHERS: Teacher[] = [
    { id: 1, name: "Иванова С. М.", type: "Профильный", subject: "Математика", teamlead: "Козлов А. В." },
    { id: 2, name: "Козлов А. В.", type: "Профильный", subject: "Физика", teamlead: "Морозова Е. А." },
    { id: 3, name: "Морозова Е. А.", type: "Общеобразовательный", subject: "История", teamlead: "Иванова С. В." },
    { id: 4, name: "Петрова Н. И.", type: "Общеобразовательный", subject: "Английский", teamlead: "Иванова С. В." },
];

export const OU_SEED: OuRecord[] = [
    { id: "seed-1", teacherId: 1, date: "15 мая 2026", ratings: [5, 4, 4, 5, 4], avg: 4.5, comment: "Хорошая структура, студенты вовлечены", flag: "ok" },
    { id: "seed-2", teacherId: 1, date: "12 марта 2026", ratings: [3, 3, 3, 3, 3], avg: 3.0, comment: "Слабая обратная связь", flag: "repeat" },
    { id: "seed-3", teacherId: 2, date: "10 мая 2026", ratings: [3, 3, 4, 3, 3], avg: 3.2, comment: "Темп слишком высокий", flag: "repeat" },
    { id: "seed-4", teacherId: 3, date: "20 мая 2026", ratings: [4, 4, 5, 4, 4], avg: 4.3, comment: "Хорошая подача материала", flag: "ok" },
    { id: "seed-5", teacherId: 4, date: "12 мая 2026", ratings: [5, 4, 5, 5, 4], avg: 4.6, comment: "Отличная вовлечённость группы", flag: "ok" },
];
