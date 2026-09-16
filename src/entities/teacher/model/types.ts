export type TeacherType = "Профильный" | "Общеобразовательный";

export interface Teacher {
    id: number;
    name: string;
    type: TeacherType;
    subject: string;
    teamlead: string;
}

export type OuFlag = "ok" | "repeat" | "escalated";

export interface OuRecord {
    id: string;
    teacherId: number;
    date: string;
    ratings: number[];
    avg: number;
    comment: string;
    flag: OuFlag;
}
