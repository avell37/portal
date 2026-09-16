import { useSyncExternalStore } from "react";
import type { Notification } from "./types";

const STORAGE_KEY = "portal-retake-notifs-v1";

function loadInitial(): Notification[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as Notification[];
    } catch {
        // ignore malformed/blocked storage and fall back to an empty log
    }
    return [];
}

let notifs: Notification[] = loadInitial();
const listeners = new Set<() => void>();
// See the same note in talks-store.ts — cache per studentId so
// useSyncExternalStore gets a stable reference between renders.
const byStudentCache = new Map<number, Notification[]>();

function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notifs));
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

export function notifyStudent(studentId: number, text: string) {
    notifs = [{ id: crypto.randomUUID(), studentId, date: new Date().toLocaleDateString("ru"), text }, ...notifs];
    persist();
}

function getSnapshotForStudent(studentId: number): Notification[] {
    const cached = byStudentCache.get(studentId);
    if (cached) return cached;
    const computed = notifs.filter((n) => n.studentId === studentId);
    byStudentCache.set(studentId, computed);
    return computed;
}

export function useNotificationsForStudent(studentId: number): Notification[] {
    return useSyncExternalStore(subscribe, () => getSnapshotForStudent(studentId));
}
