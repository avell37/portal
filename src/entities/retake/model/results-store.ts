import { useSyncExternalStore } from "react";
import { RETAKE_STUDENTS } from "./mock-data";
import type { RetakeAttempt, RetakeItem, RetakeStudent } from "./types";

const STORAGE_KEY = "portal-retake-results-v1";

interface Override {
    attempts: RetakeAttempt[];
    expelled: boolean;
}

function key(studentId: number, subject: string) {
    return `${studentId}::${subject}`;
}

function loadInitial(): Record<string, Override> {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as Record<string, Override>;
    } catch {
        // ignore malformed/blocked storage and fall back to no overrides
    }
    return {};
}

let overrides: Record<string, Override> = loadInitial();
const listeners = new Set<() => void>();

function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
    } catch {
        // storage unavailable (private mode, quota) — state still works in-memory
    }
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

const RU_MONTHS: Record<string, number> = {
    "января": 0, "февраля": 1, "марта": 2, "апреля": 3, "мая": 4, "июня": 5,
    "июля": 6, "августа": 7, "сентября": 8, "октября": 9, "ноября": 10, "декабря": 11,
};
const RU_MONTHS_BY_INDEX = Object.keys(RU_MONTHS);

function parseRuDate(s: string): Date | null {
    const m = s.match(/(\d{1,2})\s+([а-яё]+)\s+(\d{4})(?:,\s*(\d{1,2}):(\d{2}))?/i);
    if (!m) return null;
    const month = RU_MONTHS[m[2]!.toLowerCase()];
    if (month === undefined) return null;
    return new Date(+m[3]!, month, +m[1]!, m[4] ? +m[4] : 0, m[5] ? +m[5] : 0);
}

function formatRuDate(d: Date): string {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${d.getDate()} ${RU_MONTHS_BY_INDEX[d.getMonth()]} ${d.getFullYear()}, ${hh}:${mm}`;
}

/** Минимум 2 недели между попытками (см. ТЗ, Схема 4.1) — если исходную
 * дату не удаётся разобрать (например "Слот не назначен"), честно пишем
 * текстом вместо придуманной даты. */
function earliestNextDate(prevDate: string): string {
    const d = parseRuDate(prevDate);
    if (!d) return "не ранее чем через 2 недели после предыдущей попытки";
    d.setDate(d.getDate() + 14);
    return formatRuDate(d);
}

function baseItem(studentId: number, subject: string): RetakeItem | undefined {
    return RETAKE_STUDENTS.find((s) => s.id === studentId)?.items.find((i) => i.subject === subject);
}

export type RetakeResult = "passed" | "failed" | "no-show";

/** Руководитель учебного отдела вносит результат последней попытки —
 * сдал/не сдал/не явился. Не сдал/не явился на попытке < 3 автоматически
 * создаёт следующую попытку не раньше чем через 2 недели; на 3-й попытке —
 * помечает предмет "подлежит отчислению" вместо новой попытки. */
export function recordResult(studentId: number, subject: string, result: RetakeResult) {
    const base = baseItem(studentId, subject);
    if (!base) return;
    const k = key(studentId, subject);
    const current = overrides[k];
    const attempts = current ? [...current.attempts] : [...base.attempts];
    const last = attempts[attempts.length - 1];
    if (!last) return;

    const finalResult = result === "passed" ? "passed" : "failed";
    attempts[attempts.length - 1] = { ...last, result: finalResult };

    let expelled = current?.expelled ?? false;
    if (finalResult === "failed") {
        if (last.num >= 3) {
            expelled = true;
        } else {
            attempts.push({ num: last.num + 1, date: earliestNextDate(last.date), result: "waiting" });
        }
    }

    overrides = { ...overrides, [k]: { attempts, expelled } };
    persist();
}

function effectiveItems(student: RetakeStudent): RetakeItem[] {
    return student.items.map((item) => {
        const o = overrides[key(student.id, item.subject)];
        if (!o) return item;
        return { ...item, attempts: o.attempts, expelled: o.expelled };
    });
}

export function useEffectiveItems(studentId: number): RetakeItem[] {
    useSyncExternalStore(subscribe, () => overrides);
    const student = RETAKE_STUDENTS.find((s) => s.id === studentId);
    return student ? effectiveItems(student) : [];
}

/** Для панели "внести результаты пакетом" — все студенты с их актуальными
 * (учитывающими override) предметами разом. */
export function useEffectiveRetakeStudents(): (RetakeStudent & { items: RetakeItem[] })[] {
    useSyncExternalStore(subscribe, () => overrides);
    return RETAKE_STUDENTS.map((s) => ({ ...s, items: effectiveItems(s) }));
}
