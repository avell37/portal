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
}

export interface Talk {
    id: string;
    studentId: number;
    date: string;
    content: string;
    agreements: string;
    zoneAtTime: Zone;
}
