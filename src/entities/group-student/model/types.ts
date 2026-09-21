export type Zone = "red" | "yellow" | "green";

export interface Checkpoint {
    name: string;
    max: number;
    got: number;
    deadline: string;
    status: "сдано" | "просрочено" | "активна";
}

export interface Subject {
    name: string;
    pct: number;
    zone: Zone;
    kts: Checkpoint[];
}

export interface Student {
    id: number;
    name: string;
    group: string;
    subjects: Subject[];
}

export interface Group {
    name: string;
    curator: string;
    // Демо-привязка группы к конкретному demo-логину куратора — реальной
    // модели "у куратора N групп" в проекте нет, эмулируем на этом поле.
    curatorEmail?: string;
}

export interface Talk {
    id: string;
    studentId: number;
    date: string;
    content: string;
    agreements: string;
    zoneAtTime: Zone;
}
