import { useSyncExternalStore } from "react";

export interface RetakeTask {
    subject: string;
    fileName: string;
    uploadedAt: string;
    uploadedBy: string;
}

const STORAGE_KEY = "portal-retake-tasks-v1";

function loadInitial(): RetakeTask[] {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return JSON.parse(raw) as RetakeTask[];
    } catch {
        // ignore malformed/blocked storage and fall back to an empty list
    }
    return [];
}

let tasks: RetakeTask[] = loadInitial();
const listeners = new Set<() => void>();

function persist() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch {
        // storage unavailable (private mode, quota) — state still works in-memory
    }
    listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
}

/** Один активный файл задания на предмет — новая загрузка заменяет
 * прежнюю (см. ТЗ: "на 2-ю и 3-ю попытку задание может меняться").
 * Реального хранилища файлов нет — как и у остальных file-полей в
 * портале (заявки, СОП и т.д.), сохраняем только имя файла. */
export function uploadTask(subject: string, fileName: string, uploadedBy: string) {
    const entry: RetakeTask = { subject, fileName, uploadedAt: new Date().toLocaleDateString("ru"), uploadedBy };
    tasks = [entry, ...tasks.filter((t) => t.subject !== subject)];
    persist();
}

export function useAllTasks(): RetakeTask[] {
    return useSyncExternalStore(subscribe, () => tasks);
}

export function useTaskForSubject(subject: string): RetakeTask | undefined {
    return useAllTasks().find((t) => t.subject === subject);
}
