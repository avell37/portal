import { useMemo, useState } from "react";
import { RETAKE_STUDENTS, subjectGroups } from "@/entities/retake";

const VIEW_TABS = [
    { id: "byStudent", label: "По студентам" },
    { id: "bySubject", label: "По предметам" },
] as const;

type ViewId = (typeof VIEW_TABS)[number]["id"];

interface RetakesListProps {
    students: typeof RETAKE_STUDENTS;
    canFormList: boolean;
    onFormList: () => void;
    onSelectStudent: (id: number) => void;
}

export default function RetakesList({ students, canFormList, onFormList, onSelectStudent }: RetakesListProps) {
    const [view, setView] = useState<ViewId>("byStudent");
    const [formed, setFormed] = useState(false);

    const subjects = useMemo(() => subjectGroups().filter((sg) => sg.students.some((x) => students.includes(x.student))), [students]);
    const totalRetakes = students.reduce((s, st) => s + st.items.length, 0);
    const with2Plus = students.filter((s) => s.items.length >= 2).length;
    const subjectCount = new Set(students.flatMap((s) => s.items.map((i) => i.subject))).size;

    return (
        <div>
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
                <div className="text-[13px] font-semibold text-auth-black">Список пересдач — 1-й семестр 2025/2026</div>
                {canFormList && (
                    <button
                        onClick={() => {
                            onFormList();
                            setFormed(true);
                            setTimeout(() => setFormed(false), 2500);
                        }}
                        className="rounded-[14px] bg-auth-primary px-4 py-2 text-[13px] font-semibold text-white transition-opacity hover:opacity-90"
                    >
                        {formed ? "✓ Список сформирован из LXP" : "📥 Сформировать список из LXP"}
                    </button>
                )}
            </div>

            <div className="mb-4 flex flex-wrap gap-4 rounded-[14px] bg-gray-light px-4 py-2.5 text-[12px] text-auth-gray">
                <span>Студентов: <b className="text-auth-black">{students.length}</b></span>
                <span>Предметов: <b className="text-auth-black">{subjectCount}</b></span>
                <span>Пересдач всего: <b className="text-auth-black">{totalRetakes}</b></span>
                <span>С 2+ предметами: <b className="text-red">{with2Plus}</b></span>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
                {VIEW_TABS.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setView(t.id)}
                        className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                            view === t.id ? "bg-auth-primary text-white" : "bg-gray-light text-gray hover:opacity-80"
                        }`}
                    >
                        {t.label}
                    </button>
                ))}
            </div>

            {view === "byStudent" ? (
                <div className="space-y-2">
                    {[...students]
                        .sort((a, b) => b.items.length - a.items.length)
                        .map((s) => (
                            <div
                                key={s.id}
                                onClick={() => onSelectStudent(s.id)}
                                className="flex cursor-pointer flex-wrap items-center gap-3 rounded-[14px] border border-border bg-white px-3.5 py-2.5 transition-colors hover:bg-purple-light"
                            >
                                <span className="min-w-[140px] text-[13px] font-semibold text-auth-black">{s.name}</span>
                                <span className="min-w-[55px] text-[11px] text-auth-gray">{s.group}</span>
                                <div className="flex flex-1 flex-wrap gap-1.5">
                                    {s.items.slice(0, 3).map((i) => (
                                        <span key={i.subject} className="rounded-full bg-red-light px-2 py-0.5 text-[11px] font-semibold text-red">{i.subject}</span>
                                    ))}
                                    {s.items.length > 3 && <span className="rounded-full bg-gray-light px-2 py-0.5 text-[11px] text-auth-gray">+{s.items.length - 3} ещё</span>}
                                </div>
                                <span className="rounded-full bg-purple-light px-2.5 py-0.5 text-[11px] font-semibold text-purple">{s.items.length} предм.</span>
                            </div>
                        ))}
                    {students.length === 0 && (
                        <div className="rounded-[14px] border border-dashed border-border bg-white py-8 text-center text-[13px] text-auth-gray">Пересдач нет</div>
                    )}
                </div>
            ) : (
                <div className="space-y-2">
                    {subjects.map((sg) => (
                        <div key={sg.subject} className="overflow-hidden rounded-[14px] border border-border bg-white">
                            <div className="flex flex-wrap items-center justify-between gap-2 bg-gray-light px-4 py-3">
                                <div>
                                    <div className="text-[13px] font-semibold text-auth-black">{sg.subject}</div>
                                    <div className="text-[11px] text-auth-gray">Преп. {sg.teacher}</div>
                                </div>
                                <span className="rounded-full bg-purple-light px-2.5 py-0.5 text-[12px] font-semibold text-purple">{sg.students.length} студентов</span>
                            </div>
                            <div className="divide-y divide-border px-4">
                                {sg.students.map(({ student, item }) => (
                                    <div
                                        key={student.id}
                                        onClick={() => onSelectStudent(student.id)}
                                        className="flex cursor-pointer items-center justify-between py-2 text-[13px] hover:text-auth-primary"
                                    >
                                        <span>{student.name} <span className="text-[11px] text-auth-gray">({student.group})</span></span>
                                        <span className="rounded-[4px] bg-red-light px-2 py-0.5 text-[11px] font-semibold text-red">{item.score} б</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    {subjects.length === 0 && (
                        <div className="rounded-[14px] border border-dashed border-border bg-white py-8 text-center text-[13px] text-auth-gray">Пересдач нет</div>
                    )}
                </div>
            )}
        </div>
    );
}
