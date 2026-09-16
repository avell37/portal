import { TEACHERS, useOuHistory, averageOf } from "@/entities/teacher";
import OuFlagBadge from "./OuFlagBadge";

function scoreColor(v: number) {
    return v >= 4 ? "var(--color-green)" : v >= 3.1 ? "var(--color-amber)" : "var(--color-red)";
}

interface TeacherCardProps {
    teacherId: number;
    canAssign: boolean;
    onBack: () => void;
    onAssign: () => void;
}

export default function TeacherCard({ teacherId, canAssign, onBack, onAssign }: TeacherCardProps) {
    const teacher = TEACHERS.find((t) => t.id === teacherId)!;
    const history = useOuHistory(teacherId);
    const avg = averageOf(history);

    return (
        <div>
            <button onClick={onBack} className="mb-3 text-[13px] font-semibold text-auth-primary hover:opacity-75">
                ← Все преподаватели
            </button>

            <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[16px] bg-auth-primary p-4">
                <div>
                    <div className="text-[15px] font-semibold text-white">{teacher.name}</div>
                    <div className="mt-1 text-[12px] text-white/70">{teacher.type} · {teacher.subject} · Тимлидер: {teacher.teamlead}</div>
                </div>
                <div className="rounded-[12px] bg-white/15 px-4 py-1.5 text-center">
                    <div className="text-xl font-bold text-white" style={{ color: avg !== null ? scoreColor(avg) : undefined }}>{avg ?? "—"}</div>
                    <div className="text-[10px] text-white/70">Средняя за все ОУ</div>
                </div>
            </div>

            {canAssign && (
                <button
                    onClick={onAssign}
                    className="mb-4 rounded-[14px] bg-auth-primary px-4 py-2.5 text-[14px] font-semibold text-white transition-opacity hover:opacity-90"
                >
                    + Провести открытый урок
                </button>
            )}

            <div className="mb-2 text-[12px] font-semibold uppercase text-auth-gray">История открытых уроков</div>
            <div className="space-y-2">
                {history.map((r) => (
                    <div key={r.id} className="flex flex-wrap items-center gap-3 rounded-[14px] bg-gray-light px-3.5 py-2.5">
                        <span className="min-w-[100px] text-[11px] text-auth-gray">{r.date}</span>
                        <span className="min-w-[36px] text-[13px] font-bold" style={{ color: scoreColor(r.avg) }}>{r.avg}</span>
                        <span className="flex-1 text-[12px] text-auth-gray">{r.comment}</span>
                        <OuFlagBadge flag={r.flag} />
                    </div>
                ))}
                {history.length === 0 && (
                    <div className="rounded-[14px] border border-dashed border-border bg-white py-8 text-center text-[13px] text-auth-gray">
                        Открытых уроков ещё не было
                    </div>
                )}
            </div>
        </div>
    );
}
