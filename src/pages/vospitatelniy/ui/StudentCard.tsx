import { useState } from "react";
import { STUDENTS, studentZone, addTalk, useTalksForStudent } from "@/entities/group-student";
import ZoneBadge from "./ZoneBadge";

const STATUS_CLASS: Record<string, string> = {
    "сдано": "bg-green-light text-green",
    "просрочено": "bg-red-light text-red",
    "активна": "bg-blue-light text-blue",
};

interface StudentCardProps {
    studentId: number;
    canAddTalk: boolean;
    onBack?: () => void;
}

export default function StudentCard({ studentId, canAddTalk, onBack }: StudentCardProps) {
    const student = STUDENTS.find((s) => s.id === studentId)!;
    const [tab, setTab] = useState<"perf" | "talks">("perf");
    const [openSubject, setOpenSubject] = useState<string | null>(null);
    const [showForm, setShowForm] = useState(false);
    const [content, setContent] = useState("");
    const [agreements, setAgreements] = useState("");

    const zone = studentZone(student);
    const talks = useTalksForStudent(studentId);
    const redSubjects = student.subjects.filter((s) => s.zone === "red").length;

    function handleSave() {
        if (!content.trim()) return;
        addTalk(studentId, content.trim(), agreements.trim(), zone);
        setContent("");
        setAgreements("");
        setShowForm(false);
    }

    return (
        <div>
            {onBack && (
                <button onClick={onBack} className="mb-3 text-[13px] font-semibold text-auth-primary hover:opacity-75">
                    ← Назад к группе
                </button>
            )}

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-auth-primary p-4">
                <div>
                    <div className="text-[15px] font-semibold text-white">{student.name}</div>
                    <div className="mt-1 flex items-center gap-2 text-[12px] text-white/70">
                        <span>{student.group}</span>
                        <ZoneBadge zone={zone} />
                    </div>
                </div>
                <div className="rounded-[12px] bg-white/15 px-4 py-1.5 text-center">
                    <div className="text-xl font-bold text-white">{redSubjects}</div>
                    <div className="text-[10px] text-white/70">Красных предметов</div>
                </div>
            </div>

            <div className="mb-4 flex flex-wrap gap-2">
                <button
                    onClick={() => setTab("perf")}
                    className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                        tab === "perf" ? "bg-auth-primary text-white" : "bg-gray-light text-gray hover:opacity-80"
                    }`}
                >
                    Успеваемость
                </button>
                <button
                    onClick={() => setTab("talks")}
                    className={`rounded-full px-3.5 py-1.5 text-[13px] font-semibold transition-colors ${
                        tab === "talks" ? "bg-auth-primary text-white" : "bg-gray-light text-gray hover:opacity-80"
                    }`}
                >
                    Беседы{talks.length > 0 ? ` (${talks.length})` : ""}
                </button>
            </div>

            {tab === "perf" ? (
                <div className="space-y-2">
                    {student.subjects.map((subj) => {
                        const isOpen = openSubject === subj.name;
                        return (
                            <div key={subj.name} className="overflow-hidden rounded-[14px] border border-border bg-white">
                                <div
                                    onClick={() => setOpenSubject(isOpen ? null : subj.name)}
                                    className="flex cursor-pointer flex-wrap items-center justify-between gap-2 px-4 py-3 hover:bg-gray-light"
                                >
                                    <div className="flex items-center gap-2.5">
                                        <span
                                            className="h-2 w-2 shrink-0 rounded-full"
                                            style={{ background: subj.zone === "red" ? "var(--color-red)" : subj.zone === "yellow" ? "var(--color-amber)" : "var(--color-green)" }}
                                        />
                                        <span className="text-[13px] font-semibold text-auth-black">{subj.name}</span>
                                        <span className="text-[12px] text-auth-gray">{subj.pct}% выполнения</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <ZoneBadge zone={subj.zone} />
                                        <span className="text-auth-gray">{isOpen ? "▴" : "▾"}</span>
                                    </div>
                                </div>
                                {isOpen && (
                                    <div className="overflow-x-auto border-t border-border">
                                        <table className="w-full text-left text-[12px]">
                                            <thead>
                                                <tr className="border-b border-border text-[10px] uppercase text-auth-gray">
                                                    <th className="px-4 py-2 font-semibold">КТ</th>
                                                    <th className="px-3 py-2 font-semibold">Макс</th>
                                                    <th className="px-3 py-2 font-semibold">Набрано</th>
                                                    <th className="px-3 py-2 font-semibold">Дедлайн</th>
                                                    <th className="px-3 py-2 font-semibold">Статус</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {subj.kts.map((kt) => (
                                                    <tr key={kt.name} className="border-b border-border last:border-none">
                                                        <td className="px-4 py-2 font-semibold text-auth-black">{kt.name}</td>
                                                        <td className="px-3 py-2 text-auth-gray">{kt.max}</td>
                                                        <td className="px-3 py-2 text-auth-black">{kt.got}</td>
                                                        <td className="px-3 py-2 text-auth-gray">{kt.deadline}</td>
                                                        <td className="px-3 py-2">
                                                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_CLASS[kt.status]}`}>{kt.status}</span>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div>
                    {talks.length === 0 && (
                        <div className="mb-3 rounded-[14px] border-l-4 border-blue bg-blue-light p-3.5 text-[12px] text-blue">
                            Бесед пока не проводилось.
                        </div>
                    )}
                    <div className="space-y-2">
                        {talks.map((t) => (
                            <div key={t.id} className="rounded-[14px] border border-border bg-white p-3.5">
                                <div className="mb-1.5 flex items-center justify-between">
                                    <span className="text-[11px] text-auth-gray">{t.date}</span>
                                    <ZoneBadge zone={t.zoneAtTime} />
                                </div>
                                <div className="text-[13px] text-auth-black"><b>Содержание:</b> {t.content}</div>
                                {t.agreements && <div className="mt-1 text-[13px] text-auth-black"><b>Договорённости:</b> {t.agreements}</div>}
                            </div>
                        ))}
                    </div>

                    {canAddTalk && (
                        <div className="mt-3">
                            {!showForm ? (
                                <button
                                    onClick={() => setShowForm(true)}
                                    className="rounded-[14px] bg-auth-primary px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                                >
                                    + Добавить запись о беседе
                                </button>
                            ) : (
                                <div className="rounded-[16px] border border-border bg-white p-4">
                                    <div className="mb-3 text-[12px] font-semibold uppercase text-auth-gray">Новая запись</div>
                                    <div className="mb-3">
                                        <label className="mb-1.5 block text-[11px] font-semibold uppercase text-auth-gray">Содержание беседы</label>
                                        <textarea
                                            value={content}
                                            onChange={(e) => setContent(e.target.value)}
                                            placeholder="Кратко — о чём говорили"
                                            rows={3}
                                            className="w-full resize-none rounded-[14px] border border-border bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-auth-primary"
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="mb-1.5 block text-[11px] font-semibold uppercase text-auth-gray">Договорённости</label>
                                        <textarea
                                            value={agreements}
                                            onChange={(e) => setAgreements(e.target.value)}
                                            placeholder="Что студент обязуется сделать"
                                            rows={3}
                                            className="w-full resize-none rounded-[14px] border border-border bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-auth-primary"
                                        />
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={handleSave}
                                            className="rounded-[14px] bg-auth-primary px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                                        >
                                            Сохранить
                                        </button>
                                        <button
                                            onClick={() => {
                                                setShowForm(false);
                                                setContent("");
                                                setAgreements("");
                                            }}
                                            className="rounded-[14px] border border-border bg-white px-4 py-2.5 text-[14px] font-semibold text-auth-black transition-colors hover:bg-gray-light"
                                        >
                                            Отмена
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
