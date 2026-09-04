export type Role =
    | "director"
    | "uchebny_head"
    | "vospitatelny_head"
    | "curator"
    | "teamlead"
    | "it_admin"
    | "student";

export interface RoleMeta {
    label: string;
    color: string;
    colorLight: string;
    dashboardPath: string;
}

export const ROLES: Record<Role, RoleMeta> = {
    director: {
        label: "Директор",
        color: "var(--color-purple)",
        colorLight: "var(--color-purple-light)",
        dashboardPath: "/director",
    },
    uchebny_head: {
        label: "Руководитель учебного отдела",
        color: "var(--color-blue)",
        colorLight: "var(--color-blue-light)",
        dashboardPath: "/uchebny",
    },
    vospitatelny_head: {
        label: "Руководитель воспитательного отдела",
        color: "var(--color-teal)",
        colorLight: "var(--color-teal-light)",
        dashboardPath: "/vospitatelniy",
    },
    curator: {
        label: "Куратор",
        color: "var(--color-teal)",
        colorLight: "var(--color-teal-light)",
        dashboardPath: "/vospitatelniy",
    },
    teamlead: {
        label: "Тимлидер",
        color: "var(--color-purple)",
        colorLight: "var(--color-purple-light)",
        dashboardPath: "/teacher-analytics",
    },
    it_admin: {
        label: "Сис. администратор",
        color: "var(--color-amber)",
        colorLight: "var(--color-amber-light)",
        dashboardPath: "/it-support",
    },
    student: {
        label: "Студент",
        color: "var(--color-gray)",
        colorLight: "var(--color-gray-light)",
        dashboardPath: "/student",
    },
};

export interface User {
    id: string;
    fullName: string;
    email: string;
    role: Role;
    password: string;
}
