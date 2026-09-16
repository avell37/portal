import type { Group, Student } from "./types";

// Демо-данные drill-down уровня "группа → студент → карточка" — этой
// детализации нет в реальной гугл-таблице (там только агрегаты по
// направлению/курсу, см. CURATOR_ZONES), поэтому группы/студенты/КТ ниже
// придуманы для демонстрации сценария, как и DEMO_USERS.
export const GROUPS: Group[] = [
    { name: "ИТ-23", curator: "Морозова Е. В." },
    { name: "ИБ-24", curator: "Петров А. С." },
    { name: "ИТ-24", curator: "Козлова Н. А." },
];

export const STUDENTS: Student[] = [
    {
        id: 1,
        name: "Громов П. И.",
        group: "ИТ-23",
        subjects: [
            {
                name: "Математика",
                pct: 32,
                zone: "red",
                kts: [
                    { name: "КТ-1", max: 20, got: 6, deadline: "01.02", status: "просрочено" },
                    { name: "КТ-2", max: 20, got: 0, deadline: "15.02", status: "просрочено" },
                    { name: "КТ-3", max: 20, got: 8, deadline: "01.03", status: "сдано" },
                ],
            },
            {
                name: "Основы ОС",
                pct: 29,
                zone: "red",
                kts: [
                    { name: "КТ-1", max: 20, got: 5, deadline: "03.02", status: "просрочено" },
                    { name: "КТ-2", max: 20, got: 0, deadline: "18.02", status: "просрочено" },
                ],
            },
            {
                name: "Английский",
                pct: 72,
                zone: "green",
                kts: [
                    { name: "КТ-1", max: 20, got: 16, deadline: "05.02", status: "сдано" },
                    { name: "КТ-2", max: 20, got: 13, deadline: "20.02", status: "сдано" },
                ],
            },
            {
                name: "Физика",
                pct: 38,
                zone: "red",
                kts: [{ name: "КТ-1", max: 20, got: 8, deadline: "05.02", status: "просрочено" }],
            },
        ],
    },
    {
        id: 2,
        name: "Ким А. В.",
        group: "ИТ-23",
        subjects: [
            {
                name: "Математика",
                pct: 45,
                zone: "yellow",
                kts: [
                    { name: "КТ-1", max: 20, got: 9, deadline: "01.02", status: "сдано" },
                    { name: "КТ-2", max: 20, got: 0, deadline: "15.02", status: "просрочено" },
                ],
            },
            {
                name: "Физика",
                pct: 41,
                zone: "yellow",
                kts: [{ name: "КТ-1", max: 20, got: 8, deadline: "05.02", status: "сдано" }],
            },
            {
                name: "История",
                pct: 70,
                zone: "green",
                kts: [{ name: "КТ-1", max: 20, got: 14, deadline: "07.02", status: "сдано" }],
            },
        ],
    },
    {
        id: 3,
        name: "Захарова М. Е.",
        group: "ИБ-24",
        subjects: [
            {
                name: "Английский",
                pct: 65,
                zone: "green",
                kts: [{ name: "КТ-1", max: 20, got: 13, deadline: "04.02", status: "сдано" }],
            },
            {
                name: "Программирование",
                pct: 80,
                zone: "green",
                kts: [{ name: "КТ-1", max: 20, got: 16, deadline: "02.02", status: "сдано" }],
            },
        ],
    },
    {
        id: 4,
        name: "Алиев Д. Р.",
        group: "ИТ-24",
        subjects: [
            {
                name: "Основы ОС",
                pct: 28,
                zone: "red",
                kts: [{ name: "КТ-1", max: 20, got: 5, deadline: "03.02", status: "просрочено" }],
            },
            {
                name: "Математика",
                pct: 35,
                zone: "red",
                kts: [{ name: "КТ-1", max: 20, got: 7, deadline: "01.02", status: "просрочено" }],
            },
            {
                name: "Физика",
                pct: 61,
                zone: "green",
                kts: [{ name: "КТ-1", max: 20, got: 12, deadline: "05.02", status: "сдано" }],
            },
        ],
    },
    {
        id: 5,
        name: "Смирнова Е. А.",
        group: "ИТ-23",
        subjects: [
            {
                name: "Математика",
                pct: 78,
                zone: "green",
                kts: [{ name: "КТ-1", max: 20, got: 15, deadline: "01.02", status: "сдано" }],
            },
            {
                name: "Программирование",
                pct: 85,
                zone: "green",
                kts: [{ name: "КТ-1", max: 20, got: 17, deadline: "04.02", status: "сдано" }],
            },
        ],
    },
];

// Зона студента считается не по среднему баллу, а по количеству красных
// предметов (см. portal_vospitatelniy.html, схема 2.3 — те же пороги, что
// у фильтра): 3+ красных предмета — красная, 2 — жёлтая, 0-1 — зелёная.
export function studentZone(student: Student): "red" | "yellow" | "green" {
    const redCount = student.subjects.filter((s) => s.zone === "red").length;
    if (redCount >= 3) return "red";
    if (redCount === 2) return "yellow";
    return "green";
}

/** Связывает залогиненного демо-студента (DEMO_USERS.student, "Ким Алина
 * Вадимовна") с его записью в этом вымышленном списке — по фамилии
 * (первое слово), т.к. это два независимых демо-набора без общего id.
 * "Ким А. В." здесь и "Ким Алина Вадимовна" в DEMO_USERS совпадают не
 * случайно — тот же человек, для полноты сценария "студент смотрит на себя". */
export function findStudentByFullName(fullName: string): Student | undefined {
    const surname = fullName.trim().split(/\s+/)[0];
    return STUDENTS.find((s) => s.name.split(/\s+/)[0] === surname);
}
