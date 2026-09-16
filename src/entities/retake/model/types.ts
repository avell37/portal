export type AttemptResult = "passed" | "failed" | "waiting" | "scheduled";

export interface RetakeAttempt {
    num: number;
    date: string;
    result: AttemptResult;
}

export interface RetakeItem {
    subject: string;
    teacher: string;
    room: string;
    score: number;
    attempts: RetakeAttempt[];
}

export interface RetakeStudent {
    id: number;
    name: string;
    group: string;
    items: RetakeItem[];
}

export interface Notification {
    id: string;
    studentId: number;
    date: string;
    text: string;
}
