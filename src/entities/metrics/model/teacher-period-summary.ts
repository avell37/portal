export interface TeacherPeriodSummary {
    period: string;
    direction: "Профильные" | "Общеобразовательные";
    avgScore: number;
    // Реальные фамилии из листа "Таблица преподаватели" (столбец "Зона
    // внимания") — те же люди, что и в TEACHER_SOP, но другой срез (не
    // СОП-опрос, а отдельная оценка руководителя учебного отдела по
    // периодам). Не анонимизировано по той же причине, что и TEACHER_SOP —
    // источник хранится только локально, наружу не публикуется.
    watchList: string[];
}

// Источник: "Метрика актуальная.xlsx" — лист "Таблица преподаватели".
export const TEACHER_PERIOD_SUMMARY: TeacherPeriodSummary[] = [
    { period: "1 сем 2024-2025 год", direction: "Профильные", avgScore: 4, watchList: ["Бесклетко", "Селищева"] },
    { period: "1 сем 2024-2025 год", direction: "Общеобразовательные", avgScore: 4, watchList: ["Дорохин", "Демура"] },
    { period: "2 сем 2024-2025 год", direction: "Профильные", avgScore: 4, watchList: ["Наумкин", "Саргис", "Селищева"] },
    { period: "2 сем 2024-2025 год", direction: "Общеобразовательные", avgScore: 4.3, watchList: ["Дорохин"] },
    { period: "1 сем 2025-2026 год", direction: "Профильные", avgScore: 3.7, watchList: ["Харитонова"] },
    { period: "1 сем 2025-2026 год", direction: "Общеобразовательные", avgScore: 4, watchList: ["Тюханова"] },
    { period: "2 сем 2025-2026 год", direction: "Профильные", avgScore: 4, watchList: ["Каменев", "Боков"] },
    { period: "2 сем 2025-2026 год", direction: "Общеобразовательные", avgScore: 3.9, watchList: ["Коробова", "Перова"] },
];
