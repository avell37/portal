import { useState } from "react";
import { TEACHERS } from "@/entities/teacher";

const CRITERIA = [
    "Интерес к занятиям",
    "Подача и объяснение материала",
    "Доброжелательность и комфорт на парах",
    "Обратная связь преподавателя",
];

export default function SopSurvey({ onFinish }: { onFinish: () => void }) {
    const [step, setStep] = useState(0);
    const [ratings, setRatings] = useState<number[]>(Array(CRITERIA.length).fill(0));
    const [comment, setComment] = useState("");

    const teacher = TEACHERS[step]!;
    const pct = ((step + 1) / TEACHERS.length) * 100;
    const allRated = ratings.every((r) => r > 0);

    function rate(idx: number, val: number) {
        setRatings((prev) => prev.map((r, i) => (i === idx ? val : r)));
    }

    function next() {
        if (!allRated) return;
        if (step < TEACHERS.length - 1) {
            setStep(step + 1);
            setRatings(Array(CRITERIA.length).fill(0));
            setComment("");
        } else {
            onFinish();
        }
    }

    return (
        <div className="max-w-2xl">
            <div className="mb-4 rounded-[14px] bg-gray-light p-4">
                <div className="flex items-center justify-between">
                    <span className="text-[13px] font-semibold text-auth-black">СОП — Семестр 2, 2025/2026</span>
                    <span className="text-[12px] text-auth-gray">Преподаватель {step + 1} из {TEACHERS.length}</span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-border">
                    <div className="h-full rounded-full bg-green transition-all" style={{ width: `${pct}%` }} />
                </div>
            </div>

            <div className="rounded-[16px] border border-border bg-blue-light p-5">
                <div className="mb-4 text-[14px] font-semibold text-blue">{teacher.name} · {teacher.subject}</div>
                {CRITERIA.map((label, idx) => (
                    <div key={label} className="flex flex-wrap items-center justify-between gap-3 border-b border-blue/15 py-2.5 last:border-none">
                        <span className="flex-1 text-[13px] text-auth-black">{idx + 1}. {label}</span>
                        <div className="flex gap-1.5">
                            {[1, 2, 3, 4, 5].map((v) => (
                                <button
                                    key={v}
                                    onClick={() => rate(idx, v)}
                                    className={`h-7 w-7 rounded-[6px] border text-[12px] font-semibold transition-colors ${
                                        v <= ratings[idx] ? "border-blue bg-blue text-white" : "border-border bg-white text-auth-gray"
                                    }`}
                                >
                                    {v}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Что вам нравится в занятиях этого преподавателя?"
                    rows={2}
                    className="mt-3 w-full resize-none rounded-[10px] border border-border bg-white px-3 py-2 text-[12px] outline-none focus:border-auth-primary"
                />
                <button
                    onClick={next}
                    disabled={!allRated}
                    className="mt-3 w-full rounded-[12px] bg-blue px-4 py-2.5 text-[13px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {step < TEACHERS.length - 1 ? "Следующий преподаватель →" : "Завершить"}
                </button>
            </div>
            <div className="mt-3 text-center text-[11px] text-auth-gray">Ответы анонимны · Пропустить преподавателя нельзя</div>
        </div>
    );
}
