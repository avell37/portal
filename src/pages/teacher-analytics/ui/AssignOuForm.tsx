import { useState } from "react";
import { TEACHERS, addOu } from "@/entities/teacher";

const CRITERIA = [
    "Чёткость постановки целей урока",
    "Структура и логика подачи материала",
    "Вовлечённость студентов",
    "Обратная связь со студентами",
    "Темп и тайминг урока",
];

interface AssignOuFormProps {
    teacherId: number;
    onDone: () => void;
    onCancel: () => void;
}

export default function AssignOuForm({ teacherId, onDone, onCancel }: AssignOuFormProps) {
    const teacher = TEACHERS.find((t) => t.id === teacherId)!;
    const [ratings, setRatings] = useState<number[]>(Array(CRITERIA.length).fill(0));
    const [comment, setComment] = useState("");

    const filled = ratings.filter((r) => r > 0);
    const avg = filled.length ? (filled.reduce((a, b) => a + b, 0) / filled.length).toFixed(1) : "—";
    const avgNum = parseFloat(avg);
    const avgColor = avg === "—" ? "white" : avgNum >= 4 ? "var(--color-score-good)" : avgNum >= 3.1 ? "var(--color-score-warn)" : "var(--color-score-bad)";

    function rate(idx: number, val: number) {
        setRatings((prev) => prev.map((r, i) => (i === idx ? val : r)));
    }

    function handleSave() {
        if (filled.length === 0) return;
        addOu(teacherId, ratings, comment.trim());
        onDone();
    }

    return (
        <div className="max-w-2xl">
            <button onClick={onCancel} className="mb-3 text-[13px] font-semibold text-auth-primary hover:opacity-75">
                ← Назад
            </button>

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-auth-primary p-4">
                <div>
                    <div className="text-sm font-semibold text-white">Открытый урок</div>
                    <div className="text-[12px] text-white/70">{teacher.name} · {teacher.subject} · сегодня</div>
                </div>
                <div className="rounded-[12px] bg-white/15 px-4 py-1.5 text-center">
                    <div className="text-xl font-bold text-white" style={{ color: avgColor }}>{avg}</div>
                    <div className="text-[10px] text-white/70">Средняя оценка</div>
                </div>
            </div>

            <div className="mt-4 space-y-2">
                {CRITERIA.map((label, idx) => (
                    <div key={label} className="flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-border bg-white px-3.5 py-2.5">
                        <span className="flex-1 text-[13px] text-auth-black">{idx + 1}. {label}</span>
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => rate(idx, v)}
                                    className={`h-6 w-6 rounded-[6px] border text-[13px] transition-colors ${
                                        v <= ratings[idx] ? "border-amber bg-amber text-white" : "border-border bg-white text-auth-gray"
                                    }`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {avg !== "—" && avgNum <= 3 && (
                <div className="mt-4 rounded-[14px] border-l-4 border-red bg-red-light p-3.5 text-[12px] text-red">
                    Оценка ≤ 3 — система автоматически поставит флаг «Требует повторного ОУ»
                </div>
            )}

            <div className="mt-4">
                <label className="mb-1.5 block text-[12px] font-semibold uppercase text-auth-gray">Комментарий</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Заметки по уроку, рекомендации преподавателю..."
                    rows={3}
                    className="w-full resize-none rounded-[14px] border border-border bg-white px-3.5 py-2.5 text-[13px] outline-none focus:border-auth-primary"
                />
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
                <button
                    onClick={handleSave}
                    disabled={filled.length === 0}
                    className="rounded-[14px] bg-auth-primary px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    Сохранить результаты ОУ
                </button>
                <button
                    onClick={onCancel}
                    className="rounded-[14px] border border-border bg-white px-4 py-2.5 text-[14px] font-semibold text-auth-black transition-colors hover:bg-gray-light"
                >
                    Отмена
                </button>
            </div>
        </div>
    );
}
