import type { RetakeStudent } from "./types";

// Как и GROUPS/STUDENTS в entities/group-student — этой детализации нет в
// реальной таблице (там только годовой контингент/пересдачи по
// направлению-курсу, см. CONTINGENT), список пересдач по студентам придуман
// для демонстрации сценария из ТЗ "Модуль учебного отдела".
export const RETAKE_STUDENTS: RetakeStudent[] = [
    {
        id: 1,
        name: "Громов П. И.",
        group: "ИТ-23",
        items: [
            {
                subject: "Математика",
                teacher: "Козлов А. В.",
                room: "201",
                score: 38,
                attempts: [
                    { num: 1, date: "15 января 2026, 16:00", result: "failed" },
                    { num: 2, date: "23 января 2026, 15:00", result: "scheduled" },
                    { num: 3, date: "20 ноября 2026 (крайний срок)", result: "waiting" },
                ],
            },
            {
                subject: "Основы ОС",
                teacher: "Иванова С. М.",
                room: "206",
                score: 29,
                attempts: [
                    { num: 1, date: "16 января 2026, 14:00", result: "failed" },
                    { num: 2, date: "22 января 2026, 16:00", result: "failed" },
                    { num: 3, date: "20 ноября 2026 (крайний срок)", result: "waiting" },
                ],
            },
            {
                subject: "Английский язык",
                teacher: "Морозова Е. А.",
                room: "205",
                score: 41,
                attempts: [{ num: 1, date: "18 января 2026, 15:00", result: "passed" }],
            },
            {
                subject: "Физика",
                teacher: "Петрова Н. И.",
                room: "104",
                score: 33,
                attempts: [{ num: 1, date: "Слот не назначен", result: "waiting" }],
            },
        ],
    },
    {
        id: 2,
        name: "Ким А. В.",
        group: "ИТ-23",
        items: [
            {
                subject: "Математика",
                teacher: "Круглова Дарья",
                room: "201",
                score: 21,
                attempts: [{ num: 1, date: "5 октября 2026, 11:00", result: "scheduled" }],
            },
            {
                subject: "Введение в ОС",
                teacher: "Попов Александр",
                room: "206",
                score: 36,
                attempts: [{ num: 1, date: "8 октября 2026, 17:10", result: "scheduled" }],
            },
            {
                subject: "Информац. техн. в совр. мире",
                teacher: "Смирнова Елена",
                room: "205",
                score: 50,
                attempts: [{ num: 1, date: "9 октября 2026, 13:00", result: "passed" }],
            },
            {
                subject: "Основы управления проектами",
                teacher: "Васильев Илья",
                room: "104",
                score: 0,
                attempts: [{ num: 1, date: "13 октября 2026, 11:00", result: "waiting" }],
            },
        ],
    },
    {
        id: 3,
        name: "Захарова М. Е.",
        group: "ИБ-24",
        items: [
            { subject: "Английский язык", teacher: "Морозова Е. А.", room: "205", score: 48, attempts: [{ num: 1, date: "25 января 2026, 15:00", result: "scheduled" }] },
        ],
    },
    {
        id: 4,
        name: "Алиев Д. Р.",
        group: "ИТ-24",
        items: [
            { subject: "Основы ОС", teacher: "Иванова С. М.", room: "206", score: 35, attempts: [{ num: 1, date: "Слот не назначен", result: "waiting" }] },
            { subject: "Математика", teacher: "Козлов А. В.", room: "201", score: 40, attempts: [{ num: 1, date: "Слот не назначен", result: "waiting" }] },
        ],
    },
];

/** Тот же приём, что findStudentByFullName в entities/group-student —
 * связывает залогиненного demo-студента с его записью здесь по фамилии. */
export function findRetakeStudentByFullName(fullName: string): RetakeStudent | undefined {
    const surname = fullName.trim().split(/\s+/)[0];
    return RETAKE_STUDENTS.find((s) => s.name.split(/\s+/)[0] === surname);
}

export function subjectGroups() {
    const map = new Map<string, { teacher: string; students: { student: RetakeStudent; item: RetakeStudent["items"][number] }[] }>();
    for (const student of RETAKE_STUDENTS) {
        for (const item of student.items) {
            const cur = map.get(item.subject) ?? { teacher: item.teacher, students: [] };
            cur.students.push({ student, item });
            map.set(item.subject, cur);
        }
    }
    return Array.from(map.entries()).map(([subject, v]) => ({ subject, ...v }));
}
