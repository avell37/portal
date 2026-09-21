import { useSyncExternalStore } from "react";
import type { Talk, Zone } from "./types";

const STORAGE_KEY = "portal-talks-v1";

function loadInitial(): Talk[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as Talk[];
    } catch {
        // ignore malformed/blocked storage and fall back to an empty log
    }
    return [];
}

let talks: Talk[] = loadInitial();
const listeners = new Set<() => void>();
// getSnapshot must return a *stable* reference per studentId between renders
// (see the same note in auth-store.ts) — a fresh .filter() array on every
// call would make React think the store changes every render and loop
// forever, so cache per studentId and only recompute after a real write.
const byStudentCache = new Map<number, Talk[]>();

function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(talks));
    } catch {
        // storage unavailable (private mode, quota) — state still works in-memory
    }
    byStudentCache.clear();
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

export function addTalk(studentId: number, content: string, agreements: string, zoneAtTime: Zone) {
    talks = [
        {
            id: crypto.randomUUID(),
            studentId,
            date: new Date().toLocaleDateString("ru"),
            content,
            agreements,
            zoneAtTime,
        },
        ...talks,
    ];
    persist();
}

function getSnapshotForStudent(studentId: number): Talk[] {
    const cached = byStudentCache.get(studentId);
    if (cached) return cached;
    const computed = talks.filter((t) => t.studentId === studentId);
    byStudentCache.set(studentId, computed);
    return computed;
}

export function useTalksForStudent(studentId: number): Talk[] {
    return useSyncExternalStore(subscribe, () => getSnapshotForStudent(studentId));
}

/** Все записи разом — для «Активности кураторов» (см. ou-store.ts,
 * useOuRecords — тот же приём, `talks` стабилен между рендерами,
 * переприсваивается только в persist()). */
export function useAllTalks(): Talk[] {
    return useSyncExternalStore(subscribe, () => talks);
}
