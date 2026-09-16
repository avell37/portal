import { useState } from "react";
import type { AttemptResult } from "@/entities/retake";
import { RETAKE_STUDENTS, notifyStudent, useNotificationsForStudent } from "@/entities/retake";

const RESULT_LABEL: Record<AttemptResult, string> = {
    passed: "Сдал",
    failed: "Не сдал",
    waiting: "Ожидает",
    scheduled: "Назначена",
};

const RESULT_CLASS: Record<AttemptResult, string> = {
    passed: "bg-green-light text-green",
    failed: "bg-red-light text-red",
    waiting: "bg-gray-light text-gray",
    scheduled: "bg-blue-light text-blue",
};

interface RetakeStudentCardProps {
    studentId: number;
    canNotify: boolean;
    onBack?: () => void;
}

export default function RetakeStudentCard({ studentId, canNotify, onBack }: RetakeStudentCardProps) {
    const student = RETAKE_STUDENTS.find((s) => s.id === studentId)!;
    const [openSubject, setOpenSubject] = useState<string | null>(null);
    const [notified, setNotified] = useState(false);
    const notifs = useNotificationsForStudent(studentId);
    const onSecondAttempt = student.items.filter((i) => {
        const latest = i.attempts[i.attempts.length - 1];
        return latest && latest.num >= 2 && latest.result !== "passed";
    }).length;

    function handleNotify() {
        const subjects = student.items.map((i) => i.subject).join(", ");
        notifyStudent(studentId, `Уведомление о пересдачах: ${subjects}`);
        setNotified(true);
        setTimeout(() => setNotified(false), 2500);
    }

    return (
        <div>
            {onBack && (
                <button onClick={onBack} className="mb-3 text-[13px] font-semibold text-auth-primary hover:opacity-75">
                    ← Вернуться к списку
                </button>
            )}

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-auth-primary p-4">
                <div>
                    <div className="text-[15px] font-semibold text-white">{student.name}</div>
                    <div className="mt-1 text-[12px] text-white/70">Группа {student.group}</div>
                </div>
                <div className="flex gap-2">
                    <div className="rounded-[12px] bg-white/15 px-4 py-1.5 text-center">
                        <div className="text-xl font-bold text-white">{student.items.length}</div>
                        <div className="text-[10px] text-white/70">предметов</div>
                    </div>
                    <div className="rounded-[12px] bg-white/15 px-4 py-1.5 text-center">
                        <div className="text-xl font-bold text-white">{onSecondAttempt}</div>
                        <div className="text-[10px] text-white/70">на 2-й+ попытке</div>
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                {student.items.map((item) => {
                    const isOpen = openSubject === item.subject;
                    const latest = item.attempts[item.attempts.length - 1]!;
                    return (
                        <div key={item.subject} className="overflow-hidden rounded-[14px] border border-border bg-white">
                            <div
                                onClick={() => setOpenSubject(isOpen ? null : item.subject)}
                                className="flex cursor-pointer flex-wrap items-center justify-between gap-2 px-4 py-3 hover:bg-gray-light"
                            >
                                <div className="flex items-center gap-2.5">
                                    <span className="text-[13px] font-semibold text-auth-black">{item.subject}</span>
                                    <span className="rounded-[4px] bg-red-light px-2 py-0.5 text-[11px] font-semibold text-red">{item.score} б</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className="text-[11px] text-auth-gray">Попытка {latest.num} из 3</span>
                                    <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${RESULT_CLASS[latest.result]}`}>{RESULT_LABEL[latest.result]}</span>
                                    <span className="text-auth-gray">{isOpen ? "▴" : "▾"}</span>
                                </div>
                            </div>
                            {isOpen && (
                                <div className="space-y-1.5 border-t border-border bg-gray-light px-4 py-3">
                                    {item.attempts.map((a) => (
                                        <div key={a.num} className="flex flex-wrap items-center gap-2 border-b border-dashed border-border py-1.5 text-[12px] last:border-none">
                                            <span className="min-w-[70px] font-semibold text-auth-gray">Попытка {a.num}</span>
                                            <span className="flex-1 text-auth-black">{a.date}</span>
                                            <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${RESULT_CLASS[a.result]}`}>{RESULT_LABEL[a.result]}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {canNotify && (
                <button
                    onClick={handleNotify}
                    className="mt-4 rounded-[14px] bg-auth-primary px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                    {notified ? "✓ Студент уведомлён" : "📨 Уведомить студента"}
                </button>
            )}

            {notifs.length > 0 && (
                <div className="mt-4 rounded-[14px] bg-gray-light p-3.5">
                    <div className="mb-2 text-[11px] font-semibold uppercase text-auth-gray">История уведомлений</div>
                    {notifs.map((n) => (
                        <div key={n.id} className="flex gap-2 py-0.5 text-[12px] text-auth-gray">
                            <span className="min-w-[85px]">{n.date}</span>
                            <span>{n.text}</span>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
