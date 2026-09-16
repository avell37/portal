import { useMemo } from "react";
import { useAuth } from "@/entities/session";
import { useTickets } from "@/entities/ticket";
import { TEACHERS, useOuRecords } from "@/entities/teacher";
import { TEACHER_SOP } from "@/entities/metrics";
import { STUDENTS, GROUPS, studentZone } from "@/entities/group-student";
import { findRetakeStudentByFullName, useNotificationsForStudent } from "@/entities/retake";

export interface NotificationItem {
    id: string;
    text: string;
    date?: string;
}

/** Колокольчик в шапке общий для всех ролей (см. AppTopbar) — у каждой роли
 * своё представление о "новом событии", собранное из уже существующих
 * реальных источников (тикеты/ОУ/зоны/пересдачи), а не выдуманное с нуля:
 * - it_admin/director: новые (непринятые) IT-заявки
 * - teamlead/uchebny_head: ОУ с флагом "повторный"/"эскалация"
 * - uchebny_head/director: критические сигналы СОП (реальные данные)
 * - vospitatelny_head/curator/director: студенты в красной зоне
 * - student: уведомления о пересдачах (то же, что видит куратор при "Уведомить студента")
 * Хуки вызываются безусловно (правила хуков), фильтрация по роли — уже в selectItems. */
export function useNotifications(): NotificationItem[] {
    const currentUser = useAuth((s) => s.currentUser);
    const tickets = useTickets();
    const ouRecords = useOuRecords();
    const retakeStudent = currentUser ? findRetakeStudentByFullName(currentUser.fullName) : undefined;
    const retakeNotifs = useNotificationsForStudent(retakeStudent?.id ?? -1);

    return useMemo(() => {
        if (!currentUser) return [];
        const role = currentUser.role;
        const items: NotificationItem[] = [];

        const newTickets = () =>
            tickets
                .filter((t) => t.status === "Новая")
                .map((t) => ({ id: `ticket-${t.id}`, text: `Новая заявка: ауд. ${t.room} · ${t.authorName}`, date: t.date }));

        const ouFlags = () =>
            ouRecords
                .filter((r) => r.flag === "repeat" || r.flag === "escalated")
                .map((r) => {
                    const teacher = TEACHERS.find((t) => t.id === r.teacherId);
                    const label = r.flag === "escalated" ? "Эскалация директору" : "Требуется повторный ОУ";
                    return { id: `ou-${r.id}`, text: `${teacher?.name ?? "Преподаватель"} · ${label}`, date: r.date };
                });

        const sopCritical = () =>
            TEACHER_SOP.filter((t) => t.interest <= 3 || t.delivery <= 3 || t.feedback <= 3 || t.comfort <= 3).map((t) => ({
                id: `sop-${t.name}`,
                text: `Критический сигнал СОП: ${t.name}`,
            }));

        const redZone = (scopeGroup?: string) =>
            STUDENTS.filter((s) => (!scopeGroup || s.group === scopeGroup) && studentZone(s) === "red").map((s) => ({
                id: `zone-${s.id}`,
                text: `В красной зоне: ${s.name} (${s.group})`,
            }));

        if (role === "it_admin") items.push(...newTickets());
        if (role === "teamlead") items.push(...ouFlags());
        if (role === "uchebny_head") items.push(...ouFlags(), ...sopCritical());
        if (role === "vospitatelny_head") items.push(...redZone());
        if (role === "curator") items.push(...redZone(GROUPS[0]!.name));
        if (role === "student") items.push(...retakeNotifs.map((n) => ({ id: `retake-${n.id}`, text: n.text, date: n.date })));
        if (role === "director") items.push(...newTickets(), ...sopCritical(), ...redZone());

        return items;
    }, [currentUser, tickets, ouRecords, retakeNotifs]);
}
