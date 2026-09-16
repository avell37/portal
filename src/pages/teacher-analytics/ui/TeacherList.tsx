import { TEACHERS, useOuHistory, averageOf } from "@/entities/teacher";

function scoreColor(v: number) {
    return v >= 4 ? "var(--color-green)" : v >= 3.1 ? "var(--color-amber)" : "var(--color-red)";
}

function TeacherRow({
    teacherId,
    name,
    type,
    canAssign,
    onSelect,
    onAssign,
}: {
    teacherId: number;
    name: string;
    type: string;
    canAssign: boolean;
    onSelect: () => void;
    onAssign: () => void;
}) {
    const history = useOuHistory(teacherId);
    const avg = averageOf(history);
    const flag = history[0]?.flag;

    return (
        <tr onClick={onSelect} className="cursor-pointer border-b border-border last:border-none hover:bg-purple-light">
            <td className="px-4 py-2.5 font-semibold text-auth-black">{name}</td>
            <td className="px-3 py-2.5 text-[12px] text-auth-gray">{type}</td>
            <td className="px-3 py-2.5 font-semibold" style={{ color: avg !== null ? scoreColor(avg) : undefined }}>{avg ?? "—"}</td>
            <td className="px-3 py-2.5">
                {flag === "escalated" ? (
                    <span className="rounded-full bg-amber-light px-2 py-0.5 text-[11px] font-semibold text-amber">Эскалация</span>
                ) : flag === "repeat" ? (
                    <span className="rounded-full bg-red-light px-2 py-0.5 text-[11px] font-semibold text-red">Повторный ОУ</span>
                ) : (
                    <span className="text-auth-gray">—</span>
                )}
            </td>
            <td className="px-3 py-2.5">
                {canAssign && (
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            onAssign();
                        }}
                        className="rounded-[10px] bg-auth-primary px-3 py-1.5 text-[12px] font-semibold text-white transition-opacity hover:opacity-90"
                    >
                        Заполнить ОУ
                    </button>
                )}
            </td>
        </tr>
    );
}

interface TeacherListProps {
    canAssign: boolean;
    onSelectTeacher: (id: number) => void;
    onAssignTeacher: (id: number) => void;
}

export default function TeacherList({ canAssign, onSelectTeacher, onAssignTeacher }: TeacherListProps) {
    return (
        <div className="overflow-x-auto rounded-[16px] border border-border bg-white">
            <table className="w-full text-left text-[13px]">
                <thead>
                    <tr className="border-b border-border text-[11px] uppercase text-auth-gray">
                        <th className="px-4 py-3 font-semibold">Преподаватель</th>
                        <th className="px-3 py-3 font-semibold">Тип</th>
                        <th className="px-3 py-3 font-semibold">Ср. оценка ОУ</th>
                        <th className="px-3 py-3 font-semibold">Флаг</th>
                        <th className="px-3 py-3 font-semibold" />
                    </tr>
                </thead>
                <tbody>
                    {TEACHERS.map((t) => (
                        <TeacherRow
                            key={t.id}
                            teacherId={t.id}
                            name={t.name}
                            type={t.type}
                            canAssign={canAssign}
                            onSelect={() => onSelectTeacher(t.id)}
                            onAssign={() => onAssignTeacher(t.id)}
                        />
                    ))}
                </tbody>
            </table>
        </div>
    );
}
