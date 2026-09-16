import { useSyncExternalStore } from "react";
import { OU_SEED } from "./mock-data";
import type { OuRecord } from "./types";

const STORAGE_KEY = "portal-ou-records-v1";

function loadInitial(): OuRecord[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as OuRecord[];
    } catch {
        // ignore malformed/blocked storage and fall back to the seeded demo history
    }
    return OU_SEED;
}

let records: OuRecord[] = loadInitial();
const listeners = new Set<() => void>();
// See the same note in talks-store.ts — cache per teacherId so
// useSyncExternalStore gets a stable reference between renders.
const byTeacherCache = new Map<number, OuRecord[]>();

function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    } catch {
        // storage unavailable (private mode, quota) — state still works in-memory
    }
    byTeacherCache.clear();
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/** Требует повторного ОУ при оценке ≤ 3; если и повторный снова ≤ 3 —
 * эскалируется директору (см. portal_teacher_analytics.html, схема 1.2). */
export function addOu(teacherId: number, ratings: number[], comment: string) {
    const filled = ratings.filter((r) => r > 0);
    const avg = filled.length ? Math.round((filled.reduce((a, b) => a + b, 0) / filled.length) * 10) / 10 : 0;
    const previous = records.find((r) => r.teacherId === teacherId);
    const flag: OuRecord["flag"] = avg > 3 ? "ok" : previous?.flag === "repeat" ? "escalated" : "repeat";
    records = [
        { id: crypto.randomUUID(), teacherId, date: new Date().toLocaleDateString("ru", { day: "2-digit", month: "long", year: "numeric" }), ratings, avg, comment, flag },
        ...records,
    ];
    persist();
}

function getSnapshotForTeacher(teacherId: number): OuRecord[] {
    const cached = byTeacherCache.get(teacherId);
    if (cached) return cached;
    const computed = records.filter((r) => r.teacherId === teacherId);
    byTeacherCache.set(teacherId, computed);
    return computed;
}

export function useOuHistory(teacherId: number): OuRecord[] {
    return useSyncExternalStore(subscribe, () => getSnapshotForTeacher(teacherId));
}

/** Все записи разом (для колокольчика уведомлений — не нужно вызывать
 * useOuHistory в цикле по каждому преподавателю). `records` — тот же
 * стабильный module-level массив, переприсваивается только в persist(). */
export function useOuRecords(): OuRecord[] {
    return useSyncExternalStore(subscribe, () => records);
}

export function averageOf(history: OuRecord[]): number | null {
    if (!history.length) return null;
    return Math.round((history.reduce((s, r) => s + r.avg, 0) / history.length) * 10) / 10;
}
